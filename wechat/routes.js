'use strict';

module.exports = function(app) {
	// Routing logic
	// ...
	var wechatApi = require('./controller');

	app.route('/api/wechat/createMenu').get(wechatApi.createMenu);
	app.route('/api/wechat/test').get(wechatApi.test);
	app.use('/api/wechat/', wechatApi.index);
};
