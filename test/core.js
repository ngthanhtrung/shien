'use strict';

var path = require('path'),
    expect = require('chai').expect,
    shien = require('../lib/shien');

describe('core', function () {

    describe('.load', function () {

        var root = path.join(__dirname, 'assets/core/load');

        it('should return `undefined` if module was not found', function () {
            var notFound = shien.load(root + '/not-found');
            expect(notFound).to.be.undefined;
        });

        it('should load module like `require()` if module exists', function () {
            var entry = shien.load(root + '/entry');
            expect(entry).not.to.be.undefined;
        });

        it('should throw error if there is any exception in loaded module', function () {
            try {
                shien.load(root + '/bad-entry');
            } catch (err) {
                expect(err).not.to.be.undefined;
            }
        });

        it('should load main module only if it was found, even in `multi` mode', function () {
            var exporteds = shien.load(root + '/entry', { multi: true });
            expect(exporteds.length).to.equal(1);
        });

        it('should search for and load multiple modules ' +
                'if `multi` option was set and main module was not found', function () {
            var exporteds = shien.load(root + '/multi', { multi: true });
            expect(exporteds).to.be.deep.equal([ 1, 2, 3 ]);
        });

    });

    describe('.assign', function () {

        it('should assign attributes from source object to destination object ' +
                '(overriding destination attributes if needed)', function () {
            var foo = { foo: 10, bar: 16 },
                bar = { bar: 7, qux: 20 },
                qux = { bar: 6, foo: 7 };
            shien.assign(foo, bar, qux);
            expect(foo).to.be.deep.equal({ foo: 7, bar: 6, qux: 20 });
        });

    });

    describe('.merge', function () {

        it('should merge source object to destination object', function () {
            var foo = {
                    foo: 10,
                    bar: { foo: 2, qux: 7 }
                },
                bar = {
                    foo: { foo: 7 },
                    bar: { bar: 3 },
                    qux: 10
                },
                qux = {
                    foo: { bar: 8 },
                    qux: 6
                };
            shien.merge(foo, bar, qux);
            expect(foo).to.be.deep.equal({
                foo: { foo: 7, bar: 8 },
                bar: { foo: 2, bar: 3, qux: 7 },
                qux: 6
            });
        });

    });

    describe('.enhance', function () {

        it('should assign attributes from source object to destination object ' +
                '(including source object\' prototype attributes, ' +
                'overriding destination attributes if needed)', function () {

            function Bar() {
                this.bar = { bar: 4, qux: 7 };
            }
            Bar.prototype.qux = function () {};

            var foo = {
                    foo: 6,
                    bar: { foo: 2, bar: 8 },
                    qux: 9
                },
                quxFn = Bar.prototype.qux;

            shien.enhance(foo, new Bar);

            expect(foo).to.be.deep.equal({
                foo: 6,
                bar: { bar: 4, qux: 7 },
                qux: quxFn
            });
        });

    });

});
