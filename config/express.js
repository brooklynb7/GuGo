'use strict';

/**
 * Module dependencies.
 */
var http = require('http'),
	express = require('express'),
	middleware = require('./middlewares');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	middleware.locals(app);
	// staticFile must be put before session,
	// otherwish there will be issue for passport login very first time opening the browser
	middleware.staticFile(app);
	middleware.template(app);
	middleware.parser(app);
	middleware.session(app, db);
	middleware.helmet(app);
	middleware.logger(app);
	middleware.router(app);
	middleware.errorHandler(app);
	middleware.https(app);

	// Return Express server instance
	return app;
};
