var fs = require('fs');
var path = require('path');

var async = require('async');

var scriptMatchList = require('./scriptMatchList');
var bowerPathList = require('../lib/bowerPathList');
var pathToConcated = require('../lib/pathToConcated');

var Varline = function (opts) {
    opts = opts || {};
    this.loadPath = opts.loadPath || [];
    this.wrap = !!opts.wrap;
    this.alias = opts.alias || {};
    this.locate = opts.locate || {};
    this.ignoredNames = opts.ignore || [];
    this.dependencies = opts.dependencies || {};

    this.pathsForName = scriptMatchList({
        loadPath: this.loadPath,
        locate: this.locate
    });
};

Varline.prototype.loadBowerComponents = function (callback) {
    bowerPathList(process.cwd(), function (err, list) {
        if (err) {
            callback(err);
            return;
        }

        var pathsForName = this.pathsForName;
        for (var i in list) {
            pathsForName[i] = list[i];
        }
        this.pathsForName = pathsForName;

        callback();
    }.bind(this));
};

Varline.prototype.resolve = function (name, callback) {
    var pathsForName = this.pathsForName;
    var ignoredNames = this.ignoredNames;
    
    var dependencies = this.dependencies[name];
    
    var alias = this.alias;

    if (!pathsForName[name]) {
        callback(name + ' is not found on src.');
        return;
    }

    pathToConcated({
        scriptName: name,
        pathsForName: pathsForName,
        ignoredNames: ignoredNames,
        alias: alias
    }, function (err, vars) {
        if (err) {
            callback(err);
            return;
        }

        dependencies.forEach(function (n) {
            var tail = vars.pop();
            vars.push(n);
            vars.push(tail);
        });

        var sources = [];
        vars.forEach(function (name) {
            sources.push(fs.readFileSync(pathsForName[name], 'utf8'));
            // TODO: encodingは念のため引数にしたい
        });

        if (this.wrap) {
            sources.unshift('(function () {');
            sources.push('})();');
        }

        callback(null, {
            vars: vars,
            source: sources.join('\n')
        });
    });
};

module.exports = Varline;
