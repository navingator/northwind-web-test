'use strict';

let path = require('path');
let Product = require(path.resolve('./app/models/product.model.js'));

/**
 * Creates a product and stores it in the database. Sends the object back to
 * the caller
 */
exports.create = function(req, res) {
  let product = new Product(req.body);
  product.create().then(() => {
    res.json(product);
  })
    .catch(err => {
      res.status(400).send(err);
    });
};
