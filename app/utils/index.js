'use strict';

var _ = require('lodash');

exports.regex = {
	mobile: /^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
};

exports.getRealIP = function(ipString) {
	if (!ipString) {
		return ipString;
	}
	var realIP = null;
	var ipArray = ipString.split(':');
	if (ipArray.length === 1) {
		realIP = ipString;
	} else {
		var ip = ipArray[ipArray.length - 1];
		if (ip === '1') {
			realIP = '127.0.0.1';
		} else {
			realIP = ip;
		}
	}

	return realIP;
};
