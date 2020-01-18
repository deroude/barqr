import React, { Component, Fragment } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Landing from './views/landing/Landing';
import Consumer from './views/consumer/Consumer';
import Venue from './views/venue/Venue';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>          
          <Route path="/consumer/:venue/:table" component={Consumer} />
          <Route path="/venue/:venue" component={Venue} />
          <Route path="/" component={Landing} />
        </Switch>
      </Router>
    );
  }
}

export default App;
