'use strict';

let path = require('path');

module.exports = function (router) {
  let users = require(path.resolve('./app/controllers/api/users.controller'));
  router.route('/users').post(users.create);
  router.route('/users/me').get(users.checkLogin, users.me);

  router.route('/users/signin').post(users.signin);
  router.route('/users/signout').post(users.signout);
  router.route('/users/adminplease').post(users.checkLogin, users.makeAdmin);
  router.route('/users/forgot').post(users.forgot);
};
