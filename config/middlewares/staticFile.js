'use strict';

var path = require('path'),
	compress = require('compression'),
	favicon = require('serve-favicon'),
	express = require('express');

module.exports = function(app) {
	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 3
	}));

	app.use(favicon('./public/images/ico/united.png'));

	app.use('/static', express.static(path.resolve('./public'), {
		// maxAge: 1000*60*60 //*24*365
	}));
};
