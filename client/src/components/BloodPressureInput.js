import React from 'react';

export default class BloodPressureInput extends React.Component {
  constructor(props) {
    super(props);
    this.submitPressure = props.submitPressure;
  }

  submitInput(event) {
    const systolicPressure = +document.querySelector('.systolic-input').value;
    const diastolicPressure = +document.querySelector('.diastolic-input').value;
    document.querySelector('.submit-warning').innerText = '';
    if (!systolicPressure || !diastolicPressure) {
      document.querySelector('.submit-warning').innerText = 'Pressure must contain only numbers.';
    } else {
      this.submitPressure(systolicPressure, diastolicPressure);
    }
  }

  swapInputField(event) {
    if (event.key === 'Enter' || event.key === '/') {
      document.querySelector('.diastolic-input').focus();
      document.querySelector('.diastolic-input').select();
      event.preventDefault();
    }
  }

  submitOnEnter(event) {
    if (event.key === 'Enter') {
      document.querySelector('.button-submit').focus();
    }
  }

  render() {
    return (
      <div className='blood-pressure-input'>
        <div className='blood-pressure-input-container'>
          <p className='blood-pressure-input-header noselect'>Record Today's Blood Pressure</p>
          <div className = 'blood-pressure-text-border'>
            <input className='systolic-input' onKeyDown={this.swapInputField.bind(this)} type='text' maxLength='3'/>
            <p className='tight-slash noselect'>/</p>
            <input className='diastolic-input' onKeyDown={this.submitOnEnter.bind(this)} type='text' maxLength='3'/> 
          </div>
          <button className='button-submit noselect' onClick={this.submitInput.bind(this)}>Submit</button>
          <p className='submit-warning'></p>
        </div>
      </div>
    );
  }
} 