'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let app = require(path.resolve('./server'));
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let User = require(path.resolve('./app/models/user.model.js'));
chai.use(chaiHttp);

let user; // user template for testing
describe('User API Routes Unit Test', function() {
  before(function(done) {
    user = new User({
      firstName: 'Unit',
      lastName: 'zzTesting',
      username: 'zzunittesting',
      password: 'password1'
    });
    done();
  });

  describe('/api/users', function() {
    it('should be able to create a user', function(done) {
      chai.request(app)
        .post('/api/users')
        .send(user)
        .end(function (err, res) {
          expect(res).to.not.equal(undefined);
          expect(res).to.have.property('status');
          expect(res).to.have.status(200);
          User.getUserByUsername(user.username).then(function (dbUser) {
            expect(user.username).to.deep.equal(dbUser.username);
            done();
          })
            .catch(err => done(err));
        });
    });
  });

  // Delete user
  after(function(done) {
    User.getUserByUsername(user.username).then(function(user) {
      User.delete(user.id);
      done();
    })
      .catch(err => done(err));
  });
});
