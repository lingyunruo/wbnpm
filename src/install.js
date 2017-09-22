const {join} = require('path');
const colors = require('colors');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
}
const myEmitter = new MyEmitter();

const {
	gitClone,
	getConfig,
	execCommandSync,
	fsExistsSync,
	createDir,
	copyDir,
	rmDir,
	setDependencies,
	getPkg
} = require('./utils');
const projectCwd = process.cwd();

function install(moduleName) {

	const cacheCwd = join(projectCwd, `.cache_${new Date().getTime()}`);
	const alias = getConfig('alias') ? getConfig('alias')[moduleName] : {};
	const gitDomain = getConfig('domain');
	const gitGroup = getConfig('group');
	const gitUrl = alias ? alias : `git@${gitDomain}:${gitGroup}/${moduleName}.git`;
	const nodeModuleDir = join(projectCwd, 'node_modules');
	const moduleDir = join(projectCwd, `node_modules/${moduleName}`);

	let res = gitClone(gitUrl, cacheCwd);

	if (res.status === 0) {
		if (!fsExistsSync(nodeModuleDir)) {
			createDir(nodeModuleDir);
		}
		if (fsExistsSync(moduleDir)) {
			rmDir(moduleDir);
		}
		createDir(moduleDir);

		let complete = copyDir(cacheCwd, moduleDir);
		setDependencies(moduleName, '0.0.0');

		if (complete) {
			console.log(colors.green(`Module ${moduleName} is installed`));
		}

		rmDir(cacheCwd);
	} else {
		execCommandSync('npm', ['install', ...process.argv.slice(2)]);
	}

	myEmitter.emit('event', moduleName);
}

module.exports = function ({args}) {

	const moduleName = args[0];

	if (moduleName) {
		install(moduleName);
	}
	else {
		const wbdependencies = getPkg('WBDependencies');
		const modulelist = Object.keys(wbdependencies);

		let count = 0;

		myEmitter.on('event', (modulename) => {
			count++;
			if (modulelist[count]) {
				install(modulelist[count]);
			}
			else {
				execCommandSync('npm', ['install', ...process.argv.slice(2)]);
			}
		});

		install(modulelist[count]);
	}
};