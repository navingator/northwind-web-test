'use strict';

/* Import dependencies */
var path = require('path');
var db = require(path.resolve('./app/config/db.config'));

/* Import maps */

/**
* Product category class used for database calls
* @property  {number}  id              Product category database ID
* @property  {string}  name            Product category name
* @property  {string}  description     Product category description
* @property  {string}  picture         File path to the product category image
* @property  {number}  parent          The product category that this product category
*                                      belongs to. May be empty. Creates a tree
*/
class ProductCategory {
  constructor(productCategory) {
    this.id = productCategory.id;
    this.name = productCategory.name;
    this.description = productCategory.description;
    this.picture = productCategory.picture;
  }

 /**
  * Creates a product category in the database
  * @return  {promise}  Resolves to a product category's id
  * SIDE EFFECTS: A product category is created in the database. Id sequence +1.
  */
  create() {
    return db.one(
      'INSERT INTO categories(categoryname, description, picture) ' +
      'VALUES(${name}, ${description}, ${picture}) ' +
      'RETURNING categoryid', this)
        .then(prodCatId => this.id = prodCatId.categoryid);
   }

  /**
  * Updates an exisiting product category with new information
  * @param  {object}  productCategory   Product category to be updated
  * @return {promise}                   Resolves to a success boolean
  * SIDE EFFECTS: A product category's information is changed in the database
  */
  update() {
    return db.result(
      'UPDATE categories ' +
      'SET (categoryname, description, picture) = (${name}, ${description}, ${picture}) ' +
      'WHERE categoryid = ${id}', this);
  }

  /**
  * Removes a product category from the database by ID
  * @param  {number}  id   Product category database ID to be deleted
  * @return {promise}      Resolves to a success or fail boolean
  * SIDE EFFECTS: A product category is removed form the database
  */
  static remove(id) {
    return db.result(
      'DELETE FROM categories ' +
      'WHERE categoryid=${id}',{id: id});
  }

  /**
  * Finds a product category from the database when given an ID
  * @param  {number}  id   Product category database ID to be searched
  * @return {promise}      Resolves to a product category object in server syntax
  */
  static findById(id) {
    return db.one(
      'SELECT * ' +
      'FROM categories ' +
      'WHERE categoryid=${id}',{id: id})
        .then(productCat => ProductCategory.convertFromDb(productCat));
  }

  /**
  * Finds a product from the database that starts with a given string
  * @param  {string}  str   Seatch string
  * @return {promise}       Resolves to an array of product category objects
  */
  static findByStr(str) {
    str = str+'%';
    return db.any(
      'SELECT * ' +
      'FROM categories ' +
      'WHERE categoryname ILIKE ${str}',{str: str})
        .then(searchRes => {
          return searchRes.map(searchRes => ProductCategory.convertFromDb(searchRes));
        });
  }

  /**
  * Retrieves the entire list of the categories table
  * @return   {promise}   Resolves to a complete list of the categories table
  */
  static listAll() {
    return db.any(
      'SELECT * ' +
      'FROM categories')
        .then(fullList => {
          return fullList.map(fullList => ProductCategory.convertFromDb(fullList));
        });
  }

  /**
  * Retrieves the amount of records in the product category table
  * @return   {object}    with the property 'count' which is set to the amount
  *                       of records in the product category table
  */
  static tableCount() {
    return db.one(
      'SELECT COUNT (*) ' +
      'AS count ' +
      'FROM categories');
  }

  /**
  * Validates whether the passed in product ID is a valid ID
  * @param    {number}  id   Id to validate
  * @return   {promise}      Resolves to a success or fail boolean
  */
  static isValidId(id) {
    return !isNaN(id);
  }

  /**
  * Converts a category from db syntax to server syntax
  * @param  {object}  dbCategory  Product category object in db syntax
  * @return {object}              The product category object in server syntax
  */
  static convertFromDb(dbCategory) { /* TODO convert to a map file */
    return new ProductCategory({
      id: dbCategory.categoryid,
      name: dbCategory.categoryname,
      description: dbCategory.description,
      picture: dbCategory.picture
    });
  }
}
module.exports = ProductCategory;
