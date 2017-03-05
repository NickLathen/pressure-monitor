import React from 'react';

export default function BloodPressureHistory(props) {
  const pressureData = props.pressureData;
  return (
    <div className='blood-pressure-history'>
      <div className='graph-header'></div>
      <div className='graph-container'>
        <canvas className='graph'></canvas>
      </div>
    </div>
  );
} 