
import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Calender from './Calender';

class EventComponent extends React.Component {

delete = () => Calender.delete(this.props.event.id)

    render() {

      return (

<div>
<div>
{/*  <div  style={{  fontFamily: 'Arial' ,  fontSize: 13}}>

        <div style={{ display:'inline-block'}}>
        <IconButton style={{  width: 8,
      height: 8,
      marginTop: -10,
      marginRight: '-5px',
      background: '#ffffff',
      fontWeight: 'bold',
    fontSize: 7 }} onClick={this.delete} title="מחק אירוע" >
         X
        </IconButton>*/}

       <div  style={{ fontSize:'60%', fontWeight:'bold' , height: "100%",  width: "100%"  , fontFamily:"Arial" }}>
       <center>
        {'(' + this.props.event.id + ") " + this.props.event.courseName }




          <Divider style={{background: '#000000' , marginTop: 0 , width: "100%"  }} />


          {this.props.event.teacherName}  < br/> {this.props.event.location}

          </center>

          </div>



</div>

        </div>
      )
  }
  }

  export default EventComponent
