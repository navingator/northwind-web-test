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
  return api.signout()
    .then(() => User.getByUsername(username))
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

      it('returns the serialized user in a cookie', () => {
        expect(response.header).to.have.property('set-cookie');
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
      return api.create(user)
        .then(() => api.signout());
    });

    after(() => cleanupUser(user.username));

    describe('valid user and valid password', () => {

      let response;
      before(() => {
        return api.signin(user)
          .then(res => response = res);
      });

      after(() => api.signout());

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns the user object without password', () => {
        for(let prop in user) {
          if(prop === 'password') {
            expect(response.body).to.not.have.property('password');
            break;
          }
          expect(response.body).to.have.property(prop, user[prop]);
        }
      });
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
      it('returns error', () => {
        expect(response.body).to.have.property('code', 1100);
        expect(response.body).to.have.property('message', 'Username does not exist. Please create an account.');
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
      it('returns error', () => {
        expect(response.body).to.have.property('code', 1101);
        expect(response.body).to.have.property('message', 'Invalid Password. Please try again.');
      });
    });
  });

  describe('signout request', () => {

    let user;
    before(() => {
      user = new User(userTemplate);
      return api.create(user);
    });

    after(() => cleanupUser(user.username));

    describe('with valid signin', () => {

      let response;
      before(() => {
        return api.signin(user)
          .then(() => api.signout())
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));
      it('cannot access protected routes', () => {
        return api.makeAdmin()
          .then(res => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code', 1200);
            expect(res.body).to.have.property('message', 'You must be logged in to perform this action.');
          });
      });
    });

    describe('without valid signin', () => {

      let response;
      before(() => {
        return api.signout()
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));
    });
  });

  describe('get user request with', () => {

    let user;
    before(() => {
      user = new User(userTemplate);
      return api.create(user)
        .then(() => api.signout());
    });

    after(() => cleanupUser(user.username));

    describe('signed in user', () => {

      let response;
      before(() => {
        return api.signin(user)
          .then(() => api.me())
          .then(res => response = res);
      });

      after(() => api.signout());

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns the user', () => expect(response.body).to.have.property('username', user.username));
    });

    describe('signed out user', () => {

      let response;
      before(() => {
        return api.me()
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));
      it('returns an empty user', () => expect(response.body).to.be.empty);
    });

  });

  describe('forgot password request', () => {

    let user;
    before(() => {
      user = new User(userTemplate);
      return api.create(user);
    });

    after(() => cleanupUser(user.username));

    describe('with valid user identifiers', () => {

      let user2;
      let response;
      before(() => {
        user2 = new User(userTemplate);
        user2.password = 'newpassword';
        return api.forgot(user2)
          .then(res => response = res);
      });

      afterEach(() => api.signout());

      after(() => api.forgot(user));

      it('returns sucess status', () => expect(response.status).to.equal(200));

      it('does not permit the user to sign in with old credentials', () => {
        // assumes credentials have changed
        return api.signin(user)
          .then(res => expect(res.status).to.equal(400));
      });

      it('permits the user to sign in with new credentials', () => {
        return api.signin(user2)
          .then(res => expect(res.status).to.equal(200));
      });
    });

    describe('with an unknown username', () => {

      let user2;
      let response;
      before(() => {
        user2 = new User(userTemplate);
        user2.username = 'zzunittesting1';
        user2.password = 'newpassword';
        return api.forgot(user2)
          .then(res => response = res);
      });

      after(() => api.signout());

      it('returns error status', () => expect(response.status).to.equal(400));

      it('returns error message', () => {
        expect(response.body).to.have.property('code', 1100);
        expect(response.body).to.have.property('message', 'Username does not exist. Please create an account.');
      });

      it('permits the user to sign in with old credentials', () => {
        return api.signin(user)
          .then(res => expect(res.status).to.equal(200));
      });
    });

    describe('without valid user identifiers', () => {

      let user2;
      let response;
      before(() => {
        user2 = new User(userTemplate);
        user2.firstName = user.firstName + 'a';
        user2.lastName = user.lastName + 'a';
        user2.password = 'newpassword';
        return api.forgot(user2)
          .then(res => response = res);
      });

      after(() => api.signout());

      it('returns error status', () => expect(response.status).to.equal(400));

      it('returns error message', () => {
        expect(response.body).to.have.property('code', 1102);
        expect(response.body).to.have.property('message', 'Name does not match the given user\'s name.');
      });

      it('permits the user to sign in with old credentials', () => {
        return api.signin(user)
          .then(res => expect(res.status).to.equal(200));
      });
    });

    describe('with empty user identifiers', () => {

      let user2;
      let response;
      before(() => {
        user2 = new User(userTemplate);
        user2.firstName = '';
        delete user2.lastName;
        user2.password = 'newpassword';
        return api.forgot(user2)
          .then(res => response = res);
      });

      after(() => api.signout());

      it('returns error status', () => expect(response.status).to.equal(400));

      it('returns error message', () => {
        expect(response.body).to.have.property('code', 1102);
        expect(response.body).to.have.property('message', 'Name does not match the given user\'s name.');
      });

      it('permits the user to sign in with old credentials', () => {
        return api.signin(user)
          .then(res => expect(res.status).to.equal(200));
      });
    });
  });

  describe('make admin request', () => {
    describe('with authenticated user', () => {
      let response;
      let user;
      before(() => {
        user = new User(userTemplate);
        return api.create(user)
          .then(() => api.makeAdmin())
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns success status', () => expect(response.status).to.equal(200));
      it('sets user isAdmin property to true', () => {
        expect(response.body).to.have.property('isAdmin', true);
      });

    });
    describe('without authenticated user', () => {
      let response;
      let user;
      before(() => {
        user = new User(userTemplate);
        return api.create(user)
          .then(() => api.signout())
          .then(() => api.makeAdmin())
          .then(res => response = res);
      });

      after(() => cleanupUser(user.username));

      it('returns unauthenticated status', () => expect(response.status).to.equal(401));
      it('does not set user isAdmin property to true', () => {
        return User.getById(user.id)
          .then(dbUser => expect(dbUser).to.have.property('isAdmin', false));
      });
    });
  });

});
