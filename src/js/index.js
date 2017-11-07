import '../css/style.scss';

import React from 'react';
import { render } from 'react-dom';
import { Route, IndexRoute, BrowserRouter as Router } from 'react-router-dom';

import NavBar from './components/shared/navbar';
import Welcome from './components/welcome/index';
import Dashboard from './components/dashboard';
import Admin from './components/admin';
import Login from './components/login';
import Modal from './components/shared/modal/modal';
import Toast from './components/shared/toast';
import Protector from './components/protector';

const APP_PATHS = {
    index: '/',
    dashboard: '/dashboard',
    admin: '/admin',
    login: '/login'
};

export default class App extends React.Component {

  constructor(props) {
    super(props);

    // holds the function handle of each navbar button
    this.sub = {
      menu: null,
      info: null,
      widget: null,
      admin: null,
      link: null
    };

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
  }

  /**
   * Subscribe a function to be called when the specified button (action) gets clicked.
   * Actions are: menu, widget, admin, info
   * @param {string} action 
   * @param {function} func 
   */
  subscribe(action, func) {
    this.sub[action] = func;
  }

  /**
   * unsubscribe the function registered to listen the given menu button action.
   * @param {string} action 
   * @param {function} func 
   */
  unsubscribe(action, func) {
    if (this.sub[action]) {
      this.sub[action] = null;
    }
  }

  /**
   * Execute the registered function based on the clicked button.
   * @param {object} event 
   * @param {string} action 
   */
  onMenuButtonClick(event, action) {
    if (this.sub[action]) {
      this.sub[action](event);
    }
  }

  render() {
    return (
      <Router basename="/">
        <div>
          <Modal />
          <Toast />
          <NavBar onButtonClick={this.onMenuButtonClick} />
          <div className="container is-fluid is-marginless height-minus-nav">
            <Route exact path={APP_PATHS.index} component={(props) => (<Welcome subscribe={this.subscribe} unsubscribe={this.unsubscribe} {...props} />)} />
            <Route exact path={APP_PATHS.dashboard} component={(props) => (<Dashboard subscribe={this.subscribe} unsubscribe={this.unsubscribe} {...props} />)} />
            <Route exact path={APP_PATHS.admin} component={(props) => (<Admin subscribe={this.subscribe} unsubscribe={this.unsubscribe} {...props} />)} />
            <Route exact path={APP_PATHS.login} component={(props) => (<Login {...props} />)} />
            <Protector path={APP_PATHS} />
          </div>
          
        </div>
      </Router>
    );
  }

}

render(<App />, document.getElementById('app'));