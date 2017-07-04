'use strict';

var wsIP = '127.0.0.1';
var wsPort = 63555;

var allDefenseSizePercent = 50;
var teamDefenceSizePercent = allDefenseSizePercent / 2;

var teams = [];
var players = [];

var canvas = $('#canvas').get(0);
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
var context = canvas.getContext('2d');

var observer = new ObserverJS();
var socket = new WebSocketServer(wsIP, wsPort);







function ObserverJS () {

	// PUBLIC VARIABLES
	this.players = [];

	// PUBLIC FUNCTIONS
	this.draw = function () {
		//test = test + 1;
		//console.log(test);

		that.clear();
		that.drawBall();
		that.drawPlayers();

		requestAnimationFrame(that.draw);
	}

	this.drawBall = function () {
		// zeichne einen Kreis
		context.beginPath();
		context.fillStyle = 'rgb(255,255,255)';
		context.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
		context.fill();
	}

	this.drawPlayers = function () {
		this.players.forEach(function (player, index) {
			var playerPosition = player.deg;

			var playerSize = 360 / (100 / teamDefenceSizePercent); // => 90°
			var playerOffset = playerSize / 2;	// => 45°

			context.beginPath();
			context.strokeStyle = player.color;
			context.lineWidth = 40;
			context.lineCap = 'round';
			context.arc(canvas.width / 2, canvas.height / 2, 320, getRadiant(playerPosition - playerOffset), getRadiant(playerPosition + playerOffset));
			context.stroke();

			context.beginPath();
			context.strokeStyle = 'rgb(61,70,73)';
			context.lineWidth = 10;
			context.arc(canvas.width / 2, canvas.height / 2, 320, getRadiant(playerPosition-0.01), getRadiant(playerPosition+0.01));
			context.stroke();
		});
	}

	this.clear = function () {
		canvas.width = canvas.width;	// clears the canvas
	}

	// PRIVATE VARIABLES
	var that = this;
	var animationFrameId;
	var test = 0;

	// PRIVATE FUNCTIONS
	var init = function () {
		that.draw();
	}

	// INIT
	init();
}


function Player (id, name, deg) {
	this.id = id;
	this.name = name;
	this.deg = deg;
	this.color = 'rgba(0,176,111,0.7)';
	//this.team = 1;
	//this.points = 5;

	this.setDeg = function (deg) {
		this.deg = 9;
	}
}



function WebSocketServer () {

	// NEW PLAYER CONNECTED
	var newPlayer = new Player(1, 'Tom', 5);
	observer.players[newPlayer.id] = newPlayer;


	// PUBLIC
	this.send = function (message) {
		webSocket.send(JSON.stringify(message));
	};

	// PRIVATE
	var wsIP = arguments[0],
		wsPort = arguments[1];
	var webSocket;
	var that = this;

	var init = function () {
		webSocket = new WebSocket('ws://' + wsIP + ':' + wsPort);

		webSocket.onopen = function () {
			console.log('WebSocket status: ' + webSocket.readyState + ' (open)');
			webSocket.send(JSON.stringify({clientType: 'observer'}));
		};

		webSocket.onmessage = function (message) {
			console.log('WebSocket recieved: ');
			console.log(message.data);
		};

		webSocket.onclose = function () {
			console.log('WebSocket close');
		};

		webSocket.onerror = function (error) {
			console.log('WebSocket error: ' + error);
		};
	};


	// INIT
	init();
}


function getRadiant(degrees) {
	return degrees * Math.PI / 180;
}



/*


	//var length = players.length;
	//for (var i = 0, length; i < length; i++) {
	//	drawPlayer(players[i].deg, 'rgba(0,176,111,0.7)');
	//}

	this.pause = function () {
		cancelAnimationFrame(animationFrameId);
	}

function WebSocketServer () {




}







/*


 function GameJS () {



 this.addPlayer = function (player) {
 players.push(player);
 //updateTeams();
 }

 // PRIVATE
 var that = this;

 var canvasId = arguments[0],
 canvas, context,
 animationFrameId;

 var players = [99];

 var dot = {
 xPos: 100,
 yPos: 100,
 deg: 45,
 speed: 1,
 size: 10
 }

 var init = function () {
 canvas = document.getElementById(canvasId);
 context = canvas.getContext('2d');

 //setEventListener();
 onWindowResize();



 var setEventListener = function () {
 window.addEventListener('resize', onWindowResize);
 };

 var onWindowResize = function () {
 canvas.height = window.innerHeight;
 canvas.width = window.innerWidth;
 draw();
 };



 var draw = function () {
 clear();

 drawDot();




 context.beginPath();
 context.arc(100,75,50,0,0.5*Math.PI, false);
 context.lineWidth = 15;
 context.strokeStyle = 'rgba(255, 0, 0, 0.5)';
 context.stroke();


 context.beginPath();
 context.arc(100,75,50,1.2*Math.PI,1.7*Math.PI, false);
 context.lineWidth = 15;
 context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
 context.stroke();

 }


 var drawDot = function () {


 context.beginPath();
 context.arc(dot.xPos, dot.yPos, dot.size, 0, 2 * Math.PI, false);
 context.fillStyle = 'rgba(255, 0, 0, 0.5)';
 context.fill();
 }




 var updateTeams = function () {
 //var team1List = document.getElementById('team-red');
 //var team2List = document.getElementById('team-blue');


 var listHtml = '';





 /*
 players.forEach(function (player, index) {
 console.log(player);

 listHtml += '<li>' + player.name + '</li>';
 });

 team1List.innerHTML = listHtml;
 }


 // INIT
 init();
 };


 var game = new GameJS('canvas');



 var p1 = new Player();
 p1.name = 'P 1';
 p1.team = 'red';
 p1.deg = 12;

 var p2 = new Player();
 p2.name = 'P 2';
 p2.team = 'blue';
 p2.deg = 36;

 game.addPlayer(p1);
 game.addPlayer(p2);



 /*







 document.addEventListener('DOMContentLoaded', function () {
 //var observerCanvas = new ObserverJS('canvas');
 //var observerCanvas.draw();
 });

 function ObserverJS () {
 // PUBLIC
 this.config = {};

 this.addClip = function (clip) {
 clips.push(clip);
 };

 // PRIVATE
 var canvasId = arguments[0],
 canvas, context,
 animationFrameId;
 var that = this;
 var clips = [];

 var init = function () {
 //log('canvas: init ['+canvasId+']');

 canvas = document.getElementById(canvasId);
 context = canvas.getContext('2d');

 //setEventListener();
 //onWindowResize();

 clear()
 };


 var setEventListener = function () {
 window.addEventListener('resize', onWindowResize);
 //canvas.addEventListener('click', onClick);
 };

 /.*
 var onWindowResize = function () {
 log('game: resize');
 clear();
 canvas.height = window.innerHeight;
 canvas.width = window.innerWidth;
 //draw();
 };
 *./
 var draw = function () {
 log('game: draw');
 clear();

 //for (var clip in clips) {
 //	log(value);
 //}

 context.beginPath();
 context.arc(100,75,50,0,2*Math.PI);
 context.stroke();
 };

 }

 */
