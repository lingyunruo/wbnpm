const fs = require('fs');
const { join } = require('path');
const { spawnSync, execSync } = require('child_process');
const color = require('colors');
const which = require('which');
const projectcwd = process.cwd();

const ignoreList = ['.git', '.gitignore', 'node_modules', '.DS_Store', '.idea'];

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

	let dirList = fs.readdirSync(dir);

	if (dirList.length === 0) {
		fs.rmdirSync(dir);
	} else {
		dirList.map(filedir => {

			let stats = fs.statSync(join(dir, filedir));

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

	let res = spawnSync('git', ['clone', gitUrl, targetDir], {
		stdio: 'pipe'
	});
	return res;
}

// 复制一个目录
function copyDir(src, dst) {
	try {
		let demoFiles = fs.readdirSync(src);

		demoFiles.map(file => {
			if (ignoreList.indexOf(file) < 0) {
				let fileDir = join(src, file);
				let tarDir = join(dst, file);
				let stat = fs.statSync(fileDir);

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
		console.log(color.red(`ERROR ${e}`));
		// rmDir(dst);
		return false;
	}
}

// 复制一个文件
function copyFile(src, dst) {
	try {
		let resdStream = fs.createReadStream(src);
		let writeStream = fs.createWriteStream(dst);

		resdStream.pipe(writeStream);
		// console.log(color.green(`${dst} copy success`));
	} catch (e) {
		console.log('copy Error', e);
	}
}

// 检测远程仓库是否存在
function existGit(url) {

	let res = spawnSync(which.sync('git'), ['remote', 'show', url], {
		stdio: 'pipe'
	});

	return !(res.status === 128);
}

// 获取配置文件
let wnpmConfig = null;
function getConfig(key) {
	let config = {};
	if (wnpmConfig) {
		config = wnpmConfig;
	} else {
		try {
			let content = fs.readFileSync(join(projectcwd, '.wbnpmconf'), 'utf-8');
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
	let config = getConfig();

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
	const cmdDir = which.sync(cmd);
	console.log(cmdDir);
	let res = spawnSync(cmdDir, args, {
		stdio: 'inherit'
	});

	return res;
}

// 创建目录
function createDir(path) {
	try {
		fs.mkdirSync(path);
	} catch (err) {
		console.log(`error: ${err}`);
	}
}

function createFile(filepath, content) {
	try {
		fs.writeFileSync(filepath, content);
	} catch (e) {
		console.log(colors.red(`creat file ${filepath} failed`));
		console.log(e);
	}
}

// 获取packagejson文件
let pkg = null;
function getPkg(key) {
	let config = {};
	if (pkg) {
		config = pkg;
	} else {
		try {
			let content = fs.readFileSync(join(projectcwd, 'package.json'));
			content = JSON.parse(content);

			config = content;
		} catch (e) {
			console.log(`error: ${e}`);
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
		console.log(`set package.json error: ${e}`);
		return false;
	}
}

// 设置依赖
function setDependencies(name, version) {
	let pkg = getPkg();

	pkg['WBDependencies'] = pkg['WBDependencies'] || {};
	pkg['WBDependencies'][name] = version;

	setPkg(pkg);

	return true;
}

// 移出依赖
function removeDependencies(name) {

	let pkg = getPkg();

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