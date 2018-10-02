import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VerticalLinearStepper from './VerticalLinearStepper'
import CoursesList from './CoursesList'
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '100%',




  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});



class ControlledExpansionPanels extends React.Component {
  constructor(props) {
      super(props)

      //this.handler = this.handler.bind(this)
    }


  state = {
    expanded: 'panel1',
  };



  /*handler = (course) => {
    if(course != null){
    this.setState(state => ({
      myCourses: state.myCourses.concat([
          {name: course , id: counter++ }
      ])
    }))
  }
  console.log(this.state.myCourses);
  console.log(counter);
  };
  */

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (

      <div className={classes.root}>

            {/*}<Typography variant='headline' align='center' className={classes.heading}>הקורסים שלי</Typography>*/}
          <CoursesList sessions ={this.props.sessions} courses={this.props.courses} deletehandler={this.props.deletehandler}
            addSessionHandler= {this.props.addSessionHandler} deleteSessionHandler={this.props.deleteSessionHandler}/>
      </div>

      /*
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded=== 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Button color='primary' variant="outlined" fullWidth={true} >הקורסים שלי</Button>
            {/*}<Typography variant='headline' align='center' className={classes.heading}>הקורסים שלי</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <CoursesList courses={this.props.courses} deletehandler={this.props.deletehandler}
            addSessionHandler= {this.props.addSessionHandler} deleteSessionHandler={this.props.deleteSessionHandler}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      */


    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);
