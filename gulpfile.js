'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var path = require('path');
var inject = require('gulp-inject');

gulp.task('less', function () {
  return gulp.src('./public/app/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('browser-sync', ['nodemon', 'less'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/*.*","public/**/*.*"],
        browser: "google chrome",
        port: 4000,
	});

  gulp.watch("public/**/*.less", ['less']);

});

gulp.task('nodemon', function (cb) {
  var init = true;
	return nodemon({
	  script: 'server/app.js'
	}).on('start', function () {
    if(init) cb(); init = false;
  });
});

gulp.task('index', function () {

  gulp.src('./public/index.html')
    .pipe(inject(gulp.src(['./public/app/*.css','./public/app/**/*.js'], {read: false}), {ignorePath: 'public'}))
    .pipe(gulp.dest('./public'))

});

gulp.task('default', ['browser-sync','index'], function () {
});
