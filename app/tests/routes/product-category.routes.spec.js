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

let zzUnit = 'zzUnit'; // TODO place this in a central file and require it in all tests

 /* Set up a test product category - do NOT use directly in functions */
let productCatTemplate = new ProductCategory({
  name: zzUnit + 'ProdCat',
  description: 'Unit test product category - Should be deleted if seen outside of testing',
  picture: './somewhere-out-there'
});

describe('ProductCat unit test', () => {

  before(done => api.cleanup(done));

  describe('unauthenticated create request with', () => {

    describe('valid category', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(res => {
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
        ProductCategory.read(productCategory.id)
          .then(dbProductCat => {
            for (let property in productCategory) {
              expect(dbProductCat).to.have.property(property, productCategory[property]);
            }
            done();
          })
          .catch(err => done(err));
      }); //is saved in database

      after(done => api.cleanup(done));

    }); //valid category

    describe('empty name', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.name = '';
        api.create(productCategory)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //empty name

    describe('name longer than 15 chars in length', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.name = 'This name is longer than 15 characters';
        api.create(productCategory)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //name longer than 15 chars in length

    describe('name shorter than 3 chars in length', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.name = 'a';
        api.create(productCategory)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //name shorter than 3 chars in length

    describe('duplicate name', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let dupProductCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            return api.create(dupProductCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //duplicate name

    describe('description longer than 100 chars in length', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        productCategory.description = 'This is a very long description. This ' +
        'is to check to see if the description can not be longer than 100 ' +
        'characters. This is the end of the description.';
        api.create(productCategory)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //description longer than 100 chars in length

  }); //unauthenticated create request with

  describe('unauthenticated get request with', () => {

    describe('no parameters', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.list()
          .then(res => {
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
        api.create(productCategory)
          .then(() => {
            return api.get(productCategory.id);
          })
          .then(res => {
            response = res;
            done();
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

      after(done => api.cleanup(done));

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(done => {
        api.get('stringid')
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns not found status

      it('returns validation message', () => {
      }); //returns validation message

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;
      let uniqueId;

      before(done => {
        api.create(productCategory)
          .then(() => {
            uniqueId = productCategory.id;
            return api.delete(productCategory.id);
          })
          .then(() => {
            return api.get(uniqueId);
          })
          .then(res => {
            response = res;
            done();
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
        api.create(productCategory)
          .then(() => {
            productCategory2.name += '2';
            return api.create(productCategory2);
          })
          .then(() => {
            return api.search(productCatTemplate.name);
          })
          .then(res => {
            response = res;
            done();
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

      after(done => api.cleanup(done));

    }); //valid search string
    describe('empty search string', () => {
      let response;

      before(done => {
        api.search('')
          .then(res => {
            response = res;
            done();
          })
          .catch(err => console.log(err.message));
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

    }); //empty search string

    describe('search string with no hits', () => {
      let response;

      before(done => {
        api.search(zzUnit)
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      }); //returns success status

      it('returns an empty object', done => {
        expect(response.body.length).to.equal(0);
        done();
      }); //returns an empty object

    }); //invalid search string

  }); //unauthenticated get request with

  describe('unauthenticated update request with', () => {

    describe('valid category', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            productCategory.name = zzUnit + 'UpPC';
            productCategory.picture = './somewhere-else';
            return api.update(productCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      }); //returns success status

      it('returns category details', done => {
        expect(response.body.name).to.equal(productCategory.name);
        expect(response.body.picture).to.equal(productCategory.picture);
        expect(response.body.description).to.equal(productCatTemplate.description);
        done();
      }); //returns category details

      it('is updated in database', done => {
        api.get(productCategory.id)
          .then(res => {
            for (let property in res.body) {
              expect(res.body).to.have.property(property, productCategory[property]);
            }
            done();
          });
      }); //is updated in database

      after(done => api.cleanup(done));

    }); //valid category

    describe('empty category name', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            delete productCategory.name;
            return api.update(productCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //empty category name

    describe('category name that is longer than 15 letters', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            productCategory.name = zzUnit + 'NameLongerThan15Letters';
            return api.update(productCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //category name that is longer than 15 letters
    describe('category name that is shorter than 3 letters', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            productCategory.name = 'zz';
            return api.update(productCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //category name that is shorter than 3 letters

    describe('duplicate category name', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let productCategory2 = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            productCategory2.name += '2';
            return api.create(productCategory2);
          })
          .then(() => {
            productCategory.name = productCategory2.name;
            return api.update(productCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });


      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //duplicate category name

    describe('description longer than 100 characters', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            productCategory.description = 'This is a very long description. This ' +
            'is to check to see if the description can not be longer than 100 ' +
            'characters. This is the end of the description.';
            return api.update(productCategory);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns invalid status

      it('returns validation message', () => {
      }); //returns validation message

      after(done => api.cleanup(done));

    }); //description longer than 100 characters

  }); //unauthenticated update request with
  describe('unauthenticated delete request with', () => {

    describe('valid category id', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            return api.delete(productCategory.id);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns success status', done => {
        expect(response.status).to.equal(200);
        done();
      }); //returns success status

      it('returns category details', () => {
        for (let property in response.body) {
          expect(response.body).to.have.property(property, productCategory[property]);
        }
      }); //returns category details

      it('is deleted from database', done => {
        ProductCategory.read(productCategory.id)
          .then(() => done(new Error('Should not have found anything')))
          .catch(err => {
            expect(err.code).to.equal(0);
            done();
          });
      }); //is deleted from database

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(done => {
        api.delete('productCategory.id')
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns invalid status', done => {
        expect(response.status).to.equal(400);
        done();
      }); //returns not found status

      it('returns validation message', () => {
      }); //returns validation message

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(productCatTemplate);
      let response;

      before(done => {
        api.create(productCategory)
          .then(() => {
            return api.delete(productCategory.id);
          })
          .then(() => {
            return api.delete(productCategory.id);
          })
          .then(res => {
            response = res;
            done();
          });
      });

      it('returns not found status', done => {
        expect(response.status).to.equal(404);
        done();
      }); //returns not found status

    }); //category id not in database

  }); //unauthenticated delete request with

}); //Product category model unit tests
