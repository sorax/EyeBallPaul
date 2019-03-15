const WebSocket = require('ws')

class Ball {
  constructor() {
    this.x = 0
    this.y = 0
    this.deg = Math.random() * 360
    this.speed = 1
    this.lastCollision = null
    // this.color = '#00f'
  }
}

class SocketServer {
  constructor(wsPort) {
    this.connections = {}
    this.observers = {}
    this.players = {}
    this.teams = { 1: {}, 2: {} }
    this.balls = [new Ball()]

    this.allDefenseSizePercent = 50
    this.teamDefenceSizePercent = this.allDefenseSizePercent / 2

    console.log('SocketServer is now listening on port', wsPort)

    this.wss = new WebSocket.Server({ port: wsPort })
    this.wss.on('connection', (ws, req) => {
      const id = req.headers['sec-websocket-key']
      // const ip = req.connection.remoteAddress;

      console.log(`New client connected (id: ${id})`)

      this.connections[id] = {}
      // this.connections[id].ws = ws

      ws.on('message', message => {
        // console.log('Received: %s', message)

        const data = JSON.parse(message)
        // console.log(data)

        switch (data.type) {
          case 'setClientType':
            this.connections[id].type = data.clientType

            if (data.clientType === 'controller') {
              this.players[id] = this.connections[id]
              this.players[id].points = 0
              this.players[id].name = ''
              this.players[id].deg = 0

              if (
                Object.keys(this.teams[1]).length <=
                Object.keys(this.teams[2]).length
              ) {
                this.players[id].team = 1
                this.teams[1][id] = this.players[id]
              } else {
                this.players[id].team = 2
                this.teams[2][id] = this.players[id]
              }

              ws.send(
                JSON.stringify({
                  type: 'setTeam',
                  team: this.players[id].team,
                }),
              )

              // console.log(
              //   `Teams are (${Object.keys(this.teams[1]).length}|${
              //     Object.keys(this.teams[2]).length
              //   })`,
              // )
            }

            if (data.clientType === 'observer') {
              this.observers[id] = this.connections[id]
              this.observers[id].ws = ws
            }

            break

          case 'setName':
            // console.log('set player name', data.name)
            var name = data.name.toString()
            //var pattern = /(\w|\d){8}/g;
            //if (pattern.test(name)) {
            this.players[id].name = name
            this.players[id].defenceSize =
              this.teamDefenceSizePercent /
              Object.keys(this.teams[this.players[id].team]).length
            //}
            break

          case 'setDeg':
            this.players[id].deg = fixDegrees(parseInt(data.deg))

            // Broadcast to everyone else.
            // wss.clients.forEach(function each(client) {
            //   if (client !== ws && client.readyState === WebSocket.OPEN) {
            //     client.send(data)
            //   }
            // })

            for (var key in this.observers) {
              var observer = this.observers[key]
              // var player = this.players[id]
              //var playerWs = player.ws;
              //delete player.ws;

              observer.ws.send(
                JSON.stringify({
                  type: 'updatePlayer',
                  player: this.players[id],
                }),
              )
            }
            break

          case 'getGameState':
            // console.log('getGameState')
            ws.send(
              JSON.stringify({
                type: 'setGameState',
                balls: this.balls,
                players: this.players,
                teams: this.teams,
              }),
            )
            break
        }
      })
      ws.on('close', () => {
        // console.log(id, this.connections)
        // console.log('Client disconnected (id: ' + id + ')')
        delete this.connections[id] // remove from connections
        delete this.observers[id]
        delete this.players[id]
        delete this.teams[1][id]
        delete this.teams[2][id]

        // if (Object.keys(players).length === 0) {
        //   clearInterval(tickInterval)
        // }
      })
    })
  }
}
module.exports = SocketServer

function fixDegrees(degrees) {
  if (degrees < 0) return degrees + 360
  if (degrees >= 360) return degrees - 360
  return degrees
}

/*


wss.on('connection', function (ws, req) {
	ws.on('message', function (message) {
		//console.log('Received: %s', message);
		var data = JSON.parse(message);
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

// wss.on('connection', function connection(ws, req) {
//   const ip = req.connection.remoteAddress;
// });
