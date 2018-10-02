import React, { Component } from 'react';
import {Header, Footer, Center} from './Components/Layouts';


const divStyle = {
  margin: '10px',
};
class App extends Component {

  render() {

    return (
      <div className="App">

        <div style={divStyle}>
        <Center/>
        {/*<div style={{marginTop: -180 , marginLeft: -180 , textAlign: 'center'}}>*/}
        <div>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
