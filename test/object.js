'use strict';

var expect = require('chai').expect,
    shien = require('../lib/shien');

describe('object', function () {

    describe('.isEmpty', function () {

        it('should return `true` for empty object', function () {
            var ret = shien.object.isEmpty({});
            expect(ret).to.be.true;
        });

        it('should return `false` for not empty object', function () {
            var ret = shien.object.isEmpty({ empty: false });
            expect(ret).to.be.false;
        });

    });

    describe('.get', function () {

        var obj = {
            foo: 'bar',
            bar: {
                hello: 'world',
                welcome: 'you'
            },
            qux: {
                arr: [ 30, 10 ]
            }
        };

        it('should return `undefined` if deep property is not found', function () {
            var ret = shien.object.get(obj, 'foo.bar'),
                ret2 = shien.object.get(obj, 'bar.getOut');

            expect(ret).to.be.undefined;
            expect(ret2).to.be.undefined;
        });

        it('should return the object itself if look-up path is empty', function () {
            var ret = shien.object.get(obj, '');
            expect(ret).to.equal(obj);
        });

        it('should return property looked up by path', function () {
            var ret = shien.object.get(obj, 'bar.welcome'),
                ret2 = shien.object.get(obj, 'qux.arr.0'),
                ret3 = shien.object.get(obj, 'qux.arr[1]');

            expect(ret).to.equal('you');
            expect(ret2).to.equal(30);
            expect(ret3).to.equal(10);
        });

    });

});
