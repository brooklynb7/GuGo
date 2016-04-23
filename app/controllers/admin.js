'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	async = require('async'),
	errorHandler = require('./errors'),
	path = require('path'),
	config = require(path.resolve('./config/config')),
	wechatConfig = config.wechat,
	API = require('wechat-api'),
	api = new API(wechatConfig.appId, wechatConfig.appSecret),
	base = require('./base'),
	mongoose = require('mongoose');


var getAdminView = function(viewPath) {
	return 'admin/' + viewPath;
};

/*
 * Page controllers
 */
exports.getWechatUserInfo = function(req, res) {
	api.getUser(req.params.openId, function(err, rst) {
		if (err) return res.status(404).send(errorHandler.getErrorMessage(err));
		res.json(rst);
	});
};

exports.getWechatFollowers = function(req, res) {
	api.getFollowers(function(err, rst) {
		if (err) return res.status(404).send(errorHandler.getErrorMessage(err));
		res.json({
			total: rst.total
		});
	});
	/*
		{
		"total":2,
		"count":2,
		"data":{
		"openid":["","OPENID1","OPENID2"]
		},
		"next_openid":"NEXT_OPENID"
		}
	*/
};

exports.getWechatUserSummary = function(req, res) {
	if (req.query.date) {
		api.getUserSummary(req.query.date, req.query.date, function(err, rst) {
			if (err) return res.status(404).send(errorHandler.getErrorMessage(err));
			res.json(rst);
		});
	} else {
		res.send('缺少参数');
	}
};
