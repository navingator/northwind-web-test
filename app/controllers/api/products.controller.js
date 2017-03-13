'use strict';

let path = require('path');
let Product = require(path.resolve('./app/models/product.model.js'));

exports.list = function(req, res) {
  Product.list()
    .then(products => res.json(products))
    .catch(err => res.status(400).send(err)); // TODO error
};

/**
 * Creates a product and stores it in the database. Sends the object back to
 * the caller
 */
exports.create = function(req, res) {
  let product = new Product(req.body);
  product.create()
    .then(() => res.json(product))
    .catch(err => res.status(400).send(err)); // TODO error
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
    .catch(err => res.status(400).send(err));
};

exports.delete = function(req, res) {
  res.send(400); //TODO implement
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
    return res.status(400).send(); //TODO error
  }
  Product.get(id)
    .then(product => {
      req.product = product;
      next();
      return null;
    })
    .catch(err => res.status(404).send(err)); //TODO error
};
