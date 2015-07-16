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
