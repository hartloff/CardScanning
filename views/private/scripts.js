/**

backend form validation still required in case user disables javascript

TODO: re-design form validation method

**/

$(document).ready(function() {

	// person # field validation
	$('#personNum').focusout(function() {
		var value = $(this).val();

		$('#personNum-msg').html(
			(value === '' && 'you must provide your person #') ||
			((value.length !== 8 || isNaN(value)) && 'person # must be an 8-digit number') || ''
		);
	});

	// question type field validation
	$('#qType').focusout(function() {
		$('#qType-msg').html(
			($('#qType').val().length === 0 && 'you must select at least one item') || ''
		);
	});

	// option 'other' event listener
	$('#qType').change(function() {
		if($('option[value="Other"]').is(':selected')) {
			$('#qDescField').html(
				'<label class="form-control-label" for="qDesc">Question description:</label>' +
				'<input class="form-control" id="qDesc" name="question-description" placeholder="Brief description" type="text" required>' +
				'<p class="form-text" id="qDesc-msg"></p>'
			);

			// question description field validation
			$('#qDesc').focusout(function() {
				$('#qDesc-msg').html(
					($('#qDesc').val() === '' && 'you must provide a question description') || ''
				);
			});
		} else {
			
			// detach event handler
			$('#qDesc').off('focusout');

			$('#qDescField').html('');
		}
	});

	// datetime field validation
	$('#datetime').focusout(function() {
		$('#datetime-msg').html(
			($('#datetime').val() === '' && 'you must provide a date and time') || ''
		);
	});

});
