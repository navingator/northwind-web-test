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
 * Trims values to clean database records
 * Any values set to an empty string will be nulled
 * @param  {object} values Object to be trimmed
 * @return {object}        New object with values trimmed and nulled
 */
function trimValues(values) {
  let newValues = {};
  for(let prop in values) {
    let value = values[prop];
    if (typeof(value) === 'string') {
      value = value.trim();
      if(value === '') {
        value = null;
      }
    }
    newValues[prop] = value;
  }
  return newValues;
}

/**
 * Helper function to query the database. Trims values before querying and
 * handles database errors after the query.
 * @param  {function} queryFn  pg-promise function to use to query the database
 * @param  {string} queryStr   Query string
 * @param  {object} values     Object containing values that query maps to
 * @return {Promise}           Promise that resolves to query data
 */
function queryDb(queryFn, queryStr, values) {
  let newValues = trimValues(values);
  return queryFn(queryStr, newValues)
    .catch(err => handleDbError(err));
}

/**
 * Queries the database, expecting any number of rows
 * @param  {string}  query  Query string mapped by object
 * @param  {object}  values Object containing values that query maps to
 * @return {Promise}        Promise that resolves to query data
 */
exports.any = function(query, values) {
  return queryDb(db.any, query, values);
};

exports.one = function(query, values) {
  return queryDb(db.one, query, values);
};

exports.none = function(query, values) {
  return queryDb(db.none, query, values);
};

exports.queryErrors = function(query, values) {
  return db.one(query, values);
};
