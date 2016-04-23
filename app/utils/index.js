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

exports.convertPicUrl = function(url) {
	if (url) {
		var array = url.split('static');
		if (array.length > 1) {
			url = '/static' + array[1];
		}
	}
	return url;
};

exports.convertPicDeleteUrl = function(url) {
	if (url) {
		var array = url.split('api');
		if (array.length > 1) {
			url = '/api' + array[1];
		}
	}
	return url;
};

exports.convertGenderToText = function(code) {
	return code === 2 ? '女' : '男';
};

String.prototype.linkify = function() {

	// http://, https://, ftp://
	var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

	// www. sans http:// or https://
	var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

	// Email addresses
	var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

	return this
		.replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
		.replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
		.replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>');
};