'use strict';

var expect = require('chai').expect,
    SortedMap = require('../../lib/shien').collection.SortedMap;

describe('collection.SortedMap', function () {

    describe('#get', function () {

        it('should return `undefined` when specified key does not exist', function () {
            var map = new SortedMap;
            expect(map.get('doesn\'t exist')).to.be.undefined;
        });

        it('should return correct value when specified key existed', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            expect(map.get('hello')).to.equal('world');
        });

    });

    describe('#put', function () {

        it('should put default value if the value is not specified', function () {
            var map = new SortedMap(7);
            map.put('seven');
            expect(map.get('seven')).to.equal(7);
        });

        it('should add new item if specified key does not exist', function () {
            var map = new SortedMap;
            expect(map.length).to.equal(0);
            map.put('one', 1);
            expect(map.get('one')).to.equal(1);
            expect(map.length).to.equal(1);
        });

        it('should replace old item if specified key existed', function () {
            var map = new SortedMap;
            map.put('one', 2);
            map.put('one', 1);
            expect(map.get('one')).to.equal(1);
            expect(map.length).to.equal(1);
        });

        it('should return old value if specified key existed', function () {
            var map = new SortedMap;
            map.put('one', 2);
            expect(map.put('one', 1)).to.equal(2);
        });

    });

    describe('#remove', function () {

        it('should do nothing if specified key does not exist', function () {
            var map = new SortedMap;
            expect(map.remove('hello')).to.be.undefined;
            expect(map.length).to.equal(0);
        });

        it('should remove item if specified key existed', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            map.remove('hello');
            expect(map.get('hello')).to.be.undefined;
            expect(map.length).to.equal(0);
        });

        it('should return old value if specified key existed', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            expect(map.remove('hello')).to.equal('world');
        });

    });

    describe('#hasKey', function () {

        it('should return `true` if specified key existed', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            expect(map.hasKey('hello')).to.be.true;
        });

        it('should return `false` if specified key does not exist', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            expect(map.hasKey('hi')).to.be.false;
        });

    });

    describe('#hasValue', function () {

        it('should return `true` if specified value existed', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            expect(map.hasValue('world')).to.be.true;
        });

        it('should return `false` if specified value does not exist', function () {
            var map = new SortedMap;
            map.put('hello', 'world');
            expect(map.hasValue('everyone')).to.be.false;
        });

    });

    describe('#allKeys', function () {

        it('should concatenate all keys in adding order (replacing not counted)', function () {
            var map = new SortedMap;
            map.put('one', 4);
            map.put('two', 3);
            map.put('three', 2);
            map.put('two', 1);
            expect(map.allKeys(',')).to.equal('one,two,three');
        });

    });

    describe('#each', function () {

        it('should iterate through all values and keys', function () {
            var map = new SortedMap,
                keys = [],
                values = [];

            map.put('one', 1);
            map.put('two', 2);
            map.put('three', 3);

            map.each(function (val, key) {
                keys.push(key);
                values.push(val);
            });

            expect(keys).to.be.deep.equal([ 'one', 'two', 'three' ]);
            expect(values).to.be.deep.equal([ 1, 2, 3 ]);
        });

    });

    describe('#eachKey', function () {

        it('should iterate through all keys', function () {
            var map = new SortedMap,
                keys = [];

            map.put('one', 1);
            map.put('two', 2);
            map.put('three', 3);

            map.eachKey(function (key) {
                keys.push(key);
            });

            expect(keys).to.be.deep.equal([ 'one', 'two', 'three' ]);
        });

    });

    describe('#eachValue', function () {

        it('should iterate through all values', function () {
            var map = new SortedMap,
                values = [];

            map.put('one', 1);
            map.put('two', 2);
            map.put('three', 3);

            map.eachValue(function (val) {
                values.push(val);
            });

            expect(values).to.be.deep.equal([ 1, 2, 3 ]);
        });

    });

});
