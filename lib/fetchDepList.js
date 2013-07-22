var grunt = require('grunt'),
    path = require('path'),
    extractDepVars = require('extract_dep_vars');

var scriptPath = function (name) {
    if (locate[name]) {
        return locate[name];
    }

    if (!name.match(/\.js$/)) {
        name += '.js';
    }

    var result;
    files.forEach(function (p) {
        var basename = path.basename(p);
        if (basename == name) {
            result = p;
        }
    });
    return result;
};

var depList = function (name, callback) {
    var p = scriptPath(name);
    if (!p) {
        throw new Error('var "' + name + '" can\'t be located.');
    }

    var code = grunt.file.read(p),
        result = [p];

    extractDepVars(code, function (deps) {
        callback(deps);
    });

    return result;
};

