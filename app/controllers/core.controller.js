'use strict';

var path = require('path');

exports.index = function (req, res) {
  res.sendFile(path.join(__dirname, '../../public', '/index.html'));
}
