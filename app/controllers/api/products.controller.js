'use strict';

let appRoot = require('app-root-path');
let Product = require(appRoot + '/app/models/product.model.js');
let ApiError = require(appRoot + '/app/models/api-error.model.js');

exports.list = function(req, res) {
  Product.listAll()
    .then(products => res.json(products))
    .catch(err => res.status(400).send(err));
};

/**
 * Creates a Product object and stores it in the database. Sends the object back to
 * the caller
 */
exports.create = function(req, res) {
  let product = new Product(req.body);
  product.createdBy = req.user.id;
  product.create()
    .then(() => res.json(product))
    .catch(err => res.status(400).send(err));
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
  product.update()
    .then(() => res.json(product))
    .catch(err => res.status(400).send(err));
};

/**
 * Deletes a product in the database, given the product ID in the request
 */
exports.delete = function(req, res) {
  Product.delete(req.product.id)
    .then(() => res.json(req.product))
    .catch(err => res.status(400).send(err));
};

/**
 * Find Product by a search string in the request. If successful, send the array
 * of results back to the caller. If nothing found, it sends a 404.
 */
exports.search = function(req, res) {
  Product.search(req.body.term)
    .then(products => res.json(products))
    .catch(err => res.status(400).send(err));
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
    return ApiError.getApiError(4100)
      .then(apiError => res.status(400).send(apiError));
  }
  Product.read(id)
    .then(product => {
      req.product = product;
      next();
      return null;
    })
    .catch(() => {
      return ApiError.getApiError(4101)
        .then(apiError => res.status(404).send(apiError));
    });
};

// TODO document
exports.checkIfOwner = function(req, res, next) {
  let user = req.user;
  let product = req.product;
  return Product.read(product.id)
    .then(dbProduct => {
      if(dbProduct.createdBy === user.username) {
        return next();
      }
      return ApiError.getApiError(0)  // TODO add a new api error if not the owner. Also, find out if this error is even neccisary.
        .then(apiErr => Promise.reject(apiErr));
    })
    .then(() => res.status(200).end())
    .catch(err => res.status(400).send(err));
};
