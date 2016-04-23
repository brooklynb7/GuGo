'use strict';

var gulp = require('gulp');

var env = process.env.NODE_ENV || 'development';

require('require-directory')(module, './gulp');

console.log('Invoking gulp -', env);

gulp.task('default', ['clean'], function() {
	// run with paramater
	gulp.start(env);
});