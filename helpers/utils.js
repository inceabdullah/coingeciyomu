const path = require("path");
exports.waitSec = (sec) => new Promise((resolve)=>setTimeout(resolve, sec*1000));
exports.getAllMatches = (text, regexp) => Array.from(text.matchAll(regexp), m => m[0]);
exports.pathJoin = path.join;
