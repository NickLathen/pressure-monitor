const BORDER_WIDTH = .10;
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * oneHour;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;

export default class Graph {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.context = canvas.getContext('2d');
    this.minOffset = 0;
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
    this.offset = this.offset + movementX * this.unitWidth / 1200;
    this.offset = Math.max(this.minOffset, this.offset);
    this.render();
  }

  scrollMomentum() {
    const friction = 3;
    cancelAnimationFrame(this.scrollTimeout);
    this.momentumLoop = function momentumLoop() {
      if (Math.abs(this.lastMovementX) < friction) {
        this.lastMovementX = 0;
      } else if (this.lastMovementX > 0) {
        this.lastMovementX -= friction;
      } else {
        this.lastMovementX += friction;
      }
      this.offset = this.offset + this.lastMovementX * this.unitWidth / 1200;
      this.offset = Math.max(this.minOffset, this.offset);
      if (this.lastMovementX) {
        this.scrollTimeout = requestAnimationFrame(this.momentumLoop);
      }
    }.bind(this);
    this.scrollTimeout = requestAnimationFrame(this.momentumLoop);
  }

  scrollHome() {
    this.lastMovementX = 0;
    cancelAnimationFrame(this.scrollTimeout);
    const scrollPerTick = this.offset / 100;
    this.scrollLoop = function scrollLoop () {
      if (this.offset > this.minOffset) {
        this.offset -= scrollPerTick;
      }
      this.offset = Math.max(this.minOffset, this.offset);
      if (this.offset !== this.minOffset) {
        this.scrollTimeout = requestAnimationFrame(this.scrollLoop);
      }
    }.bind(this);
    this.scrollTimeout = requestAnimationFrame(this.scrollLoop);
  }
  
  startResize() {
    this.resizeLoop = function resizeLoop () {
      this.resizeCanvas();
      requestAnimationFrame(this.resizeLoop);
    }.bind(this);
    requestAnimationFrame(this.resizeLoop);
  }

  stopResize() {
    if (this.resizeLoop) {
      cancelAnimationFrame(this.resizeLoop);
    }
  }

  kill() {
    this.stopResize();
    cancelAnimationFrame(this.scrollTimeout);
    document.removeEventListener('mouseup', this.mouseupHandler);
    document.removeEventListener('mousemove', this.mousemoveHandler);
    this.canvas.removeEventListener('mousedown', this.mousedownHandler);
    this.canvas.removeEventListener('dblclick', this.scrollHome);
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
    const pointSize = c.lineWidth * 1.5;
    this.dataSets.forEach(dataSet => {
      if (dataSet.points.length > 0) {
        let startingPoint = this.convertGraphToCanvas(dataSet.points[0].date, dataSet.points[0].value);
        c.strokeStyle = dataSet.color;
        c.fillStyle = dataSet.color;
        c.beginPath();
        c.moveTo(startingPoint.x, startingPoint.y);
        c.ellipse(startingPoint.x, startingPoint.y, pointSize, pointSize, 0, 0, Math.PI * 2);
        c.fill();
        c.closePath();
        dataSet.points.forEach(dataPoint => {
          if (dataPoint.date < this.startDate - oneMonth || dataPoint.date > (this.startDate + this.unitWidth) + oneMonth) {
            return;
          } else {
            const canvasCoordinates = this.convertGraphToCanvas(dataPoint.date, dataPoint.value);
            c.beginPath();
            c.moveTo(startingPoint.x, startingPoint.y);
            c.lineTo(canvasCoordinates.x, canvasCoordinates.y);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.ellipse(canvasCoordinates.x, canvasCoordinates.y, pointSize, pointSize, 0, 0, Math.PI * 2);
            c.fill();
            c.closePath();
            startingPoint = canvasCoordinates;
          }
        }); 
      }
    });
    c.lineWidth = 1;
    c.strokeStyle = 'black';
    c.fillStyle = 'black';
  }

  drawRows() {
    const c = this.context;
    c.globalCompositeOperation = 'destination-over';
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
    c.globalCompositeOperation = 'source-over';
  }
 
  findNextDay(date) {
    let currDate = date + oneDay + oneHour * 2;
    let currDateObject = new Date(currDate);
    currDate = currDate - currDateObject.getHours() * 60 * 60 * 1000 - currDateObject.getMinutes() * 60 * 1000;
    return currDate;
  } 

  findNextMonday(date) {
    let currDate = date + oneDay;
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

  findNextMondaySkip(date) {
    return this.findNextMonday(date + oneWeek);
  }

  findFirstOfMonth(date) {
    let currDate = date + oneDay;
    let currDateObject = new Date(currDate);
    let currMonthDay = currDateObject.getDate();
    while (currMonthDay !== 1) {
      currDate = currDate + oneDay;
      currDateObject = new Date(currDate);
      currMonthDay = currDateObject.getDate();
    }
    currDate = currDate - currDateObject.getHours() * 60 * 60 * 1000 - currDateObject.getMinutes() * 60 * 1000;
    return currDate;
  }

  findFirstOfMonthSkip(date) {
    return this.findFirstOfMonth(date + oneMonth + oneDay * 5);
  }

  getMonth(month) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[month - 1];
  }

  drawXAxisLabels() {
    let labelDate;
    let labelDateFunction;
    let labelType;
    if (this.unitWidth <= oneWeek * 1.5) {
      labelDateFunction = this.findNextDay;
      labelType = 'date';
    } else if (this.unitWidth <= 1.5 * oneMonth) {
      labelDateFunction = this.findNextMonday;
      labelType = 'date';
    } else if (this.unitWidth <= 2 * oneMonth) {
      labelDateFunction = this.findNextMondaySkip.bind(this);
      labelType = 'date';
    } else if (this.unitWidth <= 6 * oneMonth) {
      labelDateFunction = this.findFirstOfMonth;
      labelType = 'month';
    } else {
      labelDateFunction = this.findFirstOfMonthSkip.bind(this);
      labelType = 'month';
    }
    labelDate = labelDateFunction(this.startDate);
    const c = this.context;
    c.fillStyle = 'grey';
    c.beginPath();
    for (labelDate; labelDate <= this.startDate + this.unitWidth; labelDate = labelDateFunction(labelDate)) {
      const labelDateObject = new Date(labelDate);
      const month = labelDateObject.getMonth() + 1;
      const date = labelDateObject.getDate();
      const labelPosition = this.convertGraphToCanvas(labelDate, this.minY);
      const fontSize = Math.floor(this.width * (1 - BORDER_WIDTH) / 30);
      c.font = `${fontSize}px sans-serif`;
      let text = '';
      if (labelType === 'date') {
        text = `${month}/${date}`;
      } else if (labelType === 'month') {
        text = this.getMonth(month);
      }
      c.fillText(text, labelPosition.x + -1.5 * fontSize, labelPosition.y + fontSize);
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
    this.minOffset = -this.unitWidth * .02;
    if (this.offset === undefined) {
      this.offset = this.minOffset;
    }
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
    } else if (period.type === 'year') {
      return period.amount * 12 * oneMonth;
    }
  }
}