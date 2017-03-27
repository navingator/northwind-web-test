'use strict';
process.env.NODE_ENV='test';

let path = require('path');
let chai = require('chai');
let expect = chai.expect;

require(path.resolve('./server'));
let User = require(path.resolve('./app/models/user.model.js'));

let userTemplate = new User({
  firstName: 'Unit',
  lastName: 'zzTesting',
  username: 'zzunittesting',
  password: 'password1'
});
/**
 * Unit tests
 */
describe('User Model Unit Tests', () => {
  describe('authentication', () => {

    let user;
    before(() => {
      user = new User(userTemplate);
      return user.create();
    });

    after(() => {
      return User.delete(user.id);
    });

    it('should authenticate with itself', () => {
      return user.authenticate(userTemplate.password)
        .then(auth => expect(auth).to.equal(true));
    });
    it('should fail to authenticate with a bad password', () => {
      return user.authenticate('user.password')
        .then(auth => expect(auth).to.equal(false));
    });
  });
});
