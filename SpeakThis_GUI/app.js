var express = require("express");
var app = express();

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

var server = app.listen(2000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("SpeakThis Server listening at http://%s:%s", host, port);
});