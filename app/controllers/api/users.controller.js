'use strict';

let passport = require('passport');
let path = require('path');
let User = require(path.resolve('./app/models/user.model'));
let ApiError = require(path.resolve('./app/models/api-error.model'));

/**
 * Helper function for req.login that handles login requests
 * @param  {error}  err  Error to send back, if it exists
 * @param  {object} res  Express response object
 * @param  {User}   user User object to send back, if successful
 */
function login(err, res, user) {
  if (err) {
    res.status(400).send(err);
  } else {
    res.json(user);
  }
}

/**
 * Creates a user, storing it in the database.
 * Returns a promise
 */
exports.create = function(req, res) {
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password
  });
  return user.create()
    .then(() => {
      delete user.password; // remove sensitive data before login
      req.login(user, err => login(err, res, user));
    })
    .catch(err => res.status(400).send(err));
};

exports.signin = function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(400).send(err); // send ApiError back to the user
    } else if (!user) {
      res.status(400).send(info); //send ApiError with message indicating why user was not authenticated
    } else {
      delete user.password; // do not send the password back to the client
      req.login(user, err => login(err, res, user));
    }
  })(req, res, next);
};

exports.signout = function(req, res) {
  req.logout(); // Passport's logout function
  res.status(200).end();
};

exports.forgot = function(req, res) {
  let tempUser = new User(req.body);
  let user;
  User.getByUsername(tempUser.username)
    .then(dbUser => {
      user = dbUser;
      if(user.compareIdentifiers(tempUser)) {
        return user.updatePassword(tempUser.password);
      }
      return ApiError.getApiError(1102)
        .then(apiErr => Promise.reject(apiErr));
    })
    .then(() => {
      delete user.password;
      res.status(200).end();
    })
    .catch(err => res.status(400).send(err));
};

exports.checkLogin = function(req, res, next) {
  if(!req.isAuthenticated()) {
    return ApiError.getApiError(1200)
      .then(apiErr => res.status(401).send(apiErr));
  }

	next();
};

exports.me = function(req, res) {
  res.json(req.user);
};
