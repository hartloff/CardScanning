var express = require('express');
var scan_helper = require('./scanner');
var router = express.Router();

router.use('/scan/:type', function (req, res, next) {
	if (req.body.hasOwnProperty("scan")) {
		var scan = req.body.scan;
		var person = scan_helper.scan_to_person(scan);
		if (scan_helper.verify_student_ubit(person[2])) {
			res.scanned_person = person;
			var db = req.db;
			var collection = db.get('logging');
			collection.insert({
				"time": Date.now(),
				"scan": scan,
				"name": person
			});
		}
	} else {
		res.end('error');
	}

	next();
});

module.exports = router;
