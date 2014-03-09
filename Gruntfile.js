'use strict';

var path = require('path'),
    blanket = require('blanket');

module.exports = function (grunt) {
    /* jshint scripturl: true */

    // Load all grunt tasks
    require('matchdep')
        .filterDev('grunt-*')
        .forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '{lib,test}/**/*.js',
                'Gruntfile.js'
            ]
        },
        mochaTest: { // jshint ignore: line
            all: {
                options: {
                    require: function instrumentFiles() {
                        blanket({
                            pattern: path.join(__dirname, 'lib')
                        });
                    }
                },
                src: [
                    'test/**/*.js',
                    '!test/assets/**'
                ]
            },
            'html-cov': {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage.html'
                },
                src: [
                    'test/**/*.js',
                    '!test/assets/**'
                ]
            },
            'travis-cov': {
                options: {
                    reporter: 'travis-cov'
                },
                src: [
                    'test/**/*.js',
                    '!test/assets/**'
                ]
            }
        }
    });

    var exitProcess;

    grunt.registerTask('coverage:before', function () {
        exitProcess = process.exit;
        process.exit = function (code) {
            code && grunt.warn('Coverage does not be satisfied!');
        };
    });

    grunt.registerTask('coverage:after', function () {
        process.exit = exitProcess;
    });

    grunt.registerTask('test', 'Run JSHint and tests', [
        'jshint:all',

        'mochaTest:all',
        'mochaTest:html-cov',

        'coverage:before',
        'mochaTest:travis-cov',
        'coverage:after'
    ]);

    grunt.registerTask('default', 'Run tests and build', [
        'test'
    ]);

};
