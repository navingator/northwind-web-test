'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiAP);

require(path.resolve('./server'));
let ApiError = require(path.resolve('./app/models/api-error.model.js'));

describe('API Error Unit Tests', () => {
  describe('Get postgres error', () => {

    describe('with specified column', () => {
      let dbError;
      let apiError;
      before(done => {
        dbError = {
          code: '23502',
          table: 'users',
          column: 'username'
        };

        ApiError.getApiError(dbError)
          .then(apierr => {
            apiError = apierr;
            done();
          })
          .catch(err => done(err));
      });

      it('should return the appropriate error code and message', done => {
        expect(apiError.code).to.equal(1000);
        expect(apiError.message).to.equal('Username cannot be empty.');
        done();
      });

      it('should not have original error information', done => {
        expect(apiError.code).to.not.equal(dbError.code);
        expect(apiError).to.not.have.property('table');
        expect(apiError).to.not.have.property('column');
        done();
      });
    });

    describe('with specified constraint', () => {
      let dbError;
      let apiError;
      before(done => {
        dbError = {
          code: '23505',
          table: 'users',
          constraint: 'users_username_key'
        };

        ApiError.getApiError(dbError)
          .then(apierr => {
            apiError = apierr;
            done();
          })
          .catch(err => done(err));
      });

      it('should return the appropriate error code and message', done => {
        expect(apiError.code).to.equal(1010);
        expect(apiError.message).to.equal('Username already taken. Please choose another.');
        done();
      });

      it('should not have original error information', done => {
        expect(apiError.code).to.not.equal(dbError.code);
        expect(apiError).to.not.have.property('table');
        expect(apiError).to.not.have.property('constraint');
        done();
      });
    });

    describe('with unknown error', () => {
      let dbError;
      let apiError;
      let error;

      before(done => {
        dbError = {
          code: '12345',
          table: 'testT',
          column: 'testC'
        };

        ApiError.getApiError(dbError)
          .then(apierr => {
            apiError = apierr;
            done(new Error('Should not find error in database'));
          })
          .catch(err => {
            error = err;
            done();
          });
      });

      it('should throw an error', done => {
        expect(error.message).to.equal('Postgres error not found in database.');
        done();
      });
    });

    describe('without required error elements', () => {
      let dbError;
      let apiError;
      let error;

      before(done => {
        dbError = new Error('test error');
        ApiError.getApiError(dbError)
          .then(apiErr => {
            apiError = apiErr;
            done(new Error('Should not find error in database'));
          })
          .catch(err => {
            error = err;
            done();
          });
      });
      it('should throw an error', done => {
        expect(error.message).to.equal('Invalid postgres error');
        done();
      });
    });
  });
});
