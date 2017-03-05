import React from 'react';

export default class BloodPressureInput extends React.Component {
  constructor(props) {
    super(props);
    this.submitPressure = props.submitPressure;
  }

  componentDidMount() {
    
  }

  onClick(event) {
    debugger;
  }

  render() {
    return (
      <div className='blood-pressure-input'>
        <div className='blood-pressure-input-container'>
          <p>Record Today's Blood Pressure</p>
          <div className = 'blood-pressure-text-border'>
            <input className='systolic-input' type='text' maxLength='3'/>
            <p className='tight-slash'>/</p>
            <input className='diastolic-input' type='text' maxLength='3'/> 
          </div>
          <button className='button-submit' onClick={this.onClick.bind(this)}>Submit</button>  
        </div>
      </div>
    );
  }
} 