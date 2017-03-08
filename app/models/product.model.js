'use strict';

let path = require('path');
var db = require(path.resolve('./app/config/db.config'));

/**
 * Product class for use with database
 */
class Product {
  /**
   * Constructor for the product class with the following parameters
   * @param  {number}  id              Product database ID
   * @param  {string}  name            Product name
   * @param  {number}  categoryId      Database ID of the product's category
   * @param  {number}  quantityPerUnit Quantity per unit of product
   * @param  {number}  unitPrice       Price per unit
   * @param  {number}  unitsInStock    Units currently in stock
   * @param  {number}  unitsOnOrder    Units currently on order
   * @param  {boolean} discontinued    Whether the unit is discontinued
   */
  constructor(id, name, categoryId, quantityPerUnit, unitPrice, unitsInStock,
    unitsOnOrder, discontinued) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
    this.quantityPerUnit = quantityPerUnit;
    this.unitPrice = unitPrice;
    this.unitsInStock = unitsInStock;
    this.unitsOnOrder = unitsOnOrder;
    this.discontinued = discontinued;
  }

  /**
   * Creates a product in the database and returns a promise object that resolves
   * to the product's ID
   */
  static create(product) {
    return db.one('INSERT INTO products(productname, categoryid, ' +
      'quantityperunit, unitprice, unitsinstock, unitsonorder, discontinued) ' +
      'VALUES(${name}, ${categoryId}, ${quantityPerUnit}, ${unitPrice}, ' +
      '${unitsInStock}, ${unitsOnOrder}, ${discontinued}) returning productid', product);
  }

  static delete(productId) {
    return db.result('DELETE FROM products WHERE productid=${id}',
      {id: productId});
  }

  /**
   * Returns a product object with the parameters specified in the input object
   */
  static get(obj) {
    return new Product(
      obj.id,
      obj.name,
      obj.categoryId,
      obj.quantityPerUnit,
      obj.unitPrice,
      obj.unitsInStock,
      obj.unitsOnOrder,
      obj.discontinued
    );
  }
}

module.exports = Product;
