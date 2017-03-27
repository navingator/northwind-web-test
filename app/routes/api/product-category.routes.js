'use strict';

/* Import dependencies */
let path = require('path');

module.exports = function (router) {
  let category = require(path.resolve('./app/controllers/api/product-category.controller'));
  let users = require(path.resolve('./app/controllers/api/users.controller'));

  // Check authentication and authorization for routes
  router.all('/product_categories*', users.checkLogin, users.checkCategoryAuthorization);

  router.route('/product_categories')
    .get(category.fullList)
    .post(category.create);
  router.route('/product_categories/:prodCatId')
    .get(category.get)
    .put(category.update)
    .delete(category.delete);
  router.route('/product_categories/:prodCatId/products')
    .get(category.getProducts);
  router.route('/product_categories/search/:prodCatStr')
    .get(category.search);

  router.param('prodCatId', category.getById);
};
