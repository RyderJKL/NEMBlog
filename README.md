# NEMBlog


---
### 碎语
NEMBLog 是 OJOBlog 都多人博客管理系统的后台实现， [OJOBlog](https://github.com/onejustone/OJOBlog) 是我的第一个前后端完全分离的项目，项目采用 Vue + Express + MongoDB 的 VENM 架构并运行在 Linux 服务器中，夸张点说这个项目是个全栈。

为什么搞出来两个系统?其实最开始在开发 OJOBlog 项目的时候是一边写 Vue，一边写后台，按照数据的流向来组织代码，一般是写完前端写然后又写后台，所以，一有 bug 的时候基本是调完前端调后台，调完后台调调前端，尝试这样搞了两个星期，人格分裂了，要崩溃，想杀人，想毁灭世界，想砸掉电脑，想回家种地，人家天天玩游戏，为啥我要活得那么苦逼? 于是 `rm -rf /`，拔掉电源，跨上陈旧的黑色双肩包，一条深蓝色的牛仔裤，叫上女友出去踏浪了。。。一星期后，痛定思痛决定先用 Node + Express + MOngoDB 写出一个后台来，简单的使用 ejs + bootstrap 进行页面渲染。并写出 RESTful 风格的接口 api，于是有了 NEMBlog 系统。 

 
 当然，任何项目都不可能是完美的，我会不断更新和维护这些项目，并补充相应的技术文章，将开发中遇到的问题和产生的想法记录下来。

关于 Vue，关于 Express,关于 MongoDB，均可以参考我的 [博客](http://www.onejustone.xyz)。


---
### 功能描述

* 多人注册/登录
* 文章发布（MarkDown）
* 文章编辑/删除
* 文章转载
* 文件上传
* 主页与文章页
* 用户留言/显示留言
* 404 页面
* 错误页面
* 标签页
* 分页功能
* 搜索功能


---
### 代码架构


``` 
.
├── app.js #入口文件
├── config #配置文件目录
│   └── settings.js # 数据库配置文件
├── models # 数据模型
│   ├── comment.js # 用户评论模型
│   ├── db.js # 数据库连接文件
│   ├── post.js # 文章模型
│   └── user.js # 用户模型
├── package.json # 项目依赖
├── public # 静态目录
│   ├── fonts
│   ├── images
│   ├── javascripts
│   │   ├── bootstrap.min.js
│   │   └── jquery-1.11.1.min.js
│   └── stylesheets
│       ├── bootstrap.min.css
│       ├── bootstrap-theme.min.css
│       └── style.css
├── README.md
├── routes # 路由目录
│   └── index.js 
└── views # 视图层，魔板使用 ejs 渲染
    ├── 404.ejs # 404 页面
    ├── article.ejs # 文章展示页面
    ├── comments.ejs # 用户评论页面
    ├── edit.ejs # 文章编辑页面
    ├── error.ejs # 错误提示页面
    ├── footer.ejs # 网站底部
    ├── header.ejs # 网站头部
    ├── index.ejs # 首页
    ├── login.ejs # 登录页面
    ├── myarchive.ejs # 归档页面
    ├── paging.ejs # 分页页面
    ├── post.ejs # 文章发布页面
    ├── reg.ejs # 注册页面
    ├── search.ejs # 文章搜索页面
    ├── tag.ejs # 标签显示
    ├── tags.ejs # 标签页
    ├── upload.ejs # 文章上传页面
    └── user.ejs # 个人用户页面
```

> 如果你感觉有趣儿的话，开始 start 吧!

