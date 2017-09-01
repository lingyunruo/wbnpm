const {join} = require('path');
const colors = require('colors');
const {
	fsExistsSync,
	execCommandSync,
	copyFile,
	copyDir
}  = require('./utils');

const projectPath = process.cwd();
const wnpmConfPath = join(projectPath, '.wbnpmconf');

const boilerplatesPath = targetname => join(__dirname, `../boilerplates/${targetname}`);

module.exports = function({args}) {

	const subcmd = args[0];

	if(!fsExistsSync(wnpmConfPath)) {
		copyFile(boilerplatesPath('.wbnpmconf'), wnpmConfPath);
		console.log(colors.green(`.wbnpmconf is created`));
	}

	if(!subcmd) {
		execCommandSync('npm', ['init', ...process.argv.slice(2)]);
	}
	else if(subcmd === 'react') {
		const reactBoilerplates = boilerplatesPath('react');

		copyDir(reactBoilerplates, projectPath);

		console.log(colors.green(`react app is initial`));
	}
};