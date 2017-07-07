/**

backend form validation still required in case user disables javascript

TODO: question type validation

**/

$(document).ready(function() {

	$('form').submit(function() {
		var personNumReady = /^[0-9]{8}$/.test($('#personNum').val());
		var qTypeReady = $('#qType').val().length !== 0;
		var qDescriptionReady = $('#qDescription').val().trim().length !== 0;
		var datetimeReady = $('#datetime').val().length !== 0;

		$('#personNum-msg').html(
			(!personNumReady && 'person # must be an 8-digit number') || ''
		);

		$('#qType-msg').html(
			(!qTypeReady && 'you must select at least one item') || ''
		);

		$('#qDescription-msg').html(
			(!qDescriptionReady && 'you must provide a brief description') || ''
		);

		$('#datetime-msg').html(
			(!datetimeReady && 'you must provide a date and time') || ''
		);

		return personNumReady && qTypeReady && qDescriptionReady && datetimeReady;
	});

});
