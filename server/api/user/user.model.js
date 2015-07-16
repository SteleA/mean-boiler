'use strict';

// grab the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var comments = new Schema({
  title: String,
  body: String,
  date: {type: Date, default: new Date()}
});

// create a schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, default: 'user'},
  comments: [comments]
});





userSchema
.virtual('changePassword')
  .set(function(newPassword){
    this.set('password', bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null));
  });


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


userSchema.methods.profile = function() {
  return {username: this.username, password: this.password}
};

// Validate username is not taken
userSchema
  .path('username')
  .validate(function(value, respond) {
    var newUser = this;

    newUser.constructor.findOne({username: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        //if(newUser.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'Username taken');

var validatePresenceOf = function(value) {
  return value && value.length;
};

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  next();
})


var User = mongoose.model('User', userSchema);


module.exports = User;
