'use strict';

var path = require('path');
var db = require(path.resolve('./app/config/db.config'));
var bcrypt = require('bcrypt');

var hashpassword = function(password) {
  var saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

exports.create = function(req, res) {
  return hashpassword(req.body.password)
    .then(function (hash) {
      req.body.password = hash;
      return db.none('insert into users(username, last_name, first_name, password)' +
        ' values(${username}, ${last_name}, ${first_name}, ${password})', req.body);
    })
    .then(function () {
      res.status(200).send('user created'); //TODO log in user
    })
    .catch(function(err) {
      console.log(err); //TODO better logging method
      res.status(400).send(err);
    });
};
