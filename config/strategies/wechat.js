'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	WechatStrategy = require('passport-wechat'),
	wechatConfig = require('../config').wechat,
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use twitter strategy
	passport.use(new WechatStrategy({
		appid: wechatConfig.appId,
		appsecret: wechatConfig.appSecret,
		scope: 'snsapi_userinfo',
		state: '1',
		passReqToCallback: true
	}, function(req, openid, profile, token, done) {
		// Set the provider data and include tokens
		var providerData = profile;
		providerData.token = token;

		// Create the user OAuth profile
		var providerUserProfile = {
			displayName: profile.nickname,
			username: profile.nickname,
			provider: 'wechat',
			providerIdentifierField: 'openid',
			providerData: providerData
		};

		// Save the user OAuth profile
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}));
};
