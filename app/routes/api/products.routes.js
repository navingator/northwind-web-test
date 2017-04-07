'use strict';

let appRoot = require('app-root-path');

module.exports = function (router) {
  let products = require(appRoot + '/app/controllers/api/products.controller');
  let users = require(appRoot + '/app/controllers/api/users.controller');
  router.all('/products*', users.checkLogin);
  router.route('/products')
    .get(products.list)
    .post(products.create);
  router.route('/products/:productId')
    .get(products.get)
    .put(products.update)
    .delete(products.delete);
  router.route('/products/search')
    .post(products.search);

  router.param('productId', products.getById);
};
