'use strict';

let path = require('path');

module.exports = function (router) {
  let products = require(path.resolve('./app/controllers/api/products.controller'));
  let users = require(path.resolve('./app/controllers/api/users.controller'));
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
