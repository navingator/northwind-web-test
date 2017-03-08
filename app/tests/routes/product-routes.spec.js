'use strict';
/*jshint expr: true*/
process.env.NODE_ENV='test'; // TODO do this globally for tests

let path = require('path');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let app = require(path.resolve('./server'));
// let Product = require(path.resolve('./app/models/product.model.js'));
chai.use(chaiHttp);

/**
 * Unit Tests
 */
 /**
  * Unit Tests
  */
 describe('Product Routes Unit Tests', () => {
   xit('should successfully create a new product', done => {
     done();
   });
   xit('should fail to create a product without a name', done => {
     done();
   });
   xit('should fail to create a product without a category ID', done => {
     done();
   });
   xit('should get a previously created product', done => {
     done();
   });
   xit('should retrieve a number of created products', done => {
     done();
   });
   xit('should retrieve products from a specified category', done => {
     done();
   });
   xit('should fail to retrieve products from a category that does not exist', done => {
     done();
   });
   xit('should fail to retrieve a product without a user session', done => {
     done();
   });
   xit('should fail to retrieve a product without an authorized user', done => {
     done();
   });
   xit('should fail to retrieve a product that does not exist', done => {
     done();
   });
   xit('should update a product', done => {
     done();
   });
   xit('should fail to update a product without an authorized user', done => {
     done();
   });
   xit('should fail to update a product that does not exist', done => {
     done();
   });
   xit('should delete a previously created product', done => {
     done();
   });
   xit('should fail to delete a product that does not exist', done => {
     done();
   });
   xit('should fail to delete a product without an authorized user', done => {
     done();
   });
 });
