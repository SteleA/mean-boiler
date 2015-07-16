'use strict';

var mongoose  = require('mongoose');
var config    = require('./');

module.exports = function() {
  mongoose.connect(config.mongodbURL);
}
