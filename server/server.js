'use strict';

var wsPort = 63555;
var pTitle = 'WebSocketServer';


var users = [];


var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: wsPort });

process.title = pTitle;


console.log('');
console.log(process.title + ' up and running');
console.log('pid: ' + process.pid);
console.log('port: ' + wsPort);



wss.on('connection', function (ws) {
	console.log('client connected');
	//console.log(ws);


	ws.on('open', function open() {
		console.log('connected');
		ws.send(Date.now());
	});

	ws.on('close', function close() {
		console.log('disconnected');
	});

	ws.on('message', function (message) {
		console.log('received data:');
		console.log(message);

		ws.send('repeat: ' + message);
	});

	ws.send('hello');
});


//process.exit(0);
