'use strict';

let path = require('path');
let Product = require(path.resolve('./app/models/product.model.js'));
let ApiUtils = require('./api-utils');

exports.list = function(req, res) {
  Product.list()
    .then(products => res.json(products))
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
 * Creates a product and stores it in the database. Sends the object back to
 * the caller
 */
exports.create = function(req, res) {
  let product = new Product(req.body);
  product.create()
    .then(() => res.json(product))
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
 * Retrieves a product and sends it back to the caller as JSON
 * The data should be preprocessed by getById, so no errors will be thrown here
 */
exports.get = function(req, res) {
  res.json(req.product);
};

/**
 * Updates a product in the database
 */
exports.update = function(req, res) {
  let product = new Product(req.body);
  product.id = req.product.id;
  product.update()
    .then(() => res.status(200).send())
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
 * Deletes a product in the database, given the product ID in the request
 */
exports.delete = function(req, res) {
  Product.delete(req.product.id)
    .then(() => res.json(req.product))
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
 * Find Product by a search string in the request. If successful, send the array
 * of results back to the caller. If nothing found, it sends a 404.
 */
exports.search = function(req,res) {
  Product.search(req.params.productSearchStr)
    .then(products => {
      if (products.length === 0) {
        res.status(404).end();
        return;
      }
      res.json(products);
    })
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
 * Middleware to store the product on req.product
 * Validates that the product exists and sends errors:
 *  400 - invalid product ID
 *  404 - Product ID valid, but product not found
 * Should be called by Router.param
 */
exports.getById = function(req, res, next, id) {
  if (!Product.isValidId(id)) {
    return res.status(400).end(); //TODO error
  }
  Product.get(id)
    .then(product => {
      req.product = product;
      next();
      return null;
    })
    .catch(() => res.status(404).end());
};
