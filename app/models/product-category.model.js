'use strict';

/* Import dependencies */
var path = require('path');
var db = require(path.resolve('./app/config/db.config'));

/* Import maps */
/* TODO convert convertFromDb to a map file */

/**
 * Product category class for use with database
 */
class ProductCategory {
  /**
   * DESCRIPTION: Constructor for the product category class
   * PARAMS:
      * @param     {object}  productCategory product category object.
   * PROPERTIES
     * @property  {number}  id              Product category database ID
     * @property  {string}  name            Product category name
     * @property  {string}  description     Product category description
     * @property  {string}  picture         File path to the product category image
     * @property  {number}  parent          The product category that this product category
     *                                      belongs to. May be empty. Creates a tree
   * RETURNS: Nothing
   * CHANGES: this
   */
  constructor(productCategory) {
    this.id = productCategory.id;
    this.name = productCategory.name;
    this.description = productCategory.description;
    this.picture = productCategory.picture;
    this.parent = productCategory.parent;
  }

/** --- Product category database communication methods --- **/

  /*
  * DESCRIPTION: Creates a product category in the database and returns a promise object that resolves
  *   to the product category's ID
  * PARAMS: None
  * RETURNS: Promise
  * CHANGES: this.id
  */
  create() {
     return db.one('INSERT INTO categories(categoryname, description, picture) ' +
        'VALUES(${name}, ${description}, ${picture}) returning categoryid', this)
        .then(data => this.id = data.categoryid);
   }

  /**
   * DESCRIPTION: Deletes a product category from the database by ID
   * PARAMS:
    * @param  {number}  id      Product category database ID to be deleted
   * RETURNS: Success or fail boolean
   * CHANGES: Nothing
   */
  static delete(id) {
    return db.result('DELETE FROM categories WHERE categoryid=${id}',{id: id});
  }

  /**
   * DESCRIPTION: Finds a product category from the database when given an ID
   * PARAMS:
    * @param  {number}  id      Product category database ID to be searched
   * RETURNS: All data for a category converted to the server
   * CHANGES: Nothing
   */
  static findCategoryById(id) {
    return db.one('SELECT * FROM categories WHERE categoryid=${id}',{id: id})
    .then(function(data) {
      return ProductCategory.convertFromDb(data);
    });
  }

  /**
   * DESCRIPTION: Converts a category from db syntax to server syntax
   * PARAMS:
    * @param  {object}  dbCategory  Product category objext in db syntax
   * RETURNS: product
   * CHANGES: nothing
   */
  static convertFromDb(dbCategory) {
    return new ProductCategory({
      id: dbCategory.categoryid,
      name: dbCategory.categoryname,
      description: dbCategory.description,
      picture: dbCategory.picture,
      parent: dbCategory.parent,
    });
  }
}
module.exports = ProductCategory;
