'use strict';

var express    = require('express');
var router     = express.Router();
var controller = require('./user.controller');
var auth = require('../auth/auth.service');


// define the home page route
router.get('/', auth.hasRole('admin'), controller.findAll);
router.get('/:id', auth.isAuthenticated(), controller.findOne);
router.delete('/:id', auth.hasRole('admin'), controller.deleteUser);
router.post('/', controller.createUser);
router.put('/', auth.isAuthenticated(), controller.updateUserSettings);
router.get('/profile/me', auth.isAuthenticated(), controller.me);

//forgot password
router.get('/forgotpassword/:usernameOrEmail', controller.forgotPassword);
router.post('/resetpassword', controller.resetPassword);


module.exports = router;
