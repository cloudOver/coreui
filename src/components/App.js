import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import Dashboard from './Dashboard';
import About from './About';
import Login from './Login';

class AppComponent extends React.Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Route exact path="/" component={Dashboard} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default AppComponent;
