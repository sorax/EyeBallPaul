'use strict'

var wsPort = 63555
var wsTitle = 'SocketServer'
var allDefenseSizePercent = 20
var teamDefenceSizePercent = allDefenseSizePercent / 2

var clients = {}
var teams = {
  1: {},
  2: {},
}
var players = {
  //players[id] = clients[id];
  // 'test1': {
  // 	points: 0,
  // 	name: 'Test 1',
  // 	deg: 315,
  // 	team: 1,
  // 	defenceSize: 25
  // }
}
// teams[1]['test1'] = players['test1'];

var observers = {}
var balls = [new Ball()]

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ port: wsPort })

process.title = wsTitle

console.log(
  process.title +
    ' started:' +
    '\n- port: ' +
    wsPort +
    '\n- pId: ' +
    process.pid +
    '\n- pTitle: ' +
    process.title +
    '\n',
)

wss.on('connection', function(ws, req) {
  var id = req.headers['sec-websocket-key']
  //var ip = req.connection.remoteAddress;

  console.log('New client connected (id: ' + id + ')')

  clients[id] = {
    //ws: ws,
    type: false,
  }

  ws.on('message', function(message) {
    //console.log('Received: %s', message);

    var data = JSON.parse(message)

    switch (data.type) {
      case 'setClientType':
        clients[id].type = data.clientType

        switch (data.clientType) {
          case 'controller':
            players[id] = clients[id]
            players[id].id = id
            players[id].points = 0
            players[id].name = ''
            players[id].deg = 0

            if (Object.keys(teams[1]).length <= Object.keys(teams[2]).length) {
              players[id].team = 1
              teams[1][id] = players[id]
            } else {
              players[id].team = 2
              teams[2][id] = players[id]
            }

            console.log(
              'Teams are (' +
                Object.keys(teams[1]).length +
                '|' +
                Object.keys(teams[2]).length +
                ')',
            )

            ws.send(
              JSON.stringify({
                type: 'setTeam',
                team: players[id].team,
              }),
            )
            break

          case 'observer':
            observers[id] = clients[id]
            break
        }
        break

      case 'setName':
        console.log('set player name')
        console.log('name:', data.name)
        var name = data.name.toString()
        //var pattern = /(\w|\d){8}/g;
        //if (pattern.test(name)) {
        players[id].name = name
        players[id].defenceSize =
          teamDefenceSizePercent / Object.keys(teams[players[id].team]).length
        //}
        break

      case 'setDeg':
        players[id].deg = fixDegrees(parseInt(data.deg))

        /*
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
				*/
        break

      case 'getGameState':
        ws.send(
          JSON.stringify({
            type: 'setGameState',
            balls: balls,
            teams: teams,
            players: players,
          }),
        )
        break
    }
  })

  ws.on('close', function close() {
    console.log('Client disconnected (id: ' + id + ')')

    if (clients[id].type === 'controller') {
      delete teams[clients[id].team][id] // remove from teams
      delete players[id] // remove from players
    } else if (clients[id].type === 'observer') {
      delete observers[id] // remove from observers
    }

    delete clients[id] // remove from clients

    if (Object.keys(players).length === 0) {
      clearInterval(tickInterval)
    }
  })
})

var tickInterval
function tick() {
  balls.forEach(function(ball) {
    ball.tick()
  })
}
tickInterval = setInterval(tick, 50)

function Ball() {
  this.x = 0
  this.y = 0
  this.deg = 0 //Math.random() * 360;
  this.speed = 1
  this.lastCollision = null

  this.tick = function() {
    this.x += Math.cos(getRadiant(this.deg)) * this.speed
    this.y += Math.sin(getRadiant(this.deg)) * this.speed

    checkCollision()
  }

  var that = this
  var checkCollision = function() {
    var a2 = Math.pow(that.x, 2)
    var b2 = Math.pow(that.y, 2)
    var c2 = a2 + b2
    var r = Math.round(Math.abs(Math.sqrt(c2)))

    //console.log(r);

    if (r >= 100) {
      // that.x = Math.cos(that.deg) * 100;
      // that.y = Math.sin(that.deg) * 100;

      // a2 = Math.pow(that.x, 2);
      // b2 = Math.pow(that.y, 2);
      // c2 = a2 + b2;
      // r = Math.round(Math.abs(Math.sqrt(c2)));

      //console.log('r = ', r);

      // check for collision with players
      var wasHit = false

      for (var key in players) {
        var player = players[key]

        if (player.deg !== undefined) {
          var playerDefenceSizePercent =
            teamDefenceSizePercent / Object.keys(teams[player.team]).length
          var playerDefenceDeg = (360 / 100) * playerDefenceSizePercent
          var playerDefenceDegFrom = fixDegrees(
            player.deg - playerDefenceDeg / 2,
          )
          var playerDefenceDegTo = fixDegrees(player.deg + playerDefenceDeg / 2)

          var sinusDesWinkelsDesBallsVomMittelpunktAus =
            Math.round((that.y / 100) * 100) / 100
          //console.log(sinusDesWinkelsDesBallsVomMittelpunktAus);

          var winkelsDesBallsVomMittelpunktAus = getDegrees(
            Math.asin(sinusDesWinkelsDesBallsVomMittelpunktAus),
          )
          if (that.y < 0) {
            winkelsDesBallsVomMittelpunktAus += 180
          }
          //console.log(winkelsDesBallsVomMittelpunktAus)

          /*
					+
				   /|	
				  / |
				 /  |
				+----
*/

          // var gegenkathete = that.y;
          // var hypotenuse = 100;
          // var ballRelSin = Math.round(gegenkathete / hypotenuse * 100) / 100;
          // var ballRelDeg = Math.round(getDegrees(Math.asin(ballRelSin)));

          //console.log('ballRelSin', ballRelSin);
          //console.log('ballRelDeg', ballRelDeg);

          // 0 - 40      10
          if (playerDefenceDegFrom < playerDefenceDegTo) {
            if (
              that.deg >= playerDefenceDegFrom &&
              winkelsDesBallsVomMittelpunktAus <= playerDefenceDegTo
            ) {
              wasHit = true
            }
          }
          // 340 - 20     10
          if (playerDefenceDegFrom > playerDefenceDegTo) {
            if (
              that.deg > playerDefenceDegTo &&
              winkelsDesBallsVomMittelpunktAus < playerDefenceDegFrom
            ) {
              wasHit = false
            } else {
              wasHit = true
            }
          }

          if (wasHit === true) {
            // set lastastCollistion
            that.lastCollision = player.team

            // player hit -> bounce
            //console.log('[deg] Ball', that.deg);
            //console.log('[deg] Player', player.deg);

            var reflection = 180 + that.deg - player.deg
            that.deg = fixDegrees(reflection - that.deg)
            //console.log(that.deg);

            //clearInterval(tickInterval);

            // increase speed
            that.speed = that.speed + 1

            //process.exit(0);
          }
        }
      }

      if (wasHit == false) {
        // no player hit
        // ball is off playground

        // clearInterval(tickInterval);
        // console.log('ball.deg ', that.deg);
        // console.log('player.deg ', player.deg);
        // console.log('playerDefenceSizePercent ', playerDefenceSizePercent);
        // console.log('playerDefenceDeg ', playerDefenceDeg);
        // console.log('playerDefenceDegFrom ', playerDefenceDegFrom, ' playerDefenceDegTo ' + playerDefenceDegTo);

        that.x = 0
        that.y = 0
        that.speed = 1
        that.deg = 0 //Math.random() * 360;
      }
    }
  }
}

function getRadiant(degrees) {
  return degrees * (Math.PI / 180)
}

function getDegrees(radiant) {
  return radiant * (180 / Math.PI)
}

function fixDegrees(degrees) {
  if (degrees < 0) return degrees + 360
  if (degrees >= 360) return degrees - 360
  return degrees
}

//process.exit(0);
