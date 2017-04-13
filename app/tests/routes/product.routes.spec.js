'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test';

let appRoot = require('app-root-path');
let chai = require('chai');
let expect = chai.expect;
let app = require(appRoot + '/server');
let User = require(appRoot + '/app/models/user.model');
let Product = require(appRoot + '/app/models/product.model');
let ProductCategory = require(appRoot + '/app/models/product-category.model');
let userApi = require('./util/user-api.util')(app);
let agent = userApi.agent;
let productApi = require('./util/product-api.util')(app, agent);
let categoryApi = require('./util/product-category-api.util')(app, agent);

/**
 * Unit Tests
 * NOTE: The default state for user is admin user. If testing non-admin, explicitly signin
 *          to regUser before the test and sign back into AdminUser afterwards.
 */

// Use as template - do NOT use directly in functions, particularly if they have side effects
let productTemplate = new Product({
  name: 'zzUnitTestProduct',
  unitPrice: 12.50,
  unitsInStock: 4,
  discontinued: false
}); // initialized in the first before call

// Use as template - do NOT use directly in functions, particularly if they have side effects
let userTemplate = new User({
  firstName: 'Unit',
  lastName: 'zzTesting',
  username: 'zzUnitTesting',
  password: 'password1'
});

describe('Product Routes Unit Tests', () => {
  let adminUser;
  let regUser;

  before(() => {
    let category = new ProductCategory({
      name: 'zzUnit',
      description: 'Unit test product category - Should be deleted if seen outside of testing',
      picture: './somewhere-out-there'
    });

    adminUser = new User(userTemplate);
    regUser = new User(userTemplate);
    regUser.username = userTemplate.username + '1'; // maintain unique username

    return userApi.create(regUser)
      .then(() => userApi.signout())
      .then(() => userApi.create(adminUser))
      .then(() => userApi.makeAdmin())
      .then(() => productApi.cleanup())
      .then(() => categoryApi.cleanup())
      .then(() => categoryApi.create(category))
      .then(res => productTemplate.categoryId = res.body.id);
  });

  after(() => {
    return productApi.cleanup()
      .then(() => categoryApi.cleanup())
      .then(() => userApi.signout())
      .then(() => User.delete(adminUser.id))
      .then(() => User.delete(regUser.id));
  });

  describe('authenticated create request with', () => {

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
        for (let property in product) {
          if (property !== 'categoryName') {
            expect(response.body).to.have.property(property, product[property]);
          }
        }
      });

      it('is saved in database', () => {
        return Product.read(response.body.id)
          .then(dbProduct => {
            for (let property in dbProduct) {
              if (property !== 'categoryName') {
                expect(response.body).to.have.property(property, dbProduct[property]);
              }
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

  describe('authenticated get request with', () => {

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
          if (property !== 'categoryName') {
            expect(response.body).to.have.property(property, product[property]);
          }
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

      it('returns error', () => {
        expect(response.body).to.have.property('code', 4101);
        expect(response.body).to.have.property('message', 'ID not found.');
      });
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

  describe('authenticated update request', () => {

    describe('admin', () => {

      describe('with ownership of the product and', () => {

        describe('a valid product', () => {

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

        describe('an empty name', () => {

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

        describe('a name longer than 40 characters', () => {

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

        describe('an invalid category id', () => {

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

        describe('a duplicate name', () => {

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

      describe('without ownership of the product and', () => {

        describe('a valid product', () => {

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
      });
    });

    describe('non-admin', () => {

      before(() => {
        return userApi.signout()
        .then(() => userApi.signin(regUser));
      });

      after(() => {
        return userApi.signout()
        .then(() => userApi.signin(adminUser));
      });

      describe('with ownership of the product and', () => {

        describe('a valid product', () => {

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
      });

      describe('without ownership of the product and', () => {

        describe('a valid product', () => {

          let product;
          let productUpdate;
          let response;

          before(() => {
            product = new Product(productTemplate);
            productUpdate = new Product({
              name: productTemplate.name + '2',
              categoryId: productTemplate.categoryId,
              unitPrice: 1,
              unitsInStock: 200,
              discontinued: true
            });
            return userApi.signout()
            .then(() => userApi.signin(adminUser))
            .then(() => productApi.create(product))
            .then(() => productUpdate.id = product.id)
            .then(() => userApi.signout())
            .then(() => userApi.signin(regUser))
            .then(() => productApi.update(productUpdate))
            .then(res => response = res);
          });

          it('returns unauthorized status status', () => expect(response.status).to.be.equal(403));

          after(() => {
            return userApi.signout()
            .then(() => userApi.signin(adminUser))
            .then(() => productApi.cleanup());
          });
        });
      });
    });
  });

  describe('authenticated delete request with', () => {

    describe('admin', () => {

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
            if (property !== 'categoryName') {
              expect(response.body).to.have.property(property, product[property]);
            }
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

        it('returns error', () => {
          expect(response.body).to.have.property('code', 4101);
          expect(response.body).to.have.property('message', 'ID not found.');
        });
      });
    });

    describe('non-admin', () => {

      before(() => {
        return userApi.signout()
        .then(() => userApi.signin(regUser));
      });

      after(() => {
        return userApi.signout()
        .then(() => userApi.signin(adminUser));
      });

      describe('with ownership of the product and', () => {

        describe('valid product', () => {
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
              if (property !== 'categoryName') {
                expect(response.body).to.have.property(property, product[property]);
              }
            }
          });

          it('is deleted from database', () => {
            productApi.get(product.id)
            .then(res => expect(res.status).to.equal(404));
          });
        });
      });

      describe('without ownership of the product and', () => {

        describe('a valid product', () => {

          let product;
          let response;

          before(() => {
            product = new Product(productTemplate);
            return userApi.signout()
            .then(() => userApi.signin(adminUser))
            .then(() => productApi.create(product))
            .then(() => userApi.signout())
            .then(() => userApi.signin(regUser))
            .then(() => productApi.delete(product.id))
            .then(res => response = res);
          });

          it('returns unauthorized status status', () => expect(response.status).to.be.equal(403));

          after(() => {
            return userApi.signout()
            .then(() => userApi.signin(adminUser))
            .then(() => productApi.cleanup());
          });
        });
      });
    });
  });

  describe('authenticated search request with', () => {
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
        return productApi.search({term: productTemplate.name})
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));

      it('returns the correct number of products', () => expect(response.body.length).to.equal(2));
    });

    describe('valid search string for nonexistant products', () => {

      let response;
      before(() => {
        return productApi.search({term: productTemplate.name + 'invalid'})
          .then(res => response = res);
      });

      it('returns success status', () => expect(response.status).to.equal(200));
      it('returns an empty array', () => expect(response.body).to.have.property('length', 0));
    });
  });

  describe('unauthenticated', () => {
    before(() => userApi.signout());

    after(() => userApi.signin(adminUser));

    it('create request should return unauthenticated status', () => {
      let product = new Product(productTemplate);
      return productApi.create(product)
        .then(res => expect(res.status).to.equal(401));
    });
    it('get all products request should return unauthenticated status', () => {
      return productApi.list()
        .then(res => expect(res.status).to.equal(401));
    });
    it('get product request should return unauthenticated status', () => {
      return productApi.get(90)
        .then(res => expect(res.status).to.equal(401));
    });
    it('delete product request should return unauthenticated status', () => {
      return productApi.delete(90)
        .then(res => expect(res.status).to.equal(401));
    });
    it('update product should return unauthenticated status', () => {
      let product = new Product(productTemplate);
      product.id = 90;
      return productApi.update(product)
        .then(res => expect(res.status).to.equal(401));
    });
    it('search products should return unauthenticated status', () => {
      return productApi.search({term: 'zzUnit'})
        .then(res => expect(res.status).to.equal(401));
    });
  });
});
