'use strict';

var path = require('path');
var express = require('express');
var pageRouter = express.Router();
var apiRouter = express.Router();
var user = require(path.resolve('./app/controllers/users'));
var admin = require(path.resolve('./app/controllers/admin'));
var config = require(path.resolve('./config/config'));

module.exports = function(app) {
	pageRouter.get('/', admin.indexPage);
	pageRouter.get('/profile/user', user.profilePage('admin/profile_user'));
	pageRouter.get('/password', user.profilePage('admin/password'));
	pageRouter.get('/advice', user.requireRoleAccessPage(config.roles.admin), admin.advicePage);
	pageRouter.get('/users', user.requireRoleAccessPage(config.roles.admin), admin.usersPage);

	app.use('/admin', user.requireLoginPage, user.requireRoleAccessPage([config.roles.admin, config.roles.adminMember]),
		pageRouter);

	apiRouter.get('/users', user.requireRoleAccessPage(config.roles.admin), admin.getUsers);
	apiRouter.delete('/users/:userId', user.requireRoleAccessPage(config.roles.admin), admin.deleteUser);
	apiRouter.get('/wechat/users/:openId', user.requireRoleAccessPage(config.roles.admin), admin.getWechatUserInfo);

	app.use('/api/admin', user.requireLoginApi, user.requireRoleAccessApi([config.roles.admin, config.roles.adminMember]),
		apiRouter);

	app.get('/api/wechat/followers', admin.getWechatFollowers);
	app.get('/api/wechat/usersummary', admin.getWechatUserSummary);
};
