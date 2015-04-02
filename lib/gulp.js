var gutil = require('gulp-util');
var through = require('through2');

module.exports = function (option) {

    function transform (file, encoding, callback) {
        var result = '';

        var output = new gutil.File({
            cwd: file.cwd,
            base: file.base,
            path: file.base + 'test.js'
        });

        output.contents = new Buffer(result);
        this.push(output);
        
        callback();
    }

    return through.obj(transform, null);
};
