'use strict';

module.exports = new function () {

    var LOWER_ALPHA_CHARS = 'abcdefghiklmnopqrstuvwxyz',
        ALPHANUMERIC_CHARS = '0123456789' +
            LOWER_ALPHA_CHARS +
            LOWER_ALPHA_CHARS.toUpperCase();

    this.random = function (len) {
        len = len || 32;

        var ret = '';

        for (var i = 0; i < len; i++) {
            ret += ALPHANUMERIC_CHARS[
                Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)
            ];
        }

        return ret;
    };

};
