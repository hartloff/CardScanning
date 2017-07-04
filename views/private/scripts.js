/**

backend form validation still required in case user disables javascript

TODO: question type validation

**/

$(document).ready(function() {

	// field ready state
	var personNumReady = false; // person # ready state
	var datetimeReady = false; // datetime ready state

	// event 'input:change' emitter for all input fields
	$('input').keyup(function(event) {
		$(event.target).trigger('input:change');
	});

	// person # field validation
	$('#personNum').on('input:change focusout form:error', function() {
		var value = $(this).val();

		var isEmpty = value === '';
		var isInvalid = value.length !== 8 || isNaN(value);
		personNumReady = !(isEmpty || isInvalid);

		$('#personNum-msg').html(
			(isEmpty && 'you must provide your person #') ||
			(isInvalid && 'person # must be an 8-digit number') || ''
		);
	});

	// TODO: question type

	// datetime field validation
	$('#datetime').on('input:change focusout form:error' ,function() {
		datetimeReady = !($(this).val() === '');

		$('#datetime-msg').html(
			(!datetimeReady && 'you must provide a date and time') || ''
		);
	});

	// submit handler
	$('form').submit(function() {
		if(!(personNumReady && datetimeReady)) {
			$('input').trigger('form:error');
			return false;
		}

		return true;
	});

});
