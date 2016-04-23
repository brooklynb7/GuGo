'use strict';

var path = require('path');

module.exports = function(app) {
	// view engine setup
	app.set('views', path.resolve('./app/views'));
	app.set('view engine', 'jade');
};