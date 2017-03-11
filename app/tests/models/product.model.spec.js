'use strict';
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiAP);

require(path.resolve('./server'));
let Product = require(path.resolve('./app/models/product.model.js'));

let product;
/**
 * Unit Tests
 */
describe('Product Model Unit Tests', () => {
  beforeEach(done => {
    product = new Product({
      name: 'zzUnitTestProduct',
      categoryId: 1, // TODO create a category to guarantee one exists
      unitPrice: 12.50,
      unitsInStock: 4,
      discontinued: false
    });
    done();
  });
  afterEach(done => {
    Product.delete(product.id)
      .then(() => done())
      .catch(err => done(err));
  });
  it('should successfully create a new product', done => {
    product.create().then(() => {
      expect(product.id).to.be.a('number');
      done();
    })
      .catch(err => done(err));
  });
  xit('should get a previously created product', done => {
    done();
  });
  xit('should retrieve a number of created products', done => {
    done();
  });
  xit('should retrieve products from a specified category', done => {
    done();
  });
  xit('should fail to retrieve a product that does not exist', done => {
    done();
  });
  xit('should update a product', done => {
    done();
  });
  xit('should fail to update a product that does not exist', done => {
    done();
  });
  xit('should delete a previously created product', done => {
    done();
  });
  xit('should fail to delete a product that does not exist', done => {
    done();
  });
});
