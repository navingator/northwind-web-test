'use strict';

/*jshint expr: true*/
process.env.NODE_ENV='test';

/* Import dependencies */
let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));
let api = require('./util/product-category-api.util')(app);

/* Set up a test product category - do NOT use directly in functions */
let namePrefix = 'zzUnit';

let categoryTemplate = new ProductCategory({
  name: namePrefix,
  description: 'Unit test product category - Should be deleted if seen outside of testing',
  picture: './somewhere-out-there'
});

describe('Product Category unit test', () => {

  before(api.cleanup);

  describe('unauthenticated create request with', () => {

    describe('valid category', () => {

      let productCategory;
      let response;
      before(() => {
        productCategory = new ProductCategory(categoryTemplate);
        return api.create(productCategory)
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns category details including new id', () => {
        expect(response.body).to.have.property('id');
        productCategory.id = response.body.id;
        for (let property in productCategory) {
          expect(response.body).to.have.property(property, productCategory[property]);
        }
      }); //returns category details including new id

      it('is saved in database', () => {
        console.log(productCategory.id);
        return ProductCategory.read(productCategory.id)
          .then(dbProductCat => {
            for (let property in productCategory) {
              expect(dbProductCat).to.have.property(property, productCategory[property]);
            }
          });
      }); //is saved in database

      after(api.cleanup);

    }); //valid category

    describe('empty name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.name = '';
        return api.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(api.cleanup);

    }); //empty name

    describe('name longer than 15 chars in length', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.name = 'This name is longer than 15 characters';
        return api.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      });

      after(api.cleanup);

    }); //name longer than 15 chars in length

    describe('name shorter than 3 chars in length', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.name = 'a';
        return api.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(api.cleanup);

    }); //name shorter than 3 chars in length

    describe('duplicate name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let dupProductCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => api.create(dupProductCategory))
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3010);
        expect(response.body).to.have.property('message', 'Category name must be unique.');
      }); //returns validation message

      after(api.cleanup);

    }); //duplicate name

    describe('description longer than 100 chars in length', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.description = 'This is a very long description. This ' +
        'is to check to see if the description can not be longer than 100 ' +
        'characters. This is the end of the description.';
        return api.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3030);
        expect(response.body).to.have.property('message', 'Category description must be less than 100 characters.');
      }); //returns validation message

      after(api.cleanup);

    }); //description longer than 100 chars in length

  }); //unauthenticated create request with

  describe('unauthenticated get request with', () => {

    describe('no parameters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.list()
          .then(res => response = res);
      });

      it('lists all categories in the database', () => {
        let firstProdCat = response.body[0];
        for (let property in firstProdCat) {
          expect(productCategory).to.have.property(property);
        }
        ProductCategory.tableCount()
          .then(count => expect(response.body.length).to.equal(count));
      }); //lists all categories in the database

    }); //no parameters

    describe('valid category id', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => api.get(productCategory.id))
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns the expected category', () => expect(response.body.id).to.equal(productCategory.id));

      after(api.cleanup);

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(() => {
        return api.get('stringid')
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 4000);
        expect(response.body).to.have.property('message', 'ID is invalid.');
      }); //returns validation message

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;
      let uniqueId;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            uniqueId = productCategory.id;
            return api.delete(productCategory.id);
          })
          .then(() => api.get(uniqueId))
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));

    }); //category id not in database

    describe('valid search string', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let productCategory2 = new ProductCategory(categoryTemplate);
      let productCategories = [productCategory, productCategory2];
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            productCategory2.name += '2';
            return api.create(productCategory2);
          })
          .then(() => api.search(categoryTemplate.name))
          .then(res => response = res);
      });

      it('returns a list of categories', () => {
        //TODO
        let firstProdCat = response.body[0];
        for (let property in firstProdCat) {
          expect(productCategory).to.have.property(property);
        }
        for (let i=0; i < response.body.length; i++) {
          expect(response.body[i]).to.deep.equal(productCategories[i]);
        }
      }); //returns a list of categories in alphabetical order

      it('returns success status', () => expect(response.status).to.equal(200));

      after(api.cleanup);

    }); //valid search string
    describe('empty search string', () => {
      let response;

      before(() => {
        return api.search('')
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

    }); //empty search string

    describe('search string with no hits', () => {
      let response;

      before(() => {
        return api.search(namePrefix)
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));

    }); //invalid search string

  }); //unauthenticated get request with

  describe('unauthenticated get products request with', () => {

    describe('valid category id parameter', () => {

      let products;
      let response;

      xit('returns success status', () => {
        expect(response.status).to.equal(200);
      });

      xit('returns expected products', () => {
        expect(products).to.be.an('object');
      });
    });

    describe('non-existant category id parameter', () => {

      let response;

      xit('returns not found status', () => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('unauthenticated update request with', () => {

    describe('valid category', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            productCategory.name = namePrefix + 'UpPC';
            productCategory.picture = './somewhere-else';
            return api.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns category details', () => {
        expect(response.body.name).to.equal(productCategory.name);
        expect(response.body.picture).to.equal(productCategory.picture);
        expect(response.body.description).to.equal(categoryTemplate.description);

      }); //returns category details

      it('is updated in database', () => {
        api.get(productCategory.id)
          .then(res => {
            for (let property in res.body) {
              expect(res.body).to.have.property(property, productCategory[property]);
            }
          });
      }); //is updated in database

      after(api.cleanup);

    }); //valid category

    describe('empty category name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            delete productCategory.name;
            return api.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3000);
        expect(response.body).to.have.property('message', 'Category name cannot be empty.');
      }); //returns validation message

      after(api.cleanup);

    }); //empty category name

    describe('category name that is longer than 15 letters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            productCategory.name = namePrefix + 'NameLongerThan15Letters';
            return api.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(api.cleanup);

    }); //category name that is longer than 15 letters
    describe('category name that is shorter than 3 letters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            productCategory.name = 'zz';
            return api.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(api.cleanup);

    }); //category name that is shorter than 3 letters

    describe('duplicate category name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let productCategory2 = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            productCategory2.name += '2';
            return api.create(productCategory2);
          })
          .then(() => {
            productCategory.name = productCategory2.name;
            return api.update(productCategory);
          })
          .then(res => response = res);
      });


      it('returns invalid status', () => expect(response.status).to.equal(400)); //returns invalid status

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3010);
        expect(response.body).to.have.property('message', 'Category name must be unique.');
      }); //returns validation message

      after(api.cleanup);

    }); //duplicate category name

    describe('description longer than 100 characters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => {
            productCategory.description = 'This is a very long description. This ' +
            'is to check to see if the description can not be longer than 100 ' +
            'characters. This is the end of the description.';
            return api.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3030);
        expect(response.body).to.have.property('message', 'Category description must be less than 100 characters.');
      }); //returns validation message

      after(api.cleanup);

    }); //description longer than 100 characters

  }); //unauthenticated update request with
  describe('unauthenticated delete request with', () => {

    describe('valid category id', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => api.delete(productCategory.id))
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns category details', () => {
        for (let property in response.body) {
          expect(response.body).to.have.property(property, productCategory[property]);
        }
      }); //returns category details

      it('is deleted from database', () => {
        return api.get(productCategory.id)
          .then(res => expect(res.status).to.equal(404));
      }); //is deleted from database

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(() => {
        return api.delete('productCategory.id')
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 4000);
        expect(response.body).to.have.property('message', 'ID is invalid.');
      }); //returns validation message

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return api.create(productCategory)
          .then(() => api.delete(productCategory.id)) // Delete the ID, but ensure the ID does not exist
          .then(() => api.delete(productCategory.id)) // Perform the test
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));

    }); //category id not in database

  }); //unauthenticated delete request with
  after(api.cleanup);

}); //Product category model unit tests
