'use strict';

var express = require('express');
var path = require('path');

module.exports = function () {
  // Initialize the express application
  var app = express();
  app.use(express.static(path.resolve('./public'))); // set the static files location, example: /public/img will be /img for users
  app.use('/node_modules', express.static(path.resolve('./node_modules')));

  // routes ==================================================
  require('../routes/core.routes')(app); // core routes - import last!

  return app;
}
