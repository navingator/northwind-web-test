'use strict';

var bcrypt = require('bcrypt');
var path = require('path');
var db = require(path.resolve('./app/config/db.config'));

/**
 * User class that should be newed. Contains information about a specific user
 * @param {string} firstName the user's first name
 * @param {string} lastName  the user's last name
 * @param {string} username  username for the user
 * @param {string} password  user's (hashed) password
 */
function User(firstName, lastName, username, password) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.username = username;
  this.password = password;
}

/**
 * Creates a User from a database query result
 * @param  {Object} dbUser User result from database
 * @return {User}          User object
 */
// User.convertFromDbUser = function (dbUser) {
//   return new User(dbUser.first_name, dbUser.last_name, dbUser.username, dbUser.password); // jshint ignore:line
// };

/**
 * Public static method that returns a promise that fullfills with a bcrypt-hashed password
 * @param  {string}  password string to encrypt
 * @return {promise}          promise that resolves to a hash string
 */
User.hashPassword = function(password) {
  var saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Public static method that creates a user in the database
 * @param  {object}  user User object that contains username, lastName, firstName,
 *                        and password properties
 * @return {promise}      Promise for database insertion
 */
User.createUser = function (user) {
  return User.hashPassword(user.password)
    .then(function(hash) {
      user.passwordHash = hash;
      return db.none('INSERT INTO users(username, last_name, first_name, password)' +
        ' VALUES(${username}, ${lastName}, ${firstName}, ${passwordHash})', user);
    });
};

/**
 * Returns a user object. Throws an error if more than 1 user or no users are found.
 * @param  {string}  username username of the user
 * @return {promise}          Promise that resolves to a single user
 */
// User.getUserByUsername = function (username) {
//   return db.one('SELECT * FROM users WHERE username=${username}',
//     {username: username})
//     .then(function(data) {
//       return User.createUserFromDbUser(data);
//     });
// };

module.exports = User;
