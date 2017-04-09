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
    this.col = Math.floor(canvas.height / 20);
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
      for (let i = 0; i < arr.length; i += 1) {
        const { content, x, y } = arr[i];
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(content, x, y);
        this.danmukuArr[i].x = arr[i].x - arr[i].speed;
        if (arr[i].x <= -(arr[i].end)) {
          this.danmukuArr.splice(i, 1);
        }
      }
      this.ctx.restore();
    }, 25);
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
          y: parseInt((Math.random() * (this.canvasHeight - 30)) + 25, 10),
          end: this.ctx.measureText(d.content).width,
          speed: distance / (4 * 40),
        },
      );
      return danmukuData;
    });
    this.danmukuArr = this.danmukuArr.concat(newDanmuku);
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

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  componentDidMount() {
    const dc = new DanmukuCanvas();
    this.dc = dc;
    dc.init(this.canvas);
    this.dc.draw();
  }

  componentDidUpdate() {
    const { danmuku, playerAction, currentTime, loading } = this.props;
    if (playerAction === 1 && this.state.time !== currentTime && !loading) {
      const data =
        danmuku.filter(d => (d.timePoint >= currentTime && d.timePoint < currentTime + 0.2));
      this.dc.addDanmuku(data);
      this.dc.draw();
      this.updateTime(currentTime);
    } else if (playerAction === 2 || loading) {
      this.dc.stop();
    }
  }

  updateTime = (currentTime) => {
    this.setState({
      time: currentTime,
    });
  }

  render() {
    return (
      <canvas className="player-danmuku" ref={node => (this.canvas = node)} />
    );
  }
}
