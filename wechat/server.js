'use strict';

var init = require('../config/init')(),
	express = require('express'),
	path = require('path'),
	config = require('./config'),
	logger = require('../config/middlewares/logger'),
	parser = require('../config/middlewares/parser'),
	templateEngine = require('../config/middlewares/template'),
	moment = require('moment'),
	routes = require('./routes');

var app = express();

templateEngine(app);

logger(app);

parser(app);

routes(app);

// Setting the app router and static folder
app.use(express.static(path.resolve('../public')));

app.set('port', config.wechat.port);

var server = app.listen(app.get('port'), function() {
	console.log('[' + moment().format('YYYY-MM-DD h:mm:ss') +
		'] Wechat-API server listening on port ' + server.address().port);
});
