import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IntegrationReactSelect from './IntegrationReactSelect';
import RadioButtonsGroup from './RadioButtonsGroup';
import SelectCoursesIntegration from './SelectCoursesIntegration';
import AddCourseButton from './AddCourseButton'
import CircularIntegration from './CircularIntegration'


const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['בחר מספר מחלקה ', 'בחר סמסטר', 'בחר קורסים'];
}

function getStepContent(step,props,state,setDepartment,setSemester) {
  switch (step) {
    case 0:
      return (
        <div>
        <IntegrationReactSelect setDepartment={setDepartment}/>
        </div>
      );
    case 1:
      return (
        <div>
        <RadioButtonsGroup setSemester={setSemester}/>
        <CircularIntegration httphandler={props.httphandler} department={state.department} semester={state.semester} />
        </div>
      );
    case 2:
      return (
        <div>
      <SelectCoursesIntegration handler={props.handler} allcourses={props.allcourses}/>
      </div>
    );


    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  constructor(props) {
      super(props)
      this.setSemester = this.setSemester.bind(this)
      this.setDepartment = this.setDepartment.bind(this)
    }

  state = {
    activeStep: 2,
    department: null,
    semester: null,
  };

  setSemester = (value) => {
    this.setState(state => ({
      semester: value,
    }));
  };

  setDepartment = (value) => {
    this.setState(state => ({
      department: value,
    }));
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index,this.props,this.state,this.setDepartment,this.setSemester)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        חזור
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                         {activeStep === steps.length - 1 ?  'סיום' : 'הבא' }
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              התחל מחדש
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);
