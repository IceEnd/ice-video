import React, { Component, PropTypes } from 'react';

function DanmukuCanvas() {
  this.px = (number) => {
    const px2 = window.lib.flexible.rem2px(number / 75);
    return px2;
  };

  this.clearCanvas = () => {
    this.g.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
    const g = canvas.getContext('2d');
    this.fixCanvas(canvas);
    this.g = g;
    this.clearCanvas();
    this.colors = ['Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue'];
    this.interval = 20;
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

  // this.draw = (danmukuData) => {
  //   if (!this.isSupport) {
  //     return;
  //   }
  // };
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
  }

  componentDidMount() {
    const dc = new DanmukuCanvas();
    dc.init(this.canvas);
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <canvas className="player-danmuku" ref={node => (this.canvas = node)} />
    );
  }
}
