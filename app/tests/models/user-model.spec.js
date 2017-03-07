'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiAP);

require(path.resolve('./server'));
let User = require(path.resolve('./app/models/user.model.js'));

let user; // user template
/**
 * Unit tests
 */
describe('User Model Unit Tests', () => {
  beforeEach(done => {
    user = new User({
      firstName: 'Unit',
      lastName: 'zzTesting',
      username: 'zzunittesting',
      password: 'password1'
    });
    done();
  });

  describe('Tests without a pre-existing user', () => {
    afterEach(done => {
      User.getUserByUsername(user.username).then(dbUser => {
        User.delete(dbUser.id).then(() => done());
      })
        .catch(err => done(err));
    });

    it('should successfully create a new user', () => {
      return expect(User.createUser(user)).to.be.fulfilled;
    });
  });

  describe('Tests with a pre-existing user', () => {
    beforeEach(done => {
      User.createUser(user).then(data => {
        user.id = data.id;
        done();
      });
    });

    // Delete the created user so that testing can be repeated
    afterEach(done => {
      User.delete(user.id).then(() => done())
        .catch(err => done(err));
    });

    describe('Create Users', () => {
      it('should fail to create a new user with the same username', () => {
        let badUser = new User(user);
        badUser.firstName = 'Second';
        badUser.lastName = 'zzTesting';
        badUser.password = 'password2';
        return expect(User.createUser(badUser)).to.be.rejected;
      });
      it('should fail to create a user without a username', () => {
        let badUser = new User(user);
        delete badUser.username;
        return expect(User.createUser(badUser)).to.be.rejected;
      });
      it('should fail to create a user without a password', () => {
        let badUser = new User(user);
        delete badUser.password;
        return expect(User.createUser(badUser)).to.be.rejected;
      });
    });

    describe('Get Users', function() {
      it('should get created user successfully by username', done => {
        User.getUserByUsername(user.username).then(user => {
          // Verify fields
          expect(user.firstName).to.deep.equal(user.firstName);
          expect(user.lastName).to.deep.equal(user.lastName);
          expect(user.username).to.deep.equal(user.username);
          done();
        })
          .catch(err => done(err));
      });
      it('should get created user successfully by id', done => {
        User.getUserById(user.id).then(user => {
          // verify with username
          expect(user.username).to.deep.equal(user.username);
          done();
        })
          .catch(err => done(err));
      });
      it('should authenticate with itself', done => {
        User.getUserByUsername(user.username).then(dbUser => {
          dbUser.authenticate(user.password).then(auth => {
            expect(auth).to.deep.equal(true);
            done();
          });
        })
          .catch(err => done(err));
      });
      it('should fail to authenticate with a bad password', done => {
        User.getUserByUsername(user.username).then(dbUser => {
          dbUser.authenticate('badpassword').then(auth => {
            expect(auth).to.deep.equal(false);
            done();
          });
        })
          .catch(err => done(err));
      });
    });
  });
});
