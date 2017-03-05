import React from 'react';
import Graph from '../graph/graph.js';

export default class BloodPressureHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const graphElement = document.querySelector('.graph');
    const graphContainer = document.querySelector('.graph-container');
    this.graph = new Graph(graphElement, graphContainer);
  }

  render() {
    const pressureData = this.props.pressureData;
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