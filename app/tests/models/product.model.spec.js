'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test';

let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiAP);

require(path.resolve('./server'));
let Product = require(path.resolve('./app/models/product.model.js'));

/**
 * Unit Tests
 */
describe('Product Model Unit Tests', () => {

  describe('Product ID validation', () => {
    it('should return true, when the ID is a number', () => {
      expect(Product.isValidId(4)).to.be.equal(true);
    });
    it('it should return true when the ID can convert to a number', () => {
      expect(Product.isValidId('20')).to.be.equal(true);
    });
    it('it should return false when the ID cannot convert to a number', () => {
      expect(Product.isValidId('4B200')).to.be.equal(false);
    });
  });

});
