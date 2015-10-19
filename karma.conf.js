module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-md5/angular-md5.js',
      'public/bower_components/angular-aria/angular-aria.js',
      'public/bower_components/angular-material/angular-material.js',
      'public/bower_components/angular-animate/angular-animate.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/bower_components/angular-ui-router/release/angular-ui-router.js',
      'public/app/*.js',
      'public/app/**/*.js',
      'public/app/**/*.spec.js'
    ],
    reporters: ['mocha', 'coverage'],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      '../../public/*.js': 'coverage'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true
  })
}
