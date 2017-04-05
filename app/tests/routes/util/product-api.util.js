'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = function(app, agent) {

  /**
   * Creates an object using the API
   * @param  {Product}  product Product to create
   * @return {Promise}          Promise that resolves to an express response
   * SIDE EFFECTS: Sets the product's ID
   */
  let create = function(product) {
    return agent
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
    return agent.get('/api/products/' + productId);
  };

  /**
   * Gets all of the products from the database
   * @return {Promise} Promise that resolves to an express response
   */
  let list = function() {
    return agent.get('/api/products');
  };

  /**
   * Seacrches the database for a given search string
   * @param  {Object}  query  Query object with search parameters
   * @return {Promise}        Resolves to the express response which contains
   *                          an array of product objects
   */
  let search = function(query) {
    return agent.post('/api/products/search')
      .send(query);
  };

  /**
   * Updates a product in the database
   * @param {Product}  product Product object with updated values
   * @return {Promise}         Promise that resolves to an express response
   */
  let update = function(product) {
    return agent.put('/api/products/' + product.id)
      .send(product);
  };

  /**
   * Removes a product in the database
   * @param  {number}   productId Id of the product to remove
   * @return {Promise}            Promise that resolves to an express response
   */
  let remove = function(productId) {
    return agent.delete('/api/products/' + productId);
  };

  /**
   * Deletes products that start with zzUnitTest from the database
   */
  let cleanup = function() {
    return search({term: 'zzUnitTest'})
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
