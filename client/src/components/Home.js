import React from 'react';
import BloodPressureInput from './BloodPressureInput';
import BloodPressureHistory from './BloodPressureHistory';
import api from '../api/api.js';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.auth.getToken(),
      systolicPressures: [],
      diastolicPressures: [],
    };
    this.getPressures();
  }

  submitPressure(systolic, diastolic) {
    return api.submitPressure(this.state.token, systolic, diastolic).then(() => {
      return this.getPressures();
    });
  }

  getPressures() {
    return api.getPressures(this.state.token)
    .then(pressures => {
      const systolicPressures = [];
      const diastolicPressures = [];
      pressures.forEach(pressure => {
        systolicPressures.push({date: +pressure.date, value: pressure.systolic});
        diastolicPressures.push({date: +pressure.date, value: pressure.diastolic});
      });
      const newState = {
        systolicPressures,
        diastolicPressures
      };
      this.setState(newState);
    });
  }

  render() {
    const state = this.state;
    const systolicPressures = state.systolicPressures;
    const diastolicPressures = state.diastolicPressures;
    return (
      <div className='home'>
        <BloodPressureInput submitPressure={this.submitPressure.bind(this)}/>
        <hr className='horizontal-divide'></hr>
        <BloodPressureHistory getPressures={this.getPressures.bind(this)} systolicPressures={systolicPressures} diastolicPressures={diastolicPressures}/>
      </div>
    );
  }
}

export default Home;