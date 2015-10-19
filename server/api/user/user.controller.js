'use strict';

var User     = require('./user.model');
var bcrypt   = require('bcrypt-nodejs');
var auth     = require('../auth/auth.service');
var helper   = require('../../helpers');
var moment   = require('moment');
var sendEmail = require('../../emails');


// list all users
exports.findAll = function(req, res, next) {
  User.find({}, '-password', function(err, user){
    if (err) next(err);
    if (!user) return res.json('No users found');
    res.send( user );
  });
};

// find user by id
exports.findOne = function(req, res, next) {
  User.findById(req.params.id, '-password -email -facebook -comments -forgotPasswordToken -forgotPasswordTokenExpires', function(err, user){
    if (err) return next(err);
    if (!user) return res.json('No user found');
    res.send(user);
  });
};

exports.createUser = function(req, res, next) {
  var newuser      = new User(req.body);
  newuser.username = newuser.username.toLowerCase().replace(/ /g,'');
  newuser.role     = 'user';

  if(newuser.username.length > 10) return next({message: 'Username too long, maximum 10 characters'});
  if(!helper.isEmail(newuser.email)) return next({message: 'Invalid email'});

  newuser.save(function (err) {
    if (err) return res.status(500).send(err);
    res.json({token: auth.signToken(newuser._id, newuser.role)});
  });

};

exports.updateUserSettings = function(req, res, next) {

  var newUsername  = req.body.username.toLowerCase() || req.user.username;
  var newEmail     = req.body.email || req.user.email;
  var newPassword  = req.body.password || req.user.password;
  var _id          = req.user._id;

  if(newUsername.length > 10) return next({message: 'Username too long, maximum 10 characters'});


  User.findById(_id , function(err, user){
    if (err) return next(err);
    if (!user) return res.json('No user found');

    if (user.username !== newUsername) {
      user.username = newUsername;
    }

    if (user.email !== newEmail) {
      user.email = newEmail;
    }

    if (user.password !== newPassword) {
      user.password = newPassword;
    }

    user.save(function (err) {
      if (err) return res.status(500).send(err);
      res.json({message: 'success'});
    });
  });

};

//Delete User
exports.deleteUser = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.sendStatus(204);
  });
};



//Get user info
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-password -comments -forgotPasswordToken -forgotPasswordTokenExpires', function(err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};


// Forgot password
exports.forgotPassword = function(req, res, next) {

  var obj = {};

  if (helper.isEmail(req.params.usernameOrEmail)) {
    obj = {email: req.params.usernameOrEmail};
    findUser();
  } else {
    obj = {username: req.params.usernameOrEmail};
    findUser();
  }


  function findUser(){
    User.findOne(obj, function(err, user){

      if (err) return next(err);
      if (!user) return res.status(400).json('No user found');

      user.forgotPasswordToken = helper.makeId();
      user.forgotPasswordTokenExpires = moment().add(1, 'h').format();

      //Send out email with token
      user.save(function(err){
        if (err) return next(err);
        sendEmail.forgotPassword(res, user);
      });
    });
  }

};

exports.resetPassword = function(req, res, next) {

  var resetToken = req.body.resetToken;
  var newPassword  = req.body.password || req.user.password;

  User.findOne({forgotPasswordToken: req.body.resetToken}, function(err, user){
    if (err) return next(err);
    if (!user) return res.status(400).json('Invalid reset token');

    if(moment().format() > user.forgotPasswordTokenExpires){
      return res.status(401).send('token expired');
    }

    if (user.password !== newPassword) {
      user.password = newPassword;
    }

    user.forgotPasswordTokenExpires = undefined;
    user.forgotPasswordToken = undefined;

    user.save(function (err) {
      if (err) return res.status(500).send(err);
      res.json({message: 'success'});
    });
  });

};
