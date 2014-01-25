'use strict';

function Shien() {
};

Shien.prototype = new (function () {

    this.define = function (object, name, value) {
        if (name === Object(name)) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    this.define(object, key, name[key]);
                }
            }

        } else {
            Object.defineProperty(object, name, {
                value:        value,
                enumerable:   true,
                writable:     false,
                configurable: false
            });
        }

        return object;
    };

    this.definer = function (object) {
        var self = this;
        object = object || Object.create(null);
        return function (name, value) {
            return self.define(object, name, value);
        };
    };

    var hasOwnProperty = Object.prototype.hasOwnProperty;

        isPlainObject = function (obj) {
            if (!obj || obj !== Object(obj) || obj.nodeType || obj.setInterval) {
                return false;
            }

            var hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
            var hasIsPrototypeOfMethod = hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');

            // Not own constructor property, must be Object
            if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOfMethod) {
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for (key in obj) {}

            return (key === undefined || hasOwnProperty.call(obj, key));
        };

    this.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            deep = false,
            target = arguments[0] || {},

            length = arguments.length,
            i = 1;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // Skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && typeof target !== 'function') {
            target = {};
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = (src && Array.isArray(src) ? src : []);

                        } else {
                            clone = (src && isPlainObject(src) ? src : {});
                        }

                        // Never move original objects, clone them
                        target[name] = this.extend(deep, clone, copy);

                    // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    this.deepExtend = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(true);
        return this.extend.apply(this, args);
    };

    this.mixin = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift({});
        return this.extend.apply(this, args);
    };

    this.deepMixin = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift({});
        return this.deepExtend.apply(this, args);
    };

    this.enhance = function (obj, ctor, args) {
        ctor.apply(obj, args);
        this.extend(obj.__proto__, ctor.prototype);
        return obj;
    };

    this.getDeepProperty = function (obj, path) {
        if (path === '') {
            return obj;
        }

        var parts = path.split('.'),
            ret = obj,
            i = 0,
            p;

        while (i < parts.length) {
            p = (p ? p + '.' : '') + parts[i];

            if (typeof ret[p] !== 'undefined') {
                ret = ret[p];
                p = null;
            } else if (i === parts.length - 1) {
                return undefined;
            }

            i++;
        }

        return ret;
    };

    this.setDeepProperty = function (obj, path, value) {
        if (path === '') {
            throw new Error('Cannot set root object!');
        }

        var parts = path.split('.'),
            i = 0,
            p;

        while (i < parts.length) {
            p = (p ? p + '.' : '') + parts[i];

            if (i === parts.length - 1) {
                obj[p] = value;
            } else if (typeof obj[p] !== 'undefined') {
                obj = obj[p];
                p = null;
            }

            i++;
        }
    };

})();

exports = module.exports = new Shien();
