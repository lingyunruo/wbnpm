const { join } = require('path');
const colors = require('colors');

const {
	rmDir,
	fsExistsSync,
	getPkg,
	removeDependencies,
	execCommandSync
} = require('./utils');

const projectCwd = process.cwd();

module.exports = function ({ args }) {
	const moduleName = args[0];
	const moduleDir = join(projectCwd, `node_modules/${moduleName}`);
	const wbDependencies = getPkg('WBDependencies');

	if (fsExistsSync(moduleDir) && wbDependencies[moduleName]) {
		rmDir(moduleDir);
		removeDependencies(moduleName);
		console.log(colors.green(`module ${moduleName} is uninstalled`));
	} else {
		execCommandSync('npm', ['uninstall', ...process.argv.slice(2)]);
	}
};