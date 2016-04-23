'use strict';

var path = require('path');
var express = require('express');
var usersRouter = express.Router();
var userRouter = express.Router();
var authRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var config = require(path.resolve('./config/config'));

module.exports = function(app) {
	pageRouter.get('/signin', user.signinPage);
	pageRouter.get('/signup', user.signupPage);
	pageRouter.get('/signout', user.signoutPage);
	pageRouter.get('/profile', user.requireLoginPage, user.profilePage('users/profile'));
	app.use('/', pageRouter);

	usersRouter.get('/', user.getUserList);
	usersRouter.put('/:userIdApi', user.updateUserInfo);
	usersRouter.delete('/:userIdApi', user.removeUser);
	app.use('/api/users', user.requireLoginApi, user.requireRoleAccessApi(config.roles.admin), usersRouter);

	userRouter.put('/profile', user.updateUserProfile);
	userRouter.put('/password', user.updateUserPassword);
	app.use('/api/user', user.requireLoginApi, userRouter);

	authRouter.post('/signin', user.signin);
	authRouter.post('/signup', user.signup);
	app.use('/api/auth', authRouter);

	// Setting the wechat oauth routes
	app.route('/auth/wechat').get(user.signinWechat);

	usersRouter.param('userIdApi', user.userByIdApi);
};
