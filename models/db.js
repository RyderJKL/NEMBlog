/**
 * Created by onejustone on 2017/1/18.
 */

var settings = rquire('../settings'),
	Db = require('mongodb').Db,
	Connection = rquire('mongodb').Connection,
	Server = rquire('mongodb').Server;

module.exports = new Db(settings.db,
	new Server(settings.host,
	Connection.DEFAULT_PORT,
	{}),{safe: true}
	// 创建一数据库连接实例，并通过 module.exports 导出该实例
	// 设置数据库名，数据库地址，数据库端口
	);

