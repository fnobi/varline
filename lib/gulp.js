var gutil = require('gulp-util');
var through = require('through2');

var Varline = require(__dirname + '/Varline');

module.exports = function (opts) {
    var varline = new Varline(opts);

    function transform (file, encoding, callback) {
        var result = '';

        var output = new gutil.File({
            cwd: file.cwd,
            base: file.base,
            path: file.path
        });

        output.contents = new Buffer(result);
        this.push(output);
        
        callback();
    }

    return through.obj(transform, null);
};
