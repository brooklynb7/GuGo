'use strict';

var init = require('../../config/init')(),
	config = require('../../config/config'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	path = require('path'),
	moment = require('moment'),
	supertest = require('supertest'),
	expect = require('expect.js'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});
autoIncrement.initialize(db);

// Init the express application
var app = require('../../config/express')(db);
require('../../config/passport')();

var user1, user2;

describe('User authentication', function() {
	before(function(done) {
		user1 = {
			username: 'test2' + Date.now(),
			password: '123456',
			email: 'test@test.com',
			mobile: '138'
		};

		user2 = {
			username: 'test1' + Date.now(),
			password: '123456',
			email: 'test@test.com',
			mobile: '138'
		};

		done();
	});

	it('should begin without the test user', function(done) {
		supertest(app)
			.post('/api/auth/signin')
			.send({
				username: user1.username,
				password: user1.password
			})
			.expect(400)
			.end(function(err, res) {
				var rst = res.body;
				expect(rst.message).to.equal('该用户不存在');
				done();
			});
	});
});