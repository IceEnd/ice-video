export default class DanmukuCanvas {
  constructor(canvas) {
    this.isSupport = true;
    if (!canvas.getContext) {
      this.isSupport = false;
      console.warn('浏览器不支持canvas');
      return;
    }
    const container = canvas.parentNode;
    if (!this.canvasWidth) {                // 父容器大小
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.canvasWidth = w;
      this.canvasHeight = h;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w;
      canvas.style.height = h;
    }
    const ctx = canvas.getContext('2d');
    this.fixCanvas(canvas);
    this.ctx = ctx;
    this.canvas = canvas;
    this.clearCanvas();
    this.danmukuArr = [];
    this.col = Math.floor(canvas.height / 30);
  }

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  fixCanvas = (t) => {
    const i = t.getContext('2d');
    const n = window.devicePixelRatio || 1;
    const e = i.webkitBackingStorePixelRatio || i.mozBackingStorePixelRatio ||
          i.msBackingStorePixelRatio || i.oBackingStorePixelRatio || i.backingStorePixelRatio || 1;
    const a = n / e;
    if (n !== e) {
      const o = t.width;
      const r = t.height;
      t.width = o * a;
      t.height = r * a;
      t.style.width = `${o}px`;
      t.style.height = `${r}px`;
      i.scale(a, a);
    }
  }

  resize = (canvas) => {
    const container = canvas.parentNode;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.canvasWidth = w;
    this.canvasHeight = h;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w;
    canvas.style.height = h;
    this.fixCanvas(canvas);
    this.col = Math.floor(canvas.height / 30);
  }

  getFont = (size) => {
    let ratio;
    switch (size) {
      case 'small':
        ratio = '14';
        break;
      case 'middle':
        ratio = '20';
        break;
      case 'large':
        ratio = '26';
        break;
      default:
        ratio = '20';
        break;
    }
    return `${ratio}px Arial normal`;
  }

  draw = () => {
    if (!this.isSupport) {
      return;
    }
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => {
      this.clearCanvas();
      this.ctx.save();
      const arr = this.danmukuArr;
      for (let i = 0, len = arr.length; i < len; i += 1) {
        if (arr[i].status) {
          const { content, x, y } = arr[i];
          this.ctx.fillStyle = arr[i].fontColor;
          this.ctx.font = this.getFont(arr[i].fontSize);
          this.ctx.fillText(content, x, y);
          if (arr[i].insert) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineCap = 'square';
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + 3);
            this.ctx.lineTo(x + arr[i].textWidth, y + 3);
            this.ctx.stroke();
            this.ctx.closePath();
          }
          switch (arr[i].model) {
            case 'roll':
              this.danmukuArr[i].x = arr[i].x - arr[i].speed;
              if (arr[i].x <= -(arr[i].textWidth)) {
                this.danmukuArr[i].status = false;
              }
              break;
            case 'top':
            case 'bottom':
              this.danmukuArr[i].current = this.danmukuArr[i].current + 30;
              if (arr[i].current >= 5000) {
                this.danmukuArr[i].status = false;
              }
              break;
            default:
              this.danmukuArr[i].x = arr[i].x - arr[i].speed;
              if (arr[i].x <= -(arr[i].textWidth)) {
                this.danmukuArr[i].status = false;
              }
              break;
          }
        }
      }
      this.ctx.restore();
    }, 30);
  }

  formatData = (data, insertFlag) => {
    let positionX;
    let positionY;
    const randomCol = parseInt(((Math.random() * (this.col - 1)) + 1), 10);
    this.ctx.font = this.getFont(data.fontSize);
    const tw = this.ctx.measureText(data.content).width;
    const distance = tw + this.canvasWidth;
    switch (data.model) {
      case 'roll':
        positionX = this.canvas.width;
        positionY = randomCol * 30;
        break;
      case 'top':
        positionX = (this.canvas.width / 2) - (tw / 2);
        positionY = randomCol * 20;
        break;
      case 'bottom':
        positionX = (this.canvas.width / 2) - (tw / 2);
        positionY = (this.col * 30) - (randomCol * 10);
        break;
      default:
        positionX = this.canvas.width;
        positionY = (parseInt(((Math.random() * (this.col - 1)) + 1), 10) * 30);
        break;
    }
    const danmukuData =
    Object.assign(
      {},
      data,
      {
        x: positionX,
        y: positionY,
        textWidth: tw,
        speed: distance / (5 * 33),
        insert: insertFlag,
        current: 0,
        status: true,
      },
    );
    return danmukuData;
  };

  addDanmuku = (data) => {
    const newDanmuku = data.map((d) => {
      const danmukuData = this.formatData(d, false);
      return danmukuData;
    });
    this.danmukuArr = this.danmukuArr.concat(newDanmuku);
  }

  insertDanmuku = (danmu) => {
    const data = this.formatData(danmu, true);
    this.danmukuArr.push(data);
  }

  stop = () => {
    clearInterval(this.timer);
    this.timer = null;
  }
}
