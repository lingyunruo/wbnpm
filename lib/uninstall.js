'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('path'),
    join = _require.join;

var colors = require('colors');

var _require2 = require('./utils'),
    rmDir = _require2.rmDir,
    fsExistsSync = _require2.fsExistsSync,
    getPkg = _require2.getPkg,
    removeDependencies = _require2.removeDependencies,
    execCommandSync = _require2.execCommandSync;

var projectCwd = process.cwd();

module.exports = function (_ref) {
	var args = _ref.args;

	var moduleName = args[0];
	var moduleDir = join(projectCwd, 'node_modules/' + moduleName);
	var wbDependencies = getPkg('WBDependencies');

	if (fsExistsSync(moduleDir) && wbDependencies[moduleName]) {
		rmDir(moduleDir);
		removeDependencies(moduleName);
		console.log(colors.green('module ' + moduleName + ' is uninstalled'));
	} else {
		execCommandSync('npm', ['uninstall'].concat(_toConsumableArray(process.argv.slice(2))));
	}
};