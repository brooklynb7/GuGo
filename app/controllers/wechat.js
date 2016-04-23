'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	wechatConfig = require('../../config/config').wechat,
	OAuth = require('wechat-oauth'),
	client = new OAuth(wechatConfig.appId, wechatConfig.appSecret),
	User = mongoose.model('User');

exports.getWechatUserInfo = function(req, res) {
	var code = req.body.code;
	client.getAccessToken(code, function(err, result) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var accessToken = result.data.access_token;
			var openid = result.data.openid;

			client.getUser(openid, function(err, userInfo) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(userInfo);
				}
			});
		}
	});
};