'use strict';

function SortedMap(val) {
    this.keys = [];
    this.values = {};
    this.length = 0;
    this.defaultValue = val;
}

SortedMap.prototype = new function () {

    this.get = function (key) {
        return this.values[key];
    };

    this.put = function (key, val) {
        if (typeof key !== 'string') {
            throw new Error('Key must be string!');
        }

        var v = (typeof val === 'undefined' ? this.defaultValue : val);
        if (typeof v === 'undefined') {
            throw new Error('Value must be defined if collection has no default value!');
        }

        if (typeof this.values[key] === 'undefined') {
            this.keys[this.length++] = key;
        }

        var oldVal = this.values[key];
        this.values[key] = v;

        return oldVal;
    };

    this.remove = function (key) {
        if (typeof this.values[key] === 'undefined') {
            return undefined;
        }

        var keys = this.keys;
        for (var i = 0, len = keys.length; i < len; i++) {
            if (keys[i] === key) {
                keys.splice(i, 1);
                break;
            }
        }

        var oldVal = this.values[key];
        delete this.values[key];
        this.length--;

        return oldVal;
    };

    this.hasKey = function (key) {
        return (typeof this.values[key] !== 'undefined');
    };

    this.hasValue = function (val) {
        var keys = this.keys,
            values = this.values;

        for (var i = 0, len = keys.length; i < len; i++) {
            if (values[keys[i]] === val) {
                return true;
            }
        }

        return false;
    };

    this.allKeys = function (delim) {
        return this.keys.join(delim);
    };

    this.each = function (it, opts) {
        if (typeof it !== 'function') {
            return;
        }

        var o = opts || {},
            keys = this.keys,
            values = this.values;

        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (o.keyOnly) {
                it(key);
            } else if (o.valueOnly) {
                it(values[key]);
            } else {
                it(values[key], key);
            }
        }
    };

    this.eachKey = function (it) {
        return this.each(it, { keyOnly: true });
    };

    this.eachValue = function (it) {
        return this.each(it, { valueOnly: true });
    };

};

exports.SortedMap = SortedMap;
