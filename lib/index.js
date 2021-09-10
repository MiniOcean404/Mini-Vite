const koa = require('koa');
const app = new koa();
const router = require('./utils/router.js');

// const compilerSfc = require('@vue/compiler-sfc'); // .vue
// const compilerDom = require('@vue/compiler-dom'); // 模板
let i = 1;

app.use((ctx) => {
	const {
		request: { url, query },
	} = ctx;
	console.log(`第${i++}次`);
	console.log(`地址：${url}`);
	console.log(`参数:`, query, '\r\n\r\n');

	router(ctx, url, query);
});

app.listen(80, () => {
	console.log(`Vite服务器运行在:http://127.0.0.1\r\n`);
});
