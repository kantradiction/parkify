import React, { Component } from 'react';

// Imported Pages
import Landing from './Components/Pages/Landing/landing';
import Dashboard from './Components/Pages/Dashboard/dashboard';
import Alert from './Components/Pages/Alert/alert';
import Create from './Components/Pages/Create/create';
import Edit from './Components/Pages/Edit/edit';
import Enlarge from './Components/Pages/Enlarge/enlarge';
import Garage from './Components/Pages/Garage/garage'
import Sample from './Components/Pages/Sample/sample';

import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Dashboard} />
          <Route exact path="/alert" component={Alert} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/edit" component={Edit} />
          <Route exact path="/enlarge" component={Enlarge} />
          <Route exact path="/garage" component={Garage} />
          <Route exact path="/sample" component={Sample} />
        </div>
      </Router>

    );
  }
}

export default App;
