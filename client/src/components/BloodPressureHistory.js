import React from 'react';
import Graph from '../graph/graph.js';
import api from '../api/api.js';

export default class BloodPressureHistory extends React.Component {
  constructor(props) {
    super(props);
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
      period: {
        type: 'month',
        amount: 1
      },
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
        <div className='graph-header'></div>
        <div className='graph-container'>
          <canvas className='graph'></canvas>
        </div>
      </div>
    );
  }
} 