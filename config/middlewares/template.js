'use strict';

var config = require('../config');
var consolidate = require('consolidate');
var path = require('path');

module.exports = function(app) {
	// view engine setup
	// app.engine('jade', consolidate[config.templateEngin]);
	app.set('views', path.resolve('./app/views'));
	app.set('view engine', 'jade');
};
