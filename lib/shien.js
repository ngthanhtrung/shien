'use strict';

var core = require('./shien/core'),
    string = require('./shien/string'),
    object = require('./shien/object'),
    file = require('./shien/file'),
    sortedMap = require('./shien/sorted-map');

module.exports = new function () {

    core.enhance(this, core);
    core.enhance(this, string);
    core.enhance(this, object);
    core.enhance(this, file);
    core.enhance(this, sortedMap);

};
