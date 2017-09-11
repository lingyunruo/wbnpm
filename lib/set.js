'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('path'),
    join = _require.join;

var _require2 = require('colors'),
    green = _require2.green;

var projectPath = process.cwd();
var configPath = join(projectPath, '.wbnpmconf');
var boilerplatesConfigPath = join(__dirname, '../boilerplates/.wbnpmconf');

var _require3 = require('./utils'),
    fsExistsSync = _require3.fsExistsSync,
    getConfig = _require3.getConfig,
    setConfig = _require3.setConfig,
    execCommandSync = _require3.execCommandSync,
    copyFile = _require3.copyFile;

var configKeyList = ['domain', 'group', 'alias'];

module.exports = function (_ref) {
	var args = _ref.args;


	if (!fsExistsSync(configPath)) {
		copyFile(boilerplatesConfigPath, configPath);
	}

	if (configKeyList.indexOf(args[0]) >= 0) {

		if (args.length === 2) {
			setConfig(args[0], args[1]);
		} else if (args.length === 3) {
			var subconfig = getConfig(args[0]) || {};

			subconfig[args[1]] = args[2];

			setConfig(args[0], subconfig);
		}
		console.log(green(args[0] + ' is set'));
	} else {
		execCommandSync('npm', ['install'].concat(_toConsumableArray(process.argv.slice(2))));
	}
};