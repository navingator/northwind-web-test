'use strict';

let appRoot = require('app-root-path');

module.exports = function (router) {
  let users = require(appRoot + '/app/controllers/api/users.controller');
  let security = require(appRoot + '/app/controllers/api/security.controller');

  router.route('/users').post(users.create);
  router.route('/users/me').get(users.me);

  router.route('/users/signin').post(users.signin);
  router.route('/users/signout').post(users.signout);
  router.route('/users/adminplease').post(security.requireLogin, users.makeAdmin);
  router.route('/users/forgot').post(users.forgot);
};
