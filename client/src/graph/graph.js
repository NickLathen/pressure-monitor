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
  }

  transformFromCanvas(x, y) {
    return {
      x: x,
      y: this.height - y
    };
  }

  transformToCanvas(x, y) {
    return {
      x: x,
      y: Math.abs(y - this.height)
    };
  }


  drawLine(x1, y1, x2, y2, styles) {
    const c = this.context;
    styles ? this.applyStyles(styles) : null;
    const start = this.transformToCanvas(x1, y1);
    const end = this.transformToCanvas(x2, y2);
    c.beginPath();
    c.moveTo(start.x, start.y);
    c.lineTo(end.x, end.y);
    c.stroke();    
  }
  
  applyStyles(styles) {
    
  }
}