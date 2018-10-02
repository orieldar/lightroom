import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Calender from './Calender';
import IntegrationReactSelect from './IntegrationReactSelect'
import VerticalLinearStepper from './VerticalLinearStepper'
import ControlledExpansionPanels from './ControlledExpansionPanels'
import CoursesList from './CoursesList'
import TemporaryDrawer from './TemporaryDrawer'
import Button from '@material-ui/core/Button';

const styles = theme => ({
});

class RightPane extends React.Component {
  constructor(props) {
      super(props)
      //this.handler = this.handler.bind(this)
    }

  state = {
    expanded: null,
    myCourses: [] ,
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
<Grid  container  direction="column"  justify="flex-start" alignItems="stretch" >

  <Grid item >
  <Button color='primary' variant="outlined" fullWidth={true} style={{backgroundColor:'#EEEEEE'}}>הקורסים שלי</Button>
  <div style={{height:'82vh', backgroundColor:'#BEBEBE' ,  maxHeight: '100vh', overflow: 'auto',
      }}>
    <ControlledExpansionPanels handler={this.props.handler} deletehandler={this.props.deletehandler} sessions = {this.props.sessions} courses={this.props.courses}
    addSessionHandler= {this.props.addSessionHandler} deleteSessionHandler={this.props.deleteSessionHandler}/>
    </div>
  </Grid>
</Grid>
);
}
}

RightPane.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RightPane);
