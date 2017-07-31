'use strict';

var wsIP = '127.0.0.1';
var wsPort = 63555;

var socket,
	playerName;

$(document).ready(function () {
	if (localStorage.getItem('name') != '') {
		playerName = localStorage.getItem('name');
	} else {
		playerName = '';
	}

	$('#name').val(playerName).focus();
	$('#name').on('keyup', function (event) {
		if (event.keyCode == 13) {
			$('#play').click();
		}
	});

	$('#play').on('click', function () {
		playerName = $('#name').val();

		if (playerName == '') {
			alert("Bitte Name ausfüllen");
		} else {
			localStorage.setItem('name', playerName);

			socket = new WebSocketServer(wsIP, wsPort);

			$('#name, #play').css('display', 'none');
			$('#deg, #log').css('display', 'block');
		}
	});

	$('#deg').on('input', function () {
		var message = {
			type: 'setDeg',
			deg: $(this).val()
		};
		console.log(message);

		socket.send(message);
	});
});


function WebSocketServer () {
	// PUBLIC
	this.send = function (message) {
		webSocket.send(JSON.stringify(message));
	};

	// PRIVATE
	var that = this,
		wsIP = arguments[0],
		wsPort = arguments[1];
	var webSocket;

	var init = function () {
		/*
		var WebSocket = require('ws'),
			ws = new WebSocket('ws://www.host.com/path');

		ws.on('open', function() {
    		ws.send('something');
		});

		ws.on('message', function(message) {
    		console.log('received: %s', message);
		});
		*/

		webSocket = new WebSocket('ws://' + wsIP + ':' + wsPort);

		webSocket.onopen = function () {
			console.log('WebSocket open: (' + webSocket.readyState + ')');

			var message = {
				type: 'setClientType',
				clientType: 'player',
				playerName: playerName,
				deg: $('#deg').val()
			};
			that.send(message);
		};

		webSocket.onmessage = function (message) {
			console.log('WebSocket message');

			var data = JSON.parse(message.data);
			console.log(data);

			var team = data.team;
			var points = data.points;

			$('#deg').addClass('team' + team);
			$('#log').html('Punkte: ' + points);
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
