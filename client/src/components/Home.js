import React from 'react';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.auth.getToken(),
      bloodPressureData: []
    };
  }

  componentDidMount() {

  }

  render() {
    const profile = this.state.profile;
    return (
      <div className='home'>
        <div className='blood-pressure-input-container'></div>
        <div className='horizontal-divide'></div>
        <div className='blood-pressure-history-container'></div>
      </div>
    );
  }
}

export default Home;