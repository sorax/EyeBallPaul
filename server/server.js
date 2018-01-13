'use strict';

var wsPort = 63555;
var wsTitle = 'SocketServer';

var clients = {};
var teams = {
	1: {},
	2: {}
};
var players = {};
var observers = {};
var balls = [new Ball()];

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: wsPort });

process.title = wsTitle;

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

	clients[id] = {
		ws: ws,
		type: false
	};

	ws.on('message', function (message) {
		console.log('Received: %s', message);

		var data = JSON.parse(message);

		switch (data.type) {
			case 'setClientType':
				clients[id].type = data.clientType;

				switch (data.clientType) {
					case 'controller':
						players[id] = clients[id];
						players[id].id = id;
						players[id].points = 0;

						if (Object.keys(teams[1]).length <= Object.keys(teams[2]).length) {
							players[id].team = 1;
							teams[1][id] = players[id];
						} else {
							players[id].team = 2;
							teams[2][id] = players[id];
						}

						ws.send(JSON.stringify({
							type: 'setTeam',
							team: players[id].team
						}));
					break;

					case 'observer':
						observers[id] = clients[id];
					break;
				}
			break;

			case 'setName':
				players[id].name = data.name;
			break;

			case 'setDeg':
				players[id].deg = data.deg;

				for (var key in observers) {
					var observer = observers[key];
					var player = players[id];
					//var playerWs = player.ws;
					delete player.ws;

					observer.ws.send(JSON.stringify({
						type: 'updatePlayer',
						player: player
					}));

					//player.ws = playerWs;
				}
			break;

			case 'getBalls':
				observers[id].ws.send(JSON.stringify({
					type: 'setBalls',
					balls: balls
				}));
			break;

		}
	});

	ws.on('close', function close () {
		console.log('Client disconnected (id: ' + id + ')');

		if (clients[id].type === 'controller') {
			delete teams[clients[id].team][id];	// remove from teams
			delete players[id];	// remove from players
		} else if (clients[id].type === 'observer') {
			delete observers[id];	// remove from observers
		}

		delete clients[id];	// remove from clients
	});
});

var tickCount = 0;
function tick () {
	tickCount++;
	console.log(tickCount);
}
//setInterval(tick, 1000);

function Ball () {} {
	this.x = 0;
	this.y = 0;
	this.deg = Math.random() * 360;
	this.speed = 1;
	this.lastCollision = false;

	this.tick = function () {
		this.x += Math.cos(getRadiant(this.deg)) * this.speed;
		this.y += Math.sin(getRadiant(this.deg)) * this.speed;
	};

}

function getRadiant (degrees) {
	return degrees * Math.PI / 180;
}

//process.exit(0);
