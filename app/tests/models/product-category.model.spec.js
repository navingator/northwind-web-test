'use strict';
process.env.NODE_ENV='test'; // TODO do this globally for tests

/* dependencies for the test */
let path = require('path');
let chai = require('chai');
let chaiAP = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiAP);

require(path.resolve('./server'));
let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));
let productCategory;

/**
 * Set up a test product category
 */
describe('Product category model unit tests', () => {
  before(done => {
    productCategory = new ProductCategory({
      name: 'zzUTestProdCat',
      description: 'Unit Test Product Category',
      picture: './db/northwind_psql/EntityRelation\ model.png'
    });
    done();
  });

  /**
  * Unit Tests
  */
  describe('unauthenticated create request with valid category', () => {
    before(done => {
      productCategory.create().then(() => {
        done();
      })
      .catch(err => done(err));
    });
    it('creates a new product categry with an numeric id', done => {
      expect(productCategory.id).to.be.a('number');
      done();
    });
    it('creates a new product categry that can be retrieved from the database', done => {
      ProductCategory.findById(productCategory.id)
        .then(dbProductCategory => {
          expect(dbProductCategory.name).to.deep.equal(productCategory.name);
          done();
        })
        .catch(err => done(err));
    });
  });

  /**
   * Clean up test product category
   */
  after(done => {
    if(productCategory.id) {
      ProductCategory.remove(productCategory.id)
        .then(() => done())
        .catch(err => done(err));
    } else {
      done();
    }
  });
});
