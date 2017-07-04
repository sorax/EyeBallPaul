'use strict';

var wsPort = 63555;

var clients = [];
//var teams = [];
//var players = [];
var observers = [];

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: wsPort});

process.title = 'SocketServer';

console.log(
	process.title + ' started:'
	+ '\n- port: ' + wsPort
	+ '\n- pId: ' + process.pid
	+ '\n- pTitle: ' + process.title
);

wss.on('connection', function (ws, req) {
	var key = req.headers['sec-websocket-key'];
	//var ip = req.connection.remoteAddress;

	console.log(
		'New client connected:'
		+ '\n- key: ' + key
	);

	clients[key] = {};
	clients[key].key = key;

	ws.on('open', function open () {
		console.log('open');
	});

	ws.on('message', function (data) {
		console.log(
			'Received data from client:'
			+ '\n' + data
		);

		var message = JSON.parse(data);

		if (message.clientType === 'observer') {
			clients[key].ws = ws;
			//observers.push(clients[key]);
			observers[key] = clients[key];

			console.log('observer connected');
		} else {
			clients[key].name = message.name;
			clients[key].deg = message.deg;
			//clients[key].team = '';
			//clients[key].points = 0;

			console.log(observers);

			observers.forEach(function (observer) {
				//if (observer.ws !== ws && observer.ws.readyState === WebSocket.OPEN) {}
				observer.ws.send(JSON.stringify(clients[key]));
			});
		}
	});

	ws.on('close', function close () {
		console.log('Client disconnected');
		delete clients[key];
	});

	//ws.send('welcome');
	//ws.send(Date.now());
});

//process.exit(0);
