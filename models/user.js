/**
 * Created by onejustone on 2017/1/20.
 */

 
let mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}



// 存储用户信息
User.prototype.save = function (callback) {
//	要存入数据库的用户信息
	let user = {
		name: this.name,
		password: this.password,
		email: this.email
	};

//	打开数据库
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}
	//	读取 users 集合
		db.collection('users', function (err, collection) {
			if (err){
				mongodb.close();
				return callback(err);
			}

		//	将用户信息插入集合
			collection.insert(user, {
				safe: true
			}, function (err, user) {
				mongodb.close();
				if (err){
					return callback(err);
				}
				callback(null, user);
			//	插入成功，并返回存储后的用户文档
			})
		})
	})
};

//读取用户信息
User.get = function (name, callback) {
//	open db
	mongodb.open(function (err, db) {
		if (err){
			return callback(err);
		}

	//	read users collection
		db.collection('users', function (err, collection) {
			if (err){
				mongodb.close();
				return callback(err);
			}

		//	find a  user  name (name is key) documentation
			collection.findOne({
				name: name
			}, function (err, user) {
				mongodb.close();
				if (err){
					return callback(err);
				}

				callback(null, user);
			//	查找成功，返回用户信息
			})
		})
	})
};

module.exports = User;
