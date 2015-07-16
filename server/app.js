'use strict';

var express       = require('express');
var app           = express();
var expressConfig = require('./config/express');
var mongoDBConfig = require('./config/database');
var routes        = require('./routes');
var serverConfig  = require('./config/server');
var errorHandling = require('./error');


expressConfig(app);
mongoDBConfig();
routes(app);
serverConfig(app);
errorHandling(app);


module.exports = app;
