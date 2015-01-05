var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var EMIC = require('./emic.js');
//var fs = require('fs');


app.get('/', function(req, res){
    //var html = fs.readFileSync("index3.html", "utf8");
    //res.send(html);
    res.sendFile(__dirname + '/index.html');
});
console.log('connection achieved')



io.on('connection', function(socket){
	EMIC.init();
	console.log('a user connected');
	//console.log('hello connection');
	socket.on("disconnect", function() {
		console.log("user disconnected");
	});
	socket.on('user message', function(msg){
		//console.log('hi all');
		console.log('sendmessage');
		EMIC.speak(msg);
		console.log('usermessage: ' + msg);
		io.emit('user message', msg);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});
