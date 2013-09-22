var grunt = require('grunt'),
    _ = grunt.util._,
    extractDepVars = require('extract_dep_vars');

var pathToConcated = function (scriptName, pathsForName, ignoredNames) {
    var scriptPath = pathsForName[scriptName];

    console.log('[load] %s', scriptName);

    var names = [scriptName];

    console.log(' - src path: %s', scriptPath);

    var dependencies = extractDepVars(grunt.file.read(scriptPath));
    console.log(' - extract dep vars', dependencies);

    dependencies.forEach(function (depName) {
        if (_.contains(ignoredNames, depName)) {
            return;
        }

        if (!pathsForName[depName]) {
            console.error('[not found (%s)]', depName);
            return;
        }

        var moduleVars = pathToConcated(depName, pathsForName, ignoredNames);

        console.log(' - union: %s + %s', moduleVars, names);
        names = _.union(moduleVars, names);
    });

    return names;
};

module.exports = pathToConcated;