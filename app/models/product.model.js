'use strict';

let db = require('./db.model');

/**
 * Product class for use with database
 */
class Product {
  /**
   * Constructor for the product class with the following
   * @param {object}  obj The object that will be used to create the product
   *   @property {number}   id            Product database ID
   *   @property {string}   name          Product name
   *   @property {number}   categoryId    Foreign key to category id this product belongs to
   *   @property {number}   unitPrice     Price per unit
   *   @property {boolean}  discontinued  Whether the unit is discontinued
   *   @property {number}   createdBy     Foreign key to user id - stores user who created product
   *   @property {string}   categoryName  Name of the product category the product belogns to
   * @return {Product}    The created product object
   */
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.categoryId = obj.categoryId;
    this.unitPrice = obj.unitPrice;
    this.unitsInStock = obj.unitsInStock;
    this.discontinued = obj.discontinued;
    this.createdBy = obj.createdBy;
    // Taken from categories table
    this.categoryName = obj.categoryName;
  }

  /**
   * Creates a product in the database
   * @returns {promise}  Promise for database insertion
   * SIDE EFFECTS: sets id property to database id
   */
  create() {
    return db.one(
      'INSERT INTO products(productname, categoryid, unitprice, ' +
      'unitsinstock, discontinued) ' +
      'VALUES(${name}, ${categoryId}, ${unitPrice}, ${unitsInStock}, ' +
      '${discontinued}) returning productid', this)
      .then(data => this.id = data.productid);
  }

  /**
   * Updates a product in the database
   * @returns {promise} Promise for database update
   */
  update() {
    return db.none(
      'UPDATE products ' +
      'SET (productname, categoryid, unitprice, unitsinstock, discontinued) ' +
      '= (${name}, ${categoryId}, ${unitPrice}, ${unitsInStock}, ${discontinued}) '+
      'WHERE productid=${id}', this);
  }

  /**
   * Converts a product received from the database into a Product object
   * @param   {object} dbProduct product object from the database
   * @returns {Product}          Product object
   */
  static convertFromDbProduct(dbProduct) {
    return new Product({
      id: dbProduct.productid,
      name: dbProduct.productname,
      categoryId: dbProduct.categoryid,
      unitPrice: dbProduct.unitprice,
      unitsInStock: dbProduct.unitsinstock,
      discontinued: dbProduct.discontinued,
      // Taken from categories table
      categoryName: dbProduct.categoryname
    });
  }

  /**
   * Validates whether the passed in product ID is a valid ID
   * @param   {number}  id ID to validate
   * @returns {boolean}    Whether the ID is valid
   */
   static isValidId(id) {
     return !isNaN(id);
   }

  /**
   * Deletes a product from the database with the given ID
   * @param   {number}  id  ID of the product to be deleted
   * @returns {promise}     Resolves upon database deletion
   */
  static delete(id) {
    return db.none('DELETE FROM products WHERE productid=${id}', {id: id});
  }

  /**
   * Retrieves a product from the database with the given ID. Throws an error if
   * one is not found
   * @param   {number}  id ID of the product to retrieve
   * @returns {promise}    Promise object that resolves to a Product
   */
  static read(id) {
    return db.one(
      'SELECT products.*, categories.categoryname ' +
      'FROM products ' +
      'LEFT JOIN categories ' +
      'ON products.categoryid = categories.categoryid ' +
      'WHERE productid=${id}', {id: id})
      .then(data => Product.convertFromDbProduct(data));
  }

  /**
   * Retrieves all products from the database with the given category ID.
   * @param   {number}  categoryId Category ID desired
   * @returns {promise}            Promise object that resolves to an array of products
   */
  static getByCategory(categoryId) {
    return db.any(
      'SELECT products.*, categories.categoryname ' +
      'FROM products ' +
      'LEFT JOIN categories ' +
      'ON products.categoryid = categories.categoryid ' +
      'WHERE categories.categoryid=${categoryId}', {categoryId: categoryId})
      .then(data => data.map(dbProduct => Product.convertFromDbProduct(dbProduct)));
  }

  /**
   * Retrieves all products from the database
   * @returns {promise} Promise object that resolves to an array of Product objects
   */
  static listAll() {
    return db.any(
        'SELECT products.*, categories.categoryname ' +
        'FROM products ' +
        'LEFT JOIN categories ' +
        'ON products.categoryid = categories.categoryid')
        .then(data => data.map(dbProduct => Product.convertFromDbProduct(dbProduct)));
  }

  /**
  * Finds a product from the database that starts with a given string
  * @param  {string}  str   Seatch string
  * @return {promise}       Resolves to an array of product objects
  */
  static search(str) {
    return db.any(
      'SELECT products.*, categories.categoryname ' +
      'FROM products ' +
      'LEFT JOIN categories ' +
      'ON products.categoryid = categories.categoryid ' +
      'WHERE productname ILIKE \'${str#}%\'', {str: str})
        .then(records => {
          return records.map(record => Product.convertFromDbProduct(record));
        });
  }
}

module.exports = Product;
