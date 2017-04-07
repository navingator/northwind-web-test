'use strict';

/* Import dependencies */
let appRoot = require('app-root-path');

module.exports = function (router) {
  let category = require(appRoot + '/app/controllers/api/product-category.controller');
  let users = require(appRoot + '/app/controllers/api/users.controller');

  // Check authentication and authorization for routes
  router.all('/categories*', users.checkLogin);

  router.route('/categories')
    .get(category.fullList)
    .post(users.checkAdmin, category.create);
  router.route('/categories/:prodCatId')
    .get(category.get)
    .put(users.checkAdmin, category.update)
    .delete(users.checkAdmin, category.delete);
  router.route('/categories/:prodCatId/products')
    .get(category.getProducts);
  router.route('/categories/search/')
    .post(category.search);

  router.param('prodCatId', category.getById);
};
