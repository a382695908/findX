var connect = require('connect');
var serveStatic = require('serve-static');
console.log("Static dir name: " + __dirname);
connect().use(serveStatic(__dirname)).listen(8080);
