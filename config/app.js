'use strict';

/**
 * Module dependencies.
 */
var config = require('./config'),
	mongoose = require('./mongoose'),
	express = require('./express'),
	autoIncrement = require('mongoose-auto-increment'),
	chalk = require('chalk');

module.exports.init = function init(callback) {
	mongoose.connect(function(db) {
		autoIncrement.initialize(db);
		// Initialize express
		var app = express(db);
		if (callback) callback(app, db, config);
	});
};

module.exports.start = function start(callback) {
	var _this = this;

	_this.init(function(app, db, config) {

		// Start the app by listening on <port> at <host>
		app.listen(config.port, config.host, function() {
			// Create server URL
			var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
			// Logging initialization
			console.log('--');
			console.log(chalk.green(config.app.title));
			console.log();
			console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
			console.log(chalk.green('Server:          ' + server));
			console.log(chalk.green('Database:        ' + config.db.uri));
			// console.log(chalk.green('App version:     ' + config.version));
			console.log('--');

			if (callback) callback(app, db, config);
		});

	});

};
