'use strict';

module.exports = function(app) {

  // User route
  app.use('/api/user', require('./api/user'));

  //Auth route
  app.use('/api/auth', require('./api/auth'));

  //404 route
  app.use('/api', function(req, res, next) {
    res.status(404).send('404 - Sorry cant find that!');
  });

  //Redirect requests to undefined routepaths to index
  app.route('/*')
    .get(function(req, res, next) {
      res.sendFile(app.get('appPath') + '/index.html');
    });

};
