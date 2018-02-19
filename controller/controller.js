'use strict';

//var wsIP = '127.0.0.1';
var wsIP = '192.168.0.14';
var wsPort = 63555;

var controller = new Controller(),
	webSocket;

$(document).ready(function () {
	controller.init({wsIP: wsIP, wsPort: wsPort});
});

function Controller () {
	// PUBLIC
	this.onDataReceived = function (data) {
		//console.log('Received: ', data);
		switch (data.type) {
			case 'setTeam':
				setTeam(data.team);
			break;
		}
	};

	this.onConnectionEstablished = function () {
		$('#connection').css('display', 'none');
		$('#login').css('display', 'block');

		// Set client type
		webSocket.send({
			type: 'setClientType',
			clientType: 'controller'
		});
	};

	this.onConnectionClosed = function () {
		$('#connection').css('display', 'block');
		$('#login').css('display', 'none');
	};

	this.init = function (config) {
		setEvents();
		webSocket = new WebSocketClient(config.wsIP, config.wsPort);
	};

	// PRIVATE
	var player = {};

	var setEvents = function () {
		if (localStorage.getItem('playerName') !== '') {
			player.name = localStorage.getItem('playerName');
		} else {
			player.name = '';
		}

		var loginName = $('#login-name');
		var loginSend = $('#login-send');

		loginName.val(player.name).focus();
		loginName.on('keyup', function (event) {
			if (event.keyCode === 13) {
				loginSend.click();
			}
		});

		loginSend.on('click', function () {
			player.name = loginName.val();

			if (player.name === '') {
				alert("Bitte Name ausfüllen");
			} else {
				localStorage.setItem('playerName', player.name);

				$('#login').css('display', 'none');
				$('#play').css('display', 'block');

				webSocket.send({
					type: 'setName',
					name: player.name
				});
			}
		});


		$('#play-deg').on('input', function () {
			webSocket.send({
				type: 'setDeg',
				deg: $(this).val()
			});
		});
	};

	var setTeam = function (team) {
		player.team = team;
		$('#login-send').attr('class', 'team' + player.team);
		$('#play-deg').attr('class', 'team' + player.team);
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

			controller.onConnectionEstablished();
			//onOpen();
		};

		socket.onmessage = function (message) {
			//console.log('Received: %s', message.data);

			var data = JSON.parse(message.data);
			//console.log(data);

			controller.onDataReceived(data);
			//onMessage(data);
		};

		socket.onerror = function (error) {
			//console.log('WebSocket Error: ' + error);
		};

		socket.onclose = function () {
			//console.log('WebSocket Close');

			controller.onConnectionClosed();
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
