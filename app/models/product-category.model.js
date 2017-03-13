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
   * SIDE EFFECTS: this
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
  * RETURNS: A promise that resolves to the newly created product category's id
  * SIDE EFFECTS: A new product category is created in the database
  */
  create() {
     return db.one('INSERT INTO categories(categoryname, description, picture) ' +
        'VALUES(${name}, ${description}, ${picture}) returning categoryid', this)
        .then(prodCatId => this.id = prodCatId.categoryid);
   }

  /**
  * DESCRIPTION: Removes a product category from the database by ID
  * PARAMS:
    * @param  {number}  id      Product category database ID to be deleted
  * RETURNS: A promise that resolves to a success or fail boolean
  * SIDE EFFECTS: None
  */
  static remove(id) {
    return db.result('DELETE FROM categories WHERE categoryid=${id}',{id: id});
  }

/**
  * DESCRIPTION: Updates an exisiting product category with new information
  * PARAMS:
    * @param  {object}  productCategory     Product category to be updated
  * RETURNS: A promise that resolves to a the roduct category object that was updated
  * SIDE EFFECTS: An existing product category with the passed in information
  */
  update() {
    return db.result('UPDATE categories SET (categoryname, description, picture) = (${name}, ${description}, ${picture}) ' +
      'WHERE categoryid = ${id}', this);
  }

  /**
  * DESCRIPTION: Finds a product category from the database when given an ID
  * PARAMS:
    * @param  {number}  id      Product category database ID to be searched
  * RETURNS: All data for a category converted to the server
  * SIDE EFFECTS: None
  */
  static findById(id) {
    console.log(id);
    return db.one('SELECT * FROM categories WHERE categoryid=${id}',{id: id})
    .then(function(productCat) {
      return ProductCategory.convertFromDb(productCat);
    });
  }

  /**
   * DESCRIPTION: Finds a product from the database that starts with a given string
   * PARAMS:
     * @param  {string}  str      String used to search the database by category name
   * RETURNS: A promise that resolves to an array of product category objects that meet the search criteria
   * SIDE EFFECTS: None
   */
  static findByStr(str) {
    str = str+'%';
    return db.any('SELECT * FROM categories WHERE categoryname ILIKE ${str}',{str: str})
      .then(searchRes => {
        return searchRes.map(searchRes => ProductCategory.convertFromDb(searchRes));
      });
      // ProductCategory.convertFromDb(data);
  }

  /**
   * DESCRIPTION: Retrieves the entire list of the categories table
   * PARAMS: None
   * RETURNS: A promise that resolves to a complete list of the categories table
   * SIDE EFFECTS: None
   */
  static listAll() {
    return db.any('SELECT * FROM categories')
    .then(fullList => {
      return fullList.map(fullList => ProductCategory.convertFromDb(fullList));
    });
  }

  /**
  * DESCRIPTION: Converts a category from db syntax to server syntax
  * PARAMS:
    * @param  {object}  dbCategory  Product category objext in db syntax
  * RETURNS: The product category object in server syntax
  * SIDE EFFECTS: None
  */
  static convertFromDb(dbCategory) {
    return new ProductCategory({
      id: dbCategory.categoryid,
      name: dbCategory.categoryname,
      description: dbCategory.description,
      picture: dbCategory.picture
    });
  }
}
module.exports = ProductCategory;
