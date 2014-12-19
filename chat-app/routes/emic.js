//Power is connected to pin4 (5V), ground is pin6, tx (output) is pin 8,
// rx (input) is pin10

var SerialPort = require('serialport').SerialPort;
console.log('Successfully loaded SerialPort module');

var serialPort = new SerialPort('/dev/ttyAMA0', {
	baudRate: 9600
});
console.log('Successfully initialised /dev/ttyAMA0');

serialPort.on('open', function () {
	console.log('Port is open')
	serialPort.on('data', function(msg) {
		console.log(msg.toString('ascii'));
	});
	serialPort.write(':SHello World to all\r');
});
		
function emic.speak(data) {
	data = data.toString('ascii');
	if (data.length > 1000) {
		console.log('Error: Message exceeds the character limit');
	} else {
		serialPort.write(':S'+ data + '\r');
	};
};

function emic.demo(id) {
	id = id.toString('ascii');
	if (id == '0' || id == '1' || id == '2') {
		serialPort.write(':D' + id + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

function emic.stopNow() {
	serialPort.write(':X\r');
}

function emic.pause() {
	serialPort.write(':Z\r');
};

function emic.voice(id) {
	var idN = id.parseInt();
	if (idN >= 0 && idN <= 8) {
		id.toString('ascii');
		serialPort.write(':N' + id + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

function emic.volume(level) {
	var levelN = id.parseInt();
	if (levelN >= -48 && levelN <= 18) {
		level = level.toString('ascii');
		serialPort.write(':V' + level + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

function emic.rate(wpm) {
	var wpmN = wpm.parseInt();
	if (wpmN >= 75 && wpmN <= 600) {
		wpm = wpm.toString('ascii');
		serialPort.write(':W' + wpm + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

function emic.parser(id) {
	id = id.toString('ascii');
	if (parser == '0' || parser == '1' || parser == '2') {
		serialPort.write(':P' + id + '\r');
	} else {
		console.log('Error: Invalid Command');
	};
};

function emic.revert() {
	serialPort.write(':R\r');
};

function emic.callCurrentSettings() {
	serialPort.write(':C\r');
};

function emic.callVersionInfo() {
	serialPort.write(':I\r');
};

function emic.callCommands() {
	serialPort.write(':I\r');
}; 

/*function writeLog(logFile, output){
	var logf = new File(logFile);
	logf.writeln(output);
	logf.close()*/

modules.exports = emic

