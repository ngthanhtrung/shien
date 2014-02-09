'use strict';

var core = require('./shien/core'),
    file = require('./shien/file'),
    sortedMap = require('./shien/sorted-map');

module.exports = new function () {

    core.enhance(this, core);
    core.enhance(this, file);
    core.enhance(this, sortedMap);

};
