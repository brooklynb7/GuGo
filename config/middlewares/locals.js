'use strict';

var config = require('../config');

module.exports = function(app) {
	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
	app.locals.livereload = config.livereload;
	app.locals.logo = config.logo;
	app.locals.favicon = config.favicon;

	if (config.secure && config.secure.ssl === true) {
		app.locals.secure = config.secure.ssl;
	}
};
