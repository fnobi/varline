var fs = require('fs');
var path = require('path');
var async = require('async');
var bowerResolve = require('bower_resolve');

var bowerPathList = function (root, callback) {
    root = root || process.cwd();

    var bowerPath = path.join(root, 'bower_components');
    var list = {};

    if (!fs.existsSync(bowerPath)) {
        return callback('bower path not found.');
    }

    fs.readdir(bowerPath, function (err, files) {
        async.forEach(files, function (file, next) {
            bowerResolve({
                path: root,
                component: file
            }, function (err, p) {
                if (!err) {
                    list[file] = p;
                }

                next();
            });
        }, function () {
            callback(null, list);
        });
    });
};

module.exports = bowerPathList;
