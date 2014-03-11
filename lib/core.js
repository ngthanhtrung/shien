'use strict';

var path = require('path'),
    fs = require('fs'),

    object = require('./object'),
    file = require('./file'),

    JS_REGEX = /\.js$/;

module.exports = new function () {

    var defineProperty = Object.defineProperty,
        slice = Array.prototype.slice;

    /* Load modules without requiring them to exist */

    this.load = function (p, opts) {
        var multi = !!(opts || {}).multi,
            modules = [];

        try {
            var main = require(p);

            if (multi) {
                modules.push(main);
                return modules;

            } else {
                return main;
            }

        } catch (err) {
            if (err.code !== 'MODULE_NOT_FOUND') {
                throw err;
            }

            if (!multi) {
                return undefined;
            }

            if (fs.existsSync(p)) {
                var files = file.traverseSync(p, {
                    match: JS_REGEX
                });

                files.sort();
                files.forEach(function iterateFiles(file) {
                    modules.push(
                        require(path.join(p, file))
                    );
                });
            }

            return modules;
        }
    };

    /* Assigning, enhancing and merging objects */

    function singlyMixin(dest, src, merge, inclProto) {
        for (var prop in src) {
            if (inclProto || src.hasOwnProperty(prop)) {
                var val = src[prop];

                if (merge &&
                        typeof dest[prop] !== 'undefined' &&
                        typeof val === 'object' &&
                        val !== null &&
                        !Array.isArray(val)) {

                    if (typeof dest[prop] !== 'object') {
                        dest[prop] = {};
                    }

                    singlyMixin(dest[prop], val, merge, inclProto);

                } else {
                    dest[prop] = val;
                }
            }
        }
    }

    function mixin(dest) {
        var args = slice.call(arguments),
            merge = false,
            inclProto = false;

        if (args.length >= 3 && typeof args[args.length - 1] === 'boolean') {
            if (args.length >= 4 && typeof args[args.length - 2] === 'boolean') {
                inclProto = args[args.length - 1];
                merge = args[args.length - 2];
                args.length -= 2;
            } else {
                merge = args[args.length - 1];
                args.length--;
            }
        }

        for (var i = 1, len = args.length; i < len; i++) {
            singlyMixin(dest, args[i], merge, inclProto);
        }

        return dest;
    }

    this.assign = function () {
        return mixin.apply(this, arguments);
    };

    this.merge = function () {
        arguments[arguments.length++] = true;
        return mixin.apply(this, arguments);
    };

    this.enhance = function () {
        arguments[arguments.length++] = false;
        arguments[arguments.length++] = true;
        return mixin.apply(this, arguments);
    };

    /* Defining and exposing object properties */

    this.define = function (obj, prop, value, visible) {
        /* jshint shadow: true */

        if (typeof prop === 'object') {
            visible = value;
            value = prop;

            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    this.define(obj, prop, value[prop], visible);
                }
            }

            return;
        }

        if (typeof prop !== 'string') {
            throw new Error('Bad property!');
        }

        defineProperty(obj, prop, {
            configurable: false,
            enumerable: !!visible,
            writable: false,
            value: value
        });
    };

    this.expose = function (dest, src, props, opts) {
        var link = !!(opts || {}).link;

        if (!Array.isArray(props)) {
            props = [ props ];
        }

        props.forEach(function iterateProperties(prop) {
            if (typeof prop !== 'string') {
                return;
            }

            var v = src[prop];

            if (typeof v !== 'undefined') {
                if (link) {
                    defineProperty(dest, prop, {
                        configurable: true,
                        enumerable: true,
                        get: function getValue() {
                            return src[prop];
                        },
                        set: function setValue(v) {
                            return (src[prop] = v);
                        }
                    });

                } else {
                    dest[prop] = v;
                }
            }
        });
    };

    /* Formatting strings */

    var // Matches `{{`, `}}` and `{<token>}`
        identifierRegex = /\{\{|\}\}|\{([^\}]+)\}/g;

    this.format = function (s) {
        var args = slice.call(arguments, 1);

        if (!args.length) { // nothing to replace
            return s;

        } else if (args.length === 1 && typeof args[0] === 'object') {
            // handle a single array or object
            args = args[0];
        }

        return s.replace(identifierRegex, function transformIdentifier(identifier, token) {
            if (identifier === '{{') {
                return '{';

            } else if (identifier === '}}') {
                return '}';

            } else {
                var v = object.get(args, token);
                return (typeof v === 'undefined' ? identifier : v);
            }
        });
    };

};
