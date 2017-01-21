var express = require('express');
var router = express.Router();
let crypto = require('crypto');
// 引入 crypto 模块，生成散列值用以加密

User = require('../models/user.js');


// 路由规划:
// /: 首页
// /login: 用户登录
// /reg: 用户注册
// /post: 发表文章
// /logout: 登出

// 其中 '/login' 和 '/reg' 只能是未登录的用户访问，而 '/post' 和 '/logout' 只能是已登录的用户访问


/* GET home page. */


router.get('/', function(req, res) {
	// console.log(req.session.user);
	res.render('index', {
		title: '主页',
		user: req.session.user,
		// success: req.flash('success').toString(),
		// error: req.flash('error').toString()
	});
});

router.get('/reg', function (req, res) {
    res.render('reg', {
    	title: '注册',
        user: req.session.user,
	    // success: req.flash('success').toString(),
	    // error: req.flash('error').toString
    });
});

router.post('/reg', function (req, res) {
	let	password = req.body.password,
		password_re = req.body['password-repeat'];
//	检验两次密码是否一致
	if (password_re != password){
		return res.redirect('/reg');
	}

//	生成密码的 md5 值
	let md5 = crypto.createHash('md5'),
		md5Password = md5.update(req.body.password).digest('hex');

	let newUser = new User({
		name: req.body.name,
		password: md5Password,
		email: req.body.email
	});

//	检查用户是否已存在
	User.get(newUser.name, function (err, user) {
		console.log('User.get: ' + user);
		if (user){
			console.log('用户已经存在');
			return res.redirect('/reg');
		}

	//	 不存在则创建新用户
		newUser.save(function (err, user) {
			if (err){
				// req.flash('error', err);
				return res.redirect('/reg');
			}
			console.log('newUser: ' + user);
			req.session.user = user;
		//	写入用户 session
		// 	req.flash('success', '注册成功！');
			res.redirect('/');
		})
	})
});

router.get('/login', function (req, res) {
    res.render('login', {
    	title: '登录',
        user: req.session.user,
    });
})


router.post('/login', function (req, res) {
	//	生成 MD5 密码值
	let md5 = crypto.createHash("md5"),
		password = md5.update(req.body.password).digest('hex');
//	检查用户是否存在
	User.get(req.body.name, function (err, user){
			if (!user){
				console.log("用户不存在");
				return res.redirect('/login');
			}

			//	密码是否一致
			if( user.password != password){
				console.log("密码不正确!");
				return res.redirect('/login');
			}

			//	否则，登录成功
			req.session.user = user;
			console.log("登录成功!");
			res.redirect('/');
		}
	)
});

router.get('/post', function (req, res) {
    res.render('post', {title: '发表'});
});

router.post('/post', function (req, res) {

});

router.get('/logout', function (req, res) {
	req.session.user = null;
	console.log("退出成功");
	res.redirect('/');
});



module.exports = router;
