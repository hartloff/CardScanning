/**

backend form validation still required in case user disables javascript

**/

$(document).ready(function() {

	// person # field validation
	$('#person-number').focusout(function() {
		var value = $('#person-number').val();

		$('#person-number-msg').html(
			(value === '' && 'you must provide your person #') ||
			((value.length != 8 || isNaN(value)) && 'person # must be an 8-digit number') || ''
		);
	});

});
