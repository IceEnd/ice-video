import React, { Component, PropTypes } from 'react';
import DanmukuCanvas from '../util/Canvas';

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
    this.dc = new DanmukuCanvas(this.canvas);
    this.dc.draw();
    window.addEventListener('resize', this.onWindowResize);
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    this.dc.stop();
  }

  onWindowResize = () => {
    this.dc.resize(this.canvas);
  }

  insertDanmuku = (danmu) => {
    this.dc.insertDanmuku(danmu);
  }

  render() {
    return (
      <canvas
        className="player-danmuku"
        ref={node => (this.canvas = node)}
      />
    );
  }
}
