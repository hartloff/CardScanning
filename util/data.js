var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/scanning');

var advised = module.exports.advised = db.get('advised');

var advising_current = module.exports.advising_current = function(db){
	return db.get('advising-current');
};


// auth
var users = module.exports.users = db.get('users');


// student = {"name":"", "person_number":"", "ubit":""}
var students = module.exports.students = db.get('students');


var add_student = module.exports.add_student = function(student){
	students(db).insert(student, function(err){
		console.log(err);
	})
};


var add_roster = module.exports.add_roster = function(roster){
	// TODO upload roster
};

//add_student({"name":"Jesse Hartloff", "person_number":"00000000", "ubit":"hartloff"});
//add_student({"name":"Test User", "person_number":"11111111", "ubit":"testing"});
//add_student({"name":"Test User 2", "person_number":"22222222", "ubit":"testing2"});
