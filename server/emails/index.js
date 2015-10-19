
var hogan = require('hogan.js');
var fs = require('fs');
var config = require('../config');
var sendgrid = require("sendgrid")(config.sendgridUsername, config.sendgridPassword);


exports.forgotPassword = function(res, user){

  var template = fs.readFileSync(__dirname + '/forgotPassword.hjs','utf-8');
  var compliedTemplate = hogan.compile(template);

  sendgrid.send({
    to:       user.email,
    fromname: config.appName,
    from:     config.supportEmail,
    subject:  'Forgot password',
    html:     compliedTemplate.render({
      resetURL: config.URL + '/resetPassword/' + user.forgotPasswordToken,
      email: user.email,
      username: user.username,
      supportEmail: config.supportEmail,
      appName: config.appName,
      appURL: config.URL,
    })
  }, function(err, json){
    if (err) return console.log(err);
    res.send('success');
  });
};
