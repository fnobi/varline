var path = require('path');
var async = require('async');

var Varline = require(__dirname + '/../lib/Varline');

var TASK_NAME = 'auto_deps';
var TASK_DESCRIPTION = 'resolve js dependency and concat automatically.';

module.exports = function (grunt) {
    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask(TASK_NAME, TASK_DESCRIPTION, function () {
        var target = this.target;
        var config = grunt.config(TASK_NAME)[target];
        var scripts = config.scripts || [];
        var dest = config.dest || 'js';
        var done = this.async();

        var varline = new Varline(config);

        varline.loadBowerComponents(function (err) {
            // bower componentsの取得に失敗しても、候補に追加されないだけなので、
            // 全体の処理は気にせず進める

            async.each(scripts, function (name, next) {
                var destPath = path.join(dest, name + '.js');
                varline.resolve(name, function (err, result) {
                    if (err) {
                        console.error('[error] %s', destPath);
                        console.error(err.toString());
                        next();
                        return;
                    }
                    console.log('[success] %s', destPath);
                    console.log(result.vars);
                    grunt.file.write(destPath, result.source);
                    next();
                });
            }, done);            
        });
    });
};










