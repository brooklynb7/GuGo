'use strict';

var handleError = function(err, path, res) {
	// Log it
	console.error(err.stack);

	// Error page
	res.status(err.status || 500).render(path + 'errors/500', {
		message: err.message,
		error: err
	});
};

var handleNotFound = function(path, res) {
	res.status(404).render(path + 'errors/404');
};

module.exports = function(app) {
	//Handle 500 error
	app.use('/api', function(err, req, res, next) {
		//console.log(err);
		if (!err) return next();
		res.status(err.status || 500).send('内部错误');
	});

	app.use('/admin', function(err, req, res, next) {
		if (!err) return next();
		handleError(err, 'admin/', res);
	});

	app.use(function(err, req, res, next) {
		if (!err) return next();
		handleError(err, '', res);
	});

	// Assume 404 since no middleware responded
	app.use('/api', function(req, res) {
		res.status(404).send('无此接口');
	});

	app.use('/admin', function(req, res) {
		handleNotFound('admin/', res);
	});

	app.use(function(req, res) {
		handleNotFound('', res);
	});
};
