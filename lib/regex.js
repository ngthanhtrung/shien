'use strict';

module.exports = new function () {

    var SPECIALS = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\' ],
        SPECIALS_REGEX = new RegExp('(\\' + SPECIALS.join('|\\') + ')', 'g');

    this.escape = function (s) {
        return s.replace(SPECIALS_REGEX, '\\$1');
    };

    this.extract = function (s) {
        return s.replace(/^\//, '')
            .replace(/\/[gis]?$/, '');
    };

};
