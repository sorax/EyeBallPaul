'use strict';

var wsIP = '127.0.0.1';
//var wsIP = '192.168.0.15';
var wsPort = 63555;

var observer = new Observer(),
	webSocket;

$(document).ready(function () {
	observer.init({wsIP: wsIP, wsPort: wsPort});
});

function Observer () {
	// PUBLIC
	this.onDataReceived = function (data) {
		//console.log('Received: ', data);
		switch (data.type) {
			// case 'updatePlayer':
			// 	var player = data.player;
			// 	players[player.id] = player;
			//
			// 	console.log(players);
			// break;

			case 'setGameState':
				balls = data.balls;
				teams = data.teams;
				players = data.players;
			break;
		}

		draw();
	};

	this.onConnectionEstablished = function () {
		$('#connection').css('display', 'none');
		$('#display').css('display', 'block');

		// Set client type
		webSocket.send({
			type: 'setClientType',
			clientType: 'observer'
		});
	};

	this.onConnectionClosed = function () {
		$('#connection').css('display', 'block');
		$('#display').css('display', 'none');
	};

	this.init = function (config) {
		webSocket = new WebSocketClient(config.wsIP, config.wsPort);

		setInterval(getGameState, 50);
	};

	// PRIVATE
	var balls = [];
	var teams = {};
	var players = {};
	var canvas = document.getElementById('display-canvas');
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	var context = canvas.getContext('2d');

	var draw = function () {
		clear();

		context.beginPath();
		context.strokeStyle = 'rgb(255,0,0)';
		context.lineWidth = 10;
		context.arc(canvas.width / 2, canvas.height / 2, 100 + 25, getRadiant(0), getRadiant(360));
		context.stroke();



		var radius = 20;

		balls.forEach(function (ball, index) {
			context.beginPath();
			context.fillStyle = 'rgb(255,0,0)';//this.color;
			context.arc((canvas.width / 2) + ball.x, (canvas.height / 2) + ball.y, radius, 0, 2 * Math.PI);
			context.fill();
		});



		for (var key in players) {
			var player = players[key];

			//var playerPosition =

			context.beginPath();
			context.strokeStyle = 'rgb(0,176,111)';
			//context.strokeStyle = rgb(255,66,0);
			context.lineWidth = 40;
			context.lineCap = 'round';
			context.arc(canvas.width / 2, canvas.height / 2, 140, getRadiant(player.deg - 10), getRadiant(player.deg + 10));
			context.stroke();

		}


	};

	var clear = function () {
		canvas.width = canvas.width;	// clears the canvas
	};

	var getGameState = function () {
		webSocket.send({
			type: 'getGameState'
		});
	};

}

function WebSocketClient () {
	// PUBLIC
	this.send = function (data) {
		socket.send(JSON.stringify(data));
	};

	// PRIVATE
	var that = this,
		wsIP = arguments[0],
		wsPort = arguments[1];
	var socket;
	var reconnectTimeout,
		reconnectTime = 2000,
		reconnectCount = 0;

	var connect = function () {
		//console.log('WebSocket Connect');
		$('#connection').text('Connecting ...');

		socket = new WebSocket('ws://' + wsIP + ':' + wsPort);

		setEvents();
	};

	var setEvents = function () {
		socket.onopen = function () {
			reconnectCount = 0;
			//console.log('WebSocket Open: (STATUS: ' + socket.readyState + ')');
			//$('#connection').text('Connected');

			observer.onConnectionEstablished();
			//onOpen();
		};

		socket.onmessage = function (message) {
			//console.log('Received: %s', message.data);

			var data = JSON.parse(message.data);
			//console.log(data);

			observer.onDataReceived(data);
			//onMessage(data);
		};

		socket.onerror = function (error) {
			//console.log('WebSocket Error: ' + error);
		};

		socket.onclose = function () {
			//console.log('WebSocket Close');

			observer.onConnectionClosed();
			//onClose();
			reConnect();
		};
	};

	var reConnect = function () {
		clearTimeout(reconnectTimeout);
		reconnectCount++;

		//console.log('WebSocket ReConnect ('+reconnectCount+')');
		$('#connection').text('ReConnecting ('+reconnectCount+')...');

		reconnectTimeout = setTimeout(function () {
			connect();
		}, reconnectTime);
	};

	var init = function () {
		//$('#connection').text('Connecting ...');
		connect();
	};

	// INIT
	init();
}

function getRadiant (degrees) {
	return degrees * Math.PI / 180;
}

















// 'use strict';
//
// var wsIP = '127.0.0.1';
// var wsPort = 63555;
//
// var observer = new Observer(),
// 	webSocket;
//
// //document.addEventListener('DOMContentLoaded', function () {
// $(document).ready(function () {
// 	observer.init({wsIP: wsIP, wsPort: wsPort});
// });
//
// function Observer () {
// 	// PUBLIC
//
// 	// PRIVATE
// 	var teams = [];
// 	var players = [];
// 	var animationFrameId;
//

//
// 	/*var init = function () {
// 		canvas = document.getElementById(canvasId);
// 		context = canvas.getContext('2d');
//
// 		setEventListener();
// 		onWindowResize();
// 	};
//
//
//
// 	var draw = function () {
// 		clear();
// 		ball.draw();
// 		drawPlayers();
//
// 		//animationFrameId = requestAnimationFrame(that.draw);
//  	};
//
// 	var setEventListener = function () {
// 		window.addEventListener('resize', onWindowResize);
// 	};
//
// 	var onWindowResize = function () {
// 		canvas.height = window.innerHeight;
// 		canvas.width = window.innerWidth;
// 		draw();
// 	};
// 	var draw = function () {
//
// 	};*/
//
// }
//




//
// var allDefenseSizePercent = 50;
// var teamDefenceSizePercent = allDefenseSizePercent / 2;
//

//

//
//
// function ObserverJS () {
//
// 	// PUBLIC FUNCTIONS
//
//
//
//
// 	// PRIVATE VARIABLES
// 	var that = this,
// 		ball,
// 		animationFrameId;
//
// 	// PRIVATE FUNCTIONS

//
// 	var drawPlayers = function () {
// 		that.players.forEach(function (player, index) {
// 			var playerPosition = player.deg;
//
// 			var playerSize = 360 / (100 / teamDefenceSizePercent); // => 90°
// 			var playerOffset = playerSize / 2;	// => 45°
//
//
// 		});
// 	};
// }
//
//
// function Player (id, name, deg) {
// 	this.id = id;
// 	this.name = name;
// 	this.deg = deg;
// 	this.color = 'rgba(0,176,111,0.7)';
// 	//this.team = 1;
// 	//this.points = 5;
//
// 	this.draw = function (context) {
//
// 	};
// }
//
//
// function Ball () {
//
// 	// PUBLIC VARIABLES
//
// 	this.speed = 1;
// 	this.colors = ['rgb(255,255,255)', 'rgb(0,176,111)', 'rgb(255,66,0)'];
// 	this.color = this.colors[0];
//
// 	// PUBLIC FUNCTIONS
// 	this.draw = function () {
//
//
// 		context.beginPath();
// 		context.fillStyle = this.color;
// 		context.arc((canvas.width / 2) + this.x, (canvas.height / 2) + this.y, this.radius, 0, 2 * Math.PI);
// 		context.fill();
//
// 		collisionTest(this.x, this.y);
// 	};
//
// 	var that = this;
//
// 	var collisionTest = function (x, y) {
// 		// draw circle on collision-test-point
// 		//context.beginPath();
// 		//context.fillStyle = 'rgb(255,0,0)';
// 		//context.arc((canvas.width / 2) + x, (canvas.height / 2) + y, 3, 0, Math.PI * 2);
// 		//context.fill();
//
//
// 		var distanceFromCenter = Math.round(Math.sqrt((that.x * that.x) + (that.y * that.y)));
// 		//console.log('distanceFromCenter: ' + distanceFromCenter);
//
// 		if (distanceFromCenter >= 280) {
// 			//var testColor = context.getImageData(0, 0, 1, 1).data;
// 			//var testColor = context.getImageData((canvas.width / 2) + x, (canvas.height / 2) + y, 1, 1).data;
// 			//console.log(testColor);
//
//
//
// 			//hasLeft();
// 			hasHitAPaddle();
// 		}
// 	};
//
// 	var hasLeft = function () {
// 		that.x = 0;
// 		that.y = 0;
// 		that.speed = 1;
// 		that.color = that.colors[0];
//
// 	};
//
// 	var hasHitAPaddle = function () {
// 		that.speed += 1;
// 		if (that.color == that.colors[2]) {
// 			that.color = that.colors[1];
// 		} else {
// 			that.color = that.colors[2];
// 		}
//
// 		that.deg = Math.random()*360;
// 		//that.deg = Math.round(Math.random() * 30 + 180);
//
//
// 		//Math.floor(Math.random() * 40) - 20;
// 	}
//
// /.*
// 	var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
// 	// invert colors
// 	for (var i = 0; i < imgData.data.length; i += 4) {
// 		imgData.data[i] = 255-imgData.data[i];
// 		imgData.data[i+1] = 255-imgData.data[i+1];
// 		imgData.data[i+2] = 255-imgData.data[i+2];
// 		imgData.data[i+3] = 255;
// 	}
//  	context.putImageData(imgData,0,0);
// *./
//
// }
//
//
// function WebSocketServer () {
// 	// PUBLIC
// 	this.send = function (message) {
// 		webSocket.send(JSON.stringify(message));
// 	};
//
// 	// PRIVATE
// 	var that = this,
// 		wsIP = arguments[0],
// 		wsPort = arguments[1],
// 		webSocket;
//
//
//	//var newPlayer = new Player(1, data.name, parseInt(data.deg));
//
// }
//
//
//
//
// //var length = players.length;
// //for (var i = 0, length; i < length; i++) {
// //	drawPlayer(players[i].deg, 'rgba(0,176,111,0.7)');
// //}
//
// this.pause = function () {
// cancelAnimationFrame(animationFrameId);
// }
//
//
//
// function GameJS () {
//
// var canvasId = arguments[0],
// canvas, context,
// animationFrameId;
//
//
//
//
// var draw = function () {
// clear();
//
// drawDot();
//
//
// context.beginPath();
// context.arc(100,75,50,0,0.5*Math.PI, false);
// context.lineWidth = 15;
// context.strokeStyle = 'rgba(255, 0, 0, 0.5)';
// context.stroke();
//
//
// context.beginPath();
// context.arc(100,75,50,1.2*Math.PI,1.7*Math.PI, false);
// context.lineWidth = 15;
// context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
// context.stroke();
//
// }
//
//
// var drawDot = function () {
// context.beginPath();
// context.arc(dot.xPos, dot.yPos, dot.size, 0, 2 * Math.PI, false);
// context.fillStyle = 'rgba(255, 0, 0, 0.5)';
// context.fill();
// }
//
//
//
//
//
// /*
// players.forEach(function (player, index) {
// console.log(player);
//
// listHtml += '<li>' + player.name + '</li>';
// });
//
// team1List.innerHTML = listHtml;
// }
//
//
//
// };
//
//
//
// document.addEventListener('DOMContentLoaded', function () {
// //var observerCanvas = new ObserverJS('canvas');
// //var observerCanvas.draw();
// });
//
// function ObserverJS () {
// // PUBLIC
// this.config = {};
//
// this.addClip = function (clip) {
// clips.push(clip);
// };
//
// // PRIVATE
// var canvasId = arguments[0],
// canvas, context,
// animationFrameId;
// var that = this;
// var clips = [];
//
//
//
// var setEventListener = function () {
// window.addEventListener('resize', onWindowResize);
// };
//
// /.*
// var onWindowResize = function () {
// log('game: resize');
// clear();
// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// //draw();
// };
// *./
// var draw = function () {
// log('game: draw');
// clear();
//
//
//
// context.beginPath();
// context.arc(100,75,50,0,2*Math.PI);
// context.stroke();
// };
//
// }
//
// */
