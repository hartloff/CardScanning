var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


function send_receipt(email){
	var transporter = nodemailer.createTransport({
		host: 'localhost',
		port: 25,
		tls:{
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


router.get('advising', function (req, res) {

	console.log("request");
	var db = req.db;
	var collection = db.get('advising-current');

	collection.findOne({}, {}, function (err, record) {
		if (err) {
			console.log(err);
		}
		if (record) {
			console.log(record);
			res.render('advising_session', {
				'message': 'Previous session still active. Close this session before starting another',
				'name': record.person.name,
				'ubit': record.person.ubit
			});
		} else {
			res.render('advising', {
				message: ''
			});
		}
	});

});


router.post('/advising-start', function (req, res) {
	console.log(res.scanned_person);
	var name = res.scanned_person.name;
	var ubit = res.scanned_person.ubit;
	var person_n = res.scanned_person.person_number;

	var db = req.db;
	var collection = db.get('advising-current');
	collection.findOne({}, {}, function (err, record) {
		if (err) {
			console.log(err);
		}
		if (record) {
			res.render('advising_session', {
				'message': 'Previous session still active. Close this session before starting another',
				'name': record.person.name,
				'ubit': record.person.ubit
			});
		} else {
			collection.insert({
				'start_time': Date.now(),
				'person': res.scanned_person
			});

			console.log('session started: ' + ubit);

			// TODO: Make this an AJAX call after page loads
			var collection_ended = db.get('advised');
			collection_ended.find({'person.ubit': res.scanned_person.ubit}, {}, function(err, records){
				if(err){
					console.log(err);
				}
				for(var i in records){
					var start = new Date(records[i].start_time);
					records[i].start = {};
					records[i].start.date = start.toLocaleDateString();
					records[i].start.time = start.toLocaleTimeString();
					//records[i].end_time = new Date(records[i].end_time);
					records[i].duration = Math.ceil((new Date(records[i].end_time) - start)/1000/60);
					records[i].duration_plural = records[i].duration !== 1;
					console.log(records[i].duration);
					console.log(new Date(records[i].end_time));
				}
				records.reverse();
				res.render('advising_session', {
					'name': name,
					'ubit': ubit,
					'sessions' : records
				});
			});
		}
	});


	//res.send("start of session with: " + res.scanned_person);
});


router.post('/advising-end', function (req, res) {
	var comments = req.body.comments;
	var ubit = req.body.ubit;

	var db = req.db;
	var collection = db.get('advising-current');
	collection.findOne({'person.ubit': ubit}, {}, function (err, record) {
		if (err) {
			console.log(err);
		}
		if (record) {
			console.log('session ended: ' + ubit);
			console.log('record: ' + record);
			collection.remove({'person.ubit': ubit}, function (err) {
				if (err) {
					console.log(err);
				}
				res.redirect('/advising');
			});
			var collection_ended = db.get('advised');
			collection_ended.insert({
				'person': record.person,
				'start_time': record.start_time,
				'end_time': Date.now(),
				'comments': comments
			});

			send_receipt(ubit + "@buffalo.edu");

		} else {
			console.log('could not end session');
			res.redirect('/advising');

		}
	});

});


module.exports = router;