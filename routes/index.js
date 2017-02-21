var express = require('express');
var router = express.Router();
let crypto = require('crypto');
// 引入 crypto 模块，生成散列值用以加密
let fs = require('fs');
User = require('../models/user.js');
// 引入 user 对象，以管理用户信息，是一个描述数据的对象，对应 MVC 架构中的 M
Post = require('../models/post.js');
// 引入 post 模块，为发表文章注册响应

Comment = require('../models/comment.js');
// 引入 留言模块


// 路由规划:
// /: 首页
// /login: 用户登录
// /reg: 用户注册
// /post: 发表文章
// /logout: 登出

// 其中 '/login' 和 '/reg' 只能是未登录的用户访问，而 '/post' 和 '/logout' 只能是已登录的用户访问

// 页面权限控制，通过 checkLogin 和 checkNotLogin
// 函数对用户状态进行检查，以显示不同的导航信息
function checkLogin(req, res, next) {
	if (!req.session.user) {
		console.log("未登录");
		res.redirect('/login');
	}

	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		console.log("已登录！");
		res.redirect('back');
		//	返回上一个页面
	}
	next();
}

/* GET home page. */


router.get('/', function (req, res) {
	let page = req.query.p ? parseInt(req.query.p) : 1;
	// 判断是否是第一页，并把请求的页数转换为 number 类型
	Post.getTen(null, page, function (err, posts, total) {
		// 查询并返回第 page 也的 10 篇文章
		if (err){
			posts =[];
		}

		res.render('index',{
			title: '主页',
			posts: posts,
			page: page,
			isFirstPage: (page -1 ) == 0,
			isLastPage: ((page - 1) * 3 + posts.length) == total,
			user: req.session.user,
		})
	})
	// Post.getAll(null, function (err, posts) {
	// 	// 获取一个人的所有文章(传入 name)或获取所有人的文章(不传入参数)
	// 	if (err) {
	// 		posts = [];
	// 	}
	// 	res.render('index', {
	// 		title: '主页',
	// 		user: req.session.user,
	// 		posts: posts,
	// 		// success: req.flash('success').toString(),
	// 		// error: req.flash('error').toString()
	// 	})
	// })
});

router.get('/reg', checkNotLogin)
router.get('/reg', function (req, res) {
	res.render('reg', {
		title: '注册',
		user: req.session.user,
		// success: req.flash('success').toString(),
		// error: req.flash('error').toString
	});
});

router.post('/reg', checkNotLogin)
router.post('/reg', function (req, res) {
	let password = req.body.password,
		password_re = req.body['password-repeat'];
//	检验两次密码是否一致
	if (password_re != password) {
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
		if (user) {
			console.log('用户已经存在');
			return res.redirect('/reg');
		}

		//	 不存在则创建新用户
		newUser.save(function (err, user) {
			// save 是一个回调函数
			if (err) {
				// req.flash('error', err);
				return res.redirect('/reg');
			}
			console.log('正在注册用户:' + user.name);
			req.session.user = user;
			console.log(req.session.user.name)
			//	写入用户 session
			console.log('注册成功！');
			res.redirect('/');
		})
	})
});

router.get('/login', checkNotLogin)
router.get('/login', function (req, res) {
	res.render('login', {
		title: '登录',
		user: req.session.user,
	});
})

router.post('/login', checkNotLogin)
router.post('/login', function (req, res) {
	//	生成 MD5 密码值
	let md5 = crypto.createHash("md5"),
		password = md5.update(req.body.password).digest('hex');
//	检查用户是否存在
	User.get(req.body.name, function (err, user) {
			if (!user) {
				console.log("用户不存在");
				return res.redirect('/login');
			}

			//	密码是否一致
			if (user.password != password) {
				console.log("密码不正确!");
				return res.redirect('/login');
			}

			//	否则，登录成功
			console.log("登录成功!");
			req.session.user = user;
			res.redirect('/');

		}
	)
	console.log("dfsafda")
});

router.get('/post', checkLogin)
router.get('/post', function (req, res) {
	console.log('发布文章页面:' + req.session.user)
	res.render('post', {
		title: '发表',
		user: req.session.user,
	});
});

router.post('/post', checkLogin)
router.post('/post', function (req, res) {
	let currentUser = req.session.user;
	console.log("正在发布文章，作者是:" + currentUser.name);
	let post = new Post(currentUser.name, req.body.title, req.body.post);
	post.save(function (err) {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		console.log("发布成功");
		res.redirect('/');
	})
});

router.get('/logout', checkLogin)
router.get('/logout', function (req, res) {
	req.session.user = null;
	console.log("退出成功");
	res.redirect('/');
});


router.get('/upload', checkLogin);
// 设置权限，只有登录用户才能上传
router.get('/upload', function (req, res) {
	res.render('upload', {
		title: '文件上传',
		user: req.session.user,
	})
})

router.post('/upload', function (req, res) {
	for (let i in req.files) {
		if (req.files[i].size == 0) {
			//	使用同步方式删除一个文件
			fs.unlinkSync(req.files[i].path);
			console.log('Successfully removed an empty file!');
		} else {
			let target_path = './public/images/' + req.files[i].name;
			//	使用同步方法重命名一个文件
			fs.renameSync(req.files[i].path, target_path);
			console.log('Successfully renamed a file');
		}
	}

	res.redirect("/upload");
})

// 添加用户页面和文章页面
// 用户页面: 当单击某个用户名链接时，跳转到:
// domain/u/username,并列出该用户的所有文章
// 文章页面: 单击某篇文章标题，跳转:
// domain/u/username/time/post.title

router.get('/u/:name', function (req, res) {
	let page = req.query.p ? parseInt(req.query.p) : 1;
	User.get(req.params.name, function (err, user) {
		if(!user){
			console.log("用户不存在")
			return res.redirect('/')
		}

		Post.getTen(user.name, page, function (err, posts, total) {
			if(err){
				console.log("err")
				return res.redirect('/')
			}

			res.render('user',{
				title: user.name,
				posts: posts,
				page: page,
				isFirstPage: (page -1 ) === 0,
				isLastPage: ((page -1 ) * 3 + posts.length) === total,
				user: req.session.user
			})
		})
	})
	// // 根据用户名，发布日期及文章标题获取一篇文章
	// User.get(req.params.name, function (err, user) {
	// 	if (!user) {
	// 		console.log("用户名不存在")
	// 		return res.redirect('/')
	// 	}
	//
	// 	Post.getAll(user.name, function (err, posts) {
	// 		//	查询并返回用户的所有文章
	// 		if (err) {
	// 			console.log("err")
	// 			return redirect('/')
	// 		}
	//
	// 		res.render('user', {
	// 			title: req.title,
	// 			posts: posts,
	// 			user: req.session.user,
	// 		})
	// 	})
	// })
})

router.get('/u/:name/:day/:title', function (req, res) {
	console.log("已经跳转页面!!!")
	Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
		if (err) {
			console.log('err');
			return res.redirect('/')
		}
		console.log("数据获取成功")
		res.render('article', {
			title: req.params.title,
			post: post,
			user: req.session.user
		})
	})
})

router.post('/u/:name/:day/:title', function (req, res) {
	let date = new Date();
	let time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
		+ " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

	let comment = {
		name: req.body.name,
		email: req.body.email,
		website: req.body.website,
		time: time,
		content: req.body.content
	};

	let newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);

	newComment.save(function (err) {
		if (err){
			console.log("留言保存失败!");
			return res.redirect('back');
		}

		console.log("留言成功!");
		res.redirect('back');
	})
})


router.get('/edit/:name/:day/:title', checkLogin)
router.get('/edit/:name/:day/:title', function (req, res) {
	let currentUser = req.session.user;
	Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
		if(err){
			console.log("编辑文章时发生错误!")
			return res.redirect('back')
		}

		res.render('edit', {
			title: '编辑',
			post: post,
			user: req.session.user,
			success: '正在跳转到编辑页面',
			error: '跳转到编辑页面时发生错误'
		})

	})
});

router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function (req, res) {
	let currentUser = req.session.user;
	Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
		let url = '/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title;

		if(err){
			console.log("更新文章时出错!")
			return res.redirect(url)
			// 返回文章页
		}

		console.log("修改成功")
		res.redirect(url);
	})
});

router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function (req, res) {
	let currentUser = req.session.user;
	Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
		if(err){
			console.log("删除文章时出错了！");
			return res.redirect('back')
		}

		console.log('删除文章车成功！');
		res.redirect('/');
	})
});

router.get('/archive', function (req, res) {
	Post.getArchive(function (err, posts) {
		if (err){
			console.log("存档页面发生错误");
			return res.redirect('/');
		}

		res.render('myarchive',{
			title:'存档',
			posts:posts,
			user:req.session.user,
		})
	})
})



module.exports = router;
