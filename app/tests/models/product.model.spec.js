'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiAP);

require(path.resolve('./server'));
let Product = require(path.resolve('./app/models/product.model.js'));

let productTemplate = new Product({
  name: 'zzUnitTestProduct',
  categoryId: 1, // TODO create a category to guarantee one exists
  unitPrice: 12.50,
  unitsInStock: 4,
  discontinued: false
});
/**
 * Unit Tests
 */
describe('Product Model Unit Tests', () => {
  describe('Delete request with', () => {
    describe('Existing product ID', () => {
      let product = new Product(productTemplate);
      before(done => {
        product.create()
          .then(() => Product.delete(product.id))
          .then(() => done())
          .catch(err => done(err));
      });
      it('should successfully delete the product',
        () => expect(Product.get(product.id)).to.be.rejected);
    });
  describe('Invalid product ID', () => {
    let error;
    before(done => {
      Product.delete(80)
        .then(() => done())
        .catch(err => {
          error = err;
          done();
        });
    });
    it('should fail silently', done => {
      expect(error).to.be.an('undefined');
      done();
    });
  });

  });
});
