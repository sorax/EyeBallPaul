'use strict';

var wsPort = 63555;

var clients = [];
//var teams = [];
var players = [];
var observers = {};

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: wsPort});

process.title = 'SocketServer';

console.log(
	process.title + ' started:'
	+ '\n- port: ' + wsPort
	+ '\n- pId: ' + process.pid
	+ '\n- pTitle: ' + process.title
	+ '\n'
);

wss.on('connection', function (ws, req) {
	var id = req.headers['sec-websocket-key'];
	//var ip = req.connection.remoteAddress;

	console.log('New client connected (id: ' + id + ')');

	clients[id] = {};
	clients[id].id = id;

	ws.on('message', function (data) {
		console.log('Received data from client:' + data);

		var message = JSON.parse(data);

		if (message.clientType === 'observer') {
			observers[id] = clients[id];
			observers[id].ws = ws;

			console.log('observer connected');
		} else {
			players[id] = clients[id];
			players[id].name = message.name;
			players[id].deg = message.deg;
			players[id].team = 1;
			players[id].points = 0;

			for (var key in observers) {
				//if (observer.ws !== ws && observer.ws.readyState === WebSocketServer.OPEN) {
					var observer = observers[key];
					var data = JSON.stringify(players[id]);
					console.log('Send data to observers: ' + data);
					observer.ws.send(data);
				//}
			}
		}
	});

	ws.on('close', function close () {
		console.log('Client disconnected  (id: ' + id + ')');
		delete clients[id];
		delete players[id];
		delete observers[id];
	});
});

//process.exit(0);
