var express = require('express');
var scan_helper = require('./scanner');
var router = express.Router();

router.use(function (req, res, next) {
//router.use('/scan/:type', function (req, res, next) {
	if (req.body.scan) {
		console.log("scan found");
		var scan = req.body.scan;
		var person = scan_helper.scan_to_person(scan);
		console.log(person);
		//if (scan_helper.verify_student_ubit(person[2])) {
			res.scanned_person = person;
			console.log(person);
			var db = req.db;
			var collection = db.get('logging');
			collection.insert({
				"time": Date.now(),
				"scan": scan,
				"person": person,
				"type": req.params.type
			});
		//}
	}

	next();
});

module.exports = router;
