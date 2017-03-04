import React from 'react';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: props.auth.getProfile()
    };
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile});
    });
  }

  logout() {
    this.props.auth.logout();
    this.props.router.push('/login');
  }

  render() {
    const profile = this.state.profile;
    return (
      <div className='home'>
        <h2>Home</h2>
        <p>Welcome {profile.name}!</p>
        <button onClick={this.logout.bind(this)}>Logout</button>
      </div>
    );
  }
}

export default Home;