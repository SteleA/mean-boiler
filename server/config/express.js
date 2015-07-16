'use strict';

var express       = require('express');
var mongoose      = require('mongoose');
var config        = require('./');
var morgan        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var cors          = require('cors');
var jwt           = require('express-jwt');



module.exports = function(app) {

  // allow CORS
  app.use(cors());

  // set enviorment to development or production
  app.set('env', config.env);
  
  if (!app.get('env')) {
    app.use(function(err, req, res, next) {
      return res.status(500).json({error: 'enviorment not set'});
    });
  }

  // use morgan to log requests to the console
  app.use(morgan('dev'));

  // read cookies (needed for auth)
  app.use(cookieParser());

  // use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // serve public
  app.use(express.static('./public'));

}
