import React, { Component, PropTypes } from 'react';

function DanmukuCanvas() {
  this.clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  this.init = (canvas) => {
    this.isSupport = true;
    if (!canvas.getContext) {
      this.isSupport = false;
      console.warn('浏览器不支持canvas，请使用现代浏览器查看图表'); // alert('浏览器不支持canvas，请使用现代浏览器查看图表');
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
    this.colors = ['Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue'];
    this.interval = 20;
    this.danmukuArr = [];
    this.ctx.font = '20px Arial normal';
    this.col = Math.floor(canvas.height / 30);
  };

  this.fixCanvas = (t) => {
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
  };

  this.draw = () => {
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
        const { content, x, y } = arr[i];
        this.ctx.fillStyle = 'white';
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
        this.danmukuArr[i].x = arr[i].x - arr[i].speed;
        if (arr[i].x <= -(arr[i].textWidth)) {
          this.danmukuArr[i].status = false;
        }
      }
      this.ctx.restore();
    }, 30);
  };

  this.addDanmuku = (data) => {
    const newDanmuku = data.map((d) => {
      const textWidth = this.ctx.measureText(d.content).width;
      const distance = textWidth + this.canvasWidth;
      const danmukuData =
      Object.assign(
        {},
        d,
        {
          x: this.canvas.width,
          y: (parseInt(((Math.random() * (this.col - 1)) + 1), 10) * 30),
          textWidth: this.ctx.measureText(d.content).width,
          speed: distance / (5 * 33),
          insert: false,
          status: true,
        },
      );
      return danmukuData;
    });
    this.danmukuArr = this.danmukuArr.concat(newDanmuku);
  };

  this.insertDanmuku = (danmu) => {
    const textWidth = this.ctx.measureText(danmu.content).width;
    const distance = textWidth + this.canvasWidth;
    const data = Object.assign(
      {},
      danmu,
      {
        x: this.canvas.width,
        y: (parseInt(((Math.random() * (this.col - 1)) + 1), 10) * 30),
        textWidth: this.ctx.measureText(danmu.content).width,
        speed: distance / (5 * 33),
        insert: true,
        status: true,
      },
    );
    this.danmukuArr.push(data);
  };

  this.stop = () => {
    clearInterval(this.timer);
    this.timer = null;
  };
}

export default class Danmuku extends Component {
  static displayName = 'IcePlayerDanmuku';

  static propTypes = {
    danmuku: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.string,
      date: PropTypes.string,
      timePoint: PropTypes.number,
    })),
    playerAction: PropTypes.number,
    currentTime: PropTypes.number,
    loading: PropTypes.bool,
  }

  componentDidMount() {
    const dc = new DanmukuCanvas();
    this.dc = dc;
    dc.init(this.canvas);
    this.dc.draw();
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.currentTime !== this.props.currentTime) ||
      (nextProps.playerAction !== this.props.playerAction);
  }

  componentDidUpdate() {
    const { danmuku, playerAction, currentTime, loading } = this.props;
    if (playerAction === 1 && !loading) {
      const data =
        danmuku.filter(d => (d.timePoint >= currentTime && d.timePoint < currentTime + 0.5));
      this.dc.addDanmuku(data);
      this.dc.draw();
    } else if (playerAction === 2 || loading) {
      this.dc.stop();
    }
  }

  insertDanmuku = (danmu) => {
    this.dc.insertDanmuku(danmu);
  }

  render() {
    return (
      <canvas className="player-danmuku" ref={node => (this.canvas = node)} />
    );
  }
}
