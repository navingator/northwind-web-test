'use strict';

var path = require('path');

exports.index = function (req, res) {
  console.log('node_env', process.env.NODE_ENV);
  if(process.env.NODE_ENV === 'release' || process.env.NODE_ENV === 'production') {
    res.sendFile(path.resolve('./public/dist/index.html'));
  } else {
    res.sendFile(path.resolve('./public/src/index.html'));
  }
};
