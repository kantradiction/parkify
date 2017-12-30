import React, { Component } from 'react';
import Landing from './components/pages/landing/landing';
import Dashboard from './components/pages/dashboard/dashboard';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Dashboard} />
        </div>
      </Router>

    );
  }
}

export default App;
