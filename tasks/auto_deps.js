module.exports = function (grunt) {
    var taskName        = 'auto_deps',
        taskDescription = 'resolve js dependency and concat automatically.',

        path = require('path'),
        async = require('async'),
        pathToConcated = require('../lib/pathToConcated'),
        scriptMatchList = require('../lib/scriptMatchList'),
        bowerPathList = require('../lib/bowerPathList');
        _ = grunt.util._;

    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask(taskName, taskDescription, function () {
        var target = this.target,
            config = grunt.config(taskName)[target],

            // config parameters
            loadPath = config.loadPath || ['src/js/*.js', 'src/js/**/*.js'],
            scripts = config.scripts || [],
            locate = config.locate || {},
            ignoredNames = config.ignore || [],
            forceddNames = config.forced || [],
            dest = config.dest || 'js',

            done = this.async();

        var pathsForName = scriptMatchList({
            loadPath: loadPath,
            locate: locate
        });

        async.series([function (next) {
            bowerPathList(process.cwd(), function (list) {
                for (var i in list) {
                    pathsForName[i] = list[i];
                }
                next();
            });
        }, function (next) {
            scripts.forEach(function (name) {
                var destPath = path.join(dest, name + '.js');

                // console.log('[script: %s]', name);
                // console.log(' - dest path: %s', destPath);

                if (!pathsForName[name]) {
                    console.error('%s is not found on src.', name);
                    return;
                }

                var vars = pathToConcated(name, pathsForName, ignoredNames),
                    sources = [];

                forceddNames.forEach(function (n) {
                    vars.unshift(n);
                });

                console.log('[write] %s (%s)', destPath, vars.join(', '));

                vars.forEach(function (name) {
                    sources.push(grunt.file.read(pathsForName[name]));
                });

                grunt.file.write(destPath, sources.join('\n'));
            });
            next();
        }], done);
    });
};
