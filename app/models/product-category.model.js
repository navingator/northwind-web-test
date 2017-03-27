'use strict';

/* Import dependencies */
let db = require('./db.model');

class ProductCategory {
  /**
  * Constructor for the product category class used for database calls
  * @param     {object}  obj             The object that will be used to create
  *                                      the product category
  * @property  {number}  id              Product category database ID
  * @property  {string}  name            Product category name
  * @property  {string}  description     Product category description
  * @property  {string}  picture         File path to the product category image
  * @return    {ProductCategory}         The created product category object
  */
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.picture = obj.picture;
  }

 /**
  * Creates a product category in the database
  * @return  {promise}  Resolves to a product category's id
  * SIDE EFFECTS: sets id property to database id.
  */
  create() {
    return db.one(
      'INSERT INTO categories(categoryname, description, picture) ' +
      'VALUES(${name}, ${description}, ${picture}) ' +
      'RETURNING categoryid', this)
      .then(data => this.id = data.categoryid);
   }

  /**
  * Updates an exisiting product category with new information
  * @return {promise}                   Resolves to a success boolean
  */
  update() {
    return db.none(
      'UPDATE categories ' +
      'SET (categoryname, description, picture) = (${name}, ${description}, ${picture}) ' +
      'WHERE categoryid = ${id}', this);
  }

  /**
  * Converts a category from the database into a ProductCategory object
  * @param  {object}           dbCategory  Product category object in db syntax
  * @return {ProductCategory}              ProductCategory object
  */
  static convertFromDb(dbCategory) {
    return new ProductCategory({
      id: dbCategory.categoryid,
      name: dbCategory.categoryname,
      description: dbCategory.description,
      picture: dbCategory.picture
    });
  }

  /**
  * Deletes a product category from the database by ID
  * @param  {number}  id   Product category database ID to be deleted
  * @return {promise}      Resolves upon database deletion
  */
  static delete(id) {
    return db.none(
      'DELETE FROM categories ' +
      'WHERE categoryid=${id}',{id: id});
  }

  /**
  * Finds a product category from the database when given an ID. Throws an error if
  * one is not found
  * @param  {number}  id   Product category database ID to be searched
  * @return {promise}      Resolves to a ProductCategory object
  */
  static read(id) {
    return db.one(
      'SELECT * ' +
      'FROM categories ' +
      'WHERE categoryid=${id}',{id: id})
        .then(productCat => ProductCategory.convertFromDb(productCat));
  }

  /**
  * Finds a product from the database that starts with a given string
  * @param  {string}  str   Seatch string
  * @return {promise}       Resolves to an array of ProductCategory objects
  */
  static search(str) {
    return db.any(
      'SELECT * ' +
      'FROM categories ' +
      'WHERE categoryname ILIKE \'${str#}%\'',{str: str})
        .then(records => {
          return records.map(record => ProductCategory.convertFromDb(record));
        });
  }

  /**
  * Retrieves the entire list of the categories table
  * @return   {promise}   Resolves to an array of ProductCategory objects
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
  * @return   {Promise}   Resolves to an object with the property 'count'
  *                       which is set to the amount of records in the product
  *                       category table
  */
  static tableCount() {
    return db.one(
      'SELECT COUNT (*) ' +
      'AS count ' +
      'FROM categories')
      .then(data => +data.count);
  }

  /**
  * Validates whether the passed in product ID is a valid ID
  * @param    {number}  id   Id to validate
  * @return   {boolean}      Whether the id is valid
  */
  static isValidId(id) {
    return !isNaN(id);
  }
}
module.exports = ProductCategory;
