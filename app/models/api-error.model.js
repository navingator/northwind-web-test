'use strict';

let db = require('./db.model');


/**
 * Class representing Node-Postgres errors, to be served to an API caller in
 * the event of an error
 */
class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }

  /**
   * Function that allows JSON.stringify() to access the message property of the
   * error prototype.
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }

  /**
   * Function that gets the error message from the database, given the error code
   * Promises will always resolve to an ApiError object
   * @param   {number}  code      The error ID in the errors table
   * @returns {Promise}           Resolves to an ApiError
   */
  static getApiError(code) {
    return db.queryErrors(
      'SELECT message FROM errors ' +
      'WHERE errorid = ${errorId}',
      {errorId: code}
    )
      .then(error => new ApiError(code, error.message))
      .catch(() => new ApiError(0, 'Error (id = ' + code + ') not found in database.'));
  }

  /**
   * Function that verifies whether an error can be processed by this model.
   * To be processed, it must
   *  Have a postgres error code (5 characters)
   *  Have either a column or constraint specified
   * @param   {Error}   err Error object
   * @returns {boolean}     Whether the error is valid for processing
   */
  static isValidDbError(err) {
    let validCode = err.hasOwnProperty('code');
    if (validCode) { validCode = err.code.length === 5; } // Postgres error standard length 5
    let validParams = err.hasOwnProperty('column') || err.hasOwnProperty('constraint');
    return validCode && validParams;
  }

  /**
   * Static function that converts a database error, specifically a Postgres error
   * created by node-postgres to an ApiError from the database given the following parameters.
   * Note that either the column or constraint must be provided
   * @param {Error}     dbError      Postgres Error code with the following properties
   *   @property {string} code         postgres error code
   *   @property {string} table        postgres table related to error
   *   @property {string} [column]     postgres column related to error
   *   @property {string} [constraint] postgres constraint related to error
   * @returns {Promise}              Promise that resolves to an ApiError
   */
  static lookupError(dbError) {

    let where = 'WHERE db_error_code=${code} AND db_table=${table}';
    if (dbError.column)     { where += ' AND db_col=${column}'; }
    if (dbError.constraint) { where += ' AND db_constraint=${constraint}'; }

    return db.queryErrors(
      'SELECT errorid,message FROM errors ' +
      where, dbError)
      .then(error => new ApiError(error.errorid, error.message))
      .catch(() => new ApiError(0, ApiError._getUnhandledErrorMessage(dbError)));
  }

  /**
   * Gets the error message for an unknown postgres error
   * @param    {Error}     dbError   Postgres Error code with the following properties
   *   @property {string} code         postgres error code
   *   @property {string} table        postgres table related to error
   *   @property {string} [column]     postgres column related to error
   *   @property {string} [constraint] postgres constraint related to error
   * @returns  {string}              Error message
   */
  static _getUnhandledErrorMessage(dbError) {

    let msg = 'Postgres error not found in errors database:';
    let properties = ['code', 'table', 'column', 'constraint'];

    for (let prop of properties) {
      if(dbError.hasOwnProperty(prop)) {
        msg += '\n' + prop + ' = ' + dbError[prop];
      }
    }

    return msg;
  }
}

module.exports = ApiError;
