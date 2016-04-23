'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	async = require('async'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	path = require('path'),
	util = require(path.resolve('./app/utils')),
	base = require('./base'),
	errorHandler = require('./errors'),
	request = require('request'),
	config = require(path.resolve('./config/config')),
	User = mongoose.model('User'),
	UserLogin = mongoose.model('UserLogin');

/*
 * Page controllers
 */

exports.signupPage = function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/signup');
	}
};

exports.signinPage = function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/signin');
	}
};

exports.signoutPage = function(req, res) {
	req.logout();
	req.session.user = null;
	res.redirect('/');
};

exports.profilePage = function(viewPath) {
	return function(req, res, next) {
		User.findOne({
			_id: req.session.user._id
		}).exec(function(err, user) {
			user.password = undefined;
			user.salt = undefined;
			res.render(viewPath, {
				profile: user
			});
		});
	};
};

exports.passwordPage = function(viewPath) {
	return function(req, res, next) {
		res.render(viewPath);
	};
};

/* Reuqire login page middleware */
exports.requireLoginPage = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).render('errors/401');
	}
	next();
};

exports.requireRoleAccessPage = function(roles) {
	return function(req, res, next) {
		if (_.isString(roles)) {
			roles = [roles];
		}
		if (!_.isArray(roles)) {
			return next('角色参数错误');
		}

		function checkRoles() {
			if (_.includes(roles, req.session.user.role)) {
				next();
			} else {
				return res.status(403).render('errors/403', {
					requiredRoles: roles
				});
			}
		}

		User.findById(req.session.user._id, function(err, user) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			req.session.user.role = user.role;
			req.session.user.status = user.status;
			checkRoles();
		});
	};
};

exports.requireInternalPage = function(req, res, next) {
	if (util.getRealIP(req.ip) === '127.0.0.1') {
		return next();
	} else {
		return res.status(403).send('Internal Page!');
	}
};

/*
 * API controllers
 */

var doLogin = function(user, req, res) {
	// Remove sensitive data before login
	user.password = undefined;
	user.salt = undefined;

	req.login(user, function(err) {
		if (err) {
			res.status(400).send(err);
		} else {
			var ip = util.getRealIP(req.ip);

			var userLogin = new UserLogin({
				user: user,
				ip: ip
			});

			if (ip === '127.0.0.1') {
				userLogin.address = '本地测试';
				userLogin.save();
			} else {
				var requestOption = {
					uri: 'http://api.map.baidu.com/location/ip?ak=' + config.baiduMapKey + '&ip=' + ip + '&coor=bd09ll',
					method: 'GET'
				};
				request(requestOption, function(err, response, body) {
					if (!err && response.statusCode === 200) {
						var rst = JSON.parse(body);
						if (rst.status === 0) {
							userLogin.address = rst.content.address;
							userLogin.save();
						}
					}
				});
			}

			User
				.findById(user._id)
				.populate('factory')
				.populate('agency')
				.exec(function(err, user) {
					if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
					req.session.user = user;
					res.json(user);
				});
		}
	});
};

exports.signup = function(req, res) {
	var user = new User(req.body);
	user.provider = 'local';

	var role = req.body.role;

	if (role === config.roles.admin || role === config.roles.adminMember) {
		return res.status(400).send('禁止操作');
	}

	var roleModel = null;

	async.waterfall([
		function(cb) {
			User
				.findOne({
					username: req.body.username
				})
				.exec(function(err, rst) {
					if (err) {
						cb(err, null);
					} else if (rst) {
						cb('用户名已经存在', null);
					} else {
						cb(null, user);
					}
				});
		},
		function(user, cb) {
			if (roleModel) {
				roleModel.save(function(err) {
					cb(err, roleModel);
				});
			} else {
				cb(null, roleModel);
			}
		},
		function(roleModel, cb) {
			if (roleModel) {
				user[role] = roleModel;
			}
			user.save(function(err) {
				cb(err, user);
			});
		}
	], function(err, user) {
		if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
		doLogin(user, req, res);
	});
};

exports.signin = function(req, res) {
	passport.authenticate('local', {
			badRequestMessage: '请输入用户名和密码'
		},
		function(err, user, info) {
			if (err || !user) return res.status(400).send(info);
			doLogin(user, req, res);
		})(req, res);
};

exports.signinWechat = function(req, res, next) {
	passport.authenticate('wechat', function(err, user, redirectURL) {
		if (err) {
			return res.send(err);
		}
		req.login(user, function(err) {
			if (err) return res.send('login error');
			User
				.findById(user._id)
				.populate('factory')
				.populate('agency')
				.exec(function(err, user) {
					if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
					req.session.user = user;
					if (redirectURL) {
						return res.redirect(redirectURL);
					} else {
						return res.send('No callback url');
					}
				});
		});
	})(req, res, next);
};

exports.updateUserPassword = function(req, res) {
	var oldPwd = req.body.oldPwd;
	var newPwd = req.body.newPwd;
	var confirmPwd = req.body.confirmPwd;

	if (oldPwd && newPwd && confirmPwd) {
		if (newPwd !== confirmPwd) {
			return res.status(400).send('新密码2次输入不一致');
		}
		User.findById(req.session.user._id, function(err, user) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			if (user.password === user.hashPassword(oldPwd)) {
				user.password = newPwd;
				user.save(function(err) {
					if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
					res.json({
						message: 'ok'
					});
				});
			} else {
				return res.status(400).send('旧密码输入错误');
			}
		});
	} else {
		res.status(400).send('缺少参数');
	}
};

exports.getUserList = function(req, res) {
	User.find().sort('userId').select('_id userId username roles provider mobile name email flag')
		.exec(function(err, users) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			res.json(users);
		});
};

exports.updateUserInfo = function(req, res) {
	var user = req.userProfile;
	user.name = req.body.name;
	user.email = req.body.email;
	user.mobile = req.body.mobile;
	user.updated = Date.now();
	user.updatedBy = req.session.user;

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			user.password = undefined;
			user.salt = undefined;
			res.json(user);
		}
	});
};

exports.removeUser = function(req, res) {
	var user = req.userProfile;
	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(user);
		}
	});
};

exports.updateUserProfile = function(req, res) {
	var profile = {
		name: req.body.name,
		mobile: req.body.mobile,
		email: req.body.email
	};
	User.update({
		_id: req.session.user._id
	}, {
		$set: profile
	}, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.session.user = _.extend(req.session.user, profile);
			res.json({
				code: 200
			});
		}
	});
};

/* Require login API middleware */
exports.requireLoginApi = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).json({
			message: '请先登录'
		});
	}

	next();
};

exports.requireRoleAccessApi = function(roles) {
	return function(req, res, next) {
		if (_.isString(roles)) {
			roles = [roles];
		}
		if (!_.isArray(roles)) {
			return next('角色参数错误');
		}

		function checkRoles() {
			if (_.includes(roles, req.session.user.role)) {
				next();
			} else {
				return res.status(403).json({
					message: '未授权'
				});
			}
		}

		User.findById(req.session.user._id, function(err, user) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			req.session.user.role = user.role;
			req.session.user.status = user.status;
			checkRoles();
		});
	};
};

/* User id api middleware */
exports.userByIdApi = function(req, res, next, id) {
	User.findById(id).exec(function(err, user) {
		if (err) return res.json(err);
		if (!user) return res.status(400).json({
			message: '未找到该用户'
		});
		req.userProfile = user;
		next();
	});
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	var cbUrl = req.query.cb || '/profile';
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' +
			providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[
			providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email
						.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user, cbUrl);
						});
					});
				} else {
					return done(err, user, cbUrl);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[
				providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, cbUrl);
			});
		} else {
			//return done(new Error('User is already connected using this provider'), user, cbUrl);
			return done(null, user, cbUrl);
		}
	}
};
