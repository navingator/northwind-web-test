'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
chai.should();
chai.use(chaiAP);

require(path.resolve('./server'));
let User = require(path.resolve('./app/models/user.model.js'));

var user1, user2; // users for testing TODO change to let
/**
 * Unit tests
 */
describe('User Model Unit Tests', function() {
  before(function(done) {
    user1 = new User({
      firstName: 'Unit',
      lastName: 'Testing',
      username: 'unittesting',
      password: 'password1'
    });
    user2 = new User({
      firstName: 'Second',
      lastName: 'Testing',
      username: 'unittesting',
      password: 'password2'
    });
    done();
  });

  describe('Create Users', function() {
    it('should be able to create a user', function() {
      return User.createUser(user1).should.be.fulfilled;
    });
    it('should fail to create a new user with the same username', function() {
      return User.createUser(user2).should.be.rejected;
    });
    it('should fail to create a user without a username', function() {
      let user = new User(user1);
      delete user.username;
      return User.createUser(user).should.be.rejected;
    });
    it('should fail to create a user without a password', function() {
      let user = new User(user1);
      user.username='unittestingexception'; // new username so we don't get the previous error
      delete user.password;
      return User.createUser(user).should.be.rejected;
    });
  });

  describe('Get Users', function() {
    it('should get created user successfully by username', function(done) {
      User.getUserByUsername(user1.username).then(function(user) {
        // Verify fields
        user.firstName.should.deep.equal(user1.firstName);
        user.lastName.should.deep.equal(user1.lastName);
        user.username.should.deep.equal(user1.username);
        done();
      })
        .catch(err => done(err));
    });
    it('should get created user successfully by id', function(done) {
      let id;
      User.getUserByUsername(user1.username).then(function(user) {
        id = user.id;
        // verify with username
        User.getUserById(id).then(function(user) {
          user.username.should.deep.equal(user1.username);
          done();
        });
      })
        .catch(err => done(err));
    });
    it('should authenticate with itself', function(done) {
      User.getUserByUsername(user1.username).then(function(user) {
        user.authenticate(user1.password).then(function(auth) {
          if (auth) {
            done();
          } else {
            done(new Error('Failed to Authenticate'));
          }
        });
      })
        .catch(err => done(err));
    });
  });

  // Delete the created user so that testing can be repeated
  after(function(done) {
    User.getUserByUsername(user1.username).then(function(user) {
      User.delete(user.id);
      done();
    })
      .catch(err => done(err));
  });
});
