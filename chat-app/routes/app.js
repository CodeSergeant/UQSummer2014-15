//Load modules
var System = require('systemjs');
var ASQ = require('asynquence');

function report (msg) {
	console.log(msg)
};

function repErr (err) {
	console.error(err)
}

var app, http, io, emic;
ASQ()
.then(function () {app = require('express')()})
.then(function () {http = require('http').Server(app)})
.then(function () {io = require('socket.io')(http)})
.then(function () {emic = require('./emic2.js')})
.then(function () {report("Modules loaded successfully")})
.or(repErr("Module load error"))
.then(emic.init())
.then(app.get('/', function(req, res){
    //var html = fs.readFileSync("index3.html", "utf8");
    //res.send(html);
    res.sendFile(__dirname + '/main.html');
});
)
.then(report('connection achieved'))
.then(

io.on('connection', function(socket){

	console.log('a user connected');
	//console.log('hello connection');
	socket.on('disconnect', function() {
		console.log('a user disconnected');
	});
	socket.on('user message', function(msg){
		//console.log('hi all');
		console.log('sendmessage');
		EMIC.speak(msg);
		console.log('usermessage: ' + msg);
		io.emit('user message', msg);
	});
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});
)
