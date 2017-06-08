module.exports = router;

var express = require('express');
var fs = require("fs");
var router = express.Router();
var app = express();
var scan_helper = require("./scanner");


router.get('/', function (req, res) {
    res.render('no_auth', {
        message: ''
    });
});


router.post('/', function (req, res) {
    if (req.body.hasOwnProperty("ta_scan")) {
        // from no_auth
        var ta_scan = req.body.ta_scan;
        var ta = scan_helper.get_ta_name(ta_scan);
        if (scan_helper.verify_ta(ta)) {
            // auth
            var db3 = req.db;
            var collection3 = db3.get('cse115lab');
            collection3.insert({
                "time": Date.now(),
                "ip": req.ip,
                "scan": ta_scan,
                "assignment": 'ta login',
                "name": ta
            });

            res.render('index', {
                title: 'Scan For Credit',
                message: 'Welcome ' + ta,
                last_user: '',
                last_scan: 'completed',
                last_assignment: '',
                ta: ta
            });
        } else {
            res.render('no_auth', {
                message: 'Error'
            });
        }
    } else {
        // from index
        if (!req.body.hasOwnProperty("ta") || !scan_helper.verify_ta(req.body.ta)) {
            var db1 = req.db;
            var collection1 = db1.get('cse115lab');
            collection1.insert({
                "notes": "Unverified TA in the index page!",
                "time": Date.now(),
                "ip": req.ip,
                "request": req.body.stringify
            });
            res.render('no_auth', {
                message: "Error: This incident has been logged and will be brought to Jesse's attention."
            });
        }

        var verified_ta = req.body.ta;


        if (!req.body.hasOwnProperty("scan") || !req.body.hasOwnProperty("points") || !req.body.hasOwnProperty("assignment") || !req.body.hasOwnProperty("notes")) {
            res.render('index', {
                title: 'Scan For Credit',
                message: 'ERROR: PLEASE RESCAN AND RESET FORM',
                last_user: "?",
                last_scan: '',
                last_assignment: '',
                ta: verified_ta
            });
        }

        var scan = req.body.scan;
        var points = req.body.points;
        var assignment = req.body.assignment;
        var notes = req.body.notes;

        var person = scan_helper.scan_to_person(scan);

        if (person == "error" || person.length < 4 || !scan_helper.verify_student_ubit(person[2])) {
            res.render('index', {
                title: 'Scan For Credit',
                message: 'ERROR: PLEASE RESCAN',
                last_user: "?",
                last_scan: points,
                last_assignment: assignment,
                ta: verified_ta
            });
        }

        var number = person[0];
        var full_name = person[1];
        var ubit = person[2];
        var lab_section = person[3];

        if (ubit != '') {
            var db = req.db;
            var collection = db.get('cse115lab');
            collection.insert({
                "ubit": ubit,
                "points": points,
                "notes": notes,
                "time": Date.now(),
                "ip": req.ip,
                "scan": scan,
                "assignment": assignment,
                "person_number": number,
                "name": full_name,
                "registered_lab_section": lab_section,
                "ta": verified_ta
            });
        }

    

    var message = '';
    if (assignment.indexOf("lab") != -1 && !scan_helper.in_proper_lab(lab_section) && notes.length == 0) {
        //message = 'Wrong lab section. If an exception has been add an explanation as a note in the form or no points ' +
        //    'will be awarded. Your proper lab section is ' + lab_section;
        message = 'Wrong lab section. Add note if valid. Registered in ' + lab_section + ' (' +
            scan_helper.get_lab_section_time(lab_section)+')';
    }

    res.render('index', {
        title: 'Scan For Credit',
        message: message,
        last_user: ubit + ": " + full_name,
        last_scan: points,
        last_assignment: assignment,
        ta: verified_ta
    });
}
});


module.exports = router;
