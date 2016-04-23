'use strict';

var wechatConfig = require('../config/config').wechat;
var OAuth = require('wechat-oauth');
var client = new OAuth(wechatConfig.appId, wechatConfig.appSecret);

var createWechatOAuthUrl = function(cbUrlPath) {
	return client.getAuthorizeURL(wechatConfig.host + '/auth/wechat?cb=' +
		encodeURIComponent(wechatConfig.url + cbUrlPath), '1', 'snsapi_userinfo');
};

module.exports = {
	wechat: {
		port: 3302,
		token: 'wechatToken',
		appId: wechatConfig.appId,
		appSecret: wechatConfig.appSecret,
		account: wechatConfig.account,
		msgType: {
			event: 'event',
			text: 'text',
			location: 'location'
		},
		event: {
			subscribe: 'subscribe',
			click: 'CLICK',
			view: 'VIEW',
			scan: 'SCAN'
		},
		mp_url: 'https://mp.weixin.qq.com/',
		mp_login_url: 'https://mp.weixin.qq.com/cgi-bin/login?lang=zh_CN',
		subscribeMsg: '感谢您的关注!',
		menuButton: {
			parentMenu: {
				name: 'ParentMenu'
			},
			linkMenu: {
				name: 'linkMenu',
				url: createWechatOAuthUrl('/appurl')
			}
		}
	}
};
