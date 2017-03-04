import React, { PropTypes as T } from 'react';
import AuthService from '../auth/auth.js';

export default class Login extends React.Component {
  componentDidMount() {
    if (this.props.route.path === 'login') {
      const auth = this.props.auth;
      auth.login(); 
    }
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}