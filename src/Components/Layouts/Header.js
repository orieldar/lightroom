import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IntegrationReactSelect from './IntegrationReactSelect'
import TemporaryDrawer from './TemporaryDrawer'

export default props =>
    <Grid  container  direction="row"  justify="flex-start" alignItems="flex-start" md={12}>
      <Grid item md={12}>
        <Paper >
        <AppBar position="static">
              <Toolbar>
              <TemporaryDrawer/>
                <Typography variant="subheading" color="inherit" align='right' >
                   Ziggi Light
                </Typography>
              </Toolbar>
            </AppBar>
        </Paper>
      </Grid>

    </Grid>
