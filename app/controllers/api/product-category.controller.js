'use strict';

/* Import dependencies */
let path = require('path');
let ProductCat = require(path.resolve('./app/models/product-category.model.js'));
let ApiUtils = require('./api-utils');

/**
* Creates a Product Category
* @return   {promise}   Resolves to a product category objecthe newly created product category object
* SIDE EFFECTS: A new product category is created in the database
*/
exports.create = function(req, res) {
  let productCat = new ProductCat(req.body);
  productCat.create()
    .then(() => res.json(productCat))
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
* Updates a Product Category
* @return   {promise}   Resolves to a product category object
* SIDE EFFECTS: A product category is updated in the database
*/
exports.update = function(req, res) {
  req.body.id = req.params.prodCatId;
  let productCat = new ProductCat(req.body);
  productCat.update()
    .then(() => {
      res.json(productCat);
    })
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
* Deletes a Produce Category
* @return   {promise}   Resolves to a 200 status
* SIDE EFFECTS: A product category is deleted from the database
*/
exports.delete = function(req, res) {
  ProductCat.remove(req.params.prodCatId)
    .then(() => {
      res.status(200).send(req.productCat);
    })
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
* Retrieves a product category
* @return   {promise}   Resolves to a product category as a JSON
* ERROR CODES:  The data should be preprocessed by getById, no errors thrown
*/
exports.get = function(req, res) {
  res.json(req.productCat);
};

/**
* Find product categories by a search string
* @return   {promise}   Resolves to an array of product category objects
*/
exports.byStr = function(req,res) {
  ProductCat.findByStr(req.params.prodCatStr)
    .then(productCats => {
      res.json(productCats);
    })
    .catch(err => ApiUtils.handleDbError(err, res));
};

/**
* Retrieve a full list of product categories
* @return   {promise}   Resolves to a complete list of product categories
*/
exports.fullList = function(req,res) {
  ProductCat.listAll()
    .then(productCats => {
      res.json(productCats);
    })
    .catch(err => ApiUtils.handleDbError(err, res));
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
  if (!ProductCat.isValidId(id)) {
    return res.status(400).send(); //TODO error
  }
  ProductCat.findById(id)
    .then(productCat => {
      req.productCat = productCat;
      next();
      return null;
    })
    .catch(() => res.status(404).send()); //TODO error
};
