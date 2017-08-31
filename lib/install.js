'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('path'),
    join = _require.join;

var colors = require('colors');
var EventEmitter = require('events');

var MyEmitter = function (_EventEmitter) {
	_inherits(MyEmitter, _EventEmitter);

	function MyEmitter() {
		_classCallCheck(this, MyEmitter);

		return _possibleConstructorReturn(this, (MyEmitter.__proto__ || Object.getPrototypeOf(MyEmitter)).apply(this, arguments));
	}

	return MyEmitter;
}(EventEmitter);

var myEmitter = new MyEmitter();

var _require2 = require('./utils'),
    existGit = _require2.existGit,
    gitClone = _require2.gitClone,
    getConfig = _require2.getConfig,
    execCommandSync = _require2.execCommandSync,
    fsExistsSync = _require2.fsExistsSync,
    createDir = _require2.createDir,
    copyDir = _require2.copyDir,
    rmDir = _require2.rmDir,
    setDependencies = _require2.setDependencies,
    getPkg = _require2.getPkg;

var projectCwd = process.cwd();

function install(moduleName) {

	var cacheCwd = join(projectCwd, '.cache_' + new Date().getTime());
	var alias = getConfig('alias') ? getConfig('alias')[moduleName] : {};
	var gitDomain = getConfig('domain');
	var gitGroup = getConfig('group');
	var gitUrl = alias ? alias : 'git@' + gitDomain + ':' + gitGroup + '/' + moduleName + '.git';
	var nodeModuleDir = join(projectCwd, 'node_modules');
	var moduleDir = join(projectCwd, 'node_modules/' + moduleName);
	var git = existGit(gitUrl);

	if (git) {
		gitClone(gitUrl, cacheCwd);

		if (!fsExistsSync(nodeModuleDir)) {
			createDir(nodeModuleDir);
		}
		if (fsExistsSync(moduleDir)) {
			rmDir(moduleDir);
		}
		createDir(moduleDir);

		var complete = copyDir(cacheCwd, moduleDir);
		setDependencies(moduleName, '0.0.0');

		if (complete) {
			console.log(colors.green('Module ' + moduleName + ' is installed'));
		}

		rmDir(cacheCwd);
	} else {
		execCommandSync('npm', ['install'].concat(_toConsumableArray(process.argv.slice(2))));
	}

	myEmitter.emit('event', moduleName);
}

module.exports = function (_ref) {
	var args = _ref.args;


	var moduleName = args[0];

	if (moduleName) {
		install(moduleName);
	} else {
		var wbdependencies = getPkg('WBDependencies');
		var modulelist = Object.keys(wbdependencies);

		var count = 0;

		myEmitter.on('event', function (modulename) {
			count++;
			if (modulelist[count]) {
				install(modulelist[count]);
			} else {
				execCommandSync('npm', ['install'].concat(_toConsumableArray(process.argv.slice(2))));
			}
		});

		install(modulelist[count]);
	}
};