'use strict';

var core = require('./core'),

    MODULES = [
        'string',
        'object',
        'file',
        'collection'
    ];

module.exports = new function () {

    core.enhance(this, core);

    MODULES.forEach(function (m) {
        core.define(this, m, require('./' + m), true);
    }, this);

};
