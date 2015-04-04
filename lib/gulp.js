var path = require('path');

var gutil = require('gulp-util');
var through = require('through2');

var Varline = require(__dirname + '/Varline');

module.exports = function (opts) {
    var varline = new Varline(opts);

    function transform (file, encoding, callback) {
        var name = path.basename(file.path, '.js');

        varline.loadBowerComponents(function (err) {
            // bower componentsの取得に失敗しても、候補に追加されないだけなので、
            // 全体の処理は気にせず進める

            // var destPath = path.join(dest, name + '.js');
            varline.resolve(name, function (err, result) {
                if (err) {
                    console.error('[error] %s', name);
                    console.error(err.toString());
                    callback();
                    return;
                }
                console.log('[success] %s', name);
                console.log(result.vars);

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
