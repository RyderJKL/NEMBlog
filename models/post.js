/**
 * Created by onejustone on 2017/1/28.
 */

 
let mongodb = require('./db');
let markdown = require('markdown').markdown;

function  Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
}

// 存储一篇文章及其相关信息
Post.prototype.save = function (callback) {
	let date = new Date();
//	存储各种时间格式，方便以后扩展
	let time = {
		data: date,
		year: date.getFullYear(),
		month: date.getFullYear() + '-' + (date.getMonth() + 1),
		day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + "" +
			date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};
//	存入数据库的文档
	let post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post
	};

//	打开数据库
	mongodb.open(function (err, db) {
		if (err){
			return callback(err);
		}

	//	读取 posts 集合
		db.collection('posts', function (err, collection) {
			if ( err){
				mongodb.close();
				return callback(err);
			}
		//	将文档插入 post
			collection.insert(post, {
				safe: true
			}, function (err) {
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})
};

//	读取文章及其相关信息

//Post.get 获得单个用户信息
Post.getAll = function (name, callback) {
//	打开数据库
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}

	//	读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err){
				mongodb.close();
				return callback(err);
			}
		let query = {};
			if (name){
				query.name = name;
			}
		//	根据 query 对象查询文章
			collection.find(query).sort({
				time:-1
			}).toArray(function (err, docs) {
				mongodb.close();
				if(err){
					return callback(err);
				}
				docs.forEach(function (doc) {
					// 使用 Markdown 解析
					doc.post = markdown.toHTML(doc.post);
				});
				callback(null, docs);
			//	查询成功，以数组形式返回查询的结果

			})
		})
	})
};

Post.getOne = function (name, day, title, callback) {
//	 精确获得某个一篇文章
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}
	//	read posts collection
		db.collection('posts', function (err, collection){
				if(err){
					mongodb.close()
					return callback(err);
				}
				collection.findOne({
					//
					'name': name,
					'time.day': day,
					'title': title
				}, function (err, doc) {
					mongodb.close()
					if (err){
						return callback(err)
					}

				//	解析markdown为html
					doc.post = markdown.toHTML(doc.post);
					callback(null, doc);
					// 返回查询的文章
				})
			}
		)
	})
}

module.exports = Post;

