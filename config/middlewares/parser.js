'use strict';

var bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser');

module.exports = function(app, db) {

	app.use(bodyParser.json());
	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(methodOverride());

	// CookieParser should be above session
	app.use(cookieParser());
};