'use strict';

var core = require('../core');

module.exports = new function () {

    core.enhance(this, require('./doubly-linked-list'));
    core.enhance(this, require('./sorted-map'));

};
