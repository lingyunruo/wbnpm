const {join} = require('path');
const {green} = require('colors');

const projectPath = process.cwd();
const configPath = join(projectPath, '.wbnpmconf');
const boilerplatesConfigPath = join(__dirname, '../boilerplates/.wbnpmconf');

const {
	fsExistsSync,
	getConfig,
	setConfig,
	execCommandSync
} = require('./utils');

const configKeyList = ['domain', 'group', 'alias'];

module.exports = function({args}) {


	if(!fsExistsSync(configPath)) {
		copyFile(boilerplatesConfigPath, configPath);
	}

	if(configKeyList.indexOf(args[0]) >= 0) {

		if (args.length === 2) {
			setConfig(args[0], args[1]);
		}
		else if (args.length === 3) {
			let subconfig = getConfig(args[0]) || {};

			subconfig[args[1]] = args[2];

			setConfig(args[0], subconfig);
		}
		console.log(green(`${args[0]} is set`));
	}
	else {
		execCommandSync('npm', ['install', ...process.argv.slice(2)]);
	}
};