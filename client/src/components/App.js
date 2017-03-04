import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import store from '../reduxStore.js';
import AuthService from '../auth/auth.js';
import config from '../../../config/config.js';
import AppContainer from './AppContainer.js';
import Nav from './Nav.js';
import Login from './Login.js';
import Home from './Home.js';
import NotFound from './NotFound.js';

const auth = new AuthService(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN);

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' });
  }
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    store.subscribe(this.setState.bind(this, {}));
  }

  render(props) {
    return (
      <div>
        <Nav/>
        <Router history={browserHistory}>
          <Route path='/' component={AppContainer} auth={auth}>
            <IndexRedirect to='/home'/>
            <Route path='home' component={Home} onEnter={requireAuth}/>
            <Route path='login' component={Login}/>
          </Route>
          <Route path='*' component={NotFound}/>
        </Router>
      </div>
    );
  }
}