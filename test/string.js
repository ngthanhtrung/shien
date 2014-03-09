'use strict';

var expect = require('chai').expect,
    shien = require('../lib/shien');

describe('string', function () {

    describe('.random', function () {

        it('should return a string which contains only alphanumeric characters', function () {
            var s = shien.string.random();
            expect(/[^a-zA-Z0-9]/.test(s)).to.be.false;
        });

        it('should return a string with specified length', function () {
            var s = shien.string.random(10);
            expect(s.length).to.equal(10);
        });
    });

});
