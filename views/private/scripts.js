/**

backend form validation still required in case user disables javascript

	TODO: placeholder for description field (when other is selected)
					-add option 'other' event listener

	TODO: placeholder for error message (datetime)
					-add datetime field validation

	TODO: add submit listener

**/

$(document).ready(function() {

	// person # field validation
	$('#person-number').focusout(function() {
		var value = $(this).val();

		$('#person-number-msg').html(
			(value === '' && 'you must provide your person #') ||
			((value.length !== 8 || isNaN(value)) && 'person # must be an 8-digit number') || ''
		);
	});

	// question type field validation
	$('#question-type').focusout(function() {
		var value = $(this).val();

		$('#question-type-msg').html(
			(value.length === 0 && 'you must select at least one item') || ''
		);
	});

});
