'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = function(app, agent) {

  /**
   * Creates an object using the API
   * @param  {ProductCategory}  productCategory Product category to create
   * @return {Promise}          res             Resolves to the express response which
   *                                            contains a product category object
   * SIDE EFFECTS: Sets the product category's ID
   */
  let create = function(productCategory) {
    return agent.post('/api/categories')
      .send(productCategory)
      .then(res => {
        productCategory.id = res.body.id; // Set product ID for easy deletion later
        return res;
      });
  };

  /**
   * Deletes a given object from the database
   * @param  {Product}  productCategory  Product Category object to delete from the database
   * @return {Promise}                   Resolves to the express response
   */
  let remove = function(productCatId) {
    return agent.delete('/api/categories/' + productCatId);
  };

  /**
   * Seacrches the database for a given search string
   * @param  {Object}  query  Query object with search parameters
   * @return {Promise}        Resolves to the express response which contains
   *                          an array of product category objects
   */
  let search = function(query) {
    return agent.post('/api/categories/search')
      .send(query);
  };

  /**
   * Deletes all objects with a name that starts with 'zzUnit' from the database
   * @param  {Function} cb               Callback function - likely mocha's done function
   */
  let cleanup = function() {
    return search({term: 'zzUnit'})
      .then(res => {
        // Quit if nothing was found
        if(res.status === 404) {
          return null;
        }
        // Remove anything that was found
        let promiseArray = [];
        for (let record of res.body) {
          promiseArray.push(remove(record.id));
        }
        return Promise.all(promiseArray);
      });
  };

  /**
   * Gets a product category from the database, given the ID
   * @param  {number}   productCatId ID of the product to retrieve
   * @param  {Function} cb           Callback function to store the response
   * @return {Promise}               Resolves to the express response which
   *                                 contains a product category object
   */
  let get = function(productCatId) {
    return agent.get('/api/categories/' + productCatId);
  };

  let getProducts = function(productCatId) {
    return agent.get('/api/categories/' + productCatId + '/products');
  };

  /**
   * Gets all of the product categories from the database
   * @param  {Function} cb Callback function to store results
   * @return {Promise}               Resolves to the express response which
   *                                 contains a list of product category objects
   */
  let list = function() {
    return agent.get('/api/categories');
  };

  /**
   * Updates a product category in the database
   * @param {ProductCategory} product Product category object with updated values
   * @param {Function}        cb      Callback function to store results
   * @return {Promise}               Resolves to the express response which
   *                                 contains a product category object
   */
  let update = function(productCategory) {
    return agent
      .put('/api/categories/' + productCategory.id)
      .send(productCategory);
  };

  return {
    create: create,
    cleanup: cleanup,
    get: get,
    getProducts: getProducts,
    search: search,
    list: list,
    update: update,
    delete: remove
  };
};
