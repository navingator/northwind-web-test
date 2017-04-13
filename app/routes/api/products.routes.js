'use strict';

let appRoot = require('app-root-path');

module.exports = function (router) {
  let products = require(appRoot + '/app/controllers/api/products.controller');
  let security = require(appRoot + '/app/controllers/api/security.controller');
  router.all('/products*', security.requireLogin);

  router.route('/products')
    .get(products.list)
    .post(products.create);
  router.route('/products/:productId')
    .get(products.get)
    .put(security.requireProductSecurity, products.update)
    .delete(security.requireProductSecurity, products.delete);
  router.route('/products/search')
    .post(products.search);

  router.param('productId', products.getById);
};
