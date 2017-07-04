'use strict';

var wsIP = '127.0.0.1';
var wsPort = 63555;
var socket = new WebSocketServer(wsIP, wsPort);
var playerName = '';

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

			$('#name').css('display', 'none');
			$('#play').css('display', 'none');
			$('#deg').css('display', 'block');
		}
	});

	$('#deg').on('change input', function () {
		var value = $('#deg').val();

		socket.send({
			name: playerName,
			deg: value
		});
	});
});


function log (data) {
	console.log(data);
	//$('#log').html(data);
}


function WebSocketServer () {
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
			log('WebSocket open: (' + webSocket.readyState + ')');
		};

		webSocket.onmessage = function (message) {
			log('WebSocket recieved: ' + message.data);
		};

		webSocket.onclose = function () {
			log('WebSocket close');
		};

		webSocket.onerror = function (error) {
			log('WebSocket error: ' + error);
		};
	};

	// INIT
	init();
}
