'use strict';
/**
 * Import this last, as it contains the wildcard route
 */
var path = require('path');
module.exports = function (app) {
  var core = require(path.resolve('./app/controllers/core.controller'));
  app.route('*').get(core.index);
};
