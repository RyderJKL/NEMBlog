/**
 * Created by onejustone on 2017/2/20.
 */

 
let  mongodb = require('./db')

function Comment (name, day, title, comment) {
	this.name = name;
	this.day = day;
	this.title = title;
	this.comment = comment;
}

Comment.prototype.save = function (callback) {
	let name = this.name;
	let day = this.day;
	let title = this.title;
	let comment = this.comment;

	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}

		db.collection('posts', function (err, collection) {
			if(err){
				mongodb.close()
				return callback(err)
			}

			//通过用户名，时间，标题查找文档，并把一条留言对象添加到该文档的
			// comments 数组里
			collection.update({
				"name": name,
				"time.day":day,
				"title":title
			}, {
				$push:{"comments":comment}
				// 将留言添加到 comments 数组中
			}, function (err) {
				mongodb.close()
				if(err){
					return callback(err)
				}
				callback(null);
			})
		})
	})
};
module.exports = Comment;