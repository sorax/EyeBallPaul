const WebSocket = require('ws')

class SocketServer {
  constructor(wsPort) {
    const connections = {}

    console.log('SocketServer is now listening on port', wsPort)

    this.wss = new WebSocket.Server({ port: wsPort })
    this.wss.on('connection', function(ws, req) {
      const id = req.headers['sec-websocket-key']
      // console.log(`New client connected (id: ${id})`)

      connections[id] = {} // add to connections

      // var ip = req.connection.remoteAddress
      // console.log(address)

      // console.log(connections)

      ws.on('message', function(message) {
        // console.log('Received: %s', message)

        const data = JSON.parse(message)
        console.log(data)
      })
      ws.on('close', function close() {
        // console.log(id, this.connections)
        // console.log('Client disconnected (id: ' + id + ')')
        delete connections[id] // remove from connections
      })
    })
  }
}
module.exports = SocketServer

/*
var observers = {};
var balls = [new Ball()];

wss.on('connection', function (ws, req) {
	var id = req.headers['sec-websocket-key'];
	//var ip = req.connection.remoteAddress;

	console.log('New client connected (id: ' + id + ')');

	connections[id] = {
		//ws: ws,
		type: false
	};

	ws.on('message', function (message) {
		//console.log('Received: %s', message);

		var data = JSON.parse(message);

		switch (data.type) {
			case 'setClientType':
				connections[id].type = data.clientType;

				switch (data.clientType) {
					case 'controller':
						players[id] = connections[id];
						players[id].id = id;
						players[id].points = 0;
						players[id].name = '';
						players[id].deg = 0;
						

						if (Object.keys(teams[1]).length <= Object.keys(teams[2]).length) {
							players[id].team = 1;
							teams[1][id] = players[id];
						} else {
							players[id].team = 2;
							teams[2][id] = players[id];
						}

						console.log('Teams are (' + Object.keys(teams[1]).length + '|' + Object.keys(teams[2]).length + ')');

						ws.send(JSON.stringify({
							type: 'setTeam',
							team: players[id].team
						}));
						break;

					case 'observer':
						observers[id] = connections[id];
						break;
				}
				break;

			case 'setName':
				console.log('set player name');
				console.log('name:', data.name);
				var name = data.name.toString();
				//var pattern = /(\w|\d){8}/g;
				//if (pattern.test(name)) {
					players[id].name = name;
					players[id].defenceSize = teamDefenceSizePercent / Object.keys(teams[players[id].team]).length
				//}
				break;

			case 'setDeg':
				players[id].deg = fixDegrees(parseInt(data.deg));

				/.*
				for (var key in observers) {
					var observer = observers[key];
					var player = players[id];
					//var playerWs = player.ws;
					//delete player.ws;

					observer.ws.send(JSON.stringify({
						type: 'updatePlayer',
						player: player
					}));

					//player.ws = playerWs;
				}
				*./
				break;

			case 'getGameState':
				ws.send(JSON.stringify({
					type: 'setGameState',
					balls: balls,
					teams: teams,
					players: players
				}));
				break;

		}
	});

	ws.on('close', function close() {
		console.log('Client disconnected (id: ' + id + ')');

		if (connections[id].type === 'controller') {
			delete teams[connections[id].team][id];	// remove from teams
			delete players[id];	// remove from players
		} else if (connections[id].type === 'observer') {
			delete observers[id];	// remove from observers
		}

		delete connections[id];	// remove from connections

		if (Object.keys(players).length === 0) {
			clearInterval(tickInterval);
		}
	});
});



*/

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', function connection(ws, req) {
//   const ip = req.connection.remoteAddress;
// });

// class SocketServer {
//   constructor(height, width) {
//     this.name = 'Rectangle';
//     this.height = height;
//     this.width = width;
//   }

//   sayName() {
//     console.log('Hi, I am a ', this.name + '.');
//   }
//   get area() {
//     return this.height * this.width;
//   }
//   set area(value) {
//     this.height = this.width = Math.sqrt(value);
//   }
// };

// // class Square extends Rectangle {
// //     constructor(length) {
// //         this.height; // ReferenceError, super needs to be called first!

// //         // Here, it calls the parent class' constructor with lengths
// //         // provided for the Polygon's width and height
// //         super(length, length);

// //         // Note: In derived classes, super() must be called before you
// //         // can use 'this'. Leaving this out will cause a reference error.
// //         this.name = 'Square';
// //     }
// // }
