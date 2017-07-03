/**

backend form validation still required in case user disables javascript

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
		$('#question-type-msg').html(
			($('#question-type').val().length === 0 && 'you must select at least one item') || ''
		);
	});

	// option 'other' event listener
	$('#question-type').change(function() {
		if($('option[value="Other"]').is(':selected')) {
			$('#question-type-other-field').html(
				'<label class="form-control-label" for="question-description">Question description:</label>' +
				'<input class="form-control" id="question-description" name="question-description" placeholder="Brief description" type="text" required>' +
				'<p class="form-text" id="question-description-msg"></p>'
			);

			// question description field validation
			$('#question-description').focusout(function() {
				$('#question-description-msg').html(
					($('#question-description').val() === '' && 'you must provide a question description') || ''
				);
			});
		} else {
			// detach event handler
			$('#question-description').off('focusout');
			$('#question-type-other-field').html('');
		}
	});

	// datetime field validation
	$('#datetime').focusout(function() {
		$('#datetime-msg').html(
			($('#datetime').val() === '' && 'you must provide a date and time') || ''
		);
	});

});
