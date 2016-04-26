'use strict';

var config = require('../config'),
	passport = require('passport'),
	session = require('express-session'),
	lusca = require('lusca'),
	MongoStore = require('connect-mongo')({
		session: session
	});

module.exports = function(app, db) {
	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new MongoStore({
			mongooseConnection: db.connection,
			collection: config.sessionCollection
		}),
		cookie: {
			maxAge: config.sessionCookie.maxAge,
			httpOnly: config.sessionCookie.httpOnly,
			secure: config.sessionCookie.secure && config.secure && config.secure.ssl
		},
		key: config.sessionKey
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// Add Lusca CSRF Middleware
	app.use(lusca(config.csrf));
};
