var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


// Check if a session is active
router.use(function (req, res, next) {
	var db = req.db;
	var collection = db.get('advising-current');

	collection.findOne({}, {}, function (err, record) {
		if (err) {
			console.log(err);
		}
		if (record) {
			res.active_session = record;
		}
		next();
	});
});


router.get('/', function (req, res) {
	if (res.active_session) {
		goto_active_session(res.active_session, req.db, res);
	} else {
		res.render('advising');
	}
});


router.post('/', function (req, res) {

	var db = req.db;
	var collection = db.get('advising-current');

	if (res.scanned_person) {
		// start new session
		if (res.active_session) {
			// session already in progress
			goto_active_session(res.active_session, req.db, res);
		} else {

			var start_time = Date.now();
			collection.insert({
				'start_time': start_time,
				'person': res.scanned_person
			});

			goto_active_session({'start_time': start_time, 'person': res.scanned_person}, db, res);
		}

	} else {
		// end session
		if (!res.active_session) {
			// no session to end
			res.render('advising');
		} else {
			var comments = req.body.comments;
			var ubit = req.body.ubit;

			collection.findOne({'person.ubit': ubit}, {}, function (err, record) {
				if (err) {
					console.log(err);
				}
				if (record) {
					var collection_ended = db.get('advised');
					collection_ended.insert({
						'person': record.person,
						'start_time': record.start_time,
						'end_time': Date.now(),
						'comments': comments
					});

					collection.remove({'person.ubit': ubit}, function (err) {
						if (err) {
							console.log(err);
						}
						send_receipt(ubit + "@buffalo.edu");
					});

					res.render('advising');

				} else {
					console.log('could not find session to end (no matching ubit)');
					res.render('advising');
				}
			});

		}
	}
});


function goto_active_session(active_session, db, res) {
	var collection_ended = db.get('advised');

	var person = active_session.person;

	// TODO: Make this an AJAX call after page loads
	collection_ended.find({'person.ubit': person.ubit}, {}, function (err, records) {
		if (err) {
			console.log(err);
		}
		for (var i in records) {
			var start = new Date(records[i].start_time);
			records[i].start = {};
			records[i].start.date = start.toLocaleDateString();
			records[i].start.time = start.toLocaleTimeString();
			records[i].duration = Math.ceil((new Date(records[i].end_time) - start) / 1000 / 60);
			records[i].duration_plural = records[i].duration !== 1;
		}
		records.reverse();
		res.render('advising_session', {
			'person': person,
			'sessions': records
		});
	});
}


function send_receipt(email) {
	var transporter = nodemailer.createTransport({
		host: 'localhost',
		port: 25,
		tls: {
			rejectUnauthorized: false
		}
	});

	transporter.sendMail({
		from: 'advising@cse.buffalo.edu',
		replyTo: 'dmgrant3@buffalo.edu',
		to: email,
		subject: 'Advising Receipt',
		text: 'Thank you for your visit. Let me know if you have further questions.'
	});
}


module.exports = router;