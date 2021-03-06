'use strict';

var User          = require('../../user/user.model');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;



module.exports = function() {

  passport.use(new LocalStrategy(
    function(username, password, done) {

      User.findOne({ username: username },function (err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        return done(null, user);
      });
    }
  ));


};
