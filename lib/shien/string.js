'use strict';

var object = require('./object');

module.exports = new function () {

    var slice = Array.prototype.slice,

        // Matches `{{`, `}}` and `{<token>}`
        identifierRegExp = /\{\{|\}\}|\{([^\}]+)\}/g;

    this.format = function (s) {
        var args = slice.call(arguments, 1);

        if (!args.length) { // nothing to replace
            return s;

        } else if (args.length === 1 && typeof args[0] === 'object') {
            // handle a single array or object
            args = args[0];
        }

        return s.replace(identifierRegExp, function transformIdentifier(identifier, token) {
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
