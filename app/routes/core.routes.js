'use strict';
/**
 * Import this last, as it contains the wildcard route
 */
module.exports = function (app) {
  var core = require('../controllers/core.controller');
  app.route('*').get(core.index);
}
