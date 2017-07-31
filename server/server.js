'use strict';

var wsPort = 63555;

var clients = {};
var teams = {
		1: {},
		2: {}
	};
var players = {};
var observers = {};

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: wsPort });

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
	clients[id].ws = ws;
	clients[id].clientType = undefined;

	ws.on('message', function (data) {
		//console.log('Received data from client:' + data);

		var message = JSON.parse(data);

		switch (message.type) {
			case 'setClientType':
				clients[id].clientType = message.clientType;

				switch (message.clientType) {
					case 'player':
						players[id] = clients[id];
						players[id].playerName = message.playerName;
						players[id].deg = message.deg;
						players[id].points = 0;

						if (Object.keys(teams[1]).length <= Object.keys(teams[2]).length) {
							players[id].team = 1;
							teams[1][id] = players[id];
						} else {
							players[id].team = 2;
							teams[2][id] = players[id];
						}

						var message = {
							team: players[id].team,
							points: players[id].points
						};
						ws.send(JSON.stringify(message));
					break;

					case 'observer':
						observers[id] = clients[id];
					break;
				}
			break;

			case 'setDeg':
				players[id].deg = message.deg;

				console.log(observers);

				/*var message = {
					team: players[id].team,
					points: players[id].deg
				};
				ws.send(JSON.stringify(message));*/

				//for (var key in observers) {
				//	console.log('obsy');
				//}
			break;

			case 'getPlayersData':

			break;
		}
	});

	ws.on('close', function close () {
		console.log('Client disconnected (id: ' + id + ')');

		if (clients[id].clientType === 'player') {
			delete teams[clients[id].team][id];
			delete players[id];
		} else if (clients[id].clientType === 'observer') {
			delete observers[id];
		}

		delete clients[id];
	});
});

//process.exit(0);




/*
	ws.on('message', function (data) {

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
*/