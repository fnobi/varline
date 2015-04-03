var gutil = require('gulp-util');
var through = require('through2');

module.exports = function (opts) {
    opts = opts || {};
    var loadPath = opts.loadPath || [];
    var wrap = !!opts.wrap;
    var alias = opts.alias || {};

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
