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
var ngAnnotate 			= require('gulp-ng-annotate');
var jshint 					= require('gulp-jshint');
var clean           = require('gulp-clean');
var minifyHTML      = require('gulp-minify-html');
var minifyCss       = require('gulp-minify-css');


//JSlint
gulp.task('lint', function() {
  return gulp.src(['./public/app/**.js', './public/app/**/**.js', '!./public/app/**/*.spec.js', './server/**/**.js', './server/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('lintBuild', function() {
  return gulp.src(['./public/app/**.js', './public/app/**/**.js', '!./public/app/**/*.spec.js', './server/**/**.js', './server/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});


//Browser sync
gulp.task('browser-sync', ['nodemon', 'vendorsCSS','injectIndex'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/**.*", "public/**/**.*"],
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
gulp.task('injectIndex',['vendorsCSS'], function () {
    return gulp.src('./public/index.html')
        .pipe(inject(gulp.src('./public/js/vendors.js', {read: false}), {name: 'bower', relative: true}))
				.pipe(inject(gulp.src(['./public/css/*.*'], {read: false}),{ignorePath: 'public'}))
				.pipe(inject(gulp.src(['./public/app/**.js', './public/app/**/**.js', '!./public/app/**/*.spec.js'], {read: false}),{ignorePath: 'public'}))
        .pipe(gulp.dest('./public'));
});

//Inject JS CSS into index.html
gulp.task('injectIndexBuild', ['cleanDist','vendorsCSS','vendorsJS','less'], function () {
    return gulp.src('./public/index.html')
        .pipe(inject(gulp.src('./public/js/vendors.js', {read: false}), {name: 'bower', relative: true}))
				.pipe(inject(gulp.src('./public/js/bundle.js', {read: false}), {relative: true}))
				.pipe(inject(gulp.src(['./public/css/app.css','./public/css/vendors.css'], {read: false}),{ignorePath: 'public'}))
        //.pipe(minifyHTML())
        .pipe(gulp.dest('./dist/public'));
});

//concat bower js files
gulp.task('vendorsJS', function () {
  return gulp.src(mainBowerFiles({filter: /\.js$/i}))
      .pipe(concat('vendors.js'))
			.pipe(uglify())
      .pipe(gulp.dest('./public/js'))
});

gulp.task('clean', function () {
  gulp.src(['./public/css/*.css','./public/js/*.js'], {read: false})
      .pipe(clean({force: true}))
});

//concat bower js files
gulp.task('vendorsCSS',['clean'], function () {

  gulp.src(mainBowerFiles({filter: /\.css$/i}))
      .pipe(concat('vendors.css'))
      .pipe(gulp.dest('./public/css'))
});

//concat bower js files
gulp.task('bundleJS', function () {
  return gulp.src('./public/app/**/*.js')
      .pipe(concat('bundle.js'))
			.pipe(ngAnnotate())
			.pipe(uglify())
      .pipe(gulp.dest('./public/js'))
});


//clean dist
gulp.task('cleanDist', function () {
    return gulp.src(['./dist/node_modules','./dist/public','./dist/server','./dist/package.json'], {read: false})
        .pipe(clean({force: true}))
});


//copy files dist
gulp.task('copyDist', ['cleanDist', 'less','injectIndexBuild','vendorsJS','vendorsCSS'], function () {
    gulp.src(['./public/app/**/*.html'])
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/public/app'));

    gulp.src(['./public/app/**/*.js', '!./public/app/**/*.spec.js'])
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/public/js'));

    gulp.src(['./public/assets/**'])
    .pipe(gulp.dest('./dist/public/assets'));

    gulp.src(['./public/bower_components/**'])
    .pipe(gulp.dest('./dist/public/bower_components'));

    gulp.src(['./public/css/app.css','./public/css/vendors.css'])
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/public/css'));

    gulp.src(['./public/js/**'])
    .pipe(gulp.dest('./dist/public/js'));

    gulp.src(['./package.json'])
    .pipe(gulp.dest('./dist'));

    gulp.src(['./node_modules/**'])
    .pipe(gulp.dest('./dist/node_modules'));

    gulp.src(['./server/**/*'])
    .pipe(gulp.dest('./dist/server'));
});

//server reload
gulp.task('nodemonDist', function (cb) {
  var init = true;
	return nodemon({
	  script: 'dist/server/app.js'
	}).on('start', function () {
    if(init) cb(); init = false;
  });
});


//build for production
gulp.task('build',['cleanDist','copyDist','less','bundleJS','injectIndexBuild','vendorsJS','vendorsCSS'], function () {});

gulp.task('default', ['clean','browser-sync', 'nodemon', 'less','injectIndex','vendorsJS','vendorsCSS','lint'], function () {});

gulp.task('serve:dist', ['nodemonDist'], function () {});

gulp.task('test',['lintBuild'], function () {});
