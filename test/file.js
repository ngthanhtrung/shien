'use strict';

var path = require('path'),
    expect = require('chai').expect,
    shien = require('../lib/shien');

describe('.file', function () {

    describe('.traverse', function () {

        it('should list all sub-directories', function (cb) {
            var root = path.join(__dirname, 'assets/file/traverse'),
                dirs = [],
                t = shien.file.traverse(root);

            t.on('dir', function (dir) {
                dirs.push(dir);
            });

            t.on('done', function () {
                dirs.sort();
                expect(dirs).to.deep.equal([
                    'dir-1',
                    'dir-1/dir-1',
                    'dir-2',
                    'dir-2/dir-1',
                ]);
                cb();
            });
        });

        it('should list all files', function (cb) {
            var root = path.join(__dirname, 'assets/file/traverse'),
                files = [],
                t = shien.file.traverse(root);

            t.on('file', function (file) {
                files.push(file);
            });

            t.on('done', function () {
                files.sort();
                expect(files).to.deep.equal([
                    'dir-1/dir-1/file-1.html',
                    'dir-1/file-1.md',
                    'dir-2/dir-1/file-1.json',
                    'file-1.txt',
                    'file-2.js'
                ]);
                cb();
            });
        });

        it('should ignore directories and files ' +
                'which follow `ignore` option', function (cb) {

            var root = path.join(__dirname, 'assets/file/traverse'),
                dirs = [],
                files = [],
                t = shien.file.traverse(root, { ignore: /-2(\..*)?$/ });

            t.on('dir', function (dir) {
                dirs.push(dir);
            });

            t.on('file', function (file) {
                files.push(file);
            });

            t.on('done', function () {
                dirs.sort();
                files.sort();
                expect(dirs).to.deep.equal([
                    'dir-1',
                    'dir-1/dir-1'
                ]);
                expect(files).to.deep.equal([
                    'dir-1/dir-1/file-1.html',
                    'dir-1/file-1.md',
                    'file-1.txt'
                ]);
                cb();
            });
        });

        it('should include only files ' +
                'which follow `match` option', function (cb) {

            var root = path.join(__dirname, 'assets/file/traverse'),
                dirs = [],
                files = [],
                t = shien.file.traverse(root, { match: /-1(\.(txt|html|json))?$/ });

            t.on('dir', function (dir) {
                dirs.push(dir);
            });

            t.on('file', function (file) {
                files.push(file);
            });

            t.on('done', function () {
                dirs.sort();
                files.sort();
                expect(dirs).to.deep.equal([
                    'dir-1',
                    'dir-1/dir-1',
                    'dir-2',
                    'dir-2/dir-1'
                ]);
                expect(files).to.deep.equal([
                    'dir-1/dir-1/file-1.html',
                    'dir-2/dir-1/file-1.json',
                    'file-1.txt'
                ]);
                cb();
            });
        });

        it('should prefer `ignore` option to `match` option', function (cb) {
            var root = path.join(__dirname, 'assets/file/traverse'),
                dirs = [],
                files = [],
                t = shien.file.traverse(root, {
                    ignore: /-1(\..*)?$/,
                    match: /^file-[12]\..*$/
                });

            t.on('dir', function (dir) {
                dirs.push(dir);
            });

            t.on('file', function (file) {
                files.push(file);
            });

            t.on('done', function () {
                dirs.sort();
                files.sort();
                expect(dirs).to.deep.equal([ 'dir-2' ]);
                expect(files).to.deep.equal([ 'file-2.js' ]);
                cb();
            });
        });

    });

    describe('.traverseSync', function () {

        it('should list all files', function () {
            var root = path.join(__dirname, 'assets/file/traverse'),
                files = shien.file.traverseSync(root);

            files.sort();
            expect(files).to.deep.equal([
                'dir-1/dir-1/file-1.html',
                'dir-1/file-1.md',
                'dir-2/dir-1/file-1.json',
                'file-1.txt',
                'file-2.js'
            ]);
        });

        it('should ignore directories and files ' +
                'which follow `ignore` option', function () {

            var root = path.join(__dirname, 'assets/file/traverse'),
                files = shien.file.traverseSync(root, { ignore: /-2(\..*)?$/ });

            files.sort();
            expect(files).to.deep.equal([
                'dir-1/dir-1/file-1.html',
                'dir-1/file-1.md',
                'file-1.txt'
            ]);
        });

        it('should include only files ' +
                'which follow `match` option', function () {

            var root = path.join(__dirname, 'assets/file/traverse'),
                files = shien.file.traverseSync(root, { match: /-1(\.(txt|html|json))?$/ });

            files.sort();
            expect(files).to.deep.equal([
                'dir-1/dir-1/file-1.html',
                'dir-2/dir-1/file-1.json',
                'file-1.txt'
            ]);
        });

        it('should prefer `ignore` option to `match` option', function () {
            var root = path.join(__dirname, 'assets/file/traverse'),
                files = shien.file.traverseSync(root, {
                    ignore: /-1(\..*)?$/,
                    match: /^file-[12]\..*$/
                });

            files.sort();
            expect(files).to.deep.equal([ 'file-2.js' ]);
        });

    });

});
