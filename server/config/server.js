'use strict';

var config = require('./');

module.exports = function(app) {
  if(process.env.test) config.port = process.env.test;
  app.listen(config.port);
};
