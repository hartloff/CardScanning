
var fs = require("fs");

// This function is gross.. but it works
function extract_number_from_scan(scan){
    var splits = scan.split('^');
    var person_number = "";
    if (splits.length < 3) {
        // could be person number input instead of scan
        if(scan.length == 8) {
            return scan;
        }else{
            return "error";
        }
    } else {
        person_number = splits[2];
        if (person_number.length < 23) {
            return "error";
        }
        person_number = person_number.substring(14, 22);
        return person_number;
    }
}

function lookup_person_by_number(number, filename){
    var fileContent = fs.readFileSync(__dirname + '/' + filename).toString();
    var lines = fileContent.split('\n');
    for (var i in lines) {
        var line = lines[i];
        var values = line.split('\t');
        // gt 5 check is to make sure there's some data. A bad scan can match a blank line
        if (values[0].length > 5 && values[0] === number) {
            return values;
        }
    }
    return "error";
}

module.exports.scan_to_person = function scan_to_person(scan) {
    if (typeof scan == 'undefined') {
        return "error";
    }
    var number = extract_number_from_scan(scan);
    return lookup_person_by_number(number, "./roster");
};


module.exports.verify_student_ubit = function verify_student_ubit(student_ubit){
    var fileContent = fs.readFileSync(__dirname + "/roster").toString();
    var lines = fileContent.split('\n');
    for (var i in lines) {
        var line = lines[i];
        var values = line.split('\t');
        // gt 5 check is to make sure there's some data. A bad scan can match a blank line
        if (values.length > 2 && values[0].length > 5) {
            if(student_ubit === values[2]){
                return true;
            }
        }
    }
    return false;
}
