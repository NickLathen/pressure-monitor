import React from 'react';
import BloodPressureInput from './BloodPressureInput';
import BloodPressureHistory from './BloodPressureHistory';
import api from '../api/api.js';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.auth.getToken(),
      bloodPressureData: []
    };
  }

  submitPressure(systolic, diastolic) {
    api.submitPressure(this.state.token, systolic, diastolic);
  }

  render() {
    const profile = this.state.profile;
    return (
      <div className='home'>
        <BloodPressureInput submitPressure={this.submitPressure.bind(this)}/>
        <hr className='horizontal-divide'></hr>
        <BloodPressureHistory pressureData={this.state.bloodPressureData}/>
      </div>
    );
  }
}

export default Home;