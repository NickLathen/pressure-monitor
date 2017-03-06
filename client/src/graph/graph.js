const BORDER_WIDTH = .10;
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;

export default class Graph {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.context = canvas.getContext('2d');
    this.offset = 0;
    this.mousedownHandler = this.mousedownHandler.bind(this);
    this.mouseupHandler = this.mouseupHandler.bind(this);
    this.mousemoveHandler = this.mousemoveHandler.bind(this);
    this.scrollHome = this.scrollHome.bind(this);
    this.resizeCanvas();
    this.startResize();
    this.addListeners();
  }

  resizeCanvas() {
    const containerHeight = this.container.clientHeight;
    const containerWidth = this.container.clientWidth;
    this.canvas.setAttribute('height', containerHeight);
    this.canvas.setAttribute('width', containerWidth);
    this.height = containerHeight;
    this.width = containerWidth;
    if (this.dataSets) {
      this.render();
    }
  }

  addListeners() {
    this.canvas.addEventListener('mousedown', this.mousedownHandler);
    this.canvas.addEventListener('dblclick', this.scrollHome);
  }

  mousedownHandler(event) {
    this.lastMovementX = 0;
    cancelAnimationFrame(this.scrollTimeout);
    document.addEventListener('mouseup', this.mouseupHandler);
    document.addEventListener('mousemove', this.mousemoveHandler);
  }

  mouseupHandler(event) {
    document.removeEventListener('mouseup', this.mouseupHandler);
    document.removeEventListener('mousemove', this.mousemoveHandler);
    this.scrollMomentum();
  }

  mousemoveHandler(event) {
    const movementX = event.movementX;
    this.lastMovementX = movementX;
    this.offset = this.offset + movementX * 1.5 * 1000 * 1000;
    this.offset = Math.max(0, this.offset);
    this.render();
  }

  scrollMomentum() {
    const friction = 3;
    this.momentumLoop = function momentumLoop() {
      if (Math.abs(this.lastMovementX) < friction) {
        this.lastMovementX = 0;
      } else if (this.lastMovementX > 0) {
        this.lastMovementX -= friction;
      } else {
        this.lastMovementX += friction;
      }
      this.offset = this.offset + this.lastMovementX * 1.5 * 1000 * 1000;
      this.offset = Math.max(0, this.offset);
      if (this.offset) {
        this.scrollTimeout = requestAnimationFrame(this.momentumLoop);
      }
    }.bind(this);
    this.scrollTimeout = requestAnimationFrame(this.momentumLoop);
  }

  scrollHome() {
    const scrollPerTick = this.offset / 100;
    this.scrollLoop = function scrollLoop () {
      if (this.offset > scrollPerTick) {
        this.offset -= scrollPerTick;
      } else {
        this.offset = 0;
      }
      if (this.offset) {
        this.scrollTimeout = requestAnimationFrame(this.scrollLoop);
      }
    }.bind(this);
    this.scrollTimeout = requestAnimationFrame(this.scrollLoop);
  }
  
  startResize() {
    this.resizeLoop = function resizeLoop () {
      this.resizeCanvas();
      requestAnimationFrame(this.resizeLoop.bind(this));
    }.bind(this);
    requestAnimationFrame(this.resizeLoop.bind(this));
  }

  stopResize() {
    if (this.resizeLoop) {
      cancelAnimationFrame(this.resizeLoop);
    }
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
    const cartesianX = graphX * (1 - BORDER_WIDTH);
    const cartesianY = (BORDER_WIDTH * this.height) + graphY * (1 - BORDER_WIDTH);
    return this.convertCartesianToCanvas(cartesianX, cartesianY); 
  }

  clear() {
    const c = this.context;
    c.clearRect(0, 0, this.width, this.height);
  }

  clearYAxis() {
    const c = this.context;
    const x = this.width - this.width * BORDER_WIDTH;
    const y = 0;
    c.clearRect(x, y, this.height, this.width);
  }

  drawDataSets() {
    const c = this.context;
    c.lineWidth = this.height / 180;
    this.dataSets.forEach(dataSet => {
      const startingPoint = this.convertGraphToCanvas(dataSet.points[0].date, dataSet.points[0].value);
      c.strokeStyle = dataSet.color;
      c.beginPath();
      c.moveTo(startingPoint.x, startingPoint.y);
      dataSet.points.forEach(dataPoint => {
        if (dataPoint.date < this.startDate - oneMonth || dataPoint.date > (this.startDate + this.unitWidth) + oneMonth) {
          return;
        } else {
          const canvasCoordinates = this.convertGraphToCanvas(dataPoint.date, dataPoint.value);
          c.lineTo(canvasCoordinates.x, canvasCoordinates.y);
        }
      }); 
      c.stroke();
    });
    c.lineWidth = 1;
    c.strokeStyle = 'black';
  }

  drawRows() {
    const c = this.context;
    const rowSpacing = (this.maxY - this.minY) / (this.numRows - 1);
    c.setLineDash([1, 1]);
    c.fillStyle = 'grey';
    c.strokeStyle = 'grey';
    c.lineWidth = this.height / 400;
    c.beginPath();
    for (var row = 1; row <= this.numRows; row++) {
      const rowValue = this.minY + ((row - 1) * rowSpacing);
      const rowPosition = this.convertGraphToCanvas(this.startDate + this.unitWidth, rowValue); 
      c.moveTo(0, rowPosition.y);
      c.lineTo(rowPosition.x, rowPosition.y);
      const textPosition = this.convertGraphToCanvas(this.startDate + this.unitWidth, rowValue);
      const fontSize = Math.floor(this.width * (1 - BORDER_WIDTH) / 20);
      c.font = `${fontSize}px sans-serif`;
      c.fillText(rowValue, textPosition.x + fontSize * .1, textPosition.y + fontSize * .3);
    }
    c.stroke();
    c.setLineDash([]);
    c.lineWidth = 1;
    c.fillStyle = 'black';
    c.strokeStyle = 'black';
  }
 
  findFirstMonday() {
    let currDate = this.startDate + oneDay * 3;
    let currDateObject = new Date(currDate);
    let currDay = currDateObject.getDay();
    while (currDay !== 1) {
      currDate = currDate + oneDay;
      currDateObject = new Date(currDate);
      currDay = currDateObject.getDay();
    }
    currDate = currDate - currDateObject.getHours() * 60 * 60 * 1000 - currDateObject.getMinutes() * 60 * 1000;
    return currDate;
  }

  drawXAxisLabels() {
    const amount = 4;
    const type = this.period.type;
    const labelSpacing = (this.unitWidth) / (amount - 1);
    const c = this.context;
    c.fillStyle = 'grey';
    c.beginPath();
    var labelDate = this.findFirstMonday();
    for (var label = 1; label <= amount; label++) {
      const labelDateObject = new Date(labelDate);
      const month = labelDateObject.getMonth() + 1;
      const date = labelDateObject.getDate();
      const labelPosition = this.convertGraphToCanvas(labelDate, this.minY);
      const fontSize = Math.floor(this.width * (1 - BORDER_WIDTH) / 20);
      c.font = `${fontSize}px sans-serif`;
      c.fillText(`${month}/${date}`, labelPosition.x + -1.5 * fontSize, labelPosition.y + fontSize);
      labelDate = labelDate + oneWeek;
    }
    c.stroke();
    c.fillStyle = 'black';
  }
 
  render(data) {
    if (data) {
      this.loadData(data);
    }
    this.unitHeight = this.maxY - this.minY + (this.maxY - this.minY) * .1;
    this.unitWidth = this.convertPeriodToMilliseconds(this.period);
    this.startDate = this.currentDate - this.unitWidth - this.offset;
    this.clear();
    this.drawDataSets();
    this.clearYAxis();
    this.drawRows();
    this.drawXAxisLabels();
  }
  
  loadData(data) {
    this.numRows = data.numRows;
    this.minY = data.minY;
    this.maxY = data.maxY;
    this.period = data.period;
    this.currentDate = data.currentDate;
    this.dataSets = data.dataSets;
  }

  convertPeriodToMilliseconds(period) {
    if (period.type === 'month') {
      return period.amount * oneMonth;
    } else if (period.type === 'week') {
      return period.amount * oneWeek;
    }
  }
}