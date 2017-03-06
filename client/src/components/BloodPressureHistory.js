import React from 'react';
import Graph from '../graph/graph.js';
import api from '../api/api.js';

export default class BloodPressureHistory extends React.Component {
  constructor(props) {
    super(props);
    this.getPressures = props.getPressures;
  }

  componentDidMount() {
    const graphElement = document.querySelector('.graph');
    const graphContainer = document.querySelector('.graph-container');
    this.graph = new Graph(graphElement, graphContainer);
    this.refreshData();
  }

  componentWillUnmount() {
    this.graph.kill();
    delete this.graph;
  }

  refreshData() {
    this.getPressures()
    .then(pressures => {
      const systolicPressures = [];
      const diastolicPressures = [];
      pressures.forEach(pressure => {
        systolicPressures.push({date: +pressure.date, value: pressure.systolic});
        diastolicPressures.push({date: +pressure.date, value: pressure.diastolic});
      });
      this.graph.render({
        numRows: 7,
        minY: 60,
        maxY: 180,
        period: {
          type: 'month',
          amount: 1
        },
        currentDate: Date.now(),
        dataSets: [
          {
            color: 'purple',
            points: diastolicPressures
          },
          {
            color: 'blue',
            points: systolicPressures
          }
        ]
      });
    });
  }

  render() {
    return (
      <div className='blood-pressure-history'>
        <div className='graph-header'></div>
        <div className='graph-container'>
          <canvas className='graph'></canvas>
        </div>
      </div>
    );
  }
} 