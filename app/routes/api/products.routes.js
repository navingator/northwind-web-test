'use strict';

let path = require('path');

module.exports = function (router) {
  let products = require(path.resolve('./app/controllers/api/products.controller'));
  router.route('/products')
    .get(products.list)
    .post(products.create);
  router.route('/products/:productId')
    .get(products.get)
    .put(products.update)
    .delete(products.delete);
  router.route('/products/search/:productSearchStr')
    .get(products.search);

  // Process the product ID before hitting the route
  router.param('productId', products.getById);
};
