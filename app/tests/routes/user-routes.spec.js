'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests
//TODO suppress stdout for these tests (result from HTTP calls)

let path = require('path');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let User = require(path.resolve('./app/models/user.model.js'));
chai.use(chaiHttp);

let user; // user template for testing

describe('User API Routes Unit Test', () => {
  beforeEach(done => {
    user = new User({
      firstName: 'Unit',
      lastName: 'zzTesting',
      username: 'zzunittesting',
      password: 'password1'
    });
    done();
  });

  describe('Tests without pre-existing users', () => {
    it('should let the client know if a user does not exist', done => {
      chai.request(app)
        .post('/api/users/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.deep.equal('Username not found');
          done();
        });
    });
    describe('User Creation', () => {
      // Delete user
      afterEach(done => {
        User.getUserByUsername(user.username).then(dbUser => {
          console.log(dbUser);
          User.delete(dbUser.id).then(() => done());
        })
          .catch(err => done(err));
      });
      it('should be able to create a user (post /api/users)', done => {
        chai.request(app)
          .post('/api/users')
          .send(user)
          .end(function (err, res) {
            expect(res).to.not.equal(undefined);
            expect(res).to.have.property('status');
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('id'); // returns user
            expect(res).to.have.cookie('northwind.connect.sid'); // returns session
            User.getUserByUsername(user.username).then(dbUser => {
              expect(user.username).to.deep.equal(dbUser.username);
              done();
            })
              .catch(err => done(err));
          });
      });
    });
  });

  describe('Tests with a pre-existing user', () => {
    beforeEach(done => {
      User.createUser(user).then(data => {
        user.id = data.id;
        done();
      });
    });
    // Delete user
    afterEach(function(done) {
      User.delete(user.id).then(() => done())
        .catch(err => done(err));
    });

    describe('User creation', () => {
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
  });
});
