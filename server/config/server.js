'use strict';

var config = require('./')

module.exports = function(app) {
  app.listen(config.port);
};
