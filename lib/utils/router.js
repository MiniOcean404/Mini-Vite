const path = require('path');
const { rewriteImport } = require('./replace');
const fs = require('fs');
const mime = require('mime');
const { getPath } = require('./paths');

const compilerSfc = require('@vue/compiler-sfc'); // .vue
const compilerDom = require('@vue/compiler-dom'); // 模板

// * path.resolve：根据当前项目路径进行拼接如果为 / 直接吧当前的目录拼接为 D:/
// * path.join：往后添加地址
let filePath = undefined;
module.exports = function (ctx, url, query) {
	if (url === '/' || url.endsWith('.js') || path.extname(url) === '.js') {
		if (url === '/') {
			filePath = getPath('index.html');
		} else {
			filePath = getPath(url);
		}

		ctx.type = mime.getType(filePath);
		ctx.body = rewriteImport(fs.readFileSync(filePath, 'utf-8'));
	}

	if (url.startsWith('/@modules/')) {
		const prefix = path.resolve('node_modules', url.replace('/@modules/', ''));
		const module = require(prefix + '/package.json').module;
		filePath = path.join(prefix, module);

		ctx.type = 'application/javascript';
		ctx.body = rewriteImport(fs.readFileSync(filePath, 'utf-8'));
	} else if (url.endsWith('.css')) {
		filePath = path.join(process.cwd(), url);
		const file = fs.readFileSync(filePath, 'utf-8');
		const content = `
			 const css = "${file.replace(/\r\n/g, '')}"
			 let link = document.createElement('style')
			 link.setAttribute('type', 'text/css')
			 document.head.appendChild(link)
			 link.innerHTML = css 
			 export default css
		`;
		ctx.type = 'application/javascript';
		ctx.body = content;
	} else if (url.indexOf('.vue') > -1) {
		// vue单⽂件组件
		filePath = path.resolve(process.cwd(), url.split('?')[0].slice(1));
		const { descriptor } = compilerSfc.parse(fs.readFileSync(filePath, 'utf-8'));
		const template = descriptor.template;

		if (query.type === undefined) {
			ctx.type = 'application/javascript';
			// 借⽤vue⾃导的compile框架 解析单⽂件组件，其实相当于vue-loader做的事情
			// * 导入下方compilerDom编译的VNode 并将 script标签的内容添加上Render VNode进行导出
			ctx.body = `
			 import { render as __render } from "${url}?type=template"
			 ${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))}
			 __script.render = __render 
			 export default __script
			 `;
		} else if (query.type === 'template') {
			// * 在server端将template编译为VNode
			const render = compilerDom.compile(template.content, { mode: 'module' }).code;
			ctx.type = 'application/javascript';
			ctx.body = rewriteImport(render);
		}
	}
};
