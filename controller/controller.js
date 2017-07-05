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

	$('#deg').on('input', function () {
		var message = {
			name: playerName,
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
	var wsIP = arguments[0],
		wsPort = arguments[1];
	var webSocket;

	var init = function () {
		webSocket = new WebSocket('ws://' + wsIP + ':' + wsPort);

		webSocket.onopen = function () {
			console.log('WebSocket open: (' + webSocket.readyState + ')');
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
