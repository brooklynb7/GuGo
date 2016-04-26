'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var defaultTasks = ['env:test', 'mochaTest'];

gulp.task('env:test', function() {
	process.env.NODE_ENV = 'test';
});

gulp.task('mochaTest', function() {
	return gulp.src('app/tests/**/*.js', {
		read: false
	}).pipe(plugins.mocha({
		reporter: 'spec'
	}));
});

gulp.task('test', defaultTasks);
