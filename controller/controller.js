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
		}
	})

	$('#deg').on('change', function () {
		var value = $('#deg').val();
		$('#output').val(value);
	})
});
