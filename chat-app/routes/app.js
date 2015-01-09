//Load modules
var System = require('systemjs');
var ASQ = require('asynquence');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var emic = require('./emic2.js');

function report (msg) {
	console.log(msg)
};

function repErr (err) {
	console.error(err)
};

app.get('/', function(req, res){
    //var html = fs.readFileSync("index3.html", "utf8");
    //res.send(html);
    res.sendFile(__dirname + '/main.html');
});
io.on('connection', function(socket){
	report('a user connected');
	socket.on('disconnect', function() {
		report('a user disconnected');
	});
	socket.on('user message', function(msg){
		report('sendmessage');
		emic.speak(msg);
		report('usermessage: ' + msg);
		io.emit('user message', msg);
	});
});
http.listen(3001, function(){
    report('listening on *:3001');
});


