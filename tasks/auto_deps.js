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
            alias = config.alias || {},
            ignoredNames = config.ignore || [],
            forceddNames = config.forced || [],
            dest = config.dest || 'js',
            wrap = config.wrap ? true : false,

            done = this.async();

        var pathsForName = scriptMatchList({
            loadPath: loadPath,
            locate: locate
        });

        async.series([function (next) {
            bowerPathList(process.cwd(), function (err, list) {
                if (err) {
                    // bower componentsの取得に失敗しても、候補に失敗するだけなので、
                    // 全体の処理は気にせず進める
                    return next();
                }

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

                var vars = pathToConcated({
                    scriptName: name,
                    pathsForName: pathsForName,
                    ignoredNames: ignoredNames,
                    alias: alias
                });
                var sources = [];

                forceddNames.forEach(function (n) {
                    vars.unshift(n);
                });

                console.log('[write] %s (%s)', destPath, vars.join(', '));

                vars.forEach(function (name) {
                    sources.push(grunt.file.read(pathsForName[name]));
                });

                if (wrap) {
                    // console.log('[wrap]');
                    sources.unshift('(function () {');
                    sources.push('})();');
                }

                grunt.file.write(destPath, sources.join('\n'));
            });
            next();
        }], function (err) {
            if (err) {
                throw new Error(err);
            }
            done();
        });
    });
};
