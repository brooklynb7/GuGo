'use strict';

var config = require('../config'),
	path = require('path');

module.exports = function(app) {
	app.use(function(req, res, next) {
		res.locals.url = {
			original: req.originalUrl,
			base: req.baseUrl,
			path: req.path
		};
		res.locals._ = require('lodash');
		res.locals.query = req.query;
		res.locals.moment = require('moment');
		res.locals.roles = config.roles;
		res.locals.rolesMap = config.rolesMap;
		res.locals.providerMap = config.providerMap;
		res.locals.adviceConfig = config.advice;
		res.locals.gender = config.gender;
		res.locals.userStatus = config.userStatus;
		res.locals.userStatusMap = config.userStatusMap;
		res.locals.applyAgentStatusMap = config.applyAgentStatusMap;
		res.locals.sysMsgGroup = config.sysMsgGroup;
		res.locals.sysMsgGroupMap = config.sysMsgGroupMap;
		res.locals.session = req.session;
		res.locals.utils = require('../../app/utils');

		next();
	});

	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});
};