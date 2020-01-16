import React, { Component, Fragment } from 'react';
import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Landing from './views/landing/Landing';
import Consumer from './views/consumer/Consumer';
import Venue from './views/venue/Venue';

class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Route path="/" component={Landing} />
          <Route path="/consumer" component={Consumer} />
          <Route path="/venue" component={Venue} />
        </Fragment>
      </Router>
    );
  }
}

export default App;
