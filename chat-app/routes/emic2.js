//Power is connected to pin4 (5V), ground is pin6, tx (output) is pin 8,
// rx (input) is pin10

var async = require('async');


function report (msg) {
	console.log(msg)
};

function emicRep (msg) {
	//io.emit('emic message', msg);
};
//io.emit('emic message', 'hello to all from emic');

/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort('/dev/ttyAMA0', {
	baudRate: 9600
});
*/


module.exports = function (io) {
	function executeFn (arr, callback) {
		var num = arr.length
		var execStr = 'EMIC.'
		var firstArg = arr[0].toString('ascii');
		switch (arr.length) {
			case 1:
				execStr = execStr + firstArg + '()';
				eval(execStr);
				break;
			case 2:
				execStr = execStr + firstArg + '('
					+ arr[1].toString('ascii') + ')';
				eval(execStr);
				break;
			default:
				execStr = execStr + firstArg + '(['
					+ arr.splice(0,1).join() + '])';
				eval(execStr);
				break;
		};
		callback();
	};

	function report (msg) {
		io.emit('emic message', msg);
		console.log('EMIC: ' + msg);
	};

	var SerialPort = require('serialport').SerialPort;
	var serialPort = new SerialPort('/dev/ttyAMA0', {
		baudRate: 9600
	});
	report('Successfully loaded SerialPort module');
	report('Successfully initialised /dev/ttyAMA0');
	var masterqueue = async.queue(emicCom, 1);
	masterqueue.drain = function () {
		report('EMIC is standing by for a command');
	};

	var isReady = false;

	
	function emicCom (obj, callback) {
		isReady = false;
		obj.port.write(obj.data);
		while (isReady = false) {
			setTimeout( function () {}, 50);
		}
		callback();
	};

	var EMIC = {};

	EMIC.speak = function (data) {
		data = data.toString('ascii');
		if (data.length > 1000) {
			report('Warning: Message exceeds 1000 characters');
		} else {
			masterqueue.push({
				port: serialPort,
				data: ':S' + data + '\r'
			}, report('Finished reading: ' + data));
		};
	},

	EMIC.report = function (msg) {
		io.emit('emic message', msg);
	};

	EMIC.demo = function (id) {
		id = id.toString('ascii');
		if (id == '0' || id == '1' || id == '2') {
			emicCom({
				port: serialPort, 
				data: ':D' + id + '\r'
			}, report('Changed voice to: ' + data));
		} else {
			report('Error: Invalid Command');
		};
	};

	EMIC.stopNow = function () {
		emicCom({
			port: serialPort,
			data: ':X\r'
		}, report('EMIC has stopped'));
	};

	EMIC.pause = function () {
		emicCom({
			port: serialPort,
			data: ':Z\r'
		}, report('EMIC has been paused. \
			Use the pause command to resume'));
	};

	EMIC.voice = function (id) {
		var idN = id.parseInt();
		if (idN >= 0 && idN <= 8) {
			id.toString('ascii');
			emicCom({
				port: serialPort,
				data: ':N' + id + '\r'
			}, report('The speaking voice has \
				been changed to: ' + id));
		} else {
			report('Error: Invalid Command');
		};
	};

	EMIC.volume = function (level) {
		var levelN = id.parseInt();
		if (levelN >= -48 && levelN <= 18) {
			level = level.toString('ascii');
			emicCom({
				port: serialPort,
				data: ':V' + level + '\r'
			}, report('The volume has been changed to: ' 
				+ level + ' dB'));
		} else {
			report('Error: Invalid Command');
		};
	};

	EMIC.rate = function (wpm) {
		var wpmN = wpm.parseInt();
		if (wpmN >= 75 && wpmN <= 600) {
			wpm = wpm.toString('ascii');
			emicCom({
				port: serialPort,
				data: ':W' + wpm + '\r'
			}, report('The speaking rate has been changed to: ' 
				+ wpm + ' wpm'));
		} else {
			report('Error: Invalid Command');
		};
	};

	EMIC.chooseParser = function (id) {
		id = id.toString('ascii');
		if (parser == '0' || parser == '1' || parser == '2') {
			emicCom({
				port: serialPort,
				data: ':P' + id + '\r'
			}, report('The parser has been changed to: '
				+ id));
		} else {
			report('Error: Invalid Command');
		};
	};

	EMIC.revert = function () {
		emicCom({
			port: serialPort,
			data: ':R\r'
		}, report('EMIC has been reverted to the default settings'));
	};

	EMIC.callCurrentSettings = function () {
		emicCom({
			port: serialPort,
			data: ':C\r'
		}, function () {});
	};

	EMIC.callVersionInfo = function () {
		emicCom({
			port: serialPort,
			data: ':I\r'
		}, function () {});
	};

	EMIC.callCommands = function () {
		emicCom({
			port: serialPort,
			data: ':H\r'
		}, function () {});
	};

	EMIC.parse = function (msg) {
		msgEdit = msg.toString('ascii').trim();
		args = msg.split(' ');
		while ((args.length != 0) && (args[0].search(':') != -1)) {
			switch(args[0].split(':')[0].toLowerCase()) {
				case 'demo':
					this.demo(args[1]);
					args.splice(0,2);
					break;
				case 'stop':
					this.stopNow();
					args.splice(0,1);
					break;
				case 'pause':
					this.pause();
					args.splice(0,1);
					break;
				case 'voice':
					this.voice(args[1]);
					args.splice(0,2);
					break;
				case 'volume':
					this.volume(args[1]);
					args.splice(0,2);
					break;
				case 'rate':
					this.rate(args[1]);
					args.splice(0,2);
					break;
				case 'parser':
					this.chooseParser(args[1]);
					args.splice(0,2);
					break;
				case 'revert':
					this.revert();
					args.splice(0,1);
					break;
				case 'settings':
					this.callCurrentSettings();
					args.splice(0,1);
					break;
				case 'version':
					this.callVersionInfo();
					args.splice(0,1);
					break;
				case 'commands':
					this.callCommands();
					args.splice(0,1);
					break;
				default:
					this.report('Invalid Command');
					this.speak(args.join(' '));
					args = [];
					break;
			};
		};
		this.speak(args.join(' '));
		args = [];
	};
	io.on('connection', function (socket) {
		io.emit('emic message', 'hello world from emic');
		socket.on('user message', function (msg) {
			EMIC.parse(msg);
			io.emit('emic message', 'ECHO: ' + msg);
		});
		serialPort.on('open', function () {
			isReady = true;
			report('Port is open')
			serialPort.on('data', function(msg) {
				msg = msg.toString('ascii');
				if (msg == ':') {
					console.log('Emic is ready for an instruction')
				} else if (msg == ':?') {
					report('Invalid instruction');
				} else {
					report(msg);
				};
				isReady = true
				serialPort.flush();
			});
		});
	});
	return EMIC;
};

	/*var EMIC = {
		init: function () {
			serialPort.on('open', function () {
				//repEmic('Hello world')
				report('Port is open')
				isOpen = true;
				serialPort.on('data', function(msg) {
					msg = msg.toString('ascii');
					//console.log(msg);
					serialPort.flush();
					if (msg == ':') {
						isReady = true
						console.log('Emic is ready for an instruction')
					} else { console.log('errorcheck '+msg)}
				});
			});
		
		},*/
/*function writeLog(logFile, output){
	var logf = new File(logFile);
	logf.writeln(output);
	logf.close()*/

//serialPort.write(':S[wiy<400,20>wih<300,25>sh<100>yu<200>ax<200,27>meh<200,25>riy<200,24>krih<300,22>s<100>mah<300>s<100>wih<400>wih<300,27>sh<100>yu<200>ax<200,29>meh<200,27>riy<200,25>krih<300,24>s<100>mah<300,20>s<100>wih<400>wih<300,29>sh<100>yu<200>ax<200,30>meh<200,29>riy<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100> GUH<300,20>D<100>TAY<400,25>DIH<200>NX<100>Z<100>TUW<400>YU<800,24>WER<400>EH<400,25>VRR<400,24>YU<400,22>AR<800,20>GUH<300,27>D<100>TAY<400,29>DIH<200,27>NX<100>Z<100>FOR<400,25>KRIH<300,32>S<100>MAH<300,20>S<100>AE<100>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100> WIY<400,20>WIH<300,25>SH<100>YU<200>AX<200,27>MER<200,25>RIY<200,24>KRIH<300,22>S<100>MAH<300>S<100>WIY<400>WIH<300,27>SH<100>YU<200>AX<200,29>MEH<200,27>RIY<200,25>KRIH<300,24>S<100>MAH<300,20>S<100>WIY<400>WIH<300,29>SH<100>YU<200>AX<200,30>MEH<200,29>RIY<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<800,25>]\r');
//serialPort.write(':S[:PHONE ON] [:nv] [:dv gn 75] [wiy<400,20>wih<300,25>sh<100>yu<200>ax<200,27>meh<200,25>riy<200,24>krih<300,22>s<100>mah<300>s<100>wih<400>wih<300,27>sh<100>yu<200>ax<200,29>meh<200,27>riy<200,25>krih<300,24>s<100>mah<300,20>s<100>wih<400>wih<300,29>sh<100>yu<200>ax<200,30>meh<200,29>riy<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100>]. [GUH<300,20>D<100>TAY<400,25>DIH<200>NX<100>Z<100>TUW<400>YU<800,24>WER<400>EH<400,25>VRR<400,24>YU<400,22>AR<800,20>GUH<300,27>D<100>TAY<400,29>DIH<200,27>NX<100>Z<100>FOR<400,25>KRIH<300,32>S<100>MAH<300,20>S<100>AE<100>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100>]. [WIY<400,20>WIH<300,25>SH<100>YU<200>AX<200,27>MER<200,25>RIY<200,24>KRIH<300,22>S<100>MAH<300>S<100>WIY<400>WIH<300,27>SH<100>YU<200>AX<200,29>MEH<200,27>RIY<200,25>KRIH<300,24>S<100>MAH<300,20>S<100>WIY<400>WIH<300,29>SH<100>YU<200>AX<200,30>MEH<200,29>RIY<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<800,25>].\r');

