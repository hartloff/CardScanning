
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
        var person_number = splits[2];
        if (person_number.length < 23) {
            return "error";
        }
        person_number = person_number.substring(14, 22);
        return person_number;
    }
    return "error";
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

function scan_to_person(scan) {
    if (typeof scan == 'undefined') {
        return "error";
    }
    var number = extract_number_from_scan(scan);
    var line = lookup_person_by_number(number, "./roster");

    return line;
}

function get_ta_name(scan) {

    if (typeof scan == 'undefined') {
        return "error";
    }
    var number = extract_number_from_scan(scan);
    var ta = lookup_person_by_number(number, "./ta_roster");

    return ta[1];
}

function verify_ta(ta_name){
    var fileContent = fs.readFileSync(__dirname + '/' + "./ta_roster").toString();
    var lines = fileContent.split('\n');
    for (var i in lines) {
        var line = lines[i];
        var values = line.split('\t');
        // gt 5 check is to make sure there's some data. A bad scan can match a blank line
        if (values.length > 1 && values[1].length > 5) {
            if(ta_name == values[1]){
                return true;
            }
        }
    }
    return false;
}

function verify_student_ubit(student_ubit){
    var fileContent = fs.readFileSync(__dirname + '/' + "./roster").toString();
    var lines = fileContent.split('\n');
    for (var i in lines) {
        var line = lines[i];
        var values = line.split('\t');
        // gt 5 check is to make sure there's some data. A bad scan can match a blank line
        if (values.length > 2 && values[0].length > 5) {
            if(student_ubit == values[2]){
                return true;
            }
        }
    }
    return false;
}

function get_lab_section_time(section){
    var section_times = {};
    section_times["A1"] = "Tuesday 8:00-9:50am";
    section_times["A2"] = "Tuesday 14:00-15:50";
    section_times["A3"] = "Tuesday 16:00-17:50";
    section_times["A4"] = "Wednesday 8:00-9:50am";
    section_times["A5"] = "Wednesday 12:00-13:50";
    section_times["A6"] = "Wednesday 14:00-15:50";
    section_times["A7"] = "Wednesday 16:00-17:50";
    section_times["A8"] = "Thursday 8:00-9:50am";
    section_times["A9"] = "Thursday 10:00-11:50am";
    section_times["A10"] = "Tuesday 10:00-11:50am";
    section_times["A11"] = "Tuesday 12:00-13:50";
    section_times["A12"] = "Tuesday 18:00-19:50";
    section_times["A13"] = "Friday 18:00-19:50";

    section_times["R1"] = "Tuesday 8:00-9:50am";
    section_times["R2"] = "Tuesday 14:00-15:50";
    section_times["R3"] = "Tuesday 16:00-17:50";
    section_times["R7"] = "Wednesday 16:00-17:50";
    section_times["R8"] = "Thursday 8:00-9:50am";
    section_times["R13"] = "Friday 18:00-19:50";

    return section_times[section];
}

function get_current_lab_sections(){
    //sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6
    var section_times = {};
    section_times["A1"] = [2, [8, 9]];
    section_times["A2"] = [2, [14, 15]];
    section_times["A3"] = [2, [16, 17]];
    section_times["A4"] = [3, [8, 9]];
    section_times["A5"] = [3, [12, 13]];
    section_times["A6"] = [3, [14, 15]];
    section_times["A7"] = [3, [16, 17]];
    section_times["A8"] = [4, [8, 9]];
    section_times["A9"] = [4, [10, 11]];
    section_times["A10"] = [2, [10, 11]];
    section_times["A11"] = [2, [12, 13]];
    section_times["A12"] = [2, [18, 19]];
    section_times["A13"] = [5, [18, 19]];

    section_times["R1"] = [2, [8, 9]];
    section_times["R2"] = [2, [14, 15]];
    section_times["R3"] = [2, [16, 17]];
    section_times["R7"] = [3, [16, 17]];
    section_times["R8"] = [4, [8, 9]];
    section_times["R13"] = [5, [18, 19]];

    var date = new Date;
    var day_of_week = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    var current_sections = [];
    for(var section in section_times){
        if(section_times[section][0] == day_of_week &&
            (section_times[section][1][0] == hour ||
            section_times[section][1][1] == hour ||
            (section_times[section][1][0]-1 == hour && minutes >= 50))){
            current_sections.push(section);
        }
    }
    return current_sections;
}

function in_proper_lab(section){
    var current_labs = get_current_lab_sections();
    for(var i in current_labs){
        if(current_labs[i] == section){
            return true;
        }
    }
    return false;
}

module.exports.scan_to_person = scan_to_person;
module.exports.get_ta_name = get_ta_name;
module.exports.verify_ta = verify_ta;
module.exports.verify_student_ubit = verify_student_ubit;
module.exports.in_proper_lab = in_proper_lab;
module.exports.get_lab_section_time = get_lab_section_time;
