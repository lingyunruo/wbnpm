'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('path'),
    join = _require.join;

var colors = require('colors');

var _require2 = require('./utils'),
    fsExistsSync = _require2.fsExistsSync,
    execCommandSync = _require2.execCommandSync,
    copyFile = _require2.copyFile,
    copyDir = _require2.copyDir;

var projectPath = process.cwd();
var wnpmConfPath = join(projectPath, '.wbnpmconf');

var boilerplatesPath = function boilerplatesPath(targetname) {
	return join(__dirname, '../boilerplates/' + targetname);
};

module.exports = function (_ref) {
	var args = _ref.args;


	var subcmd = args[0];

	if (!fsExistsSync(wnpmConfPath)) {
		copyFile(boilerplatesPath('.wbnpmconf'), wnpmConfPath);
		console.log(colors.green('.wbnpmconf is created'));
	}

	if (!subcmd) {
		execCommandSync('npm', ['init'].concat(_toConsumableArray(process.argv.slice(2))));
	} else if (subcmd === 'react') {
		var reactBoilerplates = boilerplatesPath('react');

		copyDir(reactBoilerplates, projectPath);

		console.log(colors.green('react app is initial'));
	}
};