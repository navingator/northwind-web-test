'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = function(app) {
  /**
   * Creates an object using the API
   * @param  {Product}  product Product to create
   * @param  {Function} cb      Callback function - used to set the res property from the caller
   * @return {Promise}          Promise that resolves to an express response
   * SIDE EFFECTS: Sets the product's ID
   */
  let create = function(product) {
    return chai.request(app)
      .post('/api/products')
      .send(product)
      .then(res => {
        product.id = res.body.id; // set product ID for easy deletion later
        return res;
      });
  };

  /**
   * Gets a product from the database, given the ID
   * @param  {number}   productId ID of the product to retrieve
   * @return {Promise}            Promise that resolves to an express response
   */
  let get = function(productId) {
    return chai.request(app)
      .get('/api/products/' + productId);
  };

  /**
   * Gets all of the products from the database
   * @return {Promise} Promise that resolves to an express response
   */
  let list = function() {
    return chai.request(app)
      .get('/api/products');
  };

  /**
   * Searches for products that begin with the searchStr
   * @param  {string}  searchStr String to search
   * @return {Promise}           Promise that resolves to an express response
   */
  let search = function(searchStr) {
    return chai.request(app)
      .get('/api/products/search/' + searchStr);
  };

  /**
   * Updates a product in the database
   * @param {Product}  product Product object with updated values
   * @return {Promise}         Promise that resolves to an express response
   */
  let update = function(product) {
    return chai.request(app)
      .put('/api/products/' + product.id)
      .send(product);
  };

  /**
   * Removes a product in the database
   * @param  {number}   productId Id of the product to remove
   * @return {Promise}            Promise that resolves to an express response
   */
  let remove = function(productId) {
    return chai.request(app)
      .delete('/api/products/' + productId);
  };

  /**
   * Deletes a given object from the database
   * @param  {Product}  product Product object to delete from the database
   * @param  {Function} [cb]    callback function - likely mocha's done function
   */
  let cleanup = function() {
    return search('zzUnitTest')
      .then(res => {
        // Quit if nothing was found
        if(res.status === 404) {
          return null;
        }
        // Remove anything that was found
        let promises = [];
        for (let product of res.body) {
          promises.push(remove(product.id));
        }
        return Promise.all(promises);
      });
  };

  return {
    create: create,
    get: get,
    list: list,
    search: search,
    update: update,
    delete: remove,
    cleanup: cleanup
  };
};
