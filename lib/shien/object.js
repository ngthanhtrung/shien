'use strict';

module.exports = new function () {

    this.get = function (obj, p) {
        if (!p.length) {
            return obj;
        }

        p = p.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        p = p.replace(/^\./, ''); // strip a leading dot

        var ret = obj,
            parts = p.split('.'),
            part;

        for (var i = 0, len = parts.length; i < len; i++) {
            part = (part ? part + '.' : '') + parts[i];
            if (part in ret) {
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

};
