'use strict';

var path = require('path'),
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

module.exports = new function () {

    function parseOptions(opts) {
        var o = opts || {};

        if (o.ignore && typeof o.ignore === 'string') {
            o.ignore = new RegExp(o.ignore);
        }

        if (o.match && typeof o.match === 'string') {
            o.match = new RegExp(o.match);
        }

        if ((o.ignore && !(o.ignore instanceof RegExp)) ||
                (o.match && !(o.match instanceof RegExp))) {
            throw new Error('File pattern must be string or regular expression!');
        }

        return o;
    }

    function visit(emitter, emitAsync, root, dir, opts) {

        function done() {
            emitAsync(root === dir ? 'done' : 'dec ' + path.join(dir, '..'));
        }

        fs.readdir(dir, function (err, files) {
            if (err) {
                return emitAsync('error', err);
            }

            var tick = files.length;

            emitter.on('dec ' + dir, function () {
                if (--tick <= 0) {
                    emitter.removeAllListeners('dec ' + dir);
                    done();
                }
            });

            files.forEach(function (file) {
                var filePath = path.join(dir, file),
                    relPath = path.relative(root, filePath);

                if (opts.ignore && opts.ignore.test(relPath)) {
                    tick--;
                    return;
                }

                fs.stat(filePath, function (err, stat) {
                    if (err) {
                        return emitAsync('error', err);
                    }

                    if (stat.isDirectory()) {
                        emitAsync('dir', relPath);
                        visit(emitter, emitAsync, root, filePath, opts);

                    } else {
                        if (opts.match && !opts.match.test(relPath)) {
                            tick--;
                            return;
                        }

                        if (stat.isFile()) {
                            emitAsync('file', relPath);
                        }
                        emitAsync('dec ' + dir);
                    }
                });
            });

            if (!tick) {
                done();
            }
        });
    }

    this.traverse = function (root, opts) {
        var o = parseOptions(opts),
            emitter = new EventEmitter;

        visit(
            emitter,
            function emitAsync() {
                var args = arguments;
                process.nextTick(function () {
                    emitter.emit.apply(emitter, args);
                });
            },
            root, root, o
        );

        return emitter;
    };

    function visitSync(root, dir, opts) {
        var files = fs.readdirSync(dir),
            ret = [];

        files.forEach(function (file) {
            var filePath = path.join(dir, file),
                relPath = path.relative(root, filePath);

            if (opts.ignore && opts.ignore.test(relPath)) {
                return;
            }

            var stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                ret = ret.concat(visitSync(root, filePath, opts));
            } else if (stat.isFile() && (!opts.match || opts.match.test(relPath))) {
                ret.push(relPath);
            }
        });

        return ret;
    }

    this.traverseSync = function (root, opts) {
        var o = parseOptions(opts);
        return visitSync(root, root, o);
    };

};
