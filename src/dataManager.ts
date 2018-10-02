/* Prepare the tools */ 
var PDFExtract = require('pdf.js-extract').PDFExtract;
var pdfjsLib = require('pdfjs-dist');
var fs = require('fs')
var https = require("https")
var pdfExtract = new PDFExtract();

export const start = () => {
/************************    Request    **************************/

/* Prepare the request */ 
var options = {
    host: "reports4u.bgu.ac.il",
    path: "/reports/rwservlet?cmdkey=PROD&server=rep_aristo4stu4_FRHome1&report=acrr008w&desformat=pdf&DESTYPE=cache&P_YEAR=2019&P_SEMESTER=1&P_INSTITUTION=0&"
            + "P_DEGREE_LEVEL=1&P_DEPARTMENT=373&P_GLOBAL_COURSES=1&P_PATH=1&P_SPEC=1&P_YEAR_DEGREE=3&P_SORT=1&P_WEB=1&P_SPECIAL_PATH=0&P_KEY=",
    method: "GET"
  };

/* Send the request */
var req = https.request(options, function(res) {
        var resBody="";
        res.setEncoding("base64")

/* Aggrigate all the data from the website by base64 encoding to resBody variable */
    res.on('data', function(chunk) {
        resBody+=chunk                      
        });

/* When finish aggrigate all the data from the website by base64 encoding to resBody variable , convert resBody to PDF document by getDocument() method */
    res.on("end" , function(){
                pdfjsLib.getDocument({data: atob(resBody)}).then(function getPdfHelloWorld(pdf) {

/* Extract all the data as tokens from the PDF document */
                pdfExtract.test(pdf).then(function () {
                var data = pdfExtract.getData()
                var lines = PDFExtract.utils.pageToLines(data.pages[0], 2); // If you want to change page of the PDF, change the index ==> data.pages[i]
                InsertPageToMap(lines)
                console.log(JSON.stringify(courses , null,2))
            });

         });
      } );
    });
  
    req.end()
}
start()
/************************    Parsing    **************************/
export var courses = new Map();

/*Day*/
export type Day =  String;
export const isDay = (x: any): x is Day => x === "יום א" || x === "יום ב" || x ==="יום ג" ||x === "יום ד" || x ==="יום ה" || x === "יום ו";

/*KindOfSession*/
export type KindOfSession =  String;
export const isKindOfSessions = (x: any): x is KindOfSession => x === "שעור" || x === "תרגיל" || x === "מעבדה" || x === "קורס מקוון" || x === "סדנא";

/*Hour*/
export type Hour = String;
export const isHour = (x: any): x is Hour => x === "08:00" || x === "09:00" || x === "10:00"  || 
                                             x === "11:00" || x === "12:00" || x === "13:00"  || 
                                             x === "14:00" || x === "15:00" || x === "16:00"  || 
                                             x === "17:00" || x === "18:00" || x === "19:00"  || 
                                             x === "20:00"  ;

/*UniversityLocation*/
export interface UniversityLocation {
    tag:"UniversityLocation"
    building: String,
    room: String
}
export const ismakeUniversityLocation = (x: any): x is UniversityLocation => x.tag === "makeUniversityLocation";
export const makeUniversityLocation = (building: String , room: String ): UniversityLocation  =>
    ({tag: "UniversityLocation", building: building , room: room});

/*Hours*/
export interface Hours {
    tag: "Hours"
    startHour: Hour,
    endHour: Hour
}
export const isPeroid = (x: any): x is Hours => x.tag === "Hours";
export const makePeriod = (startHour: String , endHour: String): Hours | String =>
    (isHour(startHour) && isHour(endHour))? ({tag: "Hours", startHour: startHour , endHour: endHour}) :
     "";

/*Time*/
export interface Time {
    tag:"Time"
    day: Day,
    hours: Hours | String,
}
export const isTime = (x: any): x is Time => x.tag === "Time";
export const makeTime = (day: Day , hours: Hours | String): Time  =>
    ({tag: "Time", day: day , hours: hours});

/*Session*/
export interface Session {
    tag:"Session"
    time: Time ,
    location?: UniversityLocation
}
export const isSession = (x: any): x is Session => x.tag === "Session";
export const makeSession = ( time: Time , location?: UniversityLocation): Session =>
({tag:"Session"   , time:time , location: location}); 

/*Practice*/
export interface Practice {
    tag:"Practice",
    teacherName: String , 
    groupId: String,
    sessions: Session[]
}
export const isPractice = (x: any): x is Practice => x.tag === "Practice";
export const makePractice = (   teacherName: String , groupId: String , sessions: Session[]): Practice =>
({tag:"Practice"   , teacherName: teacherName , groupId:groupId , sessions: sessions}); 

/*Lecture*/
export interface Lecture {
    tag:"Lecture",
    groupId: String ,
    teacherName: String , 
    sessions: Session[] ,
    practices: Practice[]
}
export const isLecture = (x: any): x is Lecture => x.tag === "Lecture";
export const makeLecture = (groupId: String , teacherName: String , sessions: Session[], practices: Practice[]): Lecture =>
({tag:"Lecture" , groupId: groupId ,  teacherName: teacherName , sessions: sessions ,  practices: practices}); 

/*Course*/
export interface Course {
    id: String,
    name: String,
    lectures?: Lecture[]
}


/*Safers*/
const makeSafeString = ( type: String , cell: any): String =>
    (cell === undefined) ? "":
    (type === "teacherName") ? cell.str: 
    (cell.str);

const makeSafeKindOfSession = (cell: any): KindOfSession =>
    (cell === undefined) ? "" :
     isKindOfSessions(cell.str) ? (cell.str):
     "";
     
const makeSafeDay = (cell: any): Day =>
     (cell === undefined) ? "" :
      isDay(cell.str) ? (cell.str):
      "";

const makeSafePeriod = (cell: any): Hours | String =>{
    if(cell === undefined) 
        return  ""
    else
        var res = cell.str.split("-" , 2)
        return makePeriod(res[0] , res[1]);
    }

/*handlers*/
const handleSessionLine = (course: Course , line: any) =>{
    let first_cell: String = line[0].str;
    if(first_cell.indexOf("קב") !== - 1)
        {
            if(line.length==5)
            handleSpecailCourse(course , line); // RUNING UNTILL UNDIFINED
            else
            handleGroupIdStarter(course , line);
        }
    else if(first_cell.indexOf("יום") !== - 1)
        {
            handleDayStarter(course , line);
        }
    else{
            handleRegularStarter(course , line);
        }
    }

const handleGroupIdStarter = (course: Course , line: any) =>{
    const lectures: Lecture[] =  course.lectures;
    const teacherName: String  = makeSafeString("teacherName" , lectures[lectures.length-1] );
    const groupId: String  = makeSafeString("groupId",line[1]) ;
    const kind: String  = makeSafeKindOfSession(line[3]);
    const day: Day = makeSafeDay(line[5])
    const period: Hours | String = makeSafePeriod(line[6])
    const building: String = makeSafeString("building" , line[7])
    const room: String = makeSafeString("room" , line[8])
    const location: UniversityLocation = makeUniversityLocation(building , room)
    const time: Time  = makeTime(day , period)
    const session: Session = makeSession(time , location); 
    kindesHandler(kind , lectures , groupId , session , teacherName);
}

const handleDayStarter = (course: Course , line: any) =>{ //TODO ADD MORE THAN ONE PRACRICE SESSION
    const day: Day = makeSafeDay(line[0])
    const period: Hours | String = makeSafePeriod(line[1])
    const building: String = makeSafeString("building" , line[2])
    const room: String = makeSafeString("room" , line[3])
    const location: UniversityLocation = makeUniversityLocation(building , room)
    const time: Time  = makeTime(day , period)
    const session: Session = makeSession(time , location); 
    const lectures: Lecture[] =  course.lectures;
    lectures[lectures.length-1].sessions.push(session)
}

const handleRegularStarter = (course: Course , line: any) =>{
    const teacherName: String  = makeSafeString("teacherName",line[0]) ;
    const groupId: String  = makeSafeString("groupId" , line[2]) ;
    const kind: String  = makeSafeKindOfSession(line[4]);
    const day: Day = makeSafeDay(line[6])
    const period: Hours | String = makeSafePeriod(line[7])
    const building: String = makeSafeString("building" , line[8])
    const room: String = makeSafeString("room" , line[9])
    const location: UniversityLocation = makeUniversityLocation(building , room)
    const time: Time  = makeTime(day , period)
    const session: Session = makeSession(time , location); 
    const lectures: Lecture[] =  course.lectures;
    kindesHandler(kind , lectures , groupId , session , teacherName);
}


const kindesHandler = (kind: String ,lectures: Lecture[] ,  groupId: String , session: Session , teacherName: String)  =>{
    switch(kind) {
        case "תרגיל":
        const practice: Practice = makePractice("" , groupId , [session]);
        if(lectures[lectures.length-1] !== undefined)
            lectures[lectures.length-1].practices.push( practice )
        else
            lectures.push( makeLecture("" , "" , [], [practice]) )
            break;
        case "שעור":
            const Lecture1: Lecture = makeLecture(groupId , teacherName , [session], []);
            lectures.push( Lecture1 )
            break;
        case "סדנא":
            const Lecture2: Lecture = makeLecture(groupId , teacherName , [session], []);
            lectures.push( Lecture2 )
            break;
        case "קורס מקוון":
            const Lecture3: Lecture = makeLecture(groupId , teacherName , [session], []);
            lectures.push( Lecture3 )
            break;
        case "מעבדה":
            const Lecture4: Lecture = makeLecture(groupId , teacherName , [session], []);
            lectures.push( Lecture4 )
            break;
    }
    }

const handleSpecailCourse = (course: Course , line: any):   String =>{
        return ""
        }

export const InsertPageToMap = function (lines) {
    let courseCoordinatesActive : Boolean = false;
    let currentCourse : Course;
    let lectures: Lecture[];

    lines.map((line) => {
        const cell = line[0];

        if (cell && (/\d/.test(cell.str)) && cell.height === 10){
            const currentCourseName = line[1].str
            const currentCourseNumber = cell.str;
            lectures = []
            currentCourse = { id: currentCourseNumber, name: currentCourseName , lectures: lectures}
            courses.set(currentCourseNumber, currentCourse )
            courseCoordinatesActive = true;
        }

        else if(courseCoordinatesActive == true && line.length > 2)
            handleSessionLine(currentCourse , line);

        else if(courseCoordinatesActive == true && line.length == 1)
            currentCourse.name = currentCourse.name.concat(" " + line[0].str)
        });
         
    }




