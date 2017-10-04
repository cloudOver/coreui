import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Dashboard from './Dashboard';
import About from './About';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Route exact path="/" component={Dashboard} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    );
  }
}

export default App;
