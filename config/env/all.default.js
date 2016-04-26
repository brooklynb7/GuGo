'use strict';

var path = require('path');
var access = require('./access');

module.exports = {
	app: {
		title: 'AppTitle',
		description: '',
		keywords: '',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	host: process.env.HOST || '0.0.0.0',
	templateEngine: 'jade',
	providerMap: {
		local: '网站',
		wechat: '微信'
	},
	page: {
		defautPageSize: 15
	},
	// Session Cookie settings
	sessionCookie: {
		// session expiration is set by default to 24 hours
		maxAge: 24 * (60 * 60 * 1000),
		// httpOnly flag makes sure the cookie is only accessed
		// through the HTTP protocol and not JS/browser
		httpOnly: true,
		// secure cookie should be turned to true to provide additional
		// layer of security so that the cookie is set only when working
		// in HTTPS mode.
		secure: false
	},
	// sessionKey is set to the generic sessionId key used by PHP applications
	// for obsecurity reasons
	sessionKey: 'sessionId',
	sessionSecret: process.env.SESSION_SECRET || 'MEAN',
	sessionCollection: 'sessions',
	csrf: {
		csrf: false,
		csp: { /* Content Security Policy object */ },
		xframe: 'SAMEORIGIN',
		p3p: 'ABCDEF',
		xssProtection: true
	},
	logo: '',
	favicon: 'public/images/ico/united.png',
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
