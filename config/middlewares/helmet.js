'use strict';

var helmet = require('helmet');

module.exports = function(app) {
	// Use helmet to secure Express headers
	var SIX_MONTHS = 15778476000;
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.use(helmet.hsts({
		maxAge: SIX_MONTHS,
		includeSubdomains: true,
		force: true
	}));
	app.disable('x-powered-by');
};
