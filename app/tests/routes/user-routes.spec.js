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

  describe('User creation', function() {
    it('should be able to create a user (get /api/users)', function(done) {
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
    it('should not create a user with a duplicate username (post /api/users)', done => {
      let dupeuser = new User(user);
      dupeuser.firstName = 'Second';
      dupeuser.lastName = 'zzSecondTest';
      dupeuser.password = 'password2';
      chai.request(app)
        .post('/api/users')
        .send(dupeuser)
        .end((err, res) => {
          expect(res).to.not.equal(undefined);
          expect(res).to.have.status(400);
          done();
        });
    });
    it('should authenticate a user with the correct password (post /api/users/signin)', done => {
      let authUser = {
        username: user.username,
        password: user.password
      };
      chai.request(app)
        .post('/api/users/signin')
        .send(authUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.deep.equal(authUser.username);
          expect(res.body.password).to.be.an('undefined');
          done();
        });
    });
    it('should fail to authenticate a user with the wrong password (post /api/users/signin)', done => {
      let authUser = {
        username: user.username,
        password: 'notthepassword'
      };
      chai.request(app)
        .post('/api/users/signin')
        .send(authUser)
        .end((err, res) => {
          expect(res).to.not.equal(undefined);
          expect(res).to.have.status(400);
          expect(res.body.message).to.deep.equal('Invalid password');
          done();
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
