'use strict';

const appRoot = require('app-root-path');

exports.index = function (req, res) {
  if(process.env.NODE_ENV === 'release' || process.env.NODE_ENV === 'production') {
    res.sendFile(appRoot + '/public/dist/index.html');
  } else {
    res.sendFile(appRoot + '/public/src/index.html');
  }
};
