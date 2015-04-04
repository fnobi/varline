var grunt = require('grunt'),
    _ = grunt.util._,
    extractDepVars = require('extract_dep_vars');

var pathToConcated = function (opts) {
    var scriptName = opts.scriptName || {};
    var pathsForName = opts.pathsForName || {};
    var ignoredNames = opts.ignoredNames || {};
    var alias = opts.alias || {};

    var scriptPath = pathsForName[scriptName];
    var names = [scriptName];
    var dependencies = extractDepVars(grunt.file.read(scriptPath));

    dependencies.forEach(function (depName) {
        while (alias[depName]) {
            depName = alias[depName];
        }

        if (_.contains(ignoredNames, depName)) {
            return;
        }

        if (!pathsForName[depName]) {
            return;
        }

        var moduleVars = pathToConcated({
            scriptName: depName,
            pathsForName: pathsForName,
            ignoredNames: ignoredNames,
            alias: alias
        });

        names = _.union(moduleVars, names);
    });

    return names;
};

module.exports = pathToConcated;
