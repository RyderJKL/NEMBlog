/**
 * Created by onejustone on 2017/1/28.
 */

 
let mongodb = require('./db');
let markdown = require('markdown').markdown;

function  Post(name, title, tags, post) {
	this.name = name;
	this.title = title;
	this.tags = tags;
	this.post = post;

}

// 存储一篇文章及其相关信息
Post.prototype.save = function (callback) {
	let date = new Date();
//	存储各种时间格式，方便以后扩展
	let time = {
		date: date,
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
		tags: this.tags,
		post: this.post,
		comments: []
		// 保存留言
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
					if (err){
						mongodb.close()
						return callback(err)
					}

				//	解析markdown为html
					if(doc){
						// 每访问一次，pv 值增加 1
						collection.update({
							"name":name,
							"time.day":day,
							"title":title
						}, {
							$inc: {"pv":1}
						}, function (err) {
							mongodb.close()
							if(err){
								return callback(err)
							}
						})
						doc.post = markdown.toHTML(doc.post);
						// 返回查询的文章
						doc.comments.forEach(function (comment) {
							// 返回对应的留言
							comment.content = markdown.toHTML(comment.content)
						})
					}

					callback(null, doc);

				})
			}
		)
	})
};

Post.edit = function (name, day, title, callback) {
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}
		db.collection('posts', function (err, collection) {
			if(err){
				mongodb.close()
				return callback(err)
			}

			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title
			}, function (err, doc) {
				mongodb.close()
				if(err){
					return callback(err)
				}

				callback(null, doc)
				// 返回一篇查询的文章，markdown 格式
			})
		})
	})
}


Post.update = function (name, day, title, post, callback) {
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}

		db.collection('posts', function (err, collection) {
			if (err){
				mongodb.close()
				return callback(err);
			}
			collection.update({
				"name":name,
				"time.day":day,
				"title":title
			}, {
				$set:{post: post}
			}, function (err) {
				mongodb.close()
				if(err){
					return callback(err)
				}
				callback(null)
			})
		})
	})
};

Post.remove = function (name, day, title, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err)
		}

		db.collection('posts', function (err, collection) {
			if (err){
				mongodb.close()
				return callback(err)
			}

			collection.remove({
				"name":name,
				"time.day":day,
				"title":title
			}, {
				w: 1
			}, function (err) {
				mongodb.close()
				if(err){
					return callback(err)
				}
				callback(null)
			})
		})
	})
};

Post.getTen = function (name, page, callback) {
//	一次获取获取十篇文章
	mongodb.open(function (err, db) {
		if (err){
			return callback(err)
		}

		db.collection('posts', function (err, collection) {
			if (err){
				mongodb.close()
				return callback(err)
			}

			let query = {};
			if(name) {
				query.name = name;
			}
			collection.count(query, function (err, total) {
			//	使用 count 返回特定查询的文档数
				collection.find(query, {
					skip: (page -1) * 3,
					limit: 3
				}).sort({
					time: -1
				}).toArray(function (err, docs) {
					mongodb.close()
					if(err){
						return callback(err)
					}

					docs.forEach((function (doc) {
						doc.post = markdown.toHTML(doc.post);
					}));
					callback(null, docs, total);
				})
			})
		})
	})
};

Post.getArchive = function (callback) {
	// 返回所有文章存档信息
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}
		db.collection('posts', function (err, collection) {
			if(err){
				mongodb.close()
				return callback(err)
		}
			collection.find({},{
				// 返回只包含 name，time，title
				// 属性的文档组成的存档数组
				"name":1,
				"time":1,
				"title":1
			}).sort({
				time: -1
			}).toArray(function (err, docs) {
				mongodb.close();
				if(err){
					return callback(err);
				}

				callback(null, docs);
			})
		})
	})
};


Post.getTags = function (callback) {
	// 获取所有标签页
	mongodb.open(function (err, db) {
		if (err){
			return callback(err);
		}

		db.collection('posts', function (err, collection) {
			if (err){
				mongodb.close();
				return callback(err);
			}
			collection.distinct("tags", function (err, docs) {
				// 使用 distinct 来找出给定键的所有不同值
				// mongodb 数据库
				mongodb.close();
				if (err){
					return callback(err);
				}
				callback(null, docs);
			})
		})
	})
};

Post.getTag = function (tag, callback) {
	// 获取某一特定类型的标签
	mongodb.open(function (err, db) {
		if (err){
			return callback(err);
		}

		db.collection('posts', function (err, collection) {
			if (err){
				mongodb.close()
				return callback(err)
			}

			collection.find({
				// 查询所有 tags 数组 内包含 tag 的文档
				// 返回只有包含 name,time,title 组成的数组
				"tags":tag
			}, {
				"name":1,
				"time":1,
				"title":1
			}).sort({
				time:-1
			}).toArray(function (err, docs) {
				mongodb.close();
				if(err){
					return callback(err)
				}

				callback(null,docs);
			})
		})
	})
};


module.exports = Post;


