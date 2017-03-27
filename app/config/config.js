'use strict';

let browserSync = require('browser-sync');

// configure port
let port = (process.env.NODE_ENV === 'test') ?
  process.env.TEST_PORT : // use test port in test environment
  process.env.PORT; // use designated port for other environments
port = port || 3002;
exports.port = port;

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
