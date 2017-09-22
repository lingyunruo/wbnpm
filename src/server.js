const fs = require('fs');
const koa = require('koa');
const opn = require('opn');
const path = require('path');
const _ = require('lodash');
const mime = require('mime');

const projectDir = process.cwd();
const tpl = fs.readFileSync(path.join(__dirname, '../boilerplates/serverpage/index.html'));
const compiler = _.template(tpl);



module.exports = function () {

	const app = new koa();

	app.use(async function (ctx, next) {
		let url = ctx.req.url;
		let extname = path.extname(url);

		if(extname) {
			ctx.type = mime.lookup(path.resolve(`${projectDir}/${url}`));
		}
		else {
			ctx.type = 'text/html';
		}

		await next();
	});

	app.use(async function (ctx) {
		let url = ctx.req.url;

		let content = getContent(path.resolve(`${projectDir}/${url}`), url);

		if(typeof content === 'string') {
			ctx.body = content;
		}
		else if(typeof content === 'object'){
			ctx.body = content.toString();
		}
	});


	app.listen(3000);

	console.log('Please open http://127.0.0.1:3000');
};



function getContent(dir, currentUrl) {
	let content = '';
	try {
		let stats = fs.statSync(dir);
		if(stats.isDirectory()) {
			const dirList = fs.readdirSync(dir);
			content = compiler({
				list: dirList,
				currentUrl: currentUrl === '/' ? '': currentUrl
			});
		}
		else if(stats.isFile()) {
			content = fs.readFileSync(dir, 'utf-8');
		}
	}
	catch(e) {
		content = e;
	}

	return content;
}