'use strict';

/* Import dependencies */
let path = require('path');
let dbConfig = require(path.resolve('./app/config/db.config'));
let db = dbConfig.db;
let pgp = dbConfig.pgp;
let ApiError = require('./api-error.model');

/**
 * Helper function to return an error code from a PgpError
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function getErrorCodeFromPgpError(err) {
  let code = 4100;
  if (err.name === 'QueryResultError') {
    let codes = pgp.errors.queryResultErrorCode;
    switch (err.code) {
      case codes.noData:
        code = 4101;
        break;
      case codes.notEmpty:
        code = 4100;
        break;
      case codes.multiple:
        code = 4100;
        break;
      default:
        code = 4100;
    }
  }

  return code;
}

function handleDbError(err) {
  if(ApiError.isValidDbError(err)) {
    return ApiError.lookupError(err)
      .then(err => {
        return Promise.reject(err);
      });
  }
  let code = getErrorCodeFromPgpError(err);
  return Promise.reject(ApiError.getApiError(code));
}

/**
 * Queries the database, expecting any number of rows
 * @param  {string}  query  Query string mapped by object
 * @param  {object}  values Object containing values that query maps to
 * @return {Promise}        Promise that resolves to query data
 */
exports.any = function(query, values) {
  return db.any(query, values)
    .catch(err => handleDbError(err));
};

exports.one = function(query, values) {
  return db.one(query, values)
    .catch(err => handleDbError(err));
};

exports.none = function(query, values) {
  return db.none(query, values)
    .catch(err => handleDbError(err));
};

exports.queryErrors = function(query, values) {
  return db.one(query, values);
};
