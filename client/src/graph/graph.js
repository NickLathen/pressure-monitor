const BORDER_WIDTH = .15;
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;

export default class Graph {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.context = canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    const containerHeight = this.container.clientHeight;
    const containerWidth = this.container.clientWidth;
    this.canvas.setAttribute('height', containerHeight);
    this.canvas.setAttribute('width', containerWidth);
    this.height = containerHeight;
    this.width = containerWidth;
    this.offsetX = this.height * BORDER_WIDTH;
  }

  convertCanvasToCartesian(x, y) {
    return {
      x: x,
      y: this.height - y
    };
  }

  convertCartesianToCanvas(x, y) {
    return {
      x: x,
      y: Math.abs(y - this.height)
    };
  }


  convertGraphToCanvas(x, y) {
    const percentageX = (x - this.startDate) / this.unitWidth;
    const percentageY = (y - this.minY) / this.unitHeight;
    const graphX = this.width * percentageX;
    const graphY = this.height * percentageY;
    return this.convertCartesianToCanvas(graphX, graphY); 
  }

  drawDataSets() {
    const c = this.context;
    this.dataSets.forEach(dataSet => {
      const startingPoint = this.convertGraphToCanvas(dataSet.points[0].date, dataSet.points[0].value);
      c.beginPath();
      c.moveTo(startingPoint.x, startingPoint.y);
      dataSet.points.forEach(dataPoint => {
        if (dataPoint.date < this.startDate || dataPoint.date > this.currentDate) {
          return;
        } else {
          const canvasCoordinates = this.convertGraphToCanvas(dataPoint.date, dataPoint.value);
          c.lineTo(canvasCoordinates.x, canvasCoordinates.y);
        }
      });
      c.stroke();
    });
  }

  render(data) {
    this.numRows = data.numRows;
    this.minY = data.minY;
    this.maxY = data.maxY;
    this.period = data.period;
    this.currentDate = data.currentDate;
    this.dataSets = data.dataSets;
    this.unitHeight = this.maxY - this.minY;
    this.unitWidth = this.convertPeriodToMilliseconds(this.period);
    this.startDate = this.currentDate - this.unitWidth;
    this.drawDataSets();
  }

  convertPeriodToMilliseconds(period) {
    if (period.type === 'month') {
      return period.amount * oneMonth;
    }
  }
  
  applyStyles(styles) {
    
  }
}