var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	res.send('<a href="advising">Advising</a>');
});

//
//router.get('/advising', function (req, res) {
//	res.render('advising', {
//		message: ''
//	});
//});
//
//
//router.post('/scan/advising-session', function (req, res) {
//	res.send("start of session with: " + res.scanned_person);
//});
//
//
//router.post('/advising-session', function (req, res) {
//	res.send("start of session with: " + res.scanned_person);
//});


router.get('/office-hours', function (req, res) {
	res.render('advising', {
		message: ''
	});
});


router.post('/scan/office-hours-session', function (req, res) {
	res.send("start of session with: " + res.scanned_person);
});


module.exports = router;
