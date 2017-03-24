'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test';

let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let Product = require(path.resolve('./app/models/product.model.js'));
let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));
let productApi = require('./util/product-api.util')(app);
let categoryApi = require('./util/product-category-api.util')(app);

/**
 * Unit Tests
 */
// Use as template - do NOT use directly in functions, particularly if they have side effects
let productTemplate = new Product({
  name: 'zzUnitTestProduct',
  unitPrice: 12.50,
  unitsInStock: 4,
  discontinued: false
}); // initialized in the first before call
describe('Product Routes Unit Tests', () => {
  before(() => {
    let category = new ProductCategory({
      name: 'zzUnit',
      description: 'Unit test product category - Should be deleted if seen outside of testing',
      picture: './somewhere-out-there'
    });
    return categoryApi.cleanup()
      .then(() => productApi.cleanup())
      .then(() => categoryApi.create(category))
      .then(res => productTemplate.categoryId = res.body.id);
  });

  after(() => {
    return categoryApi.cleanup();
  });

  describe('unauthenticated create request with', () => {

    describe('valid product', () => {

      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        return productApi.create(product)
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns expected product', () => {
        expect(response.body).to.have.property('id');
        product.id = response.body.id;
        for (let property in product) {
          expect(response.body).to.have.property(property, product[property]);
        }
      });

      it('is saved in database', () => {
        return Product.read(product.id)
          .then(dbProduct => {
            for (let property in product) {
              expect(dbProduct).to.have.property(property, product[property]);
            }
          });
      });

      after(productApi.cleanup);
    });
    describe('empty name', () => {

      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        product.name = '';
        return productApi.create(product)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2000);
        expect(response.body).to.have.property('message', 'Product name cannot be empty.');
      });

      after(productApi.cleanup);
    });
    describe('name longer than 40 characters', () => {

      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        product.name = 'zzUnitTestcanyoubelievethatthisis45characters';
        return productApi.create(product)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2020);
        expect(response.body).to.have.property('message', 'Product name must be between 3 and 40 characters.');
      });

      after(productApi.cleanup);
    });

    describe('invalid category id', () => {

      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        product.categoryId = 10;
        return productApi.create(product)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2030);
        expect(response.body).to.have.property('message', 'Chosen category is not a valid category.');
      });

      after(productApi.cleanup);
    });
    describe('duplicate name', () => {

      let product;
      let dupeproduct;
      let response;

      before(() => {
        product = new Product(productTemplate);
        dupeproduct = new Product(productTemplate);
        return productApi.create(product)
          .then(() => productApi.create(dupeproduct))
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2010);
        expect(response.body).to.have.property('message', 'Product name must be unique.');
      });

      after(productApi.cleanup);
    });
  });
  describe('unauthenticated get request with', () => {

    describe('no parameters', () => {

      let response;
      before(() => {
        return productApi.list()
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns an array of Product objects', () => expect(response.body).to.be.an('Array'));
    });

    describe('valid product id', () => {

      let product;
      let response;

      before(() => {
        product = new Product(productTemplate);
        return productApi.create(product)
          .then(() => productApi.get(product.id))
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns expected product', () => {
        for(let property in product) {
          expect(response.body).to.have.property(property, product[property]);
        }
      });

      after(productApi.cleanup);
    });
    describe('non-existant product id', () => {
      let response;
      before(() => {
        return productApi.get(90)
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));
    });

    describe('invalid product id', () => {
      let response;
      before(() => {
        return productApi.get('bluefish')
          .then(res => response = res);
      });

      it('returns error status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 4100);
        expect(response.body).to.have.property('message', 'ID is invalid.');
      });
    });
  });
  describe('unauthenticated update request with', () => {

    describe('valid product', () => {

      let product;
      let productUpdate;
      let response;
      before(() => {
        product = new Product(productTemplate);
        productUpdate = {
          name: productTemplate.name + '2',
          categoryId: productTemplate.categoryId,
          unitPrice: 1,
          unitsInStock: 200,
          discontinued: true
        };
        return productApi.create(product)
          .then(() => {
            productUpdate.id = product.id;
            return productApi.update(productUpdate);
          })
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.be.equal(200));

      it('is saved in database', () => {
        return Product.read(product.id)
          .then(dbProduct => {
            for(let property in productUpdate) {
              expect(dbProduct).to.have.property(property, productUpdate[property]);
            }
          });
      });

      after(productApi.cleanup);
    });

    describe('empty name', () => {

      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        return productApi.create(product)
          .then(() => {
            product.name = '';
            return productApi.update(product);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2000);
        expect(response.body).to.have.property('message', 'Product name cannot be empty.');
      });

      after(productApi.cleanup);
    });

    describe('name longer than 40 characters', () => {

      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        return productApi.create(product)
          .then(() => {
            product.name = 'zzUnitTestcanyoubelievethatthisis45characters';
            return productApi.update(product);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2020);
        expect(response.body).to.have.property('message', 'Product name must be between 3 and 40 characters.');
      });

      after(productApi.cleanup);
    });
    describe('invalid category id', () => {

      let product;
      let response;

      before(() => {
        product = new Product(productTemplate);
        return productApi.create(product)
          .then(() => {
            product.categoryId = 10;
            return productApi.update(product);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2030);
        expect(response.body).to.have.property('message', 'Chosen category is not a valid category.');
      });

      after(productApi.cleanup);
    });
    describe('duplicate name', () => {

      let product;
      let dupeproduct;
      let response;
      before(() => {
        product = new Product(productTemplate);
        dupeproduct = new Product(productTemplate);
        return productApi.create(product) // create the first product
          .then(() => {
            dupeproduct.name = productTemplate.name + '2';
            return productApi.create(dupeproduct); // create the second product
          })
          .then(() => {
            dupeproduct.name = product.name;
            return productApi.update(dupeproduct); // attempt to update the second product to the 1st's name
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns error', () => {
        expect(response.body).to.have.property('code', 2010);
        expect(response.body).to.have.property('message', 'Product name must be unique.');
      });

      after(productApi.cleanup);
    });
  });
  describe('unauthenticated delete request with', () => {

    describe('valid product id', () => {
      let product;
      let response;
      before(() => {
        product = new Product(productTemplate);
        return productApi.create(product)
          .then(() => productApi.delete(product.id))
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns expected product', () => {
        for (let property in product) {
          expect(response.body).to.have.property(property, product[property]);
        }
      });

      it('is deleted from database', () => {
        productApi.get(product.id)
          .then(res => expect(res.status).to.equal(404));
      });
    });
    describe('unknown product id', () => {

      let response;
      before(() => {
        return productApi.delete(90)
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));
    });
  });

  describe('unauthenticated search request with', () => {
    before(() => {
      let product1 = new Product(productTemplate);
      let product2 = new Product(productTemplate);
      product2.name = product1.name + '2';
      return productApi.create(product1)
        .then(() => productApi.create(product2));
    });

    after(productApi.cleanup);

    describe('valid search string for existing products', () => {

      let response;
      before(() => {
        return productApi.search(productTemplate.name)
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns the correct number of products', () => expect(response.body.length).to.equal(2));
    });

    describe('valid search string for nonexistant products', () => {

      let response;
      before(() => {
        return productApi.search(productTemplate.name + 'invalid')
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));
    });
  });
});
