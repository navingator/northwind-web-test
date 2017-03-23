'use strict';

let bcrypt = require('bcrypt');
let db = require('./db.model');
let ApiError = require('./api-error.model');

/**
 * User class for use with database
 */
class User {
  /**
   * User class that should be newed. Contains information about a specific user
   * @param    {object} obj       The object that contains the following properties
   * @property {number} id        the user's ID
   * @property {string} firstName the user's first name
   * @property {string} lastName  the user's last name
   * @property {string} username  username for the user
   * @property {string} password  user's (hashed) password
   * @return   {User}             The created user object
   */
  constructor(obj) {
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.username = obj.username;
    this.password = obj.password;
  }

  /**
   * Uses bcrypt to authenticate users credentials
   * @param  {string}  password cleartext password
   * @return {promise}          promise object that resolves to a boolean indicating
   *                            whether the password is correct
   */
  authenticate(password) {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Public static method that creates a user in the database
   * @param  {object}  user User object that contains username, lastName, firstName,
   *                        and password properties
   * @return {promise}      Promise for database insertion
   * SIDE EFFECTS: Sets the user's password to a hashed password and the user's
   *               ID to the database ID
   */
  create() {
    // check for empty password before hashing
    if(!this.password) {
      return ApiError.getApiError(1003)
        .then(apiError => Promise.reject(apiError));
    }
    return User.hashPassword(this.password)
      .then(hash => {
        this.password = hash;
        return db.one(
          'INSERT INTO users(username, last_name, first_name, password) ' +
          'VALUES(${username}, ${lastName}, ${firstName}, ${password}) ' +
          'returning userid', this);
      })
      .then(data => this.id = data.userid);
  }

  /**
   * Creates a User object from a database query result
   * @param  {Object} dbUser User result from database
   * @return {User}          User object
   */
  static convertFromDbUser(dbUser) {
    return new User({
      id: dbUser.userid,
      firstName: dbUser.first_name, // jshint ignore:line
      lastName: dbUser.last_name, // jshint ignore:line
      username: dbUser.username,
      password: dbUser.password});
  }

  /**
   * Public static method that returns a promise that fullfills with a bcrypt-hashed password
   * @param  {string}  password string to encrypt
   * @return {promise}          promise that resolves to a hash string
   */
  static hashPassword(password) {
    var saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Returns a user object. Throws an error if more than 1 user or no users are found.
   * @param  {string}  username username of the user
   * @return {promise}          Promise that resolves to a single user
   */
  static getByUsername(username) {
    return db.one(
      'SELECT * FROM users ' +
      'WHERE username=${username}',
      {username: username})
      .then(function(data) {
        return User.convertFromDbUser(data);
      });
  }

  /**
   * Returns a user object. Throws an error if more than 1 user or no users are found.
   * @param  {number}  id id of the user
   * @return {promise}    Promise that resolves to a single user
   */
  static getById(id) {
    return db.one(
      'SELECT * FROM users ' +
      'WHERE userid=${id}',
      {id: id})
      .then(function(data) {
        return User.convertFromDbUser(data);
      });
  }

  /**
   * Deletes a user given the user's ID.
   * @param  {number}  id id of the user to Deletes
   * @return {promise}    promise that resolvse to result object from the query;
   */
  static delete(id) {
    return db.none(
      'DELETE FROM users ' +
      'WHERE userid=${id}',
      {id: id});
  }

}

module.exports = User;
