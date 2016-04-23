'use strict';

var path = require('path');
var access = require('./access');

module.exports = {
	app: {
		title: 'AppTitle',
		description: '',
		keywords: ''
	},
	port: process.env.PORT || 3301,
	providerMap: {
		local: '网站',
		wechat: '微信'
	},
	page: {
		defautPageSize: 15
	},
	templateEngine: 'jade',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {},
	directors: {
		temp: path.resolve('./public/images/tmp')
	},
	resizeVersion: {
		logo: {
			thumbnail: {
				width: 200,
				height: 200
			}
		},
		pic: {
			thumbnail: {
				width: 300,
				height: '300^',
				imageArgs: [
					'-gravity', 'center',
					'-extent', '300x300',
					'-auto-orient'
				]
			}
		}
	}
};
