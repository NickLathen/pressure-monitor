import React from 'react';
import { browserHistory } from 'react-router';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: props.auth.getProfile()
    };
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile});
    });
    props.auth.on('profile_deleted', () => {
      this.setState({profile: {}});
    });
  }

  logout() {
    this.props.auth.logout();
    browserHistory.push('/login');
  }

  render() {
    const auth = this.props.auth;
    const profile = this.state.profile;
    return (
      <div className='nav'>
        {profile.name ? (
          <div className='nav-profile'>
            <p className='nav-profile-message'>{`You are logged in as ${profile.name}.`}</p>
            <button className='button-logout' onClick={this.logout.bind(this)}>Logout</button>
          </div>
          ) : null
        }
      </div>
    );
  }
}