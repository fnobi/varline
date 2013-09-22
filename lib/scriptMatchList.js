var fs = require('fs'),
    path = require('path'),
    grunt = require('grunt'),
    _ = grunt.util._;

var scriptMatchList = function (opts) {
    var loadPath = opts.loadPath || [],
        locate = opts.locate || {};

    if (typeof loadPath == 'string') {
        loadPath = [loadPath];
    }

    loadPath.forEach(function (pattern) {
        grunt.file.expand(pattern).forEach(function (p) {
            var basename = path.basename(p).replace(/\.js$/, '');

            if (locate[basename]) {
                return;
            }
            locate[basename] = p;
        });
    });

    return locate;
};

module.exports = scriptMatchList;
