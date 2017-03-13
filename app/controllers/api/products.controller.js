'use strict';

let path = require('path');
let Product = require(path.resolve('./app/models/product.model.js'));

exports.list = function(req, res) {
  Product.list()
    .then(products => res.json(products))
    .catch(err => res.status(400).send(err));
};

/**
 * Creates a product and stores it in the database. Sends the object back to
 * the caller
 */
exports.create = function(req, res) {
  let product = new Product(req.body);
  product.create()
    .then(() => {
      res.json(product);
    })
    .catch(err => {
      res.status(400).send(err);
    });
};

exports.get = function(req, res) {
  let id = req.params.id;
  console.log(id);
  res.send(400); // TODO implement
};

exports.update = function(req, res) {
  res.send(400); //TODO implement
};

exports.delete = function(req, res) {
  res.send(400); //TODO implement
};
