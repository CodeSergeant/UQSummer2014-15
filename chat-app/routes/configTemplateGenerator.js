var fs = require("fs");

var messageConfig = {};
var messageArray = [
	"priority",
	"algorithm",
	"speaker",
	"language",
	"volume",
	"rate",
	"text"
];
var messageSubArray = [
	"defaultValue",
	"minimumValue",
	"maximumValue",
	"defaultValueOnMinimum",
	"defaultValueOnMaximum",
	"defaultValueOnError",
	"minMaxOfWhatProperty",
	"syntaxKeyForEMIC"
];
var messageSubObject = {};
var defaultFiller = "default";


for (var j = 0; j < messageSubArray.length; j++) {
	messageSubObject[messageSubArray[j]] = defaultFiller;
};
for (var i = 0; i < messageArray.length; i++) {
	messageConfig[messageArray[i]] = messageSubObject;
};

var strMessageConfig = JSON.stringify(messageConfig, null, 4);
fs.writeFileSync("messageConfig2.json",strMessageConfig);

var hardwareConfig = {
	"mqtt": {
		"server": "mqtt://winter.ceit.uq.edu.au",
		"inputSubscription": "emic-in",
		"outputSubscription": "emic-out"
	},
	"serialPort": {
		"port": "/dev/ttyAMA0",
		"baudRate": 9600
	}
}

fs.writeFileSync("hardwareConfig2.json",
	JSON.stringify(hardwareConfig, null, 4));