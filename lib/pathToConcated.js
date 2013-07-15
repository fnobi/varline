var grunt = require('grunt'),
    _ = grunt.util._,
    extractDepVars = require('extractDepVars');

var pathToConcated = function (name, srcPath, list) {
    console.log('[load] %s', name);

    var vars = [name];

    console.log(' - src path: %s', srcPath);

    var vs = extractDepVars(grunt.file.read(srcPath));
    console.log(' - extract dep vars', vs);

    vs.forEach(function (v) {
        if (!list[v]) {
            console.error('[not found (%s)]', v);
            return;
        }

        var moduleVars = pathToConcated(v, list[v], list);

        console.log(' - union: %s + %s', moduleVars, vars);
        vars = _.union(moduleVars, vars);
    });

    return vars;
};

module.exports = pathToConcated;