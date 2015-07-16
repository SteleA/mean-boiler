'use strict';


module.exports = function(app) {


  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    return  res.status(err.status || 500).json({error: err});
    });
  }

  if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500).json({message: err.message,error: {}});
    });
  }

}
