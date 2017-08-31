'use strict';

var fs = require('fs');

var _require = require('path'),
    join = _require.join;

var _require2 = require('child_process'),
    spawnSync = _require2.spawnSync,
    execSync = _require2.execSync;

var color = require('colors');
var which = require('which');
var projectcwd = process.cwd();

var ignoreList = ['.git', '.gitignore', 'node_modules', '.DS_Store', '.idea'];

// 判断文件是否存在
function fsExistsSync(path) {
	try {
		fs.accessSync(path, fs.F_OK);
	} catch (e) {
		return false;
	}
	return true;
}

// 删除一个目录
function rmDir(dir) {

	var dirList = fs.readdirSync(dir);

	if (dirList.length === 0) {
		fs.rmdirSync(dir);
	} else {
		dirList.map(function (filedir) {

			var stats = fs.statSync(join(dir, filedir));

			if (stats.isFile()) {
				fs.unlinkSync(join(dir, filedir));
			} else if (stats.isDirectory()) {
				rmDir(join(dir, filedir));
			}
		});

		fs.rmdirSync(dir);
	}
}

// 从git仓库克隆到指定文件
function gitClone(gitUrl, targetDir) {

	var res = spawnSync('git', ['clone', gitUrl, targetDir], {
		stdio: 'pipe'
	});
	return res;
}

// 复制一个目录
function copyDir(src, dst) {
	try {
		var demoFiles = fs.readdirSync(src);

		demoFiles.map(function (file) {
			if (ignoreList.indexOf(file) < 0) {
				var fileDir = join(src, file);
				var tarDir = join(dst, file);
				var stat = fs.statSync(fileDir);

				if (stat.isFile()) {
					copyFile(fileDir, tarDir);
				} else if (stat.isDirectory()) {
					fs.mkdirSync(tarDir);
					copyDir(fileDir, tarDir);
				}
			}
		});
		return true;
	} catch (e) {
		console.log(color.red('ERROR ' + e));
		// rmDir(dst);
		return false;
	}
}

// 复制一个文件
function copyFile(src, dst) {
	try {
		var resdStream = fs.createReadStream(src);
		var writeStream = fs.createWriteStream(dst);

		resdStream.pipe(writeStream);
		// console.log(color.green(`${dst} copy success`));
	} catch (e) {
		console.log('copy Error', e);
	}
}

// 检测远程仓库是否存在
function existGit(url) {

	var res = spawnSync(which.sync('git'), ['remote', 'show', url], {
		stdio: 'pipe'
	});

	return !(res.status === 128);
}

// 获取配置文件
var wnpmConfig = null;
function getConfig(key) {
	var config = {};
	if (wnpmConfig) {
		config = wnpmConfig;
	} else {
		try {
			var content = fs.readFileSync(join(projectcwd, '.wbnpmconf'), 'utf-8');
			config = JSON.parse(content);
		} catch (err) {
			if (err.code === 'ENOENT') {
				console.log('file is not exist');
			}
		}
	}

	if (key) {
		return config[key];
	} else {
		return config;
	}
}

// 设置配置文件
function setConfig(key, value) {
	var config = getConfig();

	try {
		config[key] = value;
		console.log();
		fs.writeFileSync(join(projectcwd, '.wbnpmconf'), JSON.stringify(config, null, '\t'));
	} catch (e) {
		console.log('set config failed');
	}
}

// 执行子进程命令
function execCommandSync(cmd, args) {
	var cmdDir = which.sync(cmd);
	console.log(cmdDir);
	var res = spawnSync(cmdDir, args, {
		stdio: 'inherit'
	});

	return res;
}

// 创建目录
function createDir(path) {
	try {
		fs.mkdirSync(path);
	} catch (err) {
		console.log('error: ' + err);
	}
}

function createFile(filepath, content) {
	try {
		fs.writeFileSync(filepath, content);
	} catch (e) {
		console.log(colors.red('creat file ' + filepath + ' failed'));
		console.log(e);
	}
}

// 获取packagejson文件
var pkg = null;
function getPkg(key) {
	var config = {};
	if (pkg) {
		config = pkg;
	} else {
		try {
			var content = fs.readFileSync(join(projectcwd, 'package.json'));
			content = JSON.parse(content);

			config = content;
		} catch (e) {
			console.log('error: ' + e);
		}
	}
	if (key) {
		return config[key] || {};
	} else {
		return config;
	}
}

// 设置package.json
function setPkg(pkg) {
	try {
		createFile(join(projectcwd, 'package.json'), JSON.stringify(pkg, null, '\t'));
		return true;
	} catch (e) {
		console.log('set package.json error: ' + e);
		return false;
	}
}

// 设置依赖
function setDependencies(name, version) {
	var pkg = getPkg();

	pkg['WBDependencies'] = pkg['WBDependencies'] || {};
	pkg['WBDependencies'][name] = version;

	setPkg(pkg);

	return true;
}

// 移出依赖
function removeDependencies(name) {

	var pkg = getPkg();

	if (pkg['WBDependencies'][name]) {
		delete pkg['WBDependencies'][name];
	}
	setPkg(pkg);
	return true;
}

exports.fsExistsSync = fsExistsSync;
exports.rmDir = rmDir;
exports.gitClone = gitClone;
exports.copyDir = copyDir;
exports.copyFile = copyFile;
exports.existGit = existGit;
exports.getConfig = getConfig;
exports.setConfig = setConfig;
exports.execCommandSync = execCommandSync;
exports.createDir = createDir;
exports.getPkg = getPkg;
exports.setDependencies = setDependencies;
exports.removeDependencies = removeDependencies;
exports.createFile = createFile;