import React, { Component } from 'react';
import './App.css';
import QrReader from 'react-qr-reader';

class App extends Component {

  state = { text: '' }

  render() {
    return (
      <div className="App">
        <QrReader
          delay={300}
          onError={err => console.log(err)}
          onScan={data => this.setState({ text: data })}
          style={{ width: '100%' }}
        />
        <div>{this.state.text}</div>
      </div>
    );
  }
}

export default App;
