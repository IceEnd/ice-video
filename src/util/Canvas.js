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
    this.colTop = parseInt((this.col * 2) / 3, 10);
    this.cols = new Array(this.col).fill(true);
    this.topCols = new Array(this.col).fill(true);
    this.bottomCols = new Array(this.col).fill(true);
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
    this.colTop = parseInt((this.col * 2) / 3, 10);
    this.cols = new Array(this.col).fill(true);
    this.topCols = new Array(this.col).fill(true);
    this.bottomCols = new Array(this.col).fill(true);
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
              if (arr[i].x + arr[i].textWidth < this.canvasWidth - 33 && arr[i].status) {
                this.cols[arr[i].col - 1] = true;
              }
              break;
            case 'top':
              this.danmukuArr[i].current = this.danmukuArr[i].current + 30;
              if (arr[i].current >= 6000) {
                this.danmukuArr[i].status = false;
                this.topCols[arr[i].col - 1] = true;
              }
              break;
            case 'bottom':
              this.danmukuArr[i].current = this.danmukuArr[i].current + 30;
              if (arr[i].current >= 6000) {
                this.danmukuArr[i].status = false;
                this.bottomCols[this.bottomCols.length - arr[i].col] = true;
              }
              break;
            default:
              this.danmukuArr[i].x = arr[i].x - arr[i].speed;
              if (arr[i].x <= -(arr[i].textWidth)) {
                this.danmukuArr[i].status = false;
              }
              if (arr[i].x + arr[i].textWidth < this.canvasWidth - 33 && arr[i].status) {
                this.cols[arr[i].col - 1] = true;
              }
              break;
          }
        }
      }
      this.ctx.restore();
      this.refreshDanmuku();
    }, 30);
  }

  refreshDanmuku = () => {
    for (let i = 0; i < this.danmukuArr.length; i += 1) {
      if (!this.danmukuArr[i].status) {
        this.danmukuArr.splice(i, 1);
      }
    }
  }

  formatData = (data, insertFlag) => {
    let positionX;
    let randomCol;
    const cols = this.cols;
    const topCols = this.topCols;
    const bottomCols = this.bottomCols;
    this.ctx.font = this.getFont(data.fontSize);
    const tw = this.ctx.measureText(data.content).width;
    const distance = tw + this.canvasWidth;
    if (data.model === 'roll') {
      for (let i = 0; i < cols.length; i += 1) {
        if (cols[i]) {
          randomCol = i + 1;
          this.cols[i] = false;
          break;
        }
        if (i === cols.length - 1) {
          const random = parseInt(((Math.random() * (this.col - 1)) + 1), 10);
          randomCol = random;
          this.cols[random - 1] = false;
        }
      }
      positionX = this.canvas.width;
    } else if (data.model === 'top') {
      for (let i = 0; i < topCols.length; i += 1) {
        if (topCols[i]) {
          randomCol = i + 1;
          this.topCols[i] = false;
          break;
        }
        if (i === topCols.length - 1) {
          const random = parseInt(((Math.random() * (this.col - 1)) + 1), 10);
          randomCol = random;
          this.topCols[random - 1] = false;
        }
      }
      positionX = (this.canvas.width / 2) - (tw / 2);
    } else if (data.model === 'bottom') {
      const len = bottomCols.length;
      for (let i = 0; i < len; i += 1) {
        if (bottomCols[i]) {
          randomCol = len - i;
          this.bottomCols[i] = false;
          break;
        }
        if (i === topCols.length - 1) {
          const random = parseInt(((Math.random() * (this.col - 1)) + 1), 10);
          randomCol = random;
          this.bottomCols[random - 1] = false;
        }
      }
      positionX = (this.canvas.width / 2) - (tw / 2);
    }
    const danmukuData =
    Object.assign(
      {},
      data,
      {
        x: positionX,
        y: randomCol * 30,
        textWidth: tw,
        speed: distance / (6 * 33),
        insert: insertFlag,
        current: 0,
        status: true,
        col: randomCol,
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
