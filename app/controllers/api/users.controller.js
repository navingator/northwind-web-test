'use strict';

var passport = require('passport');
var path = require('path');
var User = require(path.resolve('./app/models/user.model.js'));

/**
 * Creates a user, storing it in the database.
 * Returns a promise
 */
exports.create = function(req, res) {
  var user = new User(req.body.firstName, req.body.lastName, req.body.username, req.body.password);
  return User.createUser(user)
    .then(function () {
      res.status(200).send('user created'); //TODO log in user
    })
    .catch(function(err) {
      console.log(err); //TODO better logging method
      res.status(400).send(err);
    });
};

exports.signin = function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      res.status(400).send(info);
    } else {
      res.status(200).send(info);
    }
  })(req, res, next);
};
