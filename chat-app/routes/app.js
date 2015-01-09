//Load modules
var System = require('systemjs');
var ASQ = require('asynquence');

function report (msg) {
	console.log(msg)
};
report(ASQ)

function repErr (err) {
	console.error(err)
}

var app, http, io, emic;
ASQ()
.then(function () {app = require('express')()})
.then(report(app))
.then(function () {http = require('http').Server(app)})
.then(function () {io = require('socket.io')(http)})
.then(function () {emic = require('./emic2.js')})
.then(function () {report("Modules loaded successfully")})
//.or(repErr("Module load error"))
.then(report(emic))
.then(emic.init())
.then(app.get('/', function(req, res){
    //var html = fs.readFileSync("index3.html", "utf8");
    //res.send(html);
    res.sendFile(__dirname + '/main.html');
}))
.then(report('connection achieved'))
.gate(
	io.on('connection', function(socket){
		report('a user connected');
		socket.on('disconnect', function() {
			report('a user disconnected');
		});
		socket.on('user message', function(msg){
			report('sendmessage');
			EMIC.speak(msg);
			report('usermessage: ' + msg);
			io.emit('user message', msg);
		});
	}),
	http.listen(3001, function(){
    	report('listening on *:3001');
	})
)
