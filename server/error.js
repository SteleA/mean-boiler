'use strict';


module.exports = function(app) {


  // development error handler
  // will print stacktrace
  if (!process.env.enviroment) {
    app.use(function(err, req, res, next) {
    return  res.status(err.status || 500).json({error: err});
    });
  }else {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500).json({message: err.message,error: {}});
    });
  }



};
