'use strict';

var User     = require('./user.model');
var bcrypt   = require('bcrypt-nodejs');
var auth = require('../auth/auth.service');

// list all users
exports.findAll = function(req, res, next) {
  User.find({}, '-password', function(err, user){
    if (err) next(err);
    if (!user) return res.json('No users found')
    res.send( user )
  })
};

// find user by id
exports.findOne = function(req, res, next) {
  User.findById(req.params.id, '-password', function(err, user){
    if (err) return next(err);
    if (!user) return res.json('No user found');
    res.send(user);
  })
};

exports.createUser = function(req, res, next) {
  var newuser      = new User(req.body);
  newuser.username = newuser.username.toLowerCase();
  newuser.role     = 'user';

  newuser.save(function (err) {
    if (err) return res.status(500).send(err);
    res.json({token: auth.signToken(newuser._id, newuser.role)})
  });

};

exports.updateUserSettings = function(req, res, next) {

  var newUsername  = req.body.username.toLowerCase() || req.user.username;
  var newEmail     = req.body.email || req.user.email;
  var newPassword  = req.body.password || req.user.password;
  var _id          = req.user._id;


  User.findById(_id , function(err, user){
    if (err) return next(err);
    if (!user) return res.json('No user found');



    if (user.username !== newUsername) {
      user.username = newUsername;
    }

    if (user.email !== newEmail) {
      user.email = newEmail
    }

    if (user.password !== newPassword) {
      user.password = newPassword;
    }



    user.save(function (err) {
      if (err) return res.status(500).send(err);
      res.json({message: 'success'})
    });
  })

};

//
exports.deleteUser = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};



//Get user info
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-password -comments', function(err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};
