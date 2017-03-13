'use strict';
let path = require('path');
let chai = require('chai');
let chaiHttp = require('chai-http');

let Product = require(path.resolve('./app/models/product.model.js'));

chai.use(chaiHttp);

module.exports = function(app) {
  /**
   * Creates an object using the API
   * @param  {Product}  product Product to create
   * @param  {Function} cb      Callback function - used to set the res property from the caller
   * SIDE EFFECTS: Sets the product's ID
   */
  let create = function(product, cb) {
    chai.request(app)
      .post('/api/products')
      .send(product)
      .end((err, res) => {
        product.id = res.body.id; // set product ID for easy deletion later
        cb(res);
      });
  };

  /**
   * Deletes a given object from the database
   * @param  {Product}  product Product object to delete from the database
   * @param  {Function} cb      callback function - likely mocha's done function
   */
  let cleanup = function(product, cb) {
    if (product.id) {
      Product.delete(product.id)
        .then(() => cb())
        .catch(err => cb(err));
    } else {
      cb();
    }
  };

  /**
   * Gets a product from the database, given the ID
   * @param  {number}   productId ID of the product to retrieve
   * @param  {Function} cb        Callback function to store the response
   */
  let get = function(productId, cb) {
    chai.request(app)
      .get('/api/products/' + productId)
      .end((err, res) => cb(res));
  };

  /**
   * Gets all of the products from the database
   * @param  {Function} cb Callback function to store results
   */
  let list = function(cb) {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => cb(res));
  };

  /**
   * Updates a product in the database
   * @param {Product}  product Product object with updated values
   * @param {Function} cb      Callback function to store results
   */
  let update = function(product, cb) {
    chai.request(app)
      .put('/api/products/' + product.id)
      .send(product)
      .end((err, res) => cb(res));
  };

  return {
    create: create,
    cleanup: cleanup,
    get: get,
    list: list,
    update: update
  };
};
