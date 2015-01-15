//Power is connected to pin4 (5V), ground is pin6, tx (output) is pin 8,
// rx (input) is pin10
//var ASQ = require('asynquence');
var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort('/dev/ttyAMA0', {
	baudRate: 9600
});
var async = require('async');
//var io = require('socket.io')();

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
report('Successfully loaded SerialPort module');
report('Successfully initialised /dev/ttyAMA0');
module.exports = function (io) {
	var masterqueue = async.queue()
	io.on('connection', function (socket) {
		//report('EMIC is connected');
		io.emit('emic message', 'hello world from emic');
		socket.on('user message', function (msg) {
			io.emit('emic message', 'ECHO: ' + msg);
		});
	})
	var EMIC = {
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
		/*serialPort.write(':P0\r');
		serialPort.drain();
		serialPort.write(':S[wiy<400,20>wih<300,25>sh<100>yu<200>ax<200,27>meh<200,25>riy<200,24>krih<300,22>s<100>mah<300>s<100>wih<400>wih<300,27>sh<100>yu<200>ax<200,29>meh<200,27>riy<200,25>krih<300,24>s<100>mah<300,20>s<100>wih<400>wih<300,29>sh<100>yu<200>ax<200,30>meh<200,29>riy<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100> GUH<300,20>D<100>TAY<400,25>DIH<200>NX<100>Z<100>TUW<400>YU<800,24>WER<400>EH<400,25>VRR<400,24>YU<400,22>AR<800,20>GUH<300,27>D<100>TAY<400,29>DIH<200,27>NX<100>Z<100>FOR<400,25>KRIH<300,32>S<100>MAH<300,20>S<100>AE<100>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100> WIY<400,20>WIH<300,25>SH<100>YU<200>AX<200,27>MER<200,25>RIY<200,24>KRIH<300,22>S<100>MAH<300>S<100>WIY<400>WIH<300,27>SH<100>YU<200>AX<200,29>MEH<200,27>RIY<200,25>KRIH<300,24>S<100>MAH<300,20>S<100>WIY<400>WIH<300,29>SH<100>YU<200>AX<200,30>MEH<200,29>RIY<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<800,25>]\r');
		serialPort.write(':S[:PHONE ON] [:nv] [:dv gn 75] [wiy<400,20>wih<300,25>sh<100>yu<200>ax<200,27>meh<200,25>riy<200,24>krih<300,22>s<100>mah<300>s<100>wih<400>wih<300,27>sh<100>yu<200>ax<200,29>meh<200,27>riy<200,25>krih<300,24>s<100>mah<300,20>s<100>wih<400>wih<300,29>sh<100>yu<200>ax<200,30>meh<200,29>riy<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100>]. [GUH<300,20>D<100>TAY<400,25>DIH<200>NX<100>Z<100>TUW<400>YU<800,24>WER<400>EH<400,25>VRR<400,24>YU<400,22>AR<800,20>GUH<300,27>D<100>TAY<400,29>DIH<200,27>NX<100>Z<100>FOR<400,25>KRIH<300,32>S<100>MAH<300,20>S<100>AE<100>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100>]. [WIY<400,20>WIH<300,25>SH<100>YU<200>AX<200,27>MER<200,25>RIY<200,24>KRIH<300,22>S<100>MAH<300>S<100>WIY<400>WIH<300,27>SH<100>YU<200>AX<200,29>MEH<200,27>RIY<200,25>KRIH<300,24>S<100>MAH<300,20>S<100>WIY<400>WIH<300,29>SH<100>YU<200>AX<200,30>MEH<200,29>RIY<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<800,25>].\r');
		*/
			
		},

		speak: function (data) {
			data = data.toString('ascii');
			while (isOpen == false) {};
			if (data.length > 1000) {
				console.log('Error: Message exceeds the character limit');
			} else {
				//serialPort.write(':SHello World to all\r');
				serialPort.write(':S' + data + '\r');
				console.log(':S' + data + '\r');
				isReady = false

				console.log('Emic is busy')
				io.emit('emic message', 'Emic is busy')
			};
		},

		report: function (msg) {
			io.emit('emic message', msg);
		},

		demo: function (id) {
			id = id.toString('ascii');
			if (id == '0' || id == '1' || id == '2') {
				serialPort.write(':D' + id + '\r');
			} else {
				console.log('Error: Invalid Command');
			};
		},

		stopNow: function () {
			serialPort.write(':X\r');
		},

		pause: function () {
			serialPort.write(':Z\r');
		},

		voice: function (id) {
			var idN = id.parseInt();
			if (idN >= 0 && idN <= 8) {
				id.toString('ascii');
				serialPort.write(':N' + id + '\r');
			} else {
				console.log('Error: Invalid Command');
			};
		},

		volume: function (level) {
			var levelN = id.parseInt();
			if (levelN >= -48 && levelN <= 18) {
				level = level.toString('ascii');
				serialPort.write(':V' + level + '\r');
			} else {
				console.log('Error: Invalid Command');
			};
		},

		rate: function (wpm) {
			var wpmN = wpm.parseInt();
			if (wpmN >= 75 && wpmN <= 600) {
				wpm = wpm.toString('ascii');
				serialPort.write(':W' + wpm + '\r');
			} else {
				console.log('Error: Invalid Command');
			};
		},

		parser: function (id) {
			id = id.toString('ascii');
			if (parser == '0' || parser == '1' || parser == '2') {
				serialPort.write(':P' + id + '\r');
			} else {
				console.log('Error: Invalid Command');
			};
		},

		revert: function () {
			serialPort.write(':R\r');
		},

		callCurrentSettings: function () {
			serialPort.write(':C\r');
		},

		callVersionInfo: function () {
			serialPort.write(':I\r');
		},

		callCommands: function () {
			serialPort.write(':I\r');
		},

		executeFn: function (arr) {
			var num = arr.length
			var execStr = 'this.'
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
			}
		},

		parser: function (msg) {
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
						this.parser(args[1]);
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
						this.speak(args.join(''));
						args = [];
						break;
				}
			}
			this.speak(args.join(''));
			args = [];
		}
	};
	EMIC.masterqueue = async.queue(EMIC.executeFn, 1);
	EMIC.masterqueue.
	return EMIC;
};


/*function writeLog(logFile, output){
	var logf = new File(logFile);
	logf.writeln(output);
	logf.close()*/



