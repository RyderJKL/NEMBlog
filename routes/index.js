var express = require('express');
var router = express.Router();

// 路由规划:
// /: 首页
// /login: 用户登录
// /reg: 用户注册
// /post: 发表文章
// /logout: 登出

// 其中 '/login' 和 '/reg' 只能是未登录的用户访问，而 '/post' 和 '/logout' 只能是已登录的用户访问


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '主页' });
});

router.get('/reg', function (req, res) {
    res.render('reg', {title: '注册'})
});

router.post('/reg', function (req, res) {

});

router.get('/login', function (req, res) {
    res.render('login', {title: '登录'});
})

router.post('/login', function (req, res) {

});

router.get('/post', function (req, res) {
    res.render('post', {title: '发表'});
});

router.post('/post', function (req, res) {

});

router.get('/logout', function (req, res) {

});



module.exports = router;
