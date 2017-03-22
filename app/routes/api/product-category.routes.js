'use strict';

/* Import dependencies */
let path = require('path');

module.exports = function (router) {
  let ProductCategory = require(path.resolve('./app/controllers/api/product-category.controller'));
  router.route('/product_categories')
    .get(ProductCategory.fullList)
    .post(ProductCategory.create);
  router.route('/product_categories/:prodCatId')
    .get(ProductCategory.get)
    .put(ProductCategory.update)
    .delete(ProductCategory.delete);
  router.route('/product_categories/:prodCatId/products')
    .get(ProductCategory.getProducts);
  router.route('/product_categories/search/:prodCatStr')
    .get(ProductCategory.search);

  // Process the product ID before hitting the route
  router.param('prodCatId', ProductCategory.initialById);
};
