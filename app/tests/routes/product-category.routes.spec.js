'use strict';

/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

/* Import dependencies */
let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));
let api = require('./util/product-category-api.util')(app);

 /* Set up a test product category - do NOT use directly in functions */
let productCatTemplate = new ProductCategory({
  name: 'zzUTstProdCat',
  description: 'Unit test product category - Should be deleted if seen outside of testing',
  picture: './somewhere-out-there'
});

describe('ProductCat unit test', () => {

  before(done => {
    ProductCategory.findByStr(productCatTemplate.name)
    .then(dbProductCat => {
      for (let i = 0; i < dbProductCat.length; i++) {
        let productCategory = dbProductCat[i];
        if (productCategory.name === productCatTemplate.name) {
          return productCategory.id;
        }
      }
      return null;
    })
    .then(id => {
      if (id) {
        ProductCategory.remove(id)
          .then(() => done());
      } else {
        done();
      }
    });
  });

  describe('unauthenticated create request with', () => {

    describe('valid category', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory, res => {
          response = res;
          done();
        });
      });

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      }); //returns success status

      it('returns category details including new id', done => {
        expect(response.body).to.have.property('id');
        productCategory.id = response.body.id;
        for (let property in productCategory) {
          expect(response.body).to.have.property(property, productCategory[property]);
        }
        done();
      }); //returns category details including new id

      it('is saved in database', done => {
        ProductCategory.findById(productCategory.id)
          .then(dbProductCat => {
            for (let property in productCategory) {
              expect(dbProductCat).to.have.property(property, productCategory[property]);
            }
            done();
          })
          .catch(err => done(err));
      }); //is saved in database

      after(done => api.cleanup(productCategory, done));

    }); //valid category

    describe('empty name', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.name = '';
        api.create(productCategory, res => {
          response = res;
          done();
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      xit('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(productCategory, done));

    }); //empty name

    describe('name longer than 15 chars in length', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.name = 'This name is longer than 15 characters';
        api.create(productCategory, res => {
          response = res;
          done();
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      xit('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(productCategory, done));

    }); //name longer than 15 chars in length

    describe('name shorter than 3 chars in length', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.name = 'a';
        api.create(productCategory, res => {
          response = res;
          done();
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      xit('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(productCategory, done));

    }); //name shorter than 3 chars in length

    describe('duplicate name', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let dupProductCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory, () => {
          api.create(dupProductCategory, res => {
            response = res;
            done();
          });
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      xit('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(productCategory, done));

    }); //duplicate name

    describe('description longer than 100 chars in length', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.description = 'This is a very long description. This ' +
        'is to check to see if the description can not be longer than 100 ' +
        'characters. This is the end of the description.';
        api.create(productCategory, res => {
          response = res;
          done();
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      xit('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(productCategory, done));

    }); //description longer than 100 chars in length

  }); //unauthenticated create request with

  describe('unauthenticated get request with', () => {

    describe('no parameters', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.list(res => {
          response = res;
          done();
        });
      });

      it('lists all categories in the database', done => {
        let firstProdCat = response.body[0];
        for (let property in firstProdCat) {
          expect(productCategory).to.have.property(property);
        }
        ProductCategory.tableCount()
          .then(table => {
            expect(response.body.length).to.equal(+table.count);
            done();
          });
      }); //lists all categories in the database

    }); //no parameters

    describe('valid category id', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory, () => {
          api.get(productCategory.id, res => {
            response = res;
            done();
          });
        });
      });

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      }); //returns success status

      it('returns the expected category', done => {
        expect(response.body.id).to.equal(productCategory.id);
        done();
      }); //returns the expected category

      after(done => api.cleanup(productCategory,done));

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(done => {
        api.get('stringid', res => {
          response = res;
          done();
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns not found status

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;
      let uniqueId;

      before(done => {
        api.create(productCategory, () => {
          uniqueId = productCategory.id;
          api.delete(productCategory.id, () => {
            api.get(uniqueId, res => {
              response = res;
              done();
            });
          });
        });
      });

      it('returns not found status', done => {
        expect(response.status).to.equal(404);
        done();
      }); //returns not found status

    }); //category id not in database

    describe('valid search string', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let productCategory2 = new ProductCategory(productCatTemplate);
      let productCategories = [productCategory, productCategory2];
      let response;

      before(done => {
        api.create(productCategory, () => {
          productCategory2.name += '2';
          api.create(productCategory2, () => {
            api.search(productCatTemplate.name, res => {
              response = res;
              done();
            });
          });
        });
      });

      it('returns a list of categories', () => {
        let firstProdCat = response.body[0];
        for (let property in firstProdCat) {
          expect(productCategory).to.have.property(property);
        }
        for (let i=0; i < response.body.length; i++) {
          expect(response.body[i]).to.deep.equal(productCategories[i]);
        }
      }); //returns a list of categories in alphabetical order

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      }); //returns success status

      after(done => {
        ProductCategory.remove(productCategory.id)
          .then(ProductCategory.remove(productCategory2.id))
          .then(() => done())
          .catch((err) => done(err));
      });

    }); //valid search string
    describe('empty search string', () => {
      let response;

      before(done => {
        api.search('', res => {
          response = res;
          done();
        });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      xit('returns validation message', () => {
      }); //returns validation message

    }); //empty search string

    describe('search string with no hits', () => {
      let response;

      before(done => {
        api.search('ZZTestReserved', res => {
          response = res;
          done();
        });
      });

      xit('returns success status', () => {
      }); //returns success status
      xit('returns an empty object', () => {
      }); //returns an empty object
    }); //invalid search string
  }); //unauthenticated get request with
  describe('unauthenticated update request with', () => {
    describe('valid category', () => {
      xit('returns success status', () => {
      }); //returns success status
      xit('returns category details', () => {
      }); //returns category details
      xit('is updated in database', () => {
      }); //is updated in database
      xit('only updates specified record', () => {
      }); //only updates specified record
    }); //valid category
    describe('empty category name', () => {
      xit('returns invalid status', () => {
      }); //returns invalid status
      xit('returns validation message', () => {
      }); //returns validation message
    }); //empty category name
    describe('category name longer than 15 chars in length', () => {
      xit('returns invalid status', () => {
      }); //returns invalid status
      xit('returns validation message', () => {
      }); //returns validation message
    }); //category name longer than 15 chars in length
    describe('category name shorter than 3 chars in length', () => {
      xit('returns invalid status', () => {
      }); //returns invalid status
      xit('returns validation message', () => {
      }); //returns validation message
    }); //category name shorter than 3 chars in length
    describe('duplicate category name', () => {
      xit('returns invalid status', () => {
      }); //returns invalid status
      xit('returns validation message', () => {
      }); //returns validation message
    }); //duplicate category name
    describe('description longer than 100 chars in length', () => {
      xit('returns invalid status', () => {
      }); //returns invalid status
      xit('returns validation message', () => {
      }); //returns validation message
    }); //description longer than 100 chars in length
  }); //unauthenticated update request with
  describe('unauthenticated delete request with', () => {
    describe('valid category id', () => {
      xit('returns success status', () => {
      }); //returns success status
      xit('returns category details', () => {
      }); //returns category details
      xit('is deleted from database', () => {
      }); //is deleted from database
    }); //valid category id
    describe('invalid category id', () => {
      xit('returns not found status', () => {
      }); //returns not found status
    }); //invalid category id
  }); //unauthenticated delete request with
}); //Product category model unit tests
