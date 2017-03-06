import React from 'react';
import BloodPressureInput from './BloodPressureInput';
import BloodPressureHistory from './BloodPressureHistory';
import api from '../api/api.js';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.auth.getToken(),
    };
  }

  submitPressure(systolic, diastolic) {
    api.submitPressure(this.state.token, systolic, diastolic);
  }

  getPressures() {
    return api.getPressures(this.state.token);
  }

  render() {
    return (
      <div className='home'>
        <BloodPressureInput submitPressure={this.submitPressure.bind(this)}/>
        <hr className='horizontal-divide'></hr>
        <BloodPressureHistory getPressures={this.getPressures.bind(this)}/>
      </div>
    );
  }
}

export default Home;