var fs = require("fs");
var data = require('./data');

// This function is gross.. but it works
var extract_number_from_scan = module.exports.extract_number = function extract_number_from_scan(scan) {
	var splits = scan.split('^');
	var person_number = "";
	if (splits.length < 3) {
		// could be person number input instead of scan
		if (scan.length == 8) {
			return scan;
		} else {
			return null;
		}
	} else {
		person_number = splits[2];
		if (person_number.length < 23) {
			return null;
		}
		person_number = person_number.substring(14, 22);
		return person_number;
	}
}


module.exports.scan_to_person = function scan_to_person(scan, next) {
	if (typeof scan == 'undefined') {
		return scan;
	}
	var number = extract_number_from_scan(scan);
	data.students.findOne({'person_number':number}, {}, function(err, student){
		if(err){
			console.log(err);
		}
		next(student);
	});
};
