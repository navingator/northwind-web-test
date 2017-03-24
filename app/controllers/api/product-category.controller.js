'use strict';

/* Import dependencies */
let path = require('path');
let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));
let Product = require(path.resolve('./app/models/product.model.js'));
let ApiError = require(path.resolve('./app/models/api-error.model.js'));

/**
* Creates a ProductCategory object and stores it in the database. Sends the
* object back to the caller
*/
exports.create = function(req, res) {
  let productCat = new ProductCategory(req.body);
  productCat.create()
    .then(() => res.json(productCat))
    .catch(err => res.status(400).send(err));
};

/**
* Retrieves a ProductCategory and sends it back to the caller as JSON
* The data should be preprocessed by getById, no errors thrown
*/
exports.get = function(req, res) {
  res.json(req.productCat);
};

exports.getProducts = function(req, res) {
  Product.getByCategory(req.productCat.id)
    .then(products => res.json(products))
    .catch(err => res.status(400).send(err));
};

/**
* Updates a Product Category in the database
*/
exports.update = function(req, res) {
  let productCat = new ProductCategory(req.body);
  productCat.update()
    .then(() => res.json(productCat))
    .catch(err => res.status(400).send(err));
};

/**
* Deletes a ProduceCategory from the database given the product id in the request
*/
exports.delete = function(req, res) {
  ProductCategory.delete(req.productCat.id)
    .then(() => res.json(req.productCat))
    .catch(err => res.status(400).send(err));
};

/**
* Find ProductCategory(s) by a search string in the request. If successful, send
* the array of results back to the caller. If nothing found, it sends a 404.
*/
exports.search = function(req,res) {
  ProductCategory.search(req.params.prodCatStr)
    .then(productCats => {
      if (productCats.length === 0) {
        res.status(404).end();
        return;
      }
      res.json(productCats);
    })
    .catch(err => res.status(400).send(err));
};

/**
* Retrieve a full list of ProductCategory(s) from the database
*/
exports.fullList = function(req,res) {
  ProductCategory.listAll()
    .then(productCats => res.json(productCats))
    .catch(err => res.status(400).send(err));
};

/**
* Middleware to store the product category on req.productCat
* ERROR CODES:
*  400 - invalid product ID
*  404 - Product ID valid, but product not found
* CALLED BY: Router.param
* SIDE EFFECTS: req.productCat is set to the requested product category
*/
exports.initialById = function(req, res, next, id) {
  if (!ProductCategory.isValidId(id)) {
    ApiError.getApiError(4100)
      .then(apiError => res.status(400).send(apiError));
  }
  ProductCategory.read(id)
    .then(productCat => {
      req.productCat = productCat;
      next();
      return null;
    })
    .catch(() => res.status(404).end());
};
