import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VerticalLinearStepper from './VerticalLinearStepper'
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import SessionList from './SessionList';

const styles = theme => ({
  root: {
    width: '100%',


  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '10.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class CoursesList extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };



  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    var counter =0;

    return (
      <div className={classes.root}>
      {this.props.courses.map((course) => (console.log('panel' + course.name.value))) }
      {
                this.props.courses.map((course) => (
                  <div >
                  <ExpansionPanel expanded={expanded === ( `panel  ${++counter}` ) } onChange={this.handleChange(`panel  ${counter}`)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon size="small" />}>
                    <IconButton
                       key="close"
                       aria-label="Close"
                       color="inherit"
                       onClick={()=>this.props.deletehandler(course.name.value)}
                       className={classes.close}
                     >
                       <CloseIcon className={classes.icon} />
                     </IconButton>
                      {/*}<Typography variant="button" align='inherit' className={classes.button}>{course.name.value} </Typography>*/}
                      <Button color='inherit' variant="inherit" fullWidth={true} >{course.name}</Button>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    <SessionList dense={true} courseLectures={course.lectures} courseName={course.name} courseIndex={counter++}
                      sessions= {this.props.sessions} addSessionHandler= {this.props.addSessionHandler} deleteSessionHandler={this.props.deleteSessionHandler}/>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  </div>
                ))
            }
            {/*
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography align='center' className={classes.heading}>קורס 1 </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography align='center' className={classes.heading}>קורס 2</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      */}
      </div>
    );
  }
}

CoursesList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CoursesList);
