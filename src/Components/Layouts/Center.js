import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Calender from './Calender';
import RightPane from './RightPane'
import Header from './Header'
import TemporaryDrawer from './TemporaryDrawer'
import ReactFileReader from 'react-file-reader';
import {start} from '../../Utils/LocalRequest.js'
import {httpstart} from '../../Utils/HttpsRequest.js'
import Button from '@material-ui/core/Button';
import {compareObjects} from './Compare';
import SimpleSnackbar from './SimpleSnackbar'

export var courses = {}
var firstOpen = true;
export var filteredCourses = {};

const divStyle = {
  margin: '5px',

};

const styles = theme => ({
});

var counter =0;

class Center extends React.Component{
  constructor(props) {
      super(props)
      this.handler = this.handler.bind(this)
      this.deletehandler = this.deletehandler.bind(this)
      this.addSessionHandler = this.addSessionHandler.bind(this)
      this.deleteSessionHandler = this.deleteSessionHandler.bind(this)
      this.handleHTTPRequest = this.handleHTTPRequest.bind(this)
      this.saveStateStorage = this.saveStateStorage.bind(this)
    }

  state = {
    myCourses: [] ,
    courses: courses,
    mySessions: [],
  };

  handler = (selectedCourse) => {
    if(selectedCourse != null && !this.state.myCourses.includes(selectedCourse[0])){
    this.setState(state => ({
      myCourses: state.myCourses.concat(selectedCourse) ///course is an array with a course object inside
    }))
  }
  console.log(this.state.myCourses);
  console.log(counter);
  };

  saveStateStorage = () => {
    var mycourses = JSON.stringify(this.state.myCourses);
    var courses  =  JSON.stringify(this.state.courses);
    var mysessions  =  JSON.stringify(this.state.mySessions);
    localStorage.setItem('myCourses', mycourses);
    localStorage.setItem('courses', courses );
    localStorage.setItem('mySessions', mysessions);
  }

  loadLocalStorage = () => {
    if(localStorage.getItem('saved')==='true'){


    this.setState({
      myCourses: JSON.parse(localStorage.getItem('myCourses')),
      courses: JSON.parse(localStorage.getItem('courses')),
      mySessions: JSON.parse(localStorage.getItem('mySessions')), ///course is an array with a course object inside
    })
    console.log('loaded local storage')
  }
  console.log('storage not loaded')
  }



  addSessionHandler = (group) => {
    console.log(group);
    this.setState(state => ({
      mySessions: state.mySessions.concat(group) ///course is an array with a course object inside
    }))
    console.log(this.state.mySessions);

  };

  delete = (groups , groupId , courseName) =>{
    while(index !=-1){
    var index = groups.findIndex(group => group.groupId === groupId && group.courseName === courseName);
    if (index > -1)
    groups.splice(index, 1);
    }
    return groups;
}

  deleteSessionHandler = (groupId , courseName) => {
    this.setState({
      mySessions: this.delete(this.state.mySessions, groupId , courseName ) ///course is an array with a course object inside
    })
  };

  deletehandler = (coursename) => {
    console.log(coursename);
    console.log(this.state.myCourses.map(course => course.name.value))
    this.setState(state => ({
      myCourses: state.myCourses.filter(course => course.name.value != coursename)
    }))
  };


  strMapToObj(strMap) {
      let obj = Object.create(null);
      for (let [k,v] of strMap) {
          // We don’t escape the key '_proto_'
          // which can cause problems on older engines
          obj[k] = v;
      }
      return obj;
  }

  handleFiles = file => {

   let promise1 = start(file.base64.slice(28))
   promise1.then((value) =>{
     courses=this.strMapToObj(value)
  this.setState({courses: courses})


// getter
let input = localStorage.getItem('myData');
console.log(input)
  })


  }

  handleHTTPRequest =(department,semester) =>{
    console.log(department.value);
    console.log(semester);
    let courses = httpstart(department.value,semester)
    this.setState({courses: courses})
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    if(firstOpen){
      this.loadLocalStorage();
      firstOpen=false;
    }



return(
<Grid  container  direction="row"  justify="flex-start" alignItems="stretch" md={12}>
  <Grid item md={9}>
    <Paper >
    <Grid  container  direction="row"  justify="flex-start" alignItems="stretch">
    <Grid item>
    <ReactFileReader handleFiles={this.handleFiles} fileTypes={[".pdf"]} base64={true} multipleFiles={false}>
  <Button color='primary' variant="outlined" size="small" > PDF העלאת קובץ  </Button>
</ReactFileReader>
</Grid>
<Grid item>
      <TemporaryDrawer handler={this.handler} httphandler={this.handleHTTPRequest}  allcourses={courses} courses={this.props.myCourses}/>
</Grid>
</Grid>
     <Calender groups = {this.state.mySessions} courses={this.state.myCourses} addSessionHandler= {this.addSessionHandler}/>
     <SimpleSnackbar saveStateStorage= {this.saveStateStorage}/>
    </Paper>
  </Grid>

  <Grid item md={3} >

  <RightPane  handler={this.handler} deletehandler={this.deletehandler} sessions={this.state.mySessions} courses={this.state.myCourses}
            addSessionHandler= {this.addSessionHandler} deleteSessionHandler={this.deleteSessionHandler}/>
  </Grid>
</Grid>
);

}
}

Center.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Center);
