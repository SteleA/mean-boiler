'use strict';

var mongoose = require('mongoose');


var config = {
  appName: process.env.appName,
  supportEmail: process.env.supportEmail,
  secret: process.env.appSecret || 'appSecret',

  //token expires in 30 days
  tokenExpires: 60*24*30,

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  port:             process.env.PORT || 3000,
  env:              process.env.enviroment || 'development',
  mongodbURL:       process.env.mongoDB || 'mongodb://localhost/test',
  fbAppID:          process.env.facebookAppID,
  fbAppSecret:      process.env.facebookAppSecret,
  URL:              process.env.appURL || 'http://localhost:3000',
  sendgridUsername: process.env.sendgridUsername,
  sendgridPassword: process.env.sendgridPassword,

};



module.exports = config;
