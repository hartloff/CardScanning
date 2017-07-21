var express = require('express');
var scan_helper = require('./scanner');
var router = express.Router();

router.use(function (req, res, next) {
	console.log(req.user);
	if (req.body.scan) {
		var scan = req.body.scan;
		scan_helper.scan_to_person(scan, function (person) {
			var db = req.db;
			var collection = db.get('logging');
			collection.insert({
				"time": Date.now(),
				"scan": scan,
				"person": person,
				"type": req.params.type
			});

			if (person) {
				res.scanned_person = person;
				next();
			} else {
				var number = scan_helper.extract_number(scan);
				if (number) {
					res.render('advising', {
						'message': 'Student not found'
						// TODO Option to add student
					})
				} else {
					next();
				}
			}

		});
	} else {
		next();
	}

});

module.exports = router;
