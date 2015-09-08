var grunt = require('grunt'),
    async = require('async'),
    _ = grunt.util._,
    extractDepVars = require('extract_dep_vars');

var pathToConcated = function (opts, callback) {
    callback = callback || function () {};
    
    var scriptName = opts.scriptName;
    var pathsForName = opts.pathsForName || {};
    var ignoredNames = opts.ignoredNames || {};
    var alias = opts.alias || {};

    if (!scriptName) {
        throw new Error('"scriptName" is required');
    }

    var scriptPath = pathsForName[scriptName];
    var names = [scriptName];
    
    extractDepVars(grunt.file.read(scriptPath), function (err, dependencies) {
        if (err) {
            callback(err);
            return;
        }

        async.forEach(dependencies, function (depName, next) {
            while (alias[depName]) {
                depName = alias[depName];
            }

            if (_.contains(ignoredNames, depName)) {
                next();
                return;
            }

            if (!pathsForName[depName]) {
                next();
                return;
            }

            pathToConcated({
                scriptName: depName,
                pathsForName: pathsForName,
                ignoredNames: ignoredNames,
                alias: alias
            }, function (err, moduleVars) {
                if (err) {
                    next(err);
                    return;
                }
                names = _.union(moduleVars, names);
                next();
            });
        }, function (err) {
            callback(err, names);
        });
    });
};

module.exports = pathToConcated;
