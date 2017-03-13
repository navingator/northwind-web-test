'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let Product = require(path.resolve('./app/models/product.model.js'));
let api = require('./util/product-api.util')(app);

/**
 * Unit Tests
 */
// Use as template - do NOT use directly in functions, particularly if they have side effects
let productTemplate = new Product({
  name: 'zzUnitTestProduct',
  categoryId: 1, // TODO create a category to guarantee one exists
  unitPrice: 12.50,
  unitsInStock: 4,
  discontinued: false
});
describe('Product Routes Unit Tests', () => {
  describe('unauthenticated create request with', () => {
    describe('valid product', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, res => {
          response = res;
          done();
        });
      });
      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      });
      it('returns expected product', done => {
        expect(response.body).to.have.property('id');
        product.id = response.body.id;
        for (let property in product) {
          expect(response.body).to.have.property(property, product[property]);
        }
        done();
      });
      it('is saved in database', done => {
        Product.get(product.id)
          .then(dbProduct => {
            for (let property in product) {
              expect(dbProduct).to.have.property(property, product[property]);
            }
            done();
          })
          .catch(err => done(err));
      });
      after(done => api.cleanup(product, done));
    });
    describe('empty name', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        product.name = '';
        api.create(product, res => {
          response = res;
          done();
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('name longer than 40 characters', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        product.name = 'zzUnitTestcanyoubelievethatthisis45characters';
        api.create(product, res => {
          response = res;
          done();
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('invalid category id', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        product.categoryId = 10;
        api.create(product, res => {
          response = res;
          done();
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
    });
    describe('duplicate name', () => {
      let product = new Product(productTemplate);
      let dupeproduct = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          api.create(dupeproduct, res => {
            response = res;
            done();
          });
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => api.cleanup(product, done));
    });
  });
  describe('unauthenticated get request with', () => {
    describe('no parameters', () => {
      let response;
      before(done => {
        api.list(res => {
          response = res;
          done();
        });
      });
      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      });
      it('returns an array of Product objects', done => {
        expect(response.body).to.be.an('Array');
        done();
      });
    });
    describe('valid product id', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          api.get(product.id, res => {
            response = res;
            done();
          });
        });
      });
      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      });
      it('returns expected product', done => {
        for(let property in product) {
          expect(response.body).to.have.property(property, product[property]);
        }
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('invalid product id', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.get(90, res => {
          response = res;
          done();
        });
      });
      it('returns not found status', done => {
        expect(response.status).to.equal(404);
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('valid category id parameter', () => {
      xit('returns success status', done => {
        done();
      });
      xit('returns expected products', done => {
        done();
      });
    });
    describe('invalid category id parameter', () => {
      xit('returns not found status', done => {
        done();
      });
    });
  });
  describe('unauthenticated update request with', () => {
    describe('valid product', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          product.name='zzUnitTestProduct2';
          product.categoryId=2;
          product.unitPrice=1;
          product.unitsInStock=100;
          product.discontinued=true;
          api.update(product, res => {
            response = res;
            done();
          });
        });
      });
      it('returns success status', done => {
        expect(response.status).to.be.equal(200);
        done();
      });
      it('is saved in database', done => {
        Product.get(product.id)
          .then(dbProduct => {
            for(let property in product) {
              expect(dbProduct).to.have.property(property, product[property]);
            }
            done();
          })
          .catch(err => done(err));
      });
      after(done => api.cleanup(product, done));
    });
    describe('empty name', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          product.name = '';
          api.update(product, res => {
            response = res;
            done();
          });
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('name longer than 40 characters', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          product.name = 'zzUnitTestcanyoubelievethatthisis45characters';
          api.update(product, res => {
            response = res;
            done();
          });
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('invalid category id', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          product.categoryId=10;
          api.update(product, res => {
            response = res;
            done();
          });
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => api.cleanup(product, done));
    });
    describe('duplicate name', () => {
      let product1 = new Product(productTemplate);
      let product2 = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product1, () => {
          product2.name = 'zzUnitTest2';
          api.create(product2, () => {
            product2.name = product1.name;
            api.update(product2, res => {
              response = res;
              done();
            });
          });
        });
      });
      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });
      xit('returns error message', done => {
        done();
      });
      after(done => {
        Product.delete(product1.id)
          .then(Product.delete(product2.id))
          .then(() => done())
          .catch(err => done(err));
      });
    });
  });
  describe('unauthenticated delete request with', () => {
    describe('valid product id', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product, () => {
          api.delete(product.id, res => {
            response = res;
            done();
          });
        });
      });
      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      });
      it('returns expected product', done => {
        for (let property in product) {
          expect(response.body).to.have.property(property, product[property]);
        }
        done();
      });
      it('is deleted from database', done => {
        api.get(product.id, res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('invalid product id', () => {
      let response;
      before(done => {
        api.delete(90, res => {
          response = res;
          done();
        });
      });
      it('returns not found status', done => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });
});
