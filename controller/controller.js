var wsIP = '127.0.0.1';
var wsPort = 63555;
var socket;

$(document).ready(function () {
	$('#name').focus();

	$('#name').on('keyup', function (event) {
		//console.log(event);
		if (event.originalEvent.keyCode == 13) {
			$('#play').click();
		}

	})


	$('#play').on('click', function () {
		var name = $('#name').val();

		if (name == '') {
			alert("Bitte Name ausfüllen");
		} else {
			$('#name').css('display', 'none');
			$('#play').css('display', 'none');
			$('#deg').css('display', 'block');

			connect();
		}
	});

	$('#deg').on('change input', function () {
		var value = $('#deg').val();

		log(value);

		socket.send(value);
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

	function log(message) {
		$('#log').append(message + '</br>');
	}

	$('#text').keypress(function (event) {
		if (event.keyCode == '13') {
			send();
		}
	});
}


function log (data) {
	$('#log').html(data);
}