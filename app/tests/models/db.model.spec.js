'use strict';

process.env.NODE_ENV='test';

let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let rewire = require('rewire');

require(path.resolve('./server'));
let db = rewire(path.resolve('./app/models/db.model'));

describe('Database Model Unit Tests', () => {
  describe('trim values from database with', () => {
    let trimValues = db.__get__('trimValues'); // get private function from rewire
    describe('no values to trim', () => {
      let values;
      let newValues;
      before(() => {
        values = {
          prop1: 'a',
          prop2: 'battle',
          prop3: '%/\\',
          prop4: 'A battle %/\\',
          prop5: 12345,
        };
        newValues = trimValues(values);
      });

      it('will return a copy of the array without modifications', () => {
        for(let prop in values) {
          expect(newValues).to.have.property(prop, values[prop]);
        }
      });


    });

    describe('some values to trim', () => {
      let values;
      let newValues;
      before(() => {
        values = {
          prop1: '  a   ',
          prop2: 'battle   ',
          prop3: '   %/\\',
          prop4: 'Don\'t touch me!',
          prop5: '       ',
          prop6: '',
          prop7: 12345
        };
        newValues = trimValues(values);
      });
      it('will trim values', () => {
        expect(newValues.prop1).to.equal('a');
        expect(newValues.prop2).to.equal('battle');
        expect(newValues.prop3).to.equal('%/\\');
      });
      it('will null values that are empty after trim', () => {
        expect(newValues.prop5).to.equal(null);
        expect(newValues.prop6).to.equal(null);
      });
      it('will not touch values that do not need to be trimmed', () => {
        expect(newValues.prop4).to.equal(values.prop4);
      });
      it('will not change the values in the original array', () => {
        let oldValues = {
          prop1: '  a   ',
          prop2: 'battle   ',
          prop3: '   %/\\',
          prop4: 'Don\'t touch me!',
          prop5: '       ',
          prop6: ''
        };
        for(let prop in oldValues) {
          expect(oldValues).to.have.property(prop, values[prop]);
        }
      });
    });
  });
});
