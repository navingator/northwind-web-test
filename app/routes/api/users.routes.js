'use strict';

var path = require('path');

module.exports = function (router) {
  var users = require(path.resolve('./app/controllers/api/users.controller'));
  router.route('/users').post(users.create);
};
