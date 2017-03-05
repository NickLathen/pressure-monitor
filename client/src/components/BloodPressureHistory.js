import React from 'react';
import Graph from '../graph/graph.js';
import mocks from '../test/mock.js';
const generatePressures = mocks.generatePressures;

export default class BloodPressureHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const graphElement = document.querySelector('.graph');
    const graphContainer = document.querySelector('.graph-container');
    this.graph = new Graph(graphElement, graphContainer);
    let currentDate = Date.now();
    const dataSets = generatePressures();
    const animate = () => {
      currentDate = currentDate - 1000 * 1000 * 3;
      this.graph.render({
        numRows: 7,
        minY: 60,
        maxY: 180,
        period: {
          type: 'month',
          amount: 1
        },
        currentDate: currentDate,
        dataSets: dataSets
      });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

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