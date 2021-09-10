const path = require('path');

function getPath(v) {
	return path.join(process.cwd(), v);
}

module.exports = { getPath };
