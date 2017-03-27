'use strict';

let promise = require('bluebird');

let options = {
  // Initialization Options
  promiseLib: promise
};
let pgp = require('pg-promise')(options);
let connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/northwind_dev';
exports.db = pgp(connectionString);
exports.pgp = pgp;
