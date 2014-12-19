//Power is connected to pin4 (5V), ground is pin6, tx (output) is pin 8,
// rx (input) is pin10

var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort('/dev/ttyAMA0', {
	baudRate: 9600
});
var EMIC = (function() {
var isOpen = false;

var emic = {};
emic.init = function () {
	
	console.log('Successfully loaded SerialPort module');

	console.log('Successfully initialised /dev/ttyAMA0');

	serialPort.on('open', function () {
		console.log('Port is open')
		isOpen = true;
		serialPort.on('data', function(msg) {
			console.log(msg.toString('ascii'));
		});
		serialPort.write(':SHello World to all\r');
	});
};
emic.speak = function (data) {
	data = data.toString('ascii');
	while (isOpen == false) {};
	if (data.length > 1000) {
		console.log('Error: Message exceeds the character limit');
	} else {
		//serialPort.write(':SHello World to all\r');
		serialPort.write(':S' + data + '\r');
		console.log(':S' + data + '\r');
	};
};

emic.demo = function (id) {
	id = id.toString('ascii');
	if (id == '0' || id == '1' || id == '2') {
		serialPort.write(':D' + id + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

emic.stopNow = function () {
	serialPort.write(':X\r');
}

emic.pause = function () {
	serialPort.write(':Z\r');
};

emic.voice = function (id) {
	var idN = id.parseInt();
	if (idN >= 0 && idN <= 8) {
		id.toString('ascii');
		serialPort.write(':N' + id + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

emic.volume = function (level) {
	var levelN = id.parseInt();
	if (levelN >= -48 && levelN <= 18) {
		level = level.toString('ascii');
		serialPort.write(':V' + level + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

emic.rate = function (wpm) {
	var wpmN = wpm.parseInt();
	if (wpmN >= 75 && wpmN <= 600) {
		wpm = wpm.toString('ascii');
		serialPort.write(':W' + wpm + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

emic.parser = function (id) {
	id = id.toString('ascii');
	if (parser == '0' || parser == '1' || parser == '2') {
		serialPort.write(':P' + id + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

emic.revert = function () {
	serialPort.write(':R\r');
};

emic.callCurrentSettings = function () {
	serialPort.write(':C\r');
};

emic.callVersionInfo = function () {
	serialPort.write(':I\r');
};

emic.callCommands = function () {
	serialPort.write(':I\r');
};
return emic
}());


/*function writeLog(logFile, output){
	var logf = new File(logFile);
	logf.writeln(output);
	logf.close()*/

module.exports = EMIC;

