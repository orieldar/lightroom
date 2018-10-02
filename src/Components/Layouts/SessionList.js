import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {compareObjects} from './Compare'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    //maxHeight: '88vh',
    //overflow: 'auto',

  },
});




class SessionList extends React.Component {
  state = {
    checked: [0],
  };

  handleToggle = (index, group , courseName) => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];
    console.log(index)
    if (currentIndex === -1) {
      newChecked.push(index);
      group["courseName"] = courseName
      this.props.addSessionHandler(group);
    } else {
      newChecked.splice(currentIndex, 1);
      this.props.deleteSessionHandler(group.groupId , courseName);
    }

    this.setState({
      checked: newChecked,
    });

  };

  checkForOutsideSelect = (session,index,isPractice, courseName) => {
    console.log(session);
    console.log(this.props.sessions)
    console.log(this.props.sessions.includes(session))
    isPractice? session.courseName = courseName : undefined
    if(this.props.sessions.includes(session)){

    const { checked } = this.state;
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
      this.setState({
        checked: newChecked,
      });
    }
    return true;
  }
  if(isPractice){
    var includes = false;
    this.props.sessions.forEach(sess => compareObjects(sess,session)?includes=true:undefined)
    return includes;
  }
  return false;
}



  render() {
    const { classes } = this.props;
    var index = 0;

    return (
      <div className={classes.root}>
        <List>
        {console.log(this.props.courseLectures)}
          {this.props.courseLectures.map(lecture => (
            <Paper style={{ border: '1px', marginTop: 10 }}>
              <center>
                <div>
                  <ListItem
                    key={++index}
                    role={undefined}
                    dense
                    button
                    selected={this.state.checked.indexOf(index) !== -1 || this.checkForOutsideSelect(lecture,index, false, this.props.courseName )}
                    onClick={this.handleToggle(index, lecture , this.props.courseName)}
                    className={classes.listItem}
                    variant="outlined"
                  >
                    <div style={{ borderColor: '#0094C8', borderStyle: 'solid', borderRadius: '5px',  }}>
                      <ListItemText
                        inset={true}
                        disableTypography
                        primary={<Typography type="headline" align='center'  style={{ color: '#005007'}}>{`${lecture.teacherName}   ${lecture.groupId}`} </Typography>}
                        secondary={lecture.sessions.map(session => (<Typography type="body2" align='center' style={{ color: '#777777' }}> {`${session.time.hours.startHour}-${session.time.hours.endHour} ${session.time.day} \n `}</Typography>))}
                      />
                    </div>
                    <ListItemSecondaryAction>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {lecture.practices.map(practice => (
                    <ListItem
                      key={++index}
                      role={undefined}
                      dense
                      button
                      selected={this.state.checked.indexOf(index) !== -1 || this.checkForOutsideSelect(practice,index,true,this.props.courseName )}
                      onClick={this.handleToggle(index , practice , this.props.courseName)}
                      className={classes.listItem}
                      variant="outlined"
                    >
                      <div style={{ borderColor: '#FFBA41', borderStyle: 'solid', borderRadius: '5px' }}>
                        <ListItemText
                          disableTypography
                          inset={true}
                          primary={<Typography type="headline" align='center' style={{ color: '#005007' }}>{`${practice.teacherName} (${practice.groupId}) `}</Typography>}
                          secondary={<Typography type="body2" align='center' style={{ color: '#777777' }}> {practice.sessions.map(session => (`${session.time.hours.startHour}-${session.time.hours.endHour} ${session.time.day} \n `))}</Typography>}
                        />
                      </div>
                      <ListItemSecondaryAction>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                  )}
                </div>
              </center>
            </Paper>
          )

          )}

        </List>
      </div>
    );
  }
}

SessionList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SessionList);
