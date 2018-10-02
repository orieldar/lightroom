"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Prepare the tools */
var PDFExtract = require('pdf.js-extract').PDFExtract;
var pdfjsLib = require('pdfjs-dist');
var fs = require('fs');
var https = require("https");
var pdfExtract = new PDFExtract();
exports.start = function () {
    /************************    Request    **************************/
    /* Prepare the request */
    var options = {
        host: "reports4u.bgu.ac.il",
        path: "/reports/rwservlet?cmdkey=PROD&server=rep_aristo4stu4_FRHome1&report=acrr008w&desformat=pdf&DESTYPE=cache&P_YEAR=2019&P_SEMESTER=1&P_INSTITUTION=0&"
            + "P_DEGREE_LEVEL=1&P_DEPARTMENT=373&P_GLOBAL_COURSES=1&P_PATH=1&P_SPEC=1&P_YEAR_DEGREE=3&P_SORT=1&P_WEB=1&P_SPECIAL_PATH=0&P_KEY=",
        method: "GET"
    };
    /* Send the request */
    var req = https.request(options, function (res) {
        var resBody = "";
        res.setEncoding("base64");
        /* Aggrigate all the data from the website by base64 encoding to resBody variable */
        res.on('data', function (chunk) {
            resBody += chunk;
        });
        /* When finish aggrigate all the data from the website by base64 encoding to resBody variable , convert resBody to PDF document by getDocument() method */
        res.on("end", function () {
            pdfjsLib.getDocument({ data: atob(resBody) }).then(function getPdfHelloWorld(pdf) {
                /* Extract all the data as tokens from the PDF document */
                pdfExtract.test(pdf).then(function () {
                    var data = pdfExtract.getData();
                    var lines = PDFExtract.utils.pageToLines(data.pages[0], 2); // If you want to change page of the PDF, change the index ==> data.pages[i]
                    exports.InsertPageToMap(lines);
                    console.log(exports.courses.get("125.1.0059").lectures[0].sessions[0]);
                });
            });
        });
    });
    req.end();
};
exports.start();
/************************    Parsing    **************************/
exports.courses = new Map();
exports.isDay = function (x) { return x === "יום א" || x === "יום ב" || x === "יום ג" || x === "יום ד" || x === "יום ה" || x === "יום ו"; };
exports.isKindOfSessions = function (x) { return x === "שעור" || x === "תרגיל" || x === "מעבדה" || x === "קורס מקוון" || x === "סדנא"; };
exports.isHour = function (x) { return x === "08:00" || x === "09:00" || x === "10:00" ||
    x === "11:00" || x === "12:00" || x === "13:00" ||
    x === "14:00" || x === "15:00" || x === "16:00" ||
    x === "17:00" || x === "18:00" || x === "19:00" ||
    x === "20:00"; };
exports.ismakeUniversityLocation = function (x) { return x.tag === "makeUniversityLocation"; };
exports.makeUniversityLocation = function (building, room) {
    return ({ tag: "UniversityLocation", building: building, room: room });
};
exports.isPeroid = function (x) { return x.tag === "Hours"; };
exports.makePeriod = function (startHour, endHour) {
    return (exports.isHour(startHour) && exports.isHour(endHour)) ? ({ tag: "Hours", startHour: startHour, endHour: endHour }) :
        "";
};
exports.isTime = function (x) { return x.tag === "Time"; };
exports.makeTime = function (day, hours) {
    return ({ tag: "Time", day: day, hours: hours });
};
exports.isSession = function (x) { return x.tag === "Session"; };
exports.makeSession = function (time, location) {
    return ({ tag: "Session", time: time, location: location });
};
exports.isPractice = function (x) { return x.tag === "Practice"; };
exports.makePractice = function (teacherName, groupId, sessions) {
    return ({ tag: "Practice", teacherName: teacherName, groupId: groupId, sessions: sessions });
};
exports.isLecture = function (x) { return x.tag === "Lecture"; };
exports.makeLecture = function (groupId, teacherName, sessions, practices) {
    return ({ tag: "Lecture", groupId: groupId, teacherName: teacherName, sessions: sessions, practices: practices });
};
/*Safers*/
var makeSafeString = function (type, cell) {
    return (cell === undefined) ? "" :
        (type === "teacherName") ? cell.str :
            (cell.str);
};
var makeSafeKindOfSession = function (cell) {
    return (cell === undefined) ? "" :
        exports.isKindOfSessions(cell.str) ? (cell.str) :
            "";
};
var makeSafeDay = function (cell) {
    return (cell === undefined) ? "" :
        exports.isDay(cell.str) ? (cell.str) :
            "";
};
var makeSafePeriod = function (cell) {
    if (cell === undefined)
        return "";
    else
        var res = cell.str.split("-", 2);
    return exports.makePeriod(res[0], res[1]);
};
/*handlers*/
var handleSessionLine = function (course, line) {
    var first_cell = line[0].str;
    if (first_cell.indexOf("קב") !== -1) {
        if (line.length == 5)
            handleSpecailCourse(course, line); // RUNING UNTILL UNDIFINED
        else
            handleGroupIdStarter(course, line);
    }
    else if (first_cell.indexOf("יום") !== -1) {
        handleDayStarter(course, line);
    }
    else {
        handleRegularStarter(course, line);
    }
};
var handleGroupIdStarter = function (course, line) {
    var lectures = course.lectures;
    var teacherName = makeSafeString("teacherName", lectures[lectures.length - 1]);
    var groupId = makeSafeString("groupId", line[1]);
    var kind = makeSafeKindOfSession(line[3]);
    var day = makeSafeDay(line[5]);
    var period = makeSafePeriod(line[6]);
    var building = makeSafeString("building", line[7]);
    var room = makeSafeString("room", line[8]);
    var location = exports.makeUniversityLocation(building, room);
    var time = exports.makeTime(day, period);
    var session = exports.makeSession(time, location);
    kindesHandler(kind, lectures, groupId, session, teacherName);
};
var handleDayStarter = function (course, line) {
    var day = makeSafeDay(line[0]);
    var period = makeSafePeriod(line[1]);
    var building = makeSafeString("building", line[2]);
    var room = makeSafeString("room", line[3]);
    var location = exports.makeUniversityLocation(building, room);
    var time = exports.makeTime(day, period);
    var session = exports.makeSession(time, location);
    var lectures = course.lectures;
    lectures[lectures.length - 1].sessions.push(session);
};
var handleRegularStarter = function (course, line) {
    var teacherName = makeSafeString("teacherName", line[0]);
    var groupId = makeSafeString("groupId", line[2]);
    var kind = makeSafeKindOfSession(line[4]);
    var day = makeSafeDay(line[6]);
    var period = makeSafePeriod(line[7]);
    var building = makeSafeString("building", line[8]);
    var room = makeSafeString("room", line[9]);
    var location = exports.makeUniversityLocation(building, room);
    var time = exports.makeTime(day, period);
    var session = exports.makeSession(time, location);
    var lectures = course.lectures;
    kindesHandler(kind, lectures, groupId, session, teacherName);
};
var kindesHandler = function (kind, lectures, groupId, session, teacherName) {
    switch (kind) {
        case "תרגיל":
            var practice = exports.makePractice("", groupId, [session]);
            if (lectures[lectures.length - 1] !== undefined)
                lectures[lectures.length - 1].practices.push(practice);
            else
                lectures.push(exports.makeLecture("", "", [], [practice]));
            break;
        case "שעור":
            var Lecture1 = exports.makeLecture(groupId, teacherName, [session], []);
            lectures.push(Lecture1);
            break;
        case "סדנא":
            var Lecture2 = exports.makeLecture(groupId, teacherName, [session], []);
            lectures.push(Lecture2);
            break;
        case "קורס מקוון":
            var Lecture3 = exports.makeLecture(groupId, teacherName, [session], []);
            lectures.push(Lecture3);
            break;
        case "מעבדה":
            var Lecture4 = exports.makeLecture(groupId, teacherName, [session], []);
            lectures.push(Lecture4);
            break;
    }
};
var handleSpecailCourse = function (course, line) {
    return "";
};
exports.InsertPageToMap = function (lines) {
    var courseCoordinatesActive = false;
    var currentCourse;
    var lectures;
    lines.map(function (line) {
        var cell = line[0];
        if (cell && (/\d/.test(cell.str)) && cell.height === 10) {
            var currentCourseName = line[1].str;
            var currentCourseNumber = cell.str;
            lectures = [];
            currentCourse = { id: currentCourseNumber, name: currentCourseName, lectures: lectures };
            exports.courses.set(currentCourseNumber, currentCourse);
            courseCoordinatesActive = true;
        }
        else if (courseCoordinatesActive == true && line.length > 2)
            handleSessionLine(currentCourse, line);
        else if (courseCoordinatesActive == true && line.length == 1)
            currentCourse.name = currentCourse.name.concat(" " + line[0].str);
    });
};
