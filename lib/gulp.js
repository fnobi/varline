var path = require('path');

var gutil = require('gulp-util');
var through = require('through2');

var Varline = require(__dirname + '/Varline');

var PLUGIN_NAME = 'varline';

module.exports = function (opts) {
    var varline = new Varline(opts);

    function transform (file, encoding, callback) {
        var name = path.basename(file.path, '.js');

        varline.loadBowerComponents(function (err) {
            // bower componentsの取得に失敗しても、候補に追加されないだけなので、
            // 全体の処理は気にせず進める

            varline.resolve(name, function (err, result) {
                if (err) {
                    this.emit('error', new gutil.PluginError(
                        PLUGIN_NAME,
                        err,
                        { showStack: true }
                    ));
                    callback();
                    return;
                }

                gutil.log(PLUGIN_NAME, '`' + name + '`', result.vars);

                var output = new gutil.File({
                    cwd: file.cwd,
                    base: file.base,
                    path: file.path
                });

                output.contents = new Buffer(result.source);
                this.push(output);
                
                callback();
            }.bind(this));
        }.bind(this));
    }

    return through.obj(transform, null);
};
