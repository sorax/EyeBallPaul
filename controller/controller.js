var wsIP = '127.0.0.1';
var wsPort = 63555;
var socket;

$(document).ready(function () {
	$('#play').on('click', function () {
		var name = $('#name').val();

		if (name == '') {
			alert("bitte name ausfüllen");
		} else {
			$('#name').css('display', 'none');
			$('#play').css('display', 'none');
			$('#deg').css('display', 'block');
			$('#output').css('display', 'block');

			connect();
		}
	});

	$('#deg').on('change', function () {
		var value = $('#deg').val();
		$('#output').val(value);

		socket.send('hallo');
	});
});








function connect() {
	socket = new WebSocket('ws://' + wsIP + ':' + wsPort);

	socket.onopen = function () {
		console.log('Socket Status: ' + socket.readyState + ' (open)');
	};

	socket.onmessage = function (message) {
		console.log('Empfangen: ' + message.data);
	};



	function send() {
		var text = $('#text').val();
		socket.send(text);
		console.log('Gesendet : ' + text);
		$('#text').val("");
	}

	function log (message) {
		$('#log').append(message + '</br>');
	}

	$('#text').keypress(function (event) {
		if (event.keyCode == '13') {
			send();
		}
	});
}
