'use strict';

module.exports = new function () {

    var defineProperty = Object.defineProperty;

    this.isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };

    this.get = function (obj, p) {
        if (!p) {
            return obj;
        }

        p = p.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        p = p.replace(/^\./, ''); // strip a leading dot

        var ret = obj,
            parts = p.split('.'),
            part;

        for (var i = 0, len = parts.length; i < len; i++) {
            part = (part ? part + '.' : '') + parts[i];

            if (typeof ret !== 'object') {
                return undefined;

            } else if (part in ret) {
                ret = ret[part];
                part = null;

            } else if (i === len - 1) {
                return undefined;
            }
        }

        return ret;
    };

    this.set = function (obj, path, val) {
        // TODO: Implement this
        obj[path] = val;
    };

    this.defineGetter = function (obj, prop, getter) {
        defineProperty(obj, prop, {
            get: getter
        });
    };

    this.defineSetter = function (obj, prop, setter) {
        defineProperty(obj, prop, {
            set: setter
        });
    };

};
