'use strict';

var path = require('path');
var config = require(path.resolve('./app/config/config'));

var db = config.db;

exports.create = function(req, res) {
  req.body.password = req.body.password; //TODO add salting and hashing

  db.none('insert into users(username, last_name, first_name, password)' +
    ' values(${username}, ${last_name}, ${first_name}, ${password})', req.body);
};
