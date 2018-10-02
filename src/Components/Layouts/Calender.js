import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Paper from '@material-ui/core/Paper';
import EventComponent from './Event';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import SessionList from './SessionList';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

require('moment/locale/he.js')
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
const propTypes = {}
const messages = {
  allDay: 'כל היום',
  previous: 'אחורה',
  next: 'קדימה',
  today: 'היום',
  month: 'חודש',
  week: 'שבוע',
  day: 'יום',
  agenda: 'רשימה',
  date: 'תאריך',
  time: 'זמן',
  event: 'אירוע',
  showMore: total => `+ סך הכל (${total})`
};

const formats = {
  dateFormat: "dd",
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, 'ddd', culture),
  eventTimeRangeFormat: () => null

}

export var Events = [ ]

Array.prototype.inArray = function(comparer) {
  for(var i=0; i < this.length; i++) {
      if(comparer(this[i])) return true;
  }
  return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
  if (!this.inArray(comparer)) {
      this.push(element);
  }
};




const TimeAsThisWeek = (time , start) =>{
  let FullDate =  new Date();
  let Day = FullDate.getDay();
  let CurrDate = FullDate.getDate();
console.log(time)
  var Sunday;
  if(Day===6)
  {
  Sunday = CurrDate + 1;
  }
  else
  {
  Sunday = CurrDate - Day;
  }


  if(start)
  return new Date(FullDate.getFullYear(), FullDate.getMonth(), Sunday + (time.day.charCodeAt(4) - "א".charCodeAt(0)) , time.hours.startHour.slice(0,2), 0, 0)
  else
  return new Date(FullDate.getFullYear(), FullDate.getMonth(), Sunday + (time.day.charCodeAt(4) - "א".charCodeAt(0)) , time.hours.endHour.slice(0,2), 0, 0)
}

const getColor =(kind) =>{
  if(kind=== "Practice"){
    return 'orange'
  }
  else
  return 'blue'
}

var daysComparison = (number,text) =>
{
  var ans;
  console.log(number);
  switch(number){
    case 0: text==="יום א"? ans=true: ans=false; break;
    case 1: text==="יום ב"? ans=true: ans=false; break;
    case 2: text==="יום ג"? ans=true: ans=false; break;
    case 3: text==="יום ד"? ans=true: ans=false; break;
    case 4: text==="יום ה"? ans=true: ans=false; break;
    case 5: text==="יום ו"? ans=true: ans=false; break;
    default: ans=number;
  }
  return ans;
}

var releventLectures = [];
var releventLectures2 = [];
var releventPractices =[];

function timeToInt(str) {
    if (str.charAt(0) === '0') {
        return parseInt(str.charAt(1))
    }
    return parseInt(str.substring(0, 2))
}

class Calender extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = { Events , open: false ,  value: ''}
  }




  eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = '#' +event.hexColor;
    var style = {
          backgroundColor: backgroundColor,
        borderRadius: '0px',
        color: 'black',
        border: '0.1px solid black',
        display: 'block'
    };
    return {
        style: style,
    };
}

handleClose = value => {
  this.setState({ value, open: false });
};

handleSelect =() => {
  this.setState({ open: true });
  }



  handleSelect2 = ({ start, end }) => {


//releventLectures = this.props.courses.map(course=> course.lectures.map(lecture=> ({name: course.name, teacherName:lecture.teacherName,groupId: lecture.groupId, sessions: lecture.sessions.filter(session => daysComparison(start.getDay(),session.time.day ) && (start.getHours()) >= (timeToInt(session.time.hours.startHour)) && end.getHours()<= timeToInt(session.time.hours.endHour))})))
console.log(releventLectures);
//releventLectures.forEach(lecture => lecture.forEach(sess => console.log(sess)))
//releventLectures = releventLectures.map(lecture => lecture.filter(sess => sess.sessions.length > 0 ))
this.props.courses.forEach(course => course.lectures.forEach(lecture=> lecture.courseName= course.name ))
releventLectures2 = this.props.courses.map(course=> course.lectures.filter(lecture => lecture.sessions.some(session => daysComparison(start.getDay(),session.time.day ) && (start.getHours()) >= (timeToInt(session.time.hours.startHour)) && end.getHours()<= timeToInt(session.time.hours.endHour))))
releventLectures = releventLectures2;

///DO SAME WITH PRACTICES

releventPractices = this.props.courses.map(course=> course.lectures.map(lecture=> ({ name: course.name, practices: lecture.practices.map(practice => ({tag: 'Practice', teacherName:practice.teacherName,  groupId:practice.groupId,  sessions: practice.sessions.filter(session => daysComparison(start.getDay(),session.time.day ) && (start.getHours()) >= (timeToInt(session.time.hours.startHour)) && end.getHours()<= timeToInt(session.time.hours.endHour))}))})))

console.log(releventPractices);
releventPractices = releventPractices.map(practice => practice.map(lecture => ({tag: 'Practice', name: lecture.name, practices : lecture.practices.filter (sess => sess.sessions.length > 0 )})))
releventPractices = releventPractices.map(lec => lec.filter(practice => practice.practices.length > 0))
console.log(releventPractices);
this.setState({ open: true });
}


  static delete = (id) =>{
    while(index !=-1){
    var index = Events.findIndex(event => event.id === id);
    if (index > -1)
      Events.splice(index, 1);
    }
}

  render() {
    console.log(this.props)
    Events = [ ]
    this.props.groups.map((group) => {
      console.log(Events)
      group.sessions.map((session)=> {
      let start = TimeAsThisWeek(session.time , true)
      let end = TimeAsThisWeek(session.time , false)
      let color = getColor(group.tag)
      let hexColor;
      if(color== 'orange')
        hexColor = 'ffa500'
        else
        hexColor = '85C1E9'
        var element = {
          id: "(" + group.groupId + ")",
          title: group.courseName  + " " + group.teacherName+  " " + session.location.building + " - " + session.location.room ,
          courseName: group.courseName,
          teacherName: group.teacherName,
          location: "בניין " + session.location.building.match(/\d+/g).map(Number) + " - " + session.location.room,
          start: start,
          end: end,
          hexColor: hexColor,
        };
      Events.pushIfNotExist(element, function(e) {
        return e.id === element.id && e.title === element.title && e.start===element.start  ;
      });
    }
    )

    })
    console.log(Events)
    return (
      <div>
  <center>
</center>
<Paper>
        <BigCalendar
        messages={messages}
        toolbar={false}
        min={new Date(2018, 8, 11, 8, 0, 0)}
        max={new Date(2018, 8, 11, 21, 0, 0)}
        views={{ week: MyWeek}}
        defaultView={BigCalendar.Views.WEEK}
        defaultDate={new Date()}
                            defaultView='week'
        events={Events}
            startAccessor='start'
            endAccessor='end'
            selectable={true}
            onSelectSlot={this.handleSelect2}
            rtl={true}
            components={{
                event: EventComponent
            }}
            formats={formats}
            eventPropGetter={(this.eventStyleGetter)}
        />
        </Paper>
  <div >
        <ConfirmationDialogRaw
            releventLectures={releventLectures}
            open={this.state.open}
            onClose={this.handleClose}
            value={this.state.value}
            addSessionHandler = {this.props.addSessionHandler}
          />
          </div>
     </div>

    )
  }
}

Calender.propTypes = propTypes

export default Calender



const options = [
  'תכנות מערכות בניין 72 בני אייל',
  'אוטומטים בניין 90 יעל שטיין',
  'בסיסי נתונים בניין 35 רוני שטרן',
  'אלדר יא זין'
];

class ConfirmationDialogRaw extends React.Component {
  radioGroupRef = null;

  constructor(props) {
    super();
    this.state.value = props.value;
  }

  state = {
    checked: [0],
    selectedSession: null,
  };

  handleToggle = (index, group , courseName, isLecture) => () => {

    const { checked } = this.state;
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];
    isLecture? group.tag="Lecture" : group.tag="Practice"

    if (currentIndex === -1) {
      newChecked.splice(currentIndex, 1);
      this.setState({
        checked: [0],
      });

      newChecked.push(index);
      group["courseName"] = courseName
      this.setState({
        checked: newChecked,
        selectedSession: group,

      });
      //this.props.addSessionHandler(group);
    } else {
      newChecked.splice(currentIndex, 1);
      this.setState({
        checked: [0],
        selectedSession: null,
      });
    }


  };

  // TODO
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleEntering = () => {
    this.setState({
      checked: [0],
      selectedSession: null,
    });

  };

  handleCancel = () => {
    this.props.onClose(this.props.value);
  };

  handleOk = () => {
    this.props.onClose(this.state.value);
    if(this.state.selectedSession!= null)
      this.props.addSessionHandler(this.state.selectedSession)
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };



  render() {
    const { value, ...other } = this.props;
    const { classes } = this.props;
    var index =0;
    

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle align='center' id="confirmation-dialog-title">בחר הרצאה/תרגול </DialogTitle>
        <DialogContent>

            <div>
            <List>
              {this.props.releventLectures.map(course => course.map(lecture => (
                <Paper style={{ border: '1px', marginTop: 10 }}>
                <center>
                    <div>

                          <ListItem
                            key={++index}
                            role={undefined}
                            dense
                            button
                            selected={this.state.checked.indexOf(index) !== -1 }
                            onClick={this.handleToggle(index, lecture , lecture.courseName, true)}
                            variant="outlined"
                            >
                            <div style={{ borderColor: '#0094C8', borderStyle: 'solid', borderRadius: '5px',  }}>
                              <ListItemText
                                inset={true}
                                disableTypography
                                primary={<Typography type="headline" align='center' style={{ color: '#005007' }}>{`${lecture.teacherName} ${lecture.courseName} ${lecture.groupId} `}</Typography>}
                                secondary={lecture.sessions.map(session => (<Typography type="body2" align='center' style={{ color: '#777777' }}> {`${session.time.hours.startHour}-${session.time.hours.endHour} ${session.time.day} \n `}</Typography>))}

                                />
                                {console.log(this.state.selectedSession)}
                                </div>
                                <ListItemSecondaryAction>
                                </ListItemSecondaryAction>
                          </ListItem>
                      </div>
                      </center>
                      </Paper>
                    )
                  )
                  )}


                  {releventPractices.map(course => course.map(lecture => lecture.practices.map( practice => (
                    <Paper style={{ border: '1px', marginTop: 10 }}>
                    <center>
                        <div>

                              <ListItem
                                key={++index}
                                role={undefined}
                                dense
                                button
                                selected={this.state.checked.indexOf(index) !== -1 }
                                onClick={this.handleToggle(index, practice , lecture.name, false)}
                                variant="outlined"
                                >
                                <div style={{ borderColor: '#FFBA41', borderStyle: 'solid', borderRadius: '5px',  }}>
                                  <ListItemText
                                    inset={true}
                                    disableTypography
                                    primary={<Typography type="headline" align='center' style={{ color: '#005007' }}>{` ${lecture.name} ${practice.teacherName} ${practice.groupId} `}</Typography>}
                                    secondary={practice.sessions.map(session => (<Typography type="body2" align='center' style={{ color: '#777777' }}> {`${session.time.hours.startHour}-${session.time.hours.endHour} ${session.time.day} \n `}</Typography>))}

                                    />
                                    {console.log(practice)}
                                    </div>
                                    <ListItemSecondaryAction>
                                    </ListItemSecondaryAction>
                              </ListItem>
                          </div>
                          </center>
                          </Paper>
                        )
                      )
                      )
                    )
                  }
                  </List>
                  </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func,
  value: PropTypes.string,
};



class MyWeek extends React.Component {
  render() {
    let { date } = this.props
    let range = MyWeek.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}

MyWeek.range = date => {
  let FullDate =  new Date();
  let Day = FullDate.getDay();
  let CurrDate = FullDate.getDate();
  let Month = FullDate.getMonth();

  var Sunday;
  if(Day===6)
  {
  Sunday = CurrDate + 1;
  }
  else
  {
  Sunday = CurrDate - Day;
  }

  let start = new Date(2018, Month, Sunday, 8, 0, 0)
  let end = dates.add(start,5, 'day')

  let current = start
  let range = []

  while (dates.lte(current, end, 'day')) {
    range.push(current)
    current = dates.add(current, 1, 'day')
  }

  return range
}

MyWeek.navigate = (date, action) => {
  switch (action) {
    case BigCalendar.Navigate.PREVIOUS:
      return dates.add(date, -3, 'day')

    case BigCalendar.Navigate.NEXT:
      return dates.add(date, 3, 'day')

    default:
      return date
  }
}

MyWeek.title = date => {
  return `My awesome week: ${date.toLocaleDateString()}`
}
