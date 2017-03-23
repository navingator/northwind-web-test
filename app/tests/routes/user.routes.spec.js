'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test';
//TODO suppress stdout for these tests (result from HTTP calls)

let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let User = require(path.resolve('./app/models/user.model.js'));
let api = require('./util/user-api.util')(app);

let userTemplate = new User({
  firstName: 'Unit',
  lastName: 'zzTesting',
  username: 'zzUnitTesting',
  password: 'password1'
}); // user template for testing

// Utility function to cleanup the user database of unit test users
function cleanupUser(username) {
  return User.getByUsername(username)
    .then(user => User.delete(user.id))
    .catch(() => null); // Toss the error if the user does not exist
}

describe('User API Routes Unit Test', () => {

  describe('create request with', () => {

    describe('valid user', () => {

      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        return api.create(user)
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns success status', () => {
        expect(response.status).to.equal(200);
      });

      it('returns expected user', () => {
        expect(response.body.username).to.equal(userTemplate.username);
        expect(response.body.firstName).to.equal(userTemplate.firstName);
        expect(response.body.lastName).to.equal(userTemplate.lastName);
      });

      it('does not return a password', () => expect(response).to.not.have.property('password'));

      it('is saved in the database', () => {
        return User.getById(user.id)
          .then(dbUser => {
            expect(dbUser.username).to.equal(userTemplate.username);
            expect(dbUser.firstName).to.equal(userTemplate.firstName);
            expect(dbUser.lastName).to.equal(userTemplate.lastName);
          });
      });
    });
    describe('pre-existing username', () => {

      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        return api.create(user)
          .then(() => api.create(user))
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 1010);
        expect(response.body).to.have.property('message', 'Username already taken. Please choose another.');
      });
    });

    describe('username with less than 3 characters', () => {
      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        user.username = 'zz';
        return api.create(user)
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 1020);
        expect(response.body).to.have.property('message', 'Username must be between 3 and 15 characters.');
      });
    });

    describe('username with more than 15 characters', () => {
      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        user.username = 'zzUnit1234567890';
        return api.create(user)
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 1020);
        expect(response.body).to.have.property('message', 'Username must be between 3 and 15 characters.');
      });
    });

    describe('no password', () => {
      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        user.password = '';
        return api.create(user)
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 1003);
        expect(response.body).to.have.property('message', 'Password cannot be empty.');
      });
    });

    describe('no first name', () => {
      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        user.firstName = '';
        return api.create(user)
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 1001);
        expect(response.body).to.have.property('message', 'First name cannot be empty.');
      });
    });

    describe('no last name', () => {
      let user;
      let response;
      before(() => {
        user = new User(userTemplate);
        delete user.lastName;
        return api.create(user)
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 1002);
        expect(response.body).to.have.property('message', 'Last name cannot be empty.');
      });
    });
  });

  describe('signin request with ', () => {
    let user;

    before(() => {
      user = new User(userTemplate);
      return api.create(user);
    });

    after(() => cleanupUser(user.username));

    describe('valid user and valid password', () => {

      let response;
      before(() => {
        return api.signin(user)
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));
      xit('returns the user object to the caller');
      xit('returns the serialized user in a cookie');
    });

    describe('unknown user', () => {
      let response;
      before(() => {
        let user2 = new User(userTemplate);
        user2.username = 'zzunittesting1';
        return api.signin(user2)
          .then(res => response = res);
      });



      it('returns invalid status', () => expect(response.status).to.equal(400));
      xit('returns error', () => {
        //TODO
      });
    });

    describe('valid user and bad password', () => {
      let response;
      before(() => {
        let user2 = new User(userTemplate);
        user2.password = 'pass';
        return api.signin(user2)
          .then(res => response = res);
      });
      it('returns invalid status', () => expect(response.status).to.equal(400));
      xit('returns error', () => {
        //TODO
      });
    });
  });
});
