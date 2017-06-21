var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	// TODO login
	res.render('index');
});


router.get('/office-hours', function (req, res) {
	res.render('advising', {
		message: ''
	});
});


module.exports = router;
