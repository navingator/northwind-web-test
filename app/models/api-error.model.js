'use strict';

let path = require('path');
var db = require(path.resolve('./app/config/db.config'));

class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }

  /**
   * Static function that converts a database error, specifically a Postgres error
   * created by node-postgres to an ApiError
   * @param   {Error}   dbError Error object returned from node-postgres
   * @returns {Promise}         Promise that resolves to an ApiError object
   */
  static getApiError(dbError) {
    return new Promise((resolve, reject) => {
      if(!ApiError.isValidError(dbError)) {
        // If it's not a postgres error, reject with an error
        reject(new Error('Invalid postgres error'));
      } else {
        // Otherwise, get the error from the database
        resolve(ApiError._getError(dbError));
      }
    });
  }

  /**
   * Function that verifies whether an error can be processed by this model.
   * To be processed, it must
   *  Have a postgres error code (5 characters)
   *  Have either a column or constraint specified
   * @param   {Error}   err Error object
   * @returns {boolean}     Whether the error is valid for processing
   */
  static isValidError(err) {
    let validCode = err.hasOwnProperty('code');
    if (validCode) { validCode = err.code.length === 5; } // Postgres error standard length 5
    let validParams = err.hasOwnProperty('column') || err.hasOwnProperty('constraint');
    return validCode && validParams;
  }

  /**
   * Function that gets an error from the database given the following parameters.
   * Note that either the column or constraint must be provided
   * @param {Error}     dbError Postgres Error code with the following properties
   *   @property {string} code         postgres error code
   *   @property {string} table        postgres table related to error
   *   @property {string} [column]     postgres column related to error
   *   @property {string} [constraint] postgres constraint related to error
   * @returns {Promise}         Promise that resolves to an ApiError
   */
  static _getError(dbError) {

    let where = 'WHERE db_error_code=${code} AND db_table=${table}';
    if (dbError.column)     { where += ' AND db_col=${column}'; }
    if (dbError.constraint) { where += ' AND db_constraint=${constraint}'; }

    return db.one(
      'SELECT errorid,message from errors ' +
      where, dbError)
      .then(error => new ApiError(error.errorid, error.message))
      .catch(() => {
        throw new Error('Postgres error not found in database.');
      });
  }
}

module.exports = ApiError;
