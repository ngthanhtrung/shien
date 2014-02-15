'use strict';

var fs = require('fs'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter;

module.exports = new function () {

    function test(p, opts) {
        if (opts.ignore && opts.ignore.test(p)) {
            return false;
        }
        if (opts.match && !opts.match.test(p)) {
            return false;
        }
        return true;
    }

    function traverse(emitter, emit, root, dir, opts) {

        function done() {
            emit(root === dir ? 'done' : 'dec ' + path.join(dir, '..'));
        }

        fs.readdir(dir, function (err, files) {
            if (err) {
                return emit('error', err);
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

                if (!test(relPath, opts)) {
                    tick--;
                    return;
                }

                fs.stat(filePath, function (err, stat) {
                    if (err) {
                        return emit('error', err);
                    }

                    if (stat.isDirectory()) {
                        emit('dir', relPath);
                        traverse(emitter, emit, root, filePath, opts);

                    } else {
                        if (stat.isFile()) {
                            emit('file', relPath);
                        }
                        emit('dec ' + dir);
                    }
                });
            });

            if (!tick) {
                done();
            }
        });
    }

    this.traverse = function (root, opts) {
        var o = opts || {},
            emitter = new EventEmitter;

        if (o.ignore && (typeof o.ignore === 'string')) {
            o.ignore = new RegExp(o.ignore);
        }
        if (o.match && (typeof o.match === 'string')) {
            o.match = new RegExp(o.match);
        }
        if ((o.ignore && !(o.ignore instanceof RegExp)) ||
                (o.match && !(o.match instanceof RegExp))) {
            throw new Error('File pattern must be string or regular expression!');
        }

        traverse(
            emitter,
            function emit() {
                var args = arguments;
                process.nextTick(function () {
                    emitter.emit.apply(emitter, args);
                });
            },
            root, root, o
        );

        return emitter;
    };

};
