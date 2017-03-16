'use strict';
let path = require('path');
let chai = require('chai');
let chaiHttp = require('chai-http');

let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));

chai.use(chaiHttp);

module.exports = function(app) {
  /**
   * Creates an object using the API
   * @param  {ProductCategory}  productCategory Product category to create
   * @param  {Function}         cb              Callback function - used to set the
   *                                            res property from the caller
   * SIDE EFFECTS: Sets the product category's ID
   */
  let create = function(productCategory, cb) {
    chai.request(app)
      .post('/api/product_category')
      .send(productCategory)
      .end((err, res) => {
        productCategory.id = res.body.id; // Set product ID for easy deletion later
        cb(res);
      });
  };

  /**
   * Deletes a given object from the database
   * @param  {Product}  productCategory  Product Category object to delete from the database
   * @param  {Function} cb               Callback function - likely mocha's done function
   */
  let cleanup = function(productCategory, cb) {
    if (productCategory.id) {
      ProductCategory.remove(productCategory.id)
        .then(() => cb())
        .catch(err => cb(err));
    } else {
      cb();
    }
  };

  /**
   * Gets a product category from the database, given the ID
   * @param  {number}   productCatId ID of the product to retrieve
   * @param  {Function} cb           Callback function to store the response
   */
  let get = function(productCatId, cb) {
    chai.request(app)
      .get('/api/product_category/' + productCatId)
      .end((err, res) => cb(res));
  };

  let search = function(searchStr, cb) {
    chai.request(app)
      .get('/api/product_category/search/' + searchStr)
      .end((err, res) => cb(res));
  };

  /**
   * Gets all of the product categories from the database
   * @param  {Function} cb Callback function to store results
   */
  let list = function(cb) {
    chai.request(app)
      .get('/api/product_category')
      .end((err, res) => cb(res));
  };

  /**
   * Updates a product category in the database
   * @param {ProductCategory} product Product category object with updated values
   * @param {Function}        cb      Callback function to store results
   */
  let update = function(productCategory, cb) {
    chai.request(app)
      .put('/api/product_category/' + productCategory.id)
      .send(productCategory)
      .end((err, res) => cb(res));
  };

  /**
   * Deletes a given object from the database
   * @param  {Product}  productCategory  Product Category object to delete from the database
   * @param  {Function} cb               Callback function to store results
   */
  let remove = function(productCatId, cb) {
    chai.request(app)
      .delete('/api/product_category/' + productCatId)
      .end((err, res) => cb(res));
  };

  return {
    create: create,
    cleanup: cleanup,
    get: get,
    search: search,
    list: list,
    update: update,
    delete: remove
  };
};
