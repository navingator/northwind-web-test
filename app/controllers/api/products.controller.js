'use strict';

let path = require('path');
let Product = require(path.resolve('./app/models/product.model.js'));

/**
 * Creates a product and stores it in the database. Sends the object back to
 * the caller
 */
exports.create = function(req, res) {
  let product = Product.get(req.body);
  Product.create(product).then(data => {
    product.id = data.id; // set ID from database
    res.json(product);
  })
    .catch(err => {
      console.log(err); //TODO better logging method
      res.status(400).send(err);
    });
};
