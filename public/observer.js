'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const observer = new Observer(wsAddress)
})

class Observer {
  constructor(wsAddress) {
    this.players = {}
    this.balls = []

    this.refreshInterval

    this.canvas = document.getElementById('display-canvas')
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
    this.context = this.canvas.getContext('2d')

    this.setEvents()
    this.webSocket = new WebSocketClient(wsAddress)
  }

  setEvents() {
    window.on('onWebSocketOpen', () => {
      this.reconnectCount = 0
      //$('#connection').text('Connected');
      this.onConnectionEstablished()
    })

    window.on('onWebSocketMessage', event => {
      this.onDataReceived(event.detail)
    })

    // socket.onclose = function() {
    //   //console.log('WebSocket Close');
    //   observer.onConnectionClosed()
    //   //onClose();
    //   reConnect()
    // }
  }

  getGameState() {
    this.webSocket.send({
      type: 'getGameState',
    })
  }

  onDataReceived(data) {
    // console.log('Received', data)

    switch (data.type) {
      // case 'updatePlayer':
      // 	players[player.id] = data.player;
      //
      // 	console.log(players);
      // break;

      case 'setGameState':
        // this.balls = data.balls
        this.teams = data.teams
        this.players = data.players

        var playerDeg = 0
        var playerDefenceSize = 0
        for (var key in this.players) {
          var player = this.players[key]
          playerDeg = player.deg
          playerDefenceSize = player.defenceSize
        }

        $('#debug').html(
          'Ball: ' +
            // JSON.stringify(this.balls[0].deg) +
            '<br>' +
            'Player: ' +
            playerDeg +
            '<br>' +
            'PlayerDefenceSize: ' +
            playerDefenceSize +
            '<br>' +
            JSON.stringify(this.players),
        )

        this.context.beginPath()
        this.context.strokeStyle = 'rgb(255,255,255)'
        this.context.lineWidth = 10
        this.context.arc(0, 0, 10, getRadiant(0), getRadiant(10))
        this.context.stroke()

        break
    }

    this.draw()
  }

  onConnectionEstablished() {
    $('#connection').css('display', 'none')
    $('#display').css('display', 'block')

    this.webSocket.send({
      type: 'setClientType',
      clientType: 'observer',
    })

    this.refreshInterval = setInterval(this.getGameState.bind(this), 50)
  }

  onConnectionClosed() {
    clearInterval(this.refreshInterval)

    $('#connection').css('display', 'block')
    $('#display').css('display', 'none')
  }

  draw() {
    this.clear()

    var playgroundRadius = 0
    if (this.canvas.width > this.canvas.height) {
      playgroundRadius = this.canvas.height / 2
    } else {
      playgroundRadius = this.canvas.width / 2
    }
    playgroundRadius -= 50

    var ballSize = 20

    // draw outer circle
    this.context.beginPath()
    this.context.strokeStyle = 'rgb(255,0,0)'
    this.context.lineWidth = 10
    this.context.arc(
      0,
      0,
      playgroundRadius + ballSize / 2,
      getRadiant(0),
      getRadiant(360),
    )
    this.context.stroke()

    // draw balls
    // console.log('this.balls', this.balls)
    this.balls.forEach(function(ball, index) {
      this.context.beginPath()
      this.context.fillStyle = 'rgb(255,0,0)' //this.color;
      this.context.arc(
        (ball.x * playgroundRadius) / 100,
        (ball.y * playgroundRadius) / 100,
        ballSize,
        0,
        2 * Math.PI,
      )
      this.context.fill()
    })

    // draw players
    for (var key in this.players) {
      var player = this.players[key]

      this.context.beginPath()
      this.context.strokeStyle = 'rgb(0,176,111)'
      // this.context.strokeStyle = rgb(255,66,0);
      this.context.lineWidth = 40
      // this.context.lineCap = 'round';
      // this.context.arc(0, 0, playgroundRadius + (ballSize), getRadiant(player.deg - player.defenceSize / 2), getRadiant(player.deg + player.defenceSize / 2));
      var playerStartDeg = getDegrees(
        player.deg - (player.defenceSize / 100) * 180,
      )
      var playerEndDeg = getDegrees(
        player.deg + (player.defenceSize / 100) * 180,
      )
      this.context.arc(
        0,
        0,
        playgroundRadius + ballSize,
        getRadiant(playerStartDeg),
        getRadiant(playerEndDeg),
      )
      // console.log('playerStartDeg', playerStartDeg)
      // console.log('playerEndDeg', playerEndDeg)
      // console.log('defenceSize', player.defenceSize)
      this.context.stroke()
    }
  }

  clear() {
    this.canvas.width = this.canvas.width // clears the canvas
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2)
  }
}

function getRadiant(degrees) {
  return (degrees * Math.PI) / 180
}

function getDegrees(degrees) {
  if (degrees < 0) return degrees + 360
  if (degrees >= 360) return degrees - 360
  return degrees
}

// function Observer () {

// 	var teams = {};
// 	var players = {};

// function WebSocketClient () {
// 	this.send = function (data) {
// 		socket.send(JSON.stringify(data));
// 	};

// 	var that = this,
// 		wsIP = arguments[0],
// 		wsPort = arguments[1];
// 	var socket;
// 	var reconnectTimeout,
// 		reconnectTime = 2000,
// 		reconnectCount = 0;

// 	var connect = function () {
// 		//console.log('WebSocket Connect');
// 		$('#connection').text('Connecting ...');

// 		socket = new WebSocket('ws://' + wsIP + ':' + wsPort);

// 		setEvents();
// 	};

//

// 	var reConnect = function () {
// 		clearTimeout(reconnectTimeout);
// 		reconnectCount++;

// 		//console.log('WebSocket ReConnect ('+reconnectCount+')');
// 		$('#connection').text('ReConnecting ('+reconnectCount+')...');

// 		reconnectTimeout = setTimeout(function () {
// 			connect();
// 		}, reconnectTime);
// 	};

// 	var init = function () {
// 		//$('#connection').text('Connecting ...');
// 		connect();
// 	};

// 	// INIT
// 	init();
// }

// // 'use strict';
// //
// // var wsIP = '127.0.0.1';
// // var wsPort = 63555;
// //
// // var observer = new Observer(),
// // 	webSocket;
// //
// // //document.addEventListener('DOMContentLoaded', function () {
// // $(document).ready(function () {
// // 	observer.init({wsIP: wsIP, wsPort: wsPort});
// // });
// //
// // function Observer () {
// // 	// PUBLIC
// //
// // 	// PRIVATE
// // 	var teams = [];
// // 	var players = [];
// // 	var animationFrameId;
// //

// //
// // 	/*var init = function () {
// // 		canvas = document.getElementById(canvasId);
// // 		context = canvas.getContext('2d');
// //
// // 		setEventListener();
// // 		onWindowResize();
// // 	};
// //
// //
// //
// // 	var draw = function () {
// // 		clear();
// // 		ball.draw();
// // 		drawPlayers();
// //
// // 		//animationFrameId = requestAnimationFrame(that.draw);
// //  	};
// //
// // 	var setEventListener = function () {
// // 		window.addEventListener('resize', onWindowResize);
// // 	};
// //
// // 	var onWindowResize = function () {
// // 		canvas.height = window.innerHeight;
// // 		canvas.width = window.innerWidth;
// // 		draw();
// // 	};
// // 	var draw = function () {
// //
// // 	};*/
// //
// // }
// //

// //
// // var allDefenseSizePercent = 50;
// // var teamDefenceSizePercent = allDefenseSizePercent / 2;
// //

// //

// //
// //
// // function ObserverJS () {
// //
// // 	// PUBLIC FUNCTIONS
// //
// //
// //
// //
// // 	// PRIVATE VARIABLES
// // 	var that = this,
// // 		ball,
// // 		animationFrameId;
// //
// // 	// PRIVATE FUNCTIONS

// //
// // 	var drawPlayers = function () {
// // 		that.players.forEach(function (player, index) {
// // 			var playerPosition = player.deg;
// //
// // 			var playerSize = 360 / (100 / teamDefenceSizePercent); // => 90°
// // 			var playerOffset = playerSize / 2;	// => 45°
// //
// //
// // 		});
// // 	};
// // }
// //
// //
// // function Player (id, name, deg) {
// // 	this.id = id;
// // 	this.name = name;
// // 	this.deg = deg;
// // 	this.color = 'rgba(0,176,111,0.7)';
// // 	//this.team = 1;
// // 	//this.points = 5;
// //
// // 	this.draw = function (context) {
// //
// // 	};
// // }
// //
// //
// // function Ball () {
// //
// // 	// PUBLIC VARIABLES
// //
// // 	this.speed = 1;
// // 	this.colors = ['rgb(255,255,255)', 'rgb(0,176,111)', 'rgb(255,66,0)'];
// // 	this.color = this.colors[0];
// //
// // 	// PUBLIC FUNCTIONS
// // 	this.draw = function () {
// //
// //
// // 		context.beginPath();
// // 		context.fillStyle = this.color;
// // 		context.arc((canvas.width / 2) + this.x, (canvas.height / 2) + this.y, this.radius, 0, 2 * Math.PI);
// // 		context.fill();
// //
// // 		collisionTest(this.x, this.y);
// // 	};
// //
// // 	var that = this;
// //
// // 	var collisionTest = function (x, y) {
// // 		// draw circle on collision-test-point
// // 		//context.beginPath();
// // 		//context.fillStyle = 'rgb(255,0,0)';
// // 		//context.arc((canvas.width / 2) + x, (canvas.height / 2) + y, 3, 0, Math.PI * 2);
// // 		//context.fill();
// //
// //
// // 		var distanceFromCenter = Math.round(Math.sqrt((that.x * that.x) + (that.y * that.y)));
// // 		//console.log('distanceFromCenter: ' + distanceFromCenter);
// //
// // 		if (distanceFromCenter >= 280) {
// // 			//var testColor = context.getImageData(0, 0, 1, 1).data;
// // 			//var testColor = context.getImageData((canvas.width / 2) + x, (canvas.height / 2) + y, 1, 1).data;
// // 			//console.log(testColor);
// //
// //
// //
// // 			//hasLeft();
// // 			hasHitAPaddle();
// // 		}
// // 	};
// //
// // 	var hasLeft = function () {
// // 		that.x = 0;
// // 		that.y = 0;
// // 		that.speed = 1;
// // 		that.color = that.colors[0];
// //
// // 	};
// //
// // 	var hasHitAPaddle = function () {
// // 		that.speed += 1;
// // 		if (that.color == that.colors[2]) {
// // 			that.color = that.colors[1];
// // 		} else {
// // 			that.color = that.colors[2];
// // 		}
// //
// // 		that.deg = Math.random()*360;
// // 		//that.deg = Math.round(Math.random() * 30 + 180);
// //
// //
// // 		//Math.floor(Math.random() * 40) - 20;
// // 	}
// //
// // /.*
// // 	var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
// // 	// invert colors
// // 	for (var i = 0; i < imgData.data.length; i += 4) {
// // 		imgData.data[i] = 255-imgData.data[i];
// // 		imgData.data[i+1] = 255-imgData.data[i+1];
// // 		imgData.data[i+2] = 255-imgData.data[i+2];
// // 		imgData.data[i+3] = 255;
// // 	}
// //  	context.putImageData(imgData,0,0);
// // *./
// //
// // }
// //
// //
// // function WebSocketServer () {
// // 	// PUBLIC
// // 	this.send = function (message) {
// // 		webSocket.send(JSON.stringify(message));
// // 	};
// //
// // 	// PRIVATE
// // 	var that = this,
// // 		wsIP = arguments[0],
// // 		wsPort = arguments[1],
// // 		webSocket;
// //
// //
// //	//var newPlayer = new Player(1, data.name, parseInt(data.deg));
// //
// // }
// //
// //
// //
// //
// // //var length = players.length;
// // //for (var i = 0, length; i < length; i++) {
// // //	drawPlayer(players[i].deg, 'rgba(0,176,111,0.7)');
// // //}
// //
// // this.pause = function () {
// // cancelAnimationFrame(animationFrameId);
// // }
// //
// //
// //
// // function GameJS () {
// //
// // var canvasId = arguments[0],
// // canvas, context,
// // animationFrameId;
// //
// //
// //
// //
// // var draw = function () {
// // clear();
// //
// // drawDot();
// //
// //
// // context.beginPath();
// // context.arc(100,75,50,0,0.5*Math.PI, false);
// // context.lineWidth = 15;
// // context.strokeStyle = 'rgba(255, 0, 0, 0.5)';
// // context.stroke();
// //
// //
// // context.beginPath();
// // context.arc(100,75,50,1.2*Math.PI,1.7*Math.PI, false);
// // context.lineWidth = 15;
// // context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
// // context.stroke();
// //
// // }
// //
// //
// // var drawDot = function () {
// // context.beginPath();
// // context.arc(dot.xPos, dot.yPos, dot.size, 0, 2 * Math.PI, false);
// // context.fillStyle = 'rgba(255, 0, 0, 0.5)';
// // context.fill();
// // }
// //
// //
// //
// //
// //
// // /*
// // players.forEach(function (player, index) {
// // console.log(player);
// //
// // listHtml += '<li>' + player.name + '</li>';
// // });
// //
// // team1List.innerHTML = listHtml;
// // }
// //
// //
// //
// // };
// //
// //
// //
// // document.addEventListener('DOMContentLoaded', function () {
// // //var observerCanvas = new ObserverJS('canvas');
// // //var observerCanvas.draw();
// // });
// //
// // function ObserverJS () {
// // // PUBLIC
// // this.config = {};
// //
// // this.addClip = function (clip) {
// // clips.push(clip);
// // };
// //
// // // PRIVATE
// // var canvasId = arguments[0],
// // canvas, context,
// // animationFrameId;
// // var that = this;
// // var clips = [];
// //
// //
// //
// // var setEventListener = function () {
// // window.addEventListener('resize', onWindowResize);
// // };
// //
// // /.*
// // var onWindowResize = function () {
// // log('game: resize');
// // clear();
// // canvas.height = window.innerHeight;
// // canvas.width = window.innerWidth;
// // //draw();
// // };
// // *./
// // var draw = function () {
// // log('game: draw');
// // clear();
// //
// //
// //
// // context.beginPath();
// // context.arc(100,75,50,0,2*Math.PI);
// // context.stroke();
// // };
// //
// // }
// //
// // */
