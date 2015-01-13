var async = require('async');
var num = 3
var num2
function val (num) {
	num2 = num+3 - num*2;
	console.log(num2);
	console.log(num+' hello');
}
async.series([
	console.log(24),
	console.log(eval(num+3)+ 'hello2'),
	val(num),
	console.log(num2)]);
w = new Worker('emic.js');