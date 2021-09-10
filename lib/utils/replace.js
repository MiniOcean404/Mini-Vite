// * 替换找node_module里的包文件的路径
// * 必须替换为/xxx才能进行 ESModule化 否则报错
const fs = require('fs');

function rewriteImport(content) {
	// * ['|"]匹配单引双引 ([^'"]+) 匹配 1个或多个非单双引的符号
	return content.replace(/ from ['|"]([^'"]+)['|"]/gi, function (s0, s1) {
		if (s1[0] !== '.' && s1[1] !== '/') {
			return `from '/@modules/${s1}'`;
		} else {
			return s0;
		}
	});
}

module.exports = { rewriteImport };
