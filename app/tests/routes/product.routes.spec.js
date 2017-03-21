'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test';

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
  before(done => api.cleanup(done));

  describe('unauthenticated create request with', () => {

    describe('valid product', () => {

      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product)
          .then(res => {
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
        Product.read(product.id)
          .then(dbProduct => {
            for (let property in product) {
              expect(dbProduct).to.have.property(property, product[property]);
            }
            done();
          })
          .catch(err => done(err));
      });

      after(done => api.cleanup(done));
    });
    describe('empty name', () => {

      let product = new Product(productTemplate);
      let response;
      before(done => {
        product.name = '';
        api.create(product)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2020);
        expect(response.body).to.have.property('message', 'Product name must be between 3 and 40 characters.');
        done();
      });

      after(done => api.cleanup(done));
    });
    describe('name longer than 40 characters', () => {

      let product = new Product(productTemplate);
      let response;
      before(done => {
        product.name = 'zzUnitTestcanyoubelievethatthisis45characters';
        api.create(product)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2020);
        expect(response.body).to.have.property('message', 'Product name must be between 3 and 40 characters.');
        done();
      });

      after(done => api.cleanup(done));
    });

    describe('invalid category id', () => {

      let product = new Product(productTemplate);
      let response;
      before(done => {
        product.categoryId = 10;
        api.create(product)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2030);
        expect(response.body).to.have.property('message', 'Chosen category is not a valid category.');
        done();
      });
    });
    describe('duplicate name', () => {

      let product = new Product(productTemplate);
      let dupeproduct = new Product(productTemplate);
      let response;

      before(done => {
        api.create(product)
          .then(() => {
            return api.create(dupeproduct);
          })
          .then(res => {
              response = res;
              done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2010);
        expect(response.body).to.have.property('message', 'Product name must be unique.');
        done();
      });

      after(done => api.cleanup(done));
    });
  });
  describe('unauthenticated get request with', () => {

    describe('no parameters', () => {

      let response;
      before(done => {
        api.list()
          .then(res => {
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
        api.create(product)
          .then(() => {
            return api.get(product.id);
          })
          .then(res => {
            response = res;
            done();
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

      after(done => api.cleanup(done));
    });
    describe('non-existant product id', () => {
      let response;
      before(done => {
        api.get(90)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns not found status', done => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    describe('invalid product id', () => {
      let response;
      before(done => {
        api.get('bluefish')
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns error status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 4000);
        expect(response.body).to.have.property('message', 'ID is invalid.');
        done();
      });
    });

    describe('valid category id parameter', () => {

      xit('returns success status', done => {
        done();
      });

      xit('returns expected products', done => {
        done();
      });
    });

    describe('non-existant category id parameter', () => {

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
        api.create(product)
          .then(() => {
            product.name='zzUnitTestProduct2';
            product.categoryId=2;
            product.unitPrice=1;
            product.unitsInStock=100;
            product.discontinued=true;
            return api.update(product);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns success status', done => {
        expect(response.status).to.be.equal(200);
        done();
      });

      it('is saved in database', done => {
        Product.read(product.id)
          .then(dbProduct => {
            for(let property in product) {
              expect(dbProduct).to.have.property(property, product[property]);
            }
            done();
          })
          .catch(err => done(err));
      });

      after(done => api.cleanup(done));
    });

    describe('empty name', () => {

      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product)
          .then(() => {
            product.name = '';
            return api.update(product);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2020);
        expect(response.body).to.have.property('message', 'Product name must be between 3 and 40 characters.');
        done();
      });

      after(done => api.cleanup(done));
    });

    describe('name longer than 40 characters', () => {

      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product)
          .then(() => {
            product.name = 'zzUnitTestcanyoubelievethatthisis45characters';
            return api.update(product);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2020);
        expect(response.body).to.have.property('message', 'Product name must be between 3 and 40 characters.');
        done();
      });

      after(done => api.cleanup(done));
    });
    describe('invalid category id', () => {

      let product = new Product(productTemplate);
      let response;

      before(done => {
        api.create(product)
          .then(() => {
            product.categoryId=10;
            return api.update(product);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2030);
        expect(response.body).to.have.property('message', 'Chosen category is not a valid category.');
        done();
      });

      after(done => api.cleanup(done));
    });
    describe('duplicate name', () => {

      let product1 = new Product(productTemplate);
      let product2 = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product1) // create the first product
          .then(() => {
            product2.name = productTemplate.name + '2';
            return api.create(product2); // create the second product
          })
          .then(() => {
            product2.name = product1.name;
            return api.update(product2); // attempt to update the second product to the 1st's name
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      });

      it('returns error', done => {
        expect(response.body).to.have.property('code', 2010);
        expect(response.body).to.have.property('message', 'Product name must be unique.');
        done();
      });

      after(done => api.cleanup(done));
    });
  });
  describe('unauthenticated delete request with', () => {

    describe('valid product id', () => {
      let product = new Product(productTemplate);
      let response;
      before(done => {
        api.create(product)
          .then(() => {
            return api.delete(product.id);
          })
          .then(res => {
            response = res;
            done();
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
        api.get(product.id)
          .then(res => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
    describe('unknown product id', () => {

      let response;
      before(done => {
        api.delete(90)
          .then(res => {
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

  describe('unauthenticated search request with', () => {
    before(done => {
      let product1 = new Product(productTemplate);
      let product2 = new Product(productTemplate);
      product2.name = productTemplate.name + '2';
      api.create(product1)
        .then(() => {
          api.create(product2);
        })
        .then(() => {
          done();
        });
    });

    describe('valid search string for existing products', () => {

      let response;
      before(done => {
        api.search(productTemplate.name)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      });

      it('returns the correct number of products', done => {
        expect(response.body.length).to.equal(2);
        done();
      });
    });

    describe('valid search string for nonexistant products', () => {

      let response;
      before(done => {
        api.search(productTemplate.name + 'invalid')
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns not found status', done => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    after(done => api.cleanup(done));
  });
});
