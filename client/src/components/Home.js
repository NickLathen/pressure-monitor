import React from 'react';
import BloodPressureInput from './BloodPressureInput';
import BloodPressureHistory from './BloodPressureHistory';

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

  submitPressure(systolic, diastolic) {
    
  }

  render() {
    const profile = this.state.profile;
    return (
      <div className='home'>
        <BloodPressureInput submitPressure={this.submitPressure.bind(this)}/>
        <hr className='horizontal-divide'></hr>
        <BloodPressureHistory/>
      </div>
    );
  }
}

export default Home;