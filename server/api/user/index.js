'use strict';

var express    = require('express');
var router     = express.Router();
var controller = require('./user.controller');
var auth = require('../auth/auth.service');


// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', auth.isAuthenticated(), controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', controller.createUser);




module.exports = router;
