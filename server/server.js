'use strict';

var wsPort = 63555;
var pTitle = 'SocketServer';


var clients = [];
var observer = [];

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: wsPort});

process.title = pTitle;


console.log('');
console.log(process.title + ' running');
console.log('- pid: ' + process.pid);
console.log('- port: ' + wsPort);


wss.on('connection', function (ws, req) {
	console.log('client connected');
	//console.log(ws);

	var key = req.headers['sec-websocket-key'];
	var ip = req.connection.remoteAddress;
	clients[key] = {};
	clients[key].ip = ip;

	ws.on('open', function open() {
		//console.log('connected');
	});

	ws.on('close', function close() {
		console.log('disconnected');
	});

	ws.on('message', function (data) {
		console.log('received data:');
		console.log(data);

		var message = JSON.parse(data);

		if (message.clientType === 'observer') {
			observer[key] = {};
		} else {
			clients[key].name = message.name;
			clients[key].deg = message.deg;

			// send client stat change to server
			//ws.send('repeat: ' + data);


			//observer

			//wss.clients.forEach(function each(client) {
			//	if (client !== ws && client.readyState === WebSocket.OPEN) {
			//		client.send(data);
			//	}
			//});



		}
	});

	ws.send('welcome');
	ws.send(Date.now());
});

//process.exit(0);
