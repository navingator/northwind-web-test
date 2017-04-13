'use strict';

/* Import dependencies */
let appRoot = require('app-root-path');

module.exports = function (router) {
  let category = require(appRoot + '/app/controllers/api/product-category.controller');
  let security = require(appRoot + '/app/controllers/api/security.controller');

  // Check authentication and authorization for routes
  router.all('/categories*', security.requireLogin);

  router.route('/categories')
    .get(category.fullList)
    .post(security.requireAdmin, category.create);
  router.route('/categories/:categoryId')
    .get(category.get)
    .put(security.requireAdmin, category.update)
    .delete(security.requireAdmin, category.delete);
  router.route('/categories/:categoryId/products')
    .get(category.getProducts);
  router.route('/categories/search/')
    .post(category.search);

  router.param('categoryId', category.getById);
};
