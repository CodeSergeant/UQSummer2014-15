var fs = require("fs");
var inputFile = "./wifi.lua";
var outputFile = "./upload3.txt"

var file = fs.openSync(inputFile, "r");
console.log(file);
fs.closeSync();
