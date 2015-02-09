//Power is connected to pin4 (5V), ground is pin6, tx (output) is pin 8,
// rx (input) is pin10

// Import libraries/modules
var EventEmitter = require('events').EventEmitter;
//var util = require('util');
var async = require('async');
var SerialPort = require('serialport').SerialPort;
var mqtt = require('mqtt');
var hardwareConfig = require('./hardwareConfig.json');
var messageConfig = require('./messageConfig.json');

// Initialise serial port
try {
	var serialPort = new SerialPort(hardwareConfig.serialPort.port, {
		baudRate: hardwareConfig.serialPort.baudRate
	});
} catch (err) {
	emicReport('SerialPort could not be opened.');
}

serialPort.on('open', function() {
	serialPort.write(':');
	emicReport('Serial Port is now open');
	hardwareQueue.resume();
	serialPort.on('error', function(err) {
		console.error(err);
	});
	serialPort.on('data', function(data) {
		//console.log('Got data from serial port: %s\n', 
			//JSON.stringify(data.toString()));
		hardwareQueue.resume();
	});
});

// Reporting helper functions
function emicReport (msg) {
	client.publish(hardwareConfig.mqtt.outputSubscription, msg);
	//console.log(msg);
};

// Initialise masterQueue - for each message and its corresponding properties
var masterQueue = new async.priorityQueue(function (msg, callback) {
	masterQueueWorker(msg, callback);
}, 1);
masterQueue.drain = function () {
	emicReport('EMIC is standing by for a message.');
};

// Define master queue worker
function masterQueueWorker (messageArray, callback) {
	var messageArray = messageArray;
	console.log('Master queue: ', masterQueue.length()
		+ masterQueue.running());
	for (var i = 0; i < messageArray.length; i++) {
		hardwareQueue.push(messageArray[i], function (err) {
			if (err) {
				emicReport("Hardware queue error: ", err);
				//console.error("Hardware queue error: " + err);
			};
		});
	};
	masterQueue.pause();
	hardwareQueue.drain = function () {
		callback(null);
		masterQueue.resume();
	};
};

// Initialise hardwareQueue - for each write to serialPort
var hardwareQueue = new async.queue(function (msg, callback) {
	hardwareQueueWorker(msg, callback);
}, 1);

// Define hardware queue worker
function hardwareQueueWorker (message, callback) {
	serialPort.write(message);
	hardwareQueue.pause();
	callback(null);
};

// Configure mqtt client
var client = mqtt.connect(hardwareConfig.mqtt.server);
client.subscribe(hardwareConfig.mqtt.inputSubscription);

client.on('connect', function () {
	emicReport('Connection succesful');
});

client.on('message', function (topic, msg) {
 	//message is given as buffer
 	var messageObject = {};
 	try {
 		messageObject = JSON.parse(msg);
 	} catch(err) {
 		emicReport('ERROR: Invalid syntax\nNot valid JSON string.');
 		return;
 	}
 	console.log("Received mqtt message: " + msg.toString());
 	var messageArray = [];	// used to store the strings that will be writen
 								// to the serial port
 	var internalMessageObject = {};

 	var keys = messageConfig.keys;
 	for (var i = 0; i < keys.length; i++) {
 		var key = keys[i];
 		var tempValue = messageObject[key] || messageObject[key.charAt(0)] ||
 			messageConfig[key]["defaultValue"];
 		try {
 			var comparisonValue = (key == "text") ? (
 				tempValue = tempValue.toString("ascii"),
 				tempValue.length
 			) : (
 				tempValue = parseInt(tempValue),
 				tempValue
 			);
 			internalMessageObject[key] = (
 				comparisonValue < messageConfig[key]["minimumValue"]) ?
 				messageConfig[key]["defaultValueOnMinimum"] : 
 				(comparisonValue > messageConfig[key]["maximumValue"]) ?
 				messageConfig[key]["defaultValueOnMaximum"] : tempValue;
 		} catch (err) {
 			(internalMessageObject[key] =
 				messageConfig[key]["defaultValueOnError"]);
 		} finally {
 			messageConfig[key]["syntaxKeyForEMIC"] && 
 				messageArray.push(messageConfig[key]["syntaxKeyForEMIC"] 
 					+ internalMessageObject[key] + "\n");
 		};
 	};
 	
 	masterQueue.push([messageArray], internalMessageObject.priority,
 		function (err) {
 			if (err) {
 				emicReport("Master queue error: \n" + err);
 			};
 		}
 	);
});
