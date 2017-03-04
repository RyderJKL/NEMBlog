/**
 * Created by onejustone on 2017/1/20.
 */
let crypto = require('crypto')

// let mongodb = require('./db');

// 使用 Mongoose
let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/db')

let userSchema = new mongoose.Schema({
	name: String,
	password: String,
	email: String,
	head: String
}, {
	collection: 'users'
});

let userModel = mongoose.model('User', userSchema);

 


function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}



// 存储用户信息
User.prototype.save = function (callback) {
//	要存入数据库的用户信息
	let md5 = crypto.createHash('md5')
	let email_MD5 = md5.update(this.email.toLowerCase()).digest('hex')
	// 将 email 转换为小写再编码
	let head = "http://www.gravatar.com/avatar" + email_MD5 + "?s=48"

	let user = {
		name: this.name,
		password: this.password,
		email: this.email,
		head: head
		// 头像链接键
	};

	let newUser = new userModel(user);

	newUser.save(function (err, user) {
		if (err){
			return callback(err)
		}
		callback(null, user)
	});
// //	打开数据库
// 	mongodb.open(function (err, db) {
// 		if(err){
// 			return callback(err);
// 		}
// 	//	读取 users 集合
// 		db.collection('users', function (err, collection) {
// 			if (err){
// 				mongodb.close();
// 				return callback(err);
// 			}
//
// 		//	将用户信息插入集合
// 			collection.insert(user, {
// 				safe: true
// 			}, function (err) {
// 				mongodb.close();
// 				if (err){
// 					return callback(err);
// 				}
// 				callback(null,user);
// 			//	插入成功，并返回存储后的用户文档
// 			})
// 		})
// 	})
};

User.get = function (name, callback) {
	userModel.findOne({name:name}, function (err, user) {
		if (err){
			return callback(err);
		}
		callback(null, user);
	})
};
//
// //读取用户信息
// User.get = function (name, callback) {
// //	open db
// 	mongodb.open(function (err, db) {
// 		if (err){
// 			return callback(err);
// 		}
//
// 	//	read users collection
// 		db.collection('users', function (err, collection) {
// 			if (err){
// 				mongodb.close();
// 				return callback(err);
// 			}
//
// 		//	find a  user  name (name is key) documentation
// 			collection.findOne({
// 				name: name
// 			}, function (err, user) {
// 				mongodb.close();
// 				if (err){
// 					return callback(err);
// 				}
//
// 				callback(null, user);
// 			//	查找成功，返回用户信息
// 			})
// 		})
// 	})
// };

module.exports = User;
