import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import VerticalLinearStepper from './VerticalLinearStepper'


const styles = {
  list: {
    width: 'auto',
  },
  fullList: {
    width: 'auto',
  },
};

class TemporaryDrawer extends React.Component {
  state = {
    left: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div>
      <VerticalLinearStepper handler={this.props.handler} httphandler={this.props.httphandler} allcourses={this.props.allcourses}/>
      </div>
    );


    return (
      <div>
        <Button variant="outlined" size="small" fullWidth={true} onClick={this.toggleDrawer('left', true)}>ADD COURSE</Button>
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div style={{width:'50vh' , display: 'inline-block'}}
            tabIndex={0}
            role="button"
            //onClick={this.toggleDrawer('left', false)}
            //onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);
