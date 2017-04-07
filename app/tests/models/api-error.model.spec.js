'use strict';

process.env.NODE_ENV='test';

let appRoot = require('app-root-path');
let chai = require('chai');
let expect = chai.expect;

require(appRoot + '/server');
let ApiError = require(appRoot + '/app/models/api-error.model.js');

describe('API Error Unit Tests', () => {
  describe('Get postgres error', () => {

    describe('with specified column', () => {
      let dbError;
      let apiError;
      before(() => {
        dbError = {
          code: '23502',
          table: 'users',
          column: 'username'
        };

        return ApiError.lookupError(dbError)
          .then(apierr => apiError = apierr);
      });

      it('should return the appropriate error code and message', () => {
        expect(apiError.code).to.equal(1000);
        expect(apiError.message).to.equal('Username cannot be empty.');
      });

      it('should not have original error information', () => {
        expect(apiError.code).to.not.equal(dbError.code);
        expect(apiError).to.not.have.property('table');
        expect(apiError).to.not.have.property('column');
      });
    });

    describe('with specified constraint', () => {

      let dbError;
      let apiError;
      before(() => {
        dbError = {
          code: '23505',
          table: 'users',
          constraint: 'users_username_key'
        };

        return ApiError.lookupError(dbError)
          .then(apierr => apiError = apierr);
      });

      it('should return the appropriate error code and message', () => {
        expect(apiError.code).to.equal(1010);
        expect(apiError.message).to.equal('Username already taken. Please choose another.');
      });

      it('should not have original error information', () => {
        expect(apiError.code).to.not.equal(dbError.code);
        expect(apiError).to.not.have.property('table');
        expect(apiError).to.not.have.property('constraint');
      });
    });

    describe('with unknown error', () => {

      let dbError;
      let apiError;
      before(() => {
        dbError = {
          code: '12345',
          table: 'testT',
          column: 'testC'
        };

        return ApiError.lookupError(dbError)
          .then(apiErr => apiError = apiErr);
      });

      it('has an ApiError with code 0', () => {
        expect(apiError.code).to.equal(0);
      });

      it('has an ApiError with a descriptive message', () => {
        expect(apiError.message).to.equal(
          'Postgres error not found in errors database:' +
          '\ncode = 12345' +
          '\ntable = testT' +
          '\ncolumn = testC'
        );
      });
    });

    describe('without required error elements', () => {

      let dbError;
      let apiError;
      before(() => {
        dbError = new Error('test error');
        return ApiError.lookupError(dbError)
          .then(apiErr => apiError = apiErr);
      });
      it('has an ApiError with code 0', () => {
        expect(apiError.code).to.equal(0);
      });

      it('has an ApiError with a descriptive message', () => {
        expect(apiError.message).to.equal('Postgres error not found in errors database:');
      });
    });
  });

  describe('get generic API error', () => {

    describe('with a known error', () => {

      let apiError;
      let code = 4100;
      before(() => {
        return ApiError.getApiError(code)
          .then(apiErr => apiError = apiErr);
      });

      it('gets the appropriate error ', () => {
        expect(apiError.code).to.equal(code);
        expect(apiError.message).to.equal('ID is invalid.');
      });

    });

    describe('with an unknown error', () => {
      let code = '9999999999';
      let apiError;
      before(() => {
        return ApiError.getApiError(code)
          .then(apiErr => apiError = apiErr);
      });

      it('has an ApiError with code 0', () => {
        expect(apiError.code).to.equal(0);
      });

      it('has an ApiError with a descriptive message', () => {
        expect(apiError.message).to.equal('Error (id = ' + code + ') not found in database.');
      });
    });

    describe('with an invalid error code', () => {
      let code = 'ABCDEFG';
      let apiError;
      before(() => {
        return ApiError.getApiError(code)
          .then(err => apiError = err);
      });

      it('has an ApiError with code 0', () => {
        expect(apiError.code).to.equal(0);
      });

      it('has an ApiError with a descriptive message', () => {
        expect(apiError.message).to.equal('Error (id = ' + code + ') not found in database.');
      });

    });
  });
});
