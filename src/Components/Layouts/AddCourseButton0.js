import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  buttonProgress: {
    color: green[500],
    margin: theme.spacing.unit,
  },
});



class AddCourseButton extends React.Component {

  state = {
  };

  handleButtonClick = () => {
      this.setState(
        {
        },
        () => {
          this.props.handler(this.props.selectedCourse);
        },
      );

  };


  render() {
    const { classes } = this.props;

  return (
    <div>
      <Button variant="outlined" color="primary" size="small" className={classes.buttonProgress} onClick={this.handleButtonClick}>
        הוסף קורס
      </Button>
    </div>
  );
}
}

AddCourseButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddCourseButton);
