'use strict';

var mongoose = require('mongoose');

var config = {
  secret: 'honeyanny',
  port:   3000,
  env:    'development',
  mongodbURL: 'mongodb://localhost/test',

  //token expires in 30 days
  tokenExpires: 60*24*30,

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],
}

module.exports = config;
