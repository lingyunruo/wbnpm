#!/usr/bin/env node

const fs = require('fs');
const {join} = require('path');
const program = require('commander');
const {fsExistsSync} = require('./lib/utils');
const {spawn} = require('child_process');
const which = require('which');
const {execCommandSync} = require('./lib/utils');

program
	.usage('<command> [options]')
	.parse(process.argv);

const args = process.argv.slice(3);
let subcmd = program.args[0];

if(subcmd) {
	const bin = executable(subcmd);

	if(bin) {
		console.log(bin);
		wrap(spawn(bin, args, {stdio: 'inherit'}));
	}
}

function wrap(sp) {
	sp.on('close', function(code) {
		process.exit(code);
	});
}

function executable(subcmd) {
	const file = join(__dirname, `./bin/${subcmd}`);

	if(fsExistsSync(file)) {
		return file;
	}
	else {
		console.log(which.sync('npm'));
		execCommandSync('npm', [subcmd, ...args]);
		return false;
	}
}