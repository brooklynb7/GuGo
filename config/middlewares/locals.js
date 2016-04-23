'use strict';

var config = require('../config');

module.exports = function(app) {
	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	//app.locals.jsFiles = config.getJavaScriptAssets();
	//app.locals.cssFiles = config.getCSSAssets();
};