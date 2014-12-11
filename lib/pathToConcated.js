var grunt = require('grunt'),
    _ = grunt.util._,
    extractDepVars = require('extract_dep_vars');

var pathToConcated = function (opts) {
    var scriptName = opts.scriptName;
    var pathsForName = opts.pathsForName;
    var ignoredNames = opts.ignoredNames;
    var alias = opts.alias;


    var scriptPath = pathsForName[scriptName];

    // console.log('[load] %s', scriptName);

    var names = [scriptName];

    // console.log(' - src path: %s', scriptPath);

    var dependencies = extractDepVars(grunt.file.read(scriptPath));
    // console.log(' - extract dep vars', dependencies);

    dependencies.forEach(function (depName) {
        while (alias[depName]) {
            // console.log('[alias: %s -> %s]', depName, alias[depName]);
            depName = alias[depName];
        }

        if (_.contains(ignoredNames, depName)) {
            return;
        }

        if (!pathsForName[depName]) {
            // console.error('[not found (%s)]', depName);
            return;
        }

        var moduleVars = pathToConcated({
            scriptName: depName,
            pathsForName: pathsForName,
            ignoredNames: ignoredNames,
            alias: alias
        });

        // console.log(' - union: %s + %s', moduleVars, names);
        names = _.union(moduleVars, names);
    });

    return names;
};

module.exports = pathToConcated;
