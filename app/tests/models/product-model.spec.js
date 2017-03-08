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

let product = Product.get({
  name: 'zzUnitTestProduct',
  categoryId: 1, // TODO create a category to guarantee one exists
  quantityPerUnit: 2,
  unitPrice: 12.50,
  unitsInStock: 4,
  unitsOnOrder: 5,
  discontinued: false
});
/**
 * Unit Tests
 */
describe('Product Model Unit Tests', () => {
  it('should successfully create a new product', done => {
    console.log(product.unitsOnOrder);
    Product.create(product).then(data => {
      expect(data.id).to.not.be.an('undefined');
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
