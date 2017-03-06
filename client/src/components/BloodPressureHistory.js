import React from 'react';
import Graph from '../graph/graph.js';
import api from '../api/api.js';

export default class BloodPressureHistory extends React.Component {
  constructor(props) {
    super(props);
    this.period = {
      type: 'month',
      amount: 1
    };
  }

  componentDidMount() {
    const graphElement = document.querySelector('.graph');
    const graphContainer = document.querySelector('.graph-container');
    this.graph = new Graph(graphElement, graphContainer);
  }

  componentDidUpdate() {
    this.refreshData();
    this.graph.scrollHome();
  }

  componentWillUnmount() {
    this.graph.kill();
    delete this.graph;
  }

  refreshData() {
    this.graph.render({
      numRows: 7,
      minY: 60,
      maxY: 180,
      period: this.period,
      currentDate: Date.now(),
      dataSets: [
        {
          color: 'purple',
          points: this.props.diastolicPressures
        },
        {
          color: 'blue',
          points: this.props.systolicPressures
        }
      ]
    });
  }

  render() {
    return (
      <div className='blood-pressure-history'>
        <div className='graph-header'>
          <p className='graph-header-title'>History</p>
          <select className='graph-header-dropdown' defaultValue='1month'>
            <option value='1week'>Last Week</option>
            <option value='2week'>Last 2 Weeks</option>
            <option value='1month'>Last Month</option>
            <option value='2month'>Last 2 Months</option>
            <option value='3month'>Last 3 Months</option>
            <option value='6month'>Last 6 Months</option>
            <option value='1year'>Last 1 Year</option>
          </select>
        </div>
        <div className='graph-container'>
          <canvas className='graph'></canvas>
        </div>
      </div>
    );
  }
} 