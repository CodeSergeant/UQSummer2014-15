var EventEmitter = require('events').EventEmitter;
var util = require('util');
var async = require('async');
var SerialPort = require('serialport').SerialPort;

var EMIC = function(port, baudRate) {
	var self = this;

	EventEmitter.call(this);

	this._serialPort = new SerialPort(port, {
		baudRate: baudRate
	});

	// this._queue = async.queue(self._messageWorker.bind(self), 1);
	// equivalent to above
	this._queue = async.queue(function(msg, callback) {
		self._messageWorker(msg, callback);
	}, 1);

	this._queue.pause();

	this._serialPort.on('open', function() {
		self._serialPort.write(':');
		self.emit('open');
		self._queue.resume();
	});

	this._serialPort.on('error', function(err) {
		console.error(err);
	});

	this._serialPort.on('data', function(data) {
		self._queue.resume();
		console.log('Got data from serial port: %s\n', JSON.stringify(data.toString()), data);
	});
};

util.inherits(EMIC, EventEmitter);

EMIC.prototype.addMessage = function(msg, callback) {
	this._queue.push(msg, callback);
};

EMIC.prototype._messageWorker = function(msg, callback) {
	var self = this;
	// todo: make this work
	//this.parse(msg);

	// alt.
	this.emicCom(msg, function(err) {
		console.log('Finished with %s.', msg);

		self._serialPort.drain(function() {
			setTimeout(function() {
				callback(null);
			}, 2500)
		});
	});
};

EMIC.prototype.emicCom = function(rawMsg, callback) {
	console.log('Sending to emic: %s', rawMsg);
	this._serialPort.write(rawMsg, callback);
	this._queue.pause();
};

EMIC.prototype.parse = function (msg, callback) {
	var self = this;
	msgEdit = msg.toString('ascii').trim();
	args = msgEdit.split(' ');
	console.log(args);

	function add2Q (string, callback) {
		self.addMessage(string, callback)
	}
	while ((args.length != 0) && (args[0].search(':') != -1)) {
		switch(args[0].split(':')[0].toLowerCase()) {
			case 'demo':
				this.demo(args[1], function (data) {
					add2Q(data, callback);
				});
				args.splice(0,2);
				break;
			case 'stop':
				this.stopNow( function (data) {
					add2Q(data, callback);
				});
				args.splice(0,1);
				break;
			case 'pause':
				this.pause( function (data) {
					add2Q(data, callback);
				});
				args.splice(0,1);
				break;
			case 'voice':
				this.voice(args[1], function (data) {
					add2Q(data, callback);
				});
				args.splice(0,2);
				break;
			case 'volume':
				this.volume(args[1], function (data) {
					add2Q(data, callback);
				});
				args.splice(0,2);
				break;
			case 'rate':
				this.rate(args[1], function (data) {
					add2Q(data, callback);
				});
				args.splice(0,2);
				break;
			case 'parser':
				this.chooseParser(args[1], function (data) {
					add2Q(data, callback);
				});
				args.splice(0,2);
				break;
			case 'revert':
				this.revert( function (data) {
					add2Q(data, callback);
				});
				args.splice(0,1);
				break;
			case 'settings':
				this.callCurrentSettings( function (data) {
					add2Q(data, callback);
				});
				args.splice(0,1);
				break;
			case 'version':
				this.callVersionInfo( function (data) {
					add2Q(data, callback);
				});
				args.splice(0,1);
				break;
			case 'commands':
				this.callCommands( function (data) {
					add2Q(data, callback);
				});
				args.splice(0,1);
				break;
			default:
				//this.report('Invalid Command');
				this.speak(args.join(' '), function (data) {
					add2Q(data, callback);
				});
				args = [];
				break;
		};
	};
	if (args.length != 0) {
		this.speak(args.join(' '), function (data) {
			add2Q(data, callback);
		});
	}
	args = [];
	return this;
};

EMIC.prototype.speak = function (data, callback) {
	data = data.toString('ascii');
	if (data.length > 1000) {
		this.report('Warning: Message exceeds 1000 characters');
	} else {
		callback('S' + data + '\n');
		callback('R\n');
	};
	return this;
};



EMIC.prototype.demo = function (id, callback) {
	id = id.toString('ascii');
	if (id == '0' || id == '1' || id == '2') {
		callback('D' + id + '\n');
	} else {
		this.report('Error: Invalid Command');
	};
	return this;
};

EMIC.prototype.stopNow = function (callback) {
	callback('X\n');
	return this;
};

EMIC.prototype.pause = function (callback) {
	callback('Z\n');
	return this;
};

EMIC.prototype.voice = function (id, callback) {
	console.log(typeof id);
	var idN = parseInt(id);
	if (idN >= 0 && idN <= 8) {
		id.toString('ascii');
		callback('N' + id + '\n');
	} else {
		this.report('Error: Invalid Command');
	};
	return this;
};

EMIC.prototype.volume = function (level, callback) {
	var levelN = parseInt(level);
	if (levelN >= -48 && levelN <= 18) {
		level = level.toString('ascii');
		callback('V' + level + '\n');
	} else {
		this.report('Error: Invalid Command');
	};
	return this;
};

EMIC.prototype.rate = function (wpm, callback) {
	var wpmN = parseInt(wpm);
	if (wpmN >= 75 && wpmN <= 600) {
		wpm = wpm.toString('ascii');
		callback('W' + wpm + '\n');
	} else {
		this.report('Error: Invalid Command');
	};
	return this;
};

EMIC.prototype.chooseParser = function (id, callback) {
	id = id.toString('ascii');
	if (parser == '0' || parser == '1' || parser == '2') {
		callback('P' + id + '\n');
	} else {
		this.report('Error: Invalid Command');
	};
	return this;
};

EMIC.prototype.revert = function (callback) {
	callback('R\n');
	return this;
};

EMIC.prototype.callCurrentSettings = function (callback) {
	callback('C\n');
	return this;
};

EMIC.prototype.callVersionInfo = function (callback) {
	callback('I\n');
	return this;
};

EMIC.prototype.callCommands = function (callback) {
	callback('H\n');
	return this;
};

EMIC.prototype.report = function (msg) {};

module.exports = {
	create: function(port) {
		return new EMIC(port);
	}
};













/*JSON communication API

msg = {
	'v': volume,
	'r': rate,
	'l': language,
	's': speaker,
	'a': algorithm,
	't': text,
	'p': priority
}
or
msg = {
	'volume': volume,			// a signed integer with -48 <= v <= 18
	'rate': rate,				// an unsigned integer with 75 <= r <= 600
	'speaker': speaker, 		// an unsigned integer with 0 <= s <= 8
	'language': language,		// an unsigned integer with 0 <= l <= 2
	'algorithm': algorithm,		// an unsigned integer with 0 <= a <= 1
	'text': text,				// a string of length <= 1000
	'priority': priority		// an unsigned integer with 0 <= p <= 3
}

'language' = {
	0: 'US English',
	1: 'Castilian Spanish',
	2: 'Latin Spanish'
}

'speaker' = {
	0: 'Perfect Paul',
	1: 'Huge Harry',
	2: 'Beautiful Betty',
	3: 'Uppity Ursula',
	4: 'Doctor Dennis',
	5: 'Kit the Kid',
	6: 'Frail Frank'
	7: 'Rough Rita',
	8: 'Whispering Wendy'
}

'algorithm' = {
	0: 'DECtalk',
	1: 'Epson'
}

'default' = {
	's': 0,
	'v': 0,
	'l': 0,
	'r': 200,
	'p': 1 
}

'priority' = {
	0: 'Emergency Only (evacuation, etc.) (increase volume to max)',
	1: 'High priority for immediate broadcast (weather warning)',
	2: 'Normal (communications)',
	3: 'Unimportant (reading a book, temperature report)'
}

*/

// //Power is connected to pin4 (5V), ground is pin6, tx (output) is pin 8,
// // rx (input) is pin10
// var mqtt = require('mqtt');
// var client = mqtt.connect('server');
// var async = require('async');

// client.subscribe('topic');
// client.publish('topic', 'msg');

// client.on('msg', function (topic, msg) {
// 	//message is given as buffer
// 	msg = msg.toString('ascii');
// })

// /*

// JSON.stringify(object);
// JSON.parse(jsonString);


// */




// function report (msg) {
// 	console.log(msg)
// };

// function emicRep (msg) {
// 	//io.emit('emic message', msg);
// };
// //io.emit('emic message', 'hello to all from emic');

// /*
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// var SerialPort = require('serialport').SerialPort;
// var serialPort = new SerialPort('/dev/ttyAMA0', {
// 	baudRate: 9600
// });
// */


// module.exports = function (io) {
// 	/*function executeFn (arr, callback) {
// 		var num = arr.length
// 		var execStr = 'EMIC.prototype.'
// 		var firstArg = arr[0].toString('ascii');
// 		switch (arr.length) {
// 			case 1:
// 				execStr = execStr + firstArg + '()';
// 				eval(execStr);
// 				break;
// 			case 2:
// 				execStr = execStr + firstArg + '('
// 					+ arr[1].toString('ascii') + ')';
// 				eval(execStr);
// 				break;
// 			default:
// 				execStr = execStr + firstArg + '(['
// 					+ arr.splice(0,1).join() + '])';
// 				eval(execStr);
// 				break;
// 		};
// 		callback();
// 	};*/

// 	function report (msg) {
// 		io.emit('emic message', msg);
// 		console.log('EMIC: ' + msg);
// 	};

// 	var SerialPort = require('serialport').SerialPort;
// 	var serialPort = new SerialPort('/dev/ttyAMA0', {
// 		baudRate: 9600
// 	});
// 	report('Successfully loaded SerialPort module');
// 	report('Successfully initialised /dev/ttyAMA0');
// 	var masterqueue = async.queue(emicCom, 1);
// 	masterqueue.drain = function () {
// 		report('EMIC is standing by for a command');
// 	};

// 	var isReady = false;

	
// 	function emicCom (obj, callback) {
// 		isReady = false;
// 		console.log(isReady);
// 		console.log(obj.data);
// 		obj.port.write(obj.data);
// 		while (isReady = false) {
// 			setTimeout( function () {}, 50);
// 		}
// 		callback();
// 	};

// 	var EMIC = {};

// 	EMIC.prototype.report = function (msg) {
// 		io.emit('emic message', msg);
// 	};



// 	EMIC.prototype.parse = function (msg) {
// 		msgEdit = msg.toString('ascii').trim();
// 		args = msg.split(' ');
// 		while ((args.length != 0) && (args[0].search(':') != -1)) {
// 			switch(args[0].split(':')[0].toLowerCase()) {
// 				case 'demo':
// 					this.demo(args[1]);
// 					args.splice(0,2);
// 					break;
// 				case 'stop':
// 					this.stopNow();
// 					args.splice(0,1);
// 					break;
// 				case 'pause':
// 					this.pause();
// 					args.splice(0,1);
// 					break;
// 				case 'voice':
// 					this.voice(args[1]);
// 					args.splice(0,2);
// 					break;
// 				case 'volume':
// 					this.volume(args[1]);
// 					args.splice(0,2);
// 					break;
// 				case 'rate':
// 					this.rate(args[1]);
// 					args.splice(0,2);
// 					break;
// 				case 'parser':
// 					this.chooseParser(args[1]);
// 					args.splice(0,2);
// 					break;
// 				case 'revert':
// 					this.revert();
// 					args.splice(0,1);
// 					break;
// 				case 'settings':
// 					this.callCurrentSettings();
// 					args.splice(0,1);
// 					break;
// 				case 'version':
// 					this.callVersionInfo();
// 					args.splice(0,1);
// 					break;
// 				case 'commands':
// 					this.callCommands();
// 					args.splice(0,1);
// 					break;
// 				default:
// 					this.report('Invalid Command');
// 					this.speak(args.join(' '));
// 					args = [];
// 					break;
// 			};
// 		};
// 		this.speak(args.join(' '));
// 		args = [];
// 	};
// 	io.on('connection', function (socket) {
// 		io.emit('emic message', 'hello world from emic');
// 		socket.on('user message', function (msg) {
// 			EMIC.prototype.parse(msg);
// 			io.emit('emic message', 'ECHO: ' + msg);
// 		});
		
// 	});
// 	serialPort.on('open', function () {
// 			isReady = true;
// 			report('Port is open')
// 			serialPort.on('data', function(msg) {
// 				msg = msg.toString('ascii');
// 				console.log('emicSerial: ' + msg);
// 				if (msg == ':') {
// 					console.log('Emic is ready for an instruction')
// 				} else if (msg == ':?') {
// 					report('Invalid instruction');
// 				} else {
// 					report(msg);
// 				};
// 				isReady = true
// 				serialPort.flush();
// 			});
// 	});
// 	return EMIC;
// };

// 	/*var EMIC = {
// 		init: function () {
// 			serialPort.on('open', function () {
// 				//repEmic('Hello world')
// 				report('Port is open')
// 				isOpen = true;
// 				serialPort.on('data', function(msg) {
// 					msg = msg.toString('ascii');
// 					//console.log(msg);
// 					serialPort.flush();
// 					if (msg == ':') {
// 						isReady = true
// 						console.log('Emic is ready for an instruction')
// 					} else { console.log('errorcheck '+msg)}
// 				});
// 			});
		
// 		},*/
// /*function writeLog(logFile, output){
// 	var logf = new File(logFile);
// 	logf.writeln(output);
// 	logf.close()*/

// //serialPort.write(':S[wiy<400,20>wih<300,25>sh<100>yu<200>ax<200,27>meh<200,25>riy<200,24>krih<300,22>s<100>mah<300>s<100>wih<400>wih<300,27>sh<100>yu<200>ax<200,29>meh<200,27>riy<200,25>krih<300,24>s<100>mah<300,20>s<100>wih<400>wih<300,29>sh<100>yu<200>ax<200,30>meh<200,29>riy<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100> GUH<300,20>D<100>TAY<400,25>DIH<200>NX<100>Z<100>TUW<400>YU<800,24>WER<400>EH<400,25>VRR<400,24>YU<400,22>AR<800,20>GUH<300,27>D<100>TAY<400,29>DIH<200,27>NX<100>Z<100>FOR<400,25>KRIH<300,32>S<100>MAH<300,20>S<100>AE<100>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100> WIY<400,20>WIH<300,25>SH<100>YU<200>AX<200,27>MER<200,25>RIY<200,24>KRIH<300,22>S<100>MAH<300>S<100>WIY<400>WIH<300,27>SH<100>YU<200>AX<200,29>MEH<200,27>RIY<200,25>KRIH<300,24>S<100>MAH<300,20>S<100>WIY<400>WIH<300,29>SH<100>YU<200>AX<200,30>MEH<200,29>RIY<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<800,25>]\r');
// //serialPort.write(':S[:PHONE ON] [:nv] [:dv gn 75] [wiy<400,20>wih<300,25>sh<100>yu<200>ax<200,27>meh<200,25>riy<200,24>krih<300,22>s<100>mah<300>s<100>wih<400>wih<300,27>sh<100>yu<200>ax<200,29>meh<200,27>riy<200,25>krih<300,24>s<100>mah<300,20>s<100>wih<400>wih<300,29>sh<100>yu<200>ax<200,30>meh<200,29>riy<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100>]. [GUH<300,20>D<100>TAY<400,25>DIH<200>NX<100>Z<100>TUW<400>YU<800,24>WER<400>EH<400,25>VRR<400,24>YU<400,22>AR<800,20>GUH<300,27>D<100>TAY<400,29>DIH<200,27>NX<100>Z<100>FOR<400,25>KRIH<300,32>S<100>MAH<300,20>S<100>AE<100>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<600,25>_<100>]. [WIY<400,20>WIH<300,25>SH<100>YU<200>AX<200,27>MER<200,25>RIY<200,24>KRIH<300,22>S<100>MAH<300>S<100>WIY<400>WIH<300,27>SH<100>YU<200>AX<200,29>MEH<200,27>RIY<200,25>KRIH<300,24>S<100>MAH<300,20>S<100>WIY<400>WIH<300,29>SH<100>YU<200>AX<200,30>MEH<200,29>RIY<200,27>KRIH<300,25>S<100>MAH<300,22>S<100>AE<100,20>N<50>D<50>AX<200>HXAE<400,22>PIY<400,27>NUW<400,24>YXIR<800,25>].\r');

