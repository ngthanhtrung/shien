'use strict';

var expect = require('chai').expect,
    shien = require('../lib/shien');

describe('shien .core', function () {

    describe('.define', function () {

        it('should assign property to object', function () {
            var obj = {};
            expect(obj.foo).to.be.undefined;
            shien.define(obj, 'foo', 'bar');
            expect(obj.foo).to.equal('bar');
        });

        it('should assign property which is not able to be deleted', function () {
            var obj = {};
            shien.define(obj, 'foo', 'bar');
            delete obj.bar;
            expect(obj.foo).to.equal('bar');
        });

        it('should assign property which is not able to be changed', function () {
            var obj = {};
            shien.define(obj, 'foo', 'bar');
            try {
                obj.foo = 'qux';
            } catch (e) {
                if (e.type !== 'strict_read_only_property') {
                    throw e;
                }
            }
            expect(obj.foo).to.equal('bar');
        });

        it('should assign enumerable property correctly', function () {
            /* jshint forin: false */

            var obj = {},
                props = [];

            shien.define(obj, 'foo', 'bar');

            for (var prop in obj) {
                props.push(prop);
            }

            expect(props).to.include('foo');
        });

        it('should assign non-enumerable property correctly', function () {
            /* jshint forin: false */

            var obj = {},
                props = [];

            shien.define(obj, 'foo', 'bar', true);

            for (var prop in obj) {
                props.push(prop);
            }

            expect(props).to.not.include('foo');
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
