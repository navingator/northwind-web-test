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
  describe('Delete product', () => {
    
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

  describe('Product ID validation', () => {
    it('should return true, when the ID is a number', done => {
      expect(Product.isValidId(4)).to.be.equal(true);
      done();
    });
    it('it should return true when the ID can convert to a number', done => {
      expect(Product.isValidId('20')).to.be.equal(true);
      done();
    });
    it('it should return false when the ID cannot convert to a number', done => {
      expect(Product.isValidId('4B200')).to.be.equal(false);
      done();
    });
  });

  describe('Update product', () => {
    describe('with valid product', () => {
      let product = new Product(productTemplate);
      before(done => {
        product.create()
          .then(() => {
            product.name='zzUnitTestProduct2';
            product.categoryId=2;
            product.unitPrice=1;
            product.unitsInStock=100;
            product.discontinued=true;
            return product.update();
          })
          .then(() => {
            done();
          })
          .catch(err => done(err));
      });
      it('should update the product in the database', done => {
        Product.get(product.id)
          .then(dbProduct => {
            for (let property in product) {
              expect(dbProduct).to.have.property(property, product[property]);
            }
            done();
          });
      });
      after(done => {
        Product.delete(product.id)
          .then(() => done())
          .catch(err => done(err));
      });
    });
    describe('with an invalid property', () => {
      let product = new Product(productTemplate);
      let error;
      before(done => {
        product.create()
          .then(() => {
            product.name='';
            product.categoryId=2;
            product.unitPrice=1;
            product.unitsInStock=100;
            product.discontinued=true;
            return product.update();
          })
          .then(() => {
            done();
          })
          .catch(err => {
            error = err;
            done();
          });
      });
      it('should throw an error', done => {
        expect(error).to.not.be.an('undefined');
        done();
      });
      it('should not update the product in the database', done => {
        Product.get(product.id)
          .then(dbProduct => {
            expect(dbProduct.name).to.equal('zzUnitTestProduct');
            done();
          });
      });
      after(done => {
        Product.delete(product.id)
          .then(() => done())
          .catch(err => done(err));
      });
    });
  });

});
