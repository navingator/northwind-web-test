'use strict';

/* Import dependencies */
let path = require('path');

module.exports = function (router) {
  let category = require(path.resolve('./app/controllers/api/product-category.controller'));
  let users = require(path.resolve('./app/controllers/api/users.controller'));

  // Check authentication and authorization for routes
  router.all('/categories*', users.checkLogin, users.checkCategoryAuthorization);

  router.route('/categories')
    .get(category.fullList)
    .post(category.create);
  router.route('/categories/:prodCatId')
    .get(category.get)
    .put(category.update)
    .delete(category.delete);
  router.route('/categories/:prodCatId/products')
    .get(category.getProducts);
  router.route('/categories/search/:prodCatStr')
    .get(category.search);

  router.param('prodCatId', category.getById);
};
