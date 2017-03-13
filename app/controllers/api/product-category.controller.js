'use strict';

let path = require('path');
let ProductCat = require(path.resolve('./app/models/product-category.model.js'));

/**
* DESCRIPTION: Creates a Product Category
* RETURNS: The newly created product category object
* SIDE EFFECTS: A new product category is created in the database
*/
exports.create = function(req, res) {
   let productCat = new ProductCat(req.body);
   productCat.create()
      .then(productCat => {
         res.json(productCat);
      })
      .catch(err => res.status(400).send(err));
};

/**
 * DESCRIPTION: Updates a Product Category
 * RETURNS: The updated product category object
 * SIDE EFFECTS: A product category is updated in the database
 */
exports.update = function(req, res) {
   req.body.id = req.params.prodCatId;
   let productCat = new ProductCat(req.body);
   productCat.update()
      .then(() => {
         res.json(productCat);
      })
      .catch(err => res.status(400).send(err));
};

/**
 * DESCRIPTION: Deletes a Produce Category
 * RETURNS: A 200 status
 * SIDE EFFECTS: A product category is deleted for  the database
 */
exports.delete = function(req, res) {
   ProductCat.remove(req.params.prodCatId)
      .then(() => {
         res.status(200).send();
      })
      .catch(err => res.status(400).send(err));
};

/**
* DESCRIPTION: Find a Product Category by Id
* RETURNS: A product category object
* SIDE EFFECTS: None
*/
exports.byId = function(req, res) {
   ProductCat.findById(req.params.prodCatId)
      .then(productCat => {
         res.json(productCat);
      })
      .catch(err => res.status(400).send(err));
};

/**
 * DESCRIPTION: Find Product Categories by a Search String
 * RETURNS: An array of product category objects
 * SIDE EFFECTS: None
 */
exports.byStr = function(req,res) {
   ProductCat.findByStr(req.params.prodCatStr)
      .then(productCats => {
         res.json(productCats);
      })
      .catch(err => res.status(400).send(err));
};

/**
 * DESCRIPTION: Retrieve a full list of product categories
 * RETURNS: A full list of product categorires
 * SIDE EFFECTS: none
 */
exports.fullList = function(req,res) {
   ProductCat.listAll()
      .then(productCats => {
         res.json(productCats);
      })
      .catch(err => res.status(400).send(err));
};
