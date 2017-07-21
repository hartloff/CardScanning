var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/scanning');

var collection = db.get('users');

var username = process.argv[2];
var password = process.argv[3];

collection.findOne({'username': username}, function (err, user) {
	if (err) {
		console.log(err);
		shut_it_down();
	} else if (user) {
		console.log('user already exists');
		shut_it_down();
	} else {
		// TODO hash that password!!
		collection.insert({'username': username, 'password': password}, function (err, data) {
			if (err) {
				console.log(err);
				shut_it_down();
			} else {
				console.log('user ' + username + ' added');
				shut_it_down();
			}
		});
	}

});

function shut_it_down() {
	db.close();
}