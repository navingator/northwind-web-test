'use strict';

var browserSync = require('browser-sync');

exports.port = process.env.PORT || 3002;

exports.startBrowserSync = function () {
  if (process.env.NODE_ENV === 'development') {
    browserSync({
      proxy: 'localhost:' + exports.port,
      port: process.env.BROWSER_SYNC_PORT || 3000,
      files: ['public/**/*.{js,css,html}'],
      ui: {
        port: parseInt(process.env.BROWSER_SYNC_UI_PORT || 3001)
      },
      open: false
    });
  }
};

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/northwind_dev';
var db = pgp(connectionString);
exports.db = db;
exports.pgp = pgp;
