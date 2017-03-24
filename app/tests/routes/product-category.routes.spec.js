'use strict';

/*jshint expr: true*/
process.env.NODE_ENV='test';

/* Import dependencies */
let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let app = require(path.resolve('./server'));
let ProductCategory = require(path.resolve('./app/models/product-category.model.js'));
let Product = require(path.resolve('./app/models/product.model.js'));
let categoryApi = require('./util/product-category-api.util')(app);
let productApi = require('./util/product-api.util')(app);

/* Set up a test product category - do NOT use directly in functions */
let namePrefix = 'zzUnit';

let categoryTemplate = new ProductCategory({
  name: namePrefix,
  description: 'Unit test product category - Should be deleted if seen outside of testing',
  picture: './somewhere-out-there'
});

describe('Product Category unit test', () => {

  before(categoryApi.cleanup);

  describe('unauthenticated create request with', () => {

    describe('valid category', () => {

      let productCategory;
      let response;
      before(() => {
        productCategory = new ProductCategory(categoryTemplate);
        return categoryApi.create(productCategory)
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
        return ProductCategory.read(productCategory.id)
          .then(dbProductCat => {
            for (let property in productCategory) {
              expect(dbProductCat).to.have.property(property, productCategory[property]);
            }
          });
      }); //is saved in database

      after(categoryApi.cleanup);

    }); //valid category

    describe('empty name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.name = '';
        return categoryApi.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3000);
        expect(response.body).to.have.property('message', 'Category name cannot be empty.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //empty name

    describe('name longer than 15 chars in length', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.name = 'This name is longer than 15 characters';
        return categoryApi.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      });

      after(categoryApi.cleanup);

    }); //name longer than 15 chars in length

    describe('name shorter than 3 chars in length', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.name = 'a';
        return categoryApi.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //name shorter than 3 chars in length

    describe('duplicate name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let dupProductCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => categoryApi.create(dupProductCategory))
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3010);
        expect(response.body).to.have.property('message', 'Category name must be unique.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //duplicate name

    describe('description longer than 100 chars in length', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        productCategory.description = 'This is a very long description. This ' +
        'is to check to see if the description can not be longer than 100 ' +
        'characters. This is the end of the description.';
        return categoryApi.create(productCategory)
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3030);
        expect(response.body).to.have.property('message', 'Category description must be less than 100 characters.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //description longer than 100 chars in length

  }); //unauthenticated create request with

  describe('unauthenticated get request with', () => {

    describe('no parameters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.list()
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
        return categoryApi.create(productCategory)
          .then(() => categoryApi.get(productCategory.id))
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns the expected category', () => expect(response.body.id).to.equal(productCategory.id));

      after(categoryApi.cleanup);

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(() => {
        return categoryApi.get('stringid')
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 4100);
        expect(response.body).to.have.property('message', 'ID is invalid.');
      }); //returns validation message

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;
      let uniqueId;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => {
            uniqueId = productCategory.id;
            return categoryApi.delete(productCategory.id);
          })
          .then(() => categoryApi.get(uniqueId))
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
        return categoryApi.create(productCategory)
          .then(() => {
            productCategory2.name += '2';
            return categoryApi.create(productCategory2);
          })
          .then(() => categoryApi.search(categoryTemplate.name))
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

      after(categoryApi.cleanup);

    }); //valid search string
    describe('empty search string', () => {
      let response;

      before(() => {
        return categoryApi.search('')
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

    }); //empty search string

    describe('search string with no hits', () => {
      let response;

      before(() => {
        return categoryApi.search(namePrefix)
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));

    }); //invalid search string

  }); //unauthenticated get request with

  describe('unauthenticated get products request with', () => {
    let category;

    before(() => {
      let product1 = new Product({
        name: 'zzUnitTestProduct',
        unitPrice: 12.50,
        unitsInStock: 4,
        discontinued: false
      });
      let product2 = new Product(product1);
      product2.name = product1.name + '2';
      category = new ProductCategory(categoryTemplate);
      return categoryApi.create(category)
        .then(() => {
          product1.categoryId = category.id;
          product2.categoryId = category.id;
        })
        .then(() => productApi.create(product1))
        .then(() => productApi.create(product2));
    });

    after(() => {
      return productApi.cleanup()
        .then(categoryApi.cleanup);
    });

    describe('valid category id parameter', () => {

      let response;
      before(() => {
        return categoryApi.getProducts(category.id)
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns expected products', () => expect(response.body).to.have.property('length', 2));
    });

    describe('non-existant category id parameter', () => {

      let response;
      before(() => {
        return categoryApi.getProducts(90)
          .then(res => response = res);
      });

      it('returns not found status', () => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('unauthenticated update request with', () => {

    describe('valid category', () => {
      let productCategory;
      let response;

      before(() => {
        productCategory = new ProductCategory(categoryTemplate);
        return categoryApi.create(productCategory)
          .then(() => {
            productCategory.name = namePrefix + 'UpPC';
            productCategory.picture = './somewhere-else';
            return categoryApi.update(productCategory);
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
        categoryApi.get(productCategory.id)
          .then(res => {
            for (let property in res.body) {
              expect(res.body).to.have.property(property, productCategory[property]);
            }
          });
      }); //is updated in database

      after(categoryApi.cleanup);

    }); //valid category

    describe('empty category name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => {
            delete productCategory.name;
            return categoryApi.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3000);
        expect(response.body).to.have.property('message', 'Category name cannot be empty.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //empty category name

    describe('category name that is longer than 15 letters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => {
            productCategory.name = namePrefix + 'NameLongerThan15Letters';
            return categoryApi.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //category name that is longer than 15 letters
    describe('category name that is shorter than 3 letters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => {
            productCategory.name = 'zz';
            return categoryApi.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3020);
        expect(response.body).to.have.property('message', 'Category name must be between 3 and 15 characters.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //category name that is shorter than 3 letters

    describe('duplicate category name', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let productCategory2 = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => {
            productCategory2.name += '2';
            return categoryApi.create(productCategory2);
          })
          .then(() => {
            productCategory.name = productCategory2.name;
            return categoryApi.update(productCategory);
          })
          .then(res => response = res);
      });


      it('returns invalid status', () => expect(response.status).to.equal(400)); //returns invalid status

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3010);
        expect(response.body).to.have.property('message', 'Category name must be unique.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //duplicate category name

    describe('description longer than 100 characters', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => {
            productCategory.description = 'This is a very long description. This ' +
            'is to check to see if the description can not be longer than 100 ' +
            'characters. This is the end of the description.';
            return categoryApi.update(productCategory);
          })
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 3030);
        expect(response.body).to.have.property('message', 'Category description must be less than 100 characters.');
      }); //returns validation message

      after(categoryApi.cleanup);

    }); //description longer than 100 characters

  }); //unauthenticated update request with
  describe('unauthenticated delete request with', () => {

    describe('valid category id', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => categoryApi.delete(productCategory.id))
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns category details', () => {
        for (let property in response.body) {
          expect(response.body).to.have.property(property, productCategory[property]);
        }
      }); //returns category details

      it('is deleted from database', () => {
        return categoryApi.get(productCategory.id)
          .then(res => expect(res.status).to.equal(404));
      }); //is deleted from database

    }); //valid category id

    describe('invalid category id', () => {
      let response;

      before(() => {
        return categoryApi.delete('productCategory.id')
          .then(res => response = res);
      });

      it('returns invalid status', () => expect(response.status).to.equal(400));

      it('returns validation message', () => {
        expect(response.body).to.have.property('code', 4100);
        expect(response.body).to.have.property('message', 'ID is invalid.');
      }); //returns validation message

    }); //invalid category id

    describe('category id not in database', () => {
      let productCategory = new ProductCategory(categoryTemplate);
      let response;

      before(() => {
        return categoryApi.create(productCategory)
          .then(() => categoryApi.delete(productCategory.id)) // Delete the ID, but ensure the ID does not exist
          .then(() => categoryApi.delete(productCategory.id)) // Perform the test
          .then(res => response = res);
      });

      it('returns not found status', () => expect(response.status).to.equal(404));

    }); //category id not in database

  }); //unauthenticated delete request with
  after(categoryApi.cleanup);

}); //Product category model unit tests
