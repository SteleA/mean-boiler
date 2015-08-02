'use strict';

var gulp            = require('gulp');
var browserSync     = require('browser-sync');
var nodemon         = require('gulp-nodemon');
var less            = require('gulp-less');
var path            = require('path');
var inject          = require('gulp-inject');
var mainBowerFiles  = require('main-bower-files');
var concat          = require('gulp-concat');
var uglify 					= require('gulp-uglify');
var gulpif 					= require('gulp-if');
var notify 					= require('gulp-notify');
var ngmin 					= require('gulp-ngmin');

var production = process.env.NODE_ENV === 'production';


//Browser sync
gulp.task('browser-sync', ['nodemon', 'less'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/*.*","public/**/*.*"],
        browser: "google chrome",
        port: 4000,
	});

  gulp.watch("public/**/*.less", ['less']);

});

//server reload
gulp.task('nodemon', function (cb) {
  var init = true;
	return nodemon({
	  script: 'server/app.js'
	}).on('start', function () {
    if(init) cb(); init = false;
  });
});

//Complie less
gulp.task('less', function () {
  return gulp.src('./public/app/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

//Inject JS CSS into index.html
gulp.task('injectIndex', function () {
    return gulp.src('./public/index.html')
        .pipe(inject(gulp.src('./public/js/vendors.js', {read: false}), {name: 'bower', relative: true}))
				//.pipe(inject(gulp.src('./public/js/bundle.js', {read: false}), {relative: true}))
        .pipe(inject(gulp.src(['./public/app/*.css', './public/app/**.js', './public/app/**/**.js'], {read: false}),{ignorePath: 'public'}))
        .pipe(gulp.dest('./public'));
});

//concat bower js files
gulp.task('vendorsJS', function () {
  return gulp.src(mainBowerFiles({filter: /\.js$/i}))
      .pipe(concat('vendors.js'))
			.pipe(uglify())
      .pipe(gulp.dest('./public/js'))
			//.pipe(notify({ message: 'Finished minifying JavaScript'}));
});

//concat bower js files
gulp.task('bundleJS', function () {
  return gulp.src('./public/app/**/*.js')
      .pipe(concat('bundle.js'))
			//.pipe(ngmin({dynamic: true}))
			//.pipe(uglify())
      .pipe(gulp.dest('./public/js'))
			//.pipe(notify({ message: 'Finished minifying JavaScript'}));
});

gulp.task('default', ['browser-sync','injectIndex','vendorsJS','bundleJS'], function () {});
