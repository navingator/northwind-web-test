'use strict';

/* Import dependencies */
let path = require('path');

module.exports = function (router) {
  var productCat = require(path.resolve('./app/controllers/api/product-category.controller'));
  router.route('/product_category')
    .get(productCat.fullList)
    .post(productCat.create);
  router.route('/product_category/:prodCatId')
    .get(productCat.get)
    .put(productCat.update)
    .delete(productCat.delete);
  router.route('/product_category/search/:prodCatStr')
    .get(productCat.byStr);

  // Process the product ID before hitting the route
  router.param('prodCatId', productCat.initialById);
};
