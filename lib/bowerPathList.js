var fs = require('fs');
var path = require('path');
var async = require('async');
var bowerResolve = require('bower_resolve');

var bowerPathList = function (root, callback) {
    root = root || process.cwd();

    var bowerPath = path.join(root, 'bower_components');
    var list = {};

    var validModulePattern = /^[^.-]+$/;

    if (!fs.existsSync(bowerPath)) {
        return callback('bower path not found.');
    }

    fs.readdir(bowerPath, function (err, bowerComponents) {
        async.forEach(bowerComponents, function (componentName, next) {
            bowerResolve({
                path: root,
                component: componentName
            }, function (err, p) {
                if (!err) {
                    if (validModulePattern.test(componentName)) {
                        list[componentName] = p;
                    }
                    var basename = path.basename(p, '.js');
                    if (validModulePattern.test(basename)) {
                        list[basename] = p;
                    }
                }

                next();
            });
        }, function () {
            callback(null, list);
        });
    });
};

module.exports = bowerPathList;
