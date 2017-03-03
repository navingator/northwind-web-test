'use strict';

var path = require('path');
var db = require(path.resolve('./app/config/db.config'));
var bcrypt = require('bcrypt');

/**
 * Hashes password using bcrypt
 */
var hashpassword = function(password) {
  var saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Creates a user, storing it in the database.
 * Returns a promise
 */
exports.create = function(req, res) {
  var newUser = req.body;
  console.log(req);
  console.log(req.body);
  console.log(req.data);
  return hashpassword(newUser.password)
    .then(function (hash) {
      newUser.passwordHash = hash;
      return db.none('insert into users(username, last_name, first_name, password)' +
        ' values(${username}, ${lastName}, ${firstName}, ${passwordHash})', newUser);
    })
    .then(function () {
      res.status(200).send('user created'); //TODO log in user
    })
    .catch(function(err) {
      console.log(err); //TODO better logging method
      res.status(400).send(err);
    });
};
