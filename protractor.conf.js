exports.config = {
  framework: 'mocha',
  specs: [
    'test/e2e/**/*.spec.js'
  ],
  mochaOpts: {
    enableTimeouts: false
  },
  capabilities: {
    'browserName': 'phantomjs'
  },
  onPrepare: function () {
    process.env.test = 9000
    require('./server/app')
  }
}
