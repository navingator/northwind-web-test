'use strict';

let path = require('path');

module.exports = function (router) {
  let products = require(path.resolve('./app/controllers/api/products.controller'));
  router.route('/products').post(products.create);
};
