'use strict';

var passport = require('passport');
var path = require('path');
var User = require(path.resolve('./app/models/user.model.js'));

/**
 * Creates a user, storing it in the database.
 * Returns a promise
 */
exports.create = function(req, res) {
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password
  });
  return User.createUser(user)
    .then(data => {
      user.id = data.id;
      delete user.password; // remove sensitive data before login
      req.login(user, err => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    })
    .catch(function(err) {
      console.log(err); //TODO better logging method
      res.status(400).send(err);
    });
};

exports.signin = function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      res.status(400).send(err); // send error back to the user
    } else if (!user) {
      res.status(400).send(info); //send object with message indicating why user was not authenticated
    } else {
      delete user.password; // do not send the password back to the client
      req.login(user, err => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};
