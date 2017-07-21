var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	res.render('index');
});



// TODO: Menu with logout while logged in and other account niceties (change password, message when login success, etc)




router.get('/office-hours', function (req, res) {
	res.render('advising', {
		message: ''
	});
});


module.exports = router;
