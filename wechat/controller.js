'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	config = require('./config'),
	wechat = require('wechat'),
	API = require('wechat-api'),
	api = new API(config.wechat.appId, config.wechat.appSecret),
	menuButton = config.wechat.menuButton;


var MessageHandler = function(wechatUser, message, response) {
	this.wechatUser = wechatUser;
	this.message = message;
	this.res = response;
};

MessageHandler.prototype.is_subscribe_event = function() {
	var message = this.message;
	if (message.MsgType === config.wechat.msgType.event &&
		message.Event === config.wechat.event.subscribe) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_scan_event = function() {
	if (this.message.MsgType === config.wechat.msgType.event &&
		this.message.Event === config.wechat.event.scan) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_location_event = function() {
	if (this.message.MsgType === config.wechat.msgType.location) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_normal_text = function() {
	if (this.message.MsgType === config.wechat.msgType.text) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_menu_click = function() {
	if (this.message.MsgType === config.wechat.msgType.event &&
		this.message.Event === config.wechat.event.click) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.subscribe_event_handler = function() {
	this.res.reply(config.wechat.subscribeMsg);
};

//'oBGqGjkX4rAjcMhTjthPuiFz1Jac'
MessageHandler.prototype.menu_event_handler = function() {
	var eventKey = this.message.EventKey;
	var msg = '';

	switch (eventKey) {
		case menuButton.angency.key:
			msg = menuButton.angency.msg;
			break;
		default:
			break;
	}
	this.res.reply(msg);
};

MessageHandler.prototype.scan_event_handler = function() {
	var that = this;
	var sceneId = this.message.EventKey;
};

MessageHandler.prototype.response_empty = function() {
	this.res.reply('');
};

var handler = new MessageHandler();


function message_handler(handler) {
	switch (true) {
		case handler.is_subscribe_event():
			handler.subscribe_event_handler();
			break;
		case handler.is_menu_click():
			handler.menu_event_handler();
			break;
		default:
			handler.response_empty();
			break;
	}
}

exports.index = wechat(config.wechat.token, function(req, res, next) {
	// 微信输入信息都在req.wechat上
	var message = req.weixin;
	handler.res = res;
	handler.message = message;
	message_handler(handler);
});

exports.createMenu = function(req, res) {
	api.createMenu({
		'button': [{
			'name': menuButton.parentMenu.name,
			'sub_button': [{
				'type': 'view',
				'name': menuButton.linkMenu.name,
				'url': menuButton.linkMenu.url
			}]
		}, {
			'name': menuButton.parentMenu.name,
			'sub_button': [{
				'type': 'view',
				'name': menuButton.linkMenu.name,
				'url': menuButton.linkMenu.url
			}]
		}]
	}, function(err, rst) {
		res.send(rst);
	});
};

exports.test = function(req, res) {
	res.send('Wechat Api');
};
