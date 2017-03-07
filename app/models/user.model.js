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
function User(user) {
  this.id = user.id;
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.username = user.username;
  this.password = user.password;
}

/**
 * Creates a User from a database query result
 * @param  {Object} dbUser User result from database
 * @return {User}          User object
 */
User.convertFromDbUser = function (dbUser) {
  return new User({
    id: dbUser.id,
    firstName: dbUser.first_name, // jshint ignore:line
    lastName: dbUser.last_name, // jshint ignore:line
    username: dbUser.username,
    password: dbUser.password});
};

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
      let dbUser = new User(user);
      dbUser.password = hash;
      return db.one('INSERT INTO users(username, last_name, first_name, password)' +
        ' VALUES(${username}, ${lastName}, ${firstName}, ${password})' +
        'returning id', dbUser);
    });
};

/**
 * Returns a user object. Throws an error if more than 1 user or no users are found.
 * @param  {string}  username username of the user
 * @return {promise}          Promise that resolves to a single user
 */
User.getUserByUsername = function (username) {
  return db.one('SELECT * FROM users WHERE username=${username}',
    {username: username})
    .then(function(data) {
      return User.convertFromDbUser(data);
    });
};

/**
 * Returns a user object. Throws an error if more than 1 user or no users are found.
 * @param  {number}  id id of the user
 * @return {promise}    Promise that resolves to a single user
 */
User.getUserById = function (id) {
  return db.one('SELECT * FROM users WHERE id=${id}',
    {id: id})
    .then(function(data) {
      return User.convertFromDbUser(data);
    });
};

/**
 * Deletes a user given the user's ID.
 * @param  {number}  id id of the user to Deletes
 * @return {promise}    promise that resolvse to result object from the query;
 */
User.delete = function(id) {
  return db.result('DELETE FROM users WHERE id=${id}',
    {id: id});
};

/**
 * Uses bcrypt to authenticate users credentials
 * @param  {string}  password cleartext password
 * @return {promise}          promise object that resolves to a boolean indicating
 *                            whether the password is correct
 */
User.prototype.authenticate = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
