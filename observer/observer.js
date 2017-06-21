"use strict";


/*
function Player () {
	// PUBLIC
	this.name = '';
	this.deg = 0;
}



function GameJS () {
	// PUBLIC
	this.pause = function () {
		cancelAnimationFrame(animationFrameId)
	}


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

		animationFrameId = requestAnimationFrame(draw);
	};

	var setEventListener = function () {
		window.addEventListener('resize', onWindowResize);
	};

	var onWindowResize = function () {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		draw();
	};

	var clear = function () {
		canvas.width = canvas.width;	// clears the canvas
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


		var length = players.length;
		for (var i = 0, length; i < length; i++) {
			alert(i);
		}


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


	var onWindowResize = function () {
		log('game: resize');
		clear();
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		//draw();
	};

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
