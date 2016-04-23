'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User
				.findOne({
					username: username,
					provider: 'local'
				})
				.exec(function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: '该用户不存在'
						});
					}
					if (!user.authenticate(password)) {
						return done(null, false, {
							message: '用户名/密码不正确'
						});
					}

					return done(null, user);
				});
		}
	));
};