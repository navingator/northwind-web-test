'use strict';
let path = require('path');
let chai = require('chai');
let chaiHttp = require('chai-http');

let Product = require(path.resolve('./app/models/product.model.js'));

chai.use(chaiHttp);

module.exports = function(app) {
  let create = function(product, cb) {
    chai.request(app)
      .post('/api/products')
      .send(product)
      .end((err,res) => {
        product.id = res.body.id;
        cb(res);
      });
  };

  let cleanup = function(product, done) {
    if (product.id) {
      Product.delete(product.id)
        .then(() => done())
        .catch(err => done(err));
    } else {
      done();
    }
  };

  return {
    create: create,
    cleanup: cleanup
  };
};
