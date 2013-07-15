module.exports = function (grunt) {
    var taskName        = 'auto_deps',
        taskDescription = 'resolve js dependency and concat automatically.',
        path = require('path'),
        pathToConcated = require('../lib/pathToConcated'),
        scriptMatchList = require('../lib/scriptMatchList');
        _ = grunt.util._;

    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask(taskName, taskDescription, function () {
        var target = this.target,
            config = grunt.config(taskName)[target],

            // config parameters
            loadPath = config.loadPath || ['src/js/*.js', 'src/js/**/*.js'],
            scripts = config.scripts || [],
            locate = config.locate || {},
            dest = config.dest || 'js';

        var list = scriptMatchList({
            loadPath: loadPath,
            locate: locate
        });

        scripts.forEach(function (name) {
            var srcPath = list[name],
                destPath = path.join(dest, name + '.js');

            // console.log('[script: %s]', name);
            // console.log(' - dest path: %s', destPath);

            if (!srcPath) {
                console.error('%s is not found on src.', name);
                return;
            }

            var vars = pathToConcated(name, srcPath, list),
                sources = [];

            console.log('[write] %s (%s)', destPath, vars.join(', '));

            vars.forEach(function (name) {
                sources.push(grunt.file.read(list[name]));
            });

            grunt.file.write(destPath, sources.join('\n'));
        });
    });
};