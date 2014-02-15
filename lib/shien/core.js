'use strict';

module.exports = new function () {

    var defineProperty = Object.defineProperty,
        slice = Array.prototype.slice;

    this.define = function (obj, prop, value, hidden) {
        defineProperty(obj, prop, {
            configurable: false,
            enumerable: (hidden ? false : true),
            writable: false,
            value: value
        });
    };

    function singlyMixin(dest, src, merge, inclProto) {
        for (var prop in src) {
            if (inclProto || src.hasOwnProperty(prop)) {
                var val = src[prop];
                if (merge && (typeof val === 'object') && !Array.isArray(val)) {
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

};
