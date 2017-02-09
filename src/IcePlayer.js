import React, { Component, PropTypes } from 'react';
import Video from './component/Video';
import Loading from './component/Loading';

import './assets/sass/player.scss';

export default class IcePlayer extends Component {
  static displayName = 'IcePlayer';

  static propTypes = {
    children: PropTypes.any,

    width: PropTypes.number,
    height: PropTypes.number,

    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
    volume: PropTypes.number,

    getBarrageUrl: PropTypes.string.isRequired,
    postBarrageUrl: PropTypes.string.isRequired,
    controls: PropTypes.bool,
    scale: PropTypes.string,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    loop: false,
    volume: 0.8,
    controls: true,
    scale: '16:9',
    playerStatus: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: {
        showLoading: true,
        playerStatus: 0,
      },
    };
  }

  getStyle = () => {
    const styles = {};
    if (this.props.width && this.props.height) {
      styles.width = this.props.width;
      styles.paddingTop = this.props.height;
    } else {
      styles.width = '100%';
      switch (this.props.scale) {
        case '1:1':
          styles.paddingTop = '100%';
          break;
        case '4:3':
          styles.paddingTop = '75%';
          break;
        case '16:9':
        default:
          styles.paddingTop = '56.25%';
          break;
      }
    }
    return styles;
  }

  handleOnCanPaly = (time) => {
    this.setState({ duration: time });
  }

  renderLoading = () => {
    const { showLoading, playerStatus } = this.state;
    return (
      <Loading showLoading={showLoading} playerStatus={playerStatus} />
    );
  }

  renderPalyer = (styles) => {
    const video = {
      loop: this.props.loop,
      autoPlay: this.props.autoPlay,
      preload: this.props.preload,
      volume: this.props.volume,
    };
    const videoFunc = {
      handleOnCanPaly: this.handleOnCanPaly,
    };
    return (
      <div
        className="player-container video-react-container"
        style={{ paddingTop: styles.paddingTop }}
      >
        {this.renderLoading()}
        <div style={{ display: 'none' }}>Shortcut</div>
        <Video
          key="video"
          {...video}
          {...videoFunc}
        >
          {this.props.children}
        </Video>
        <div>dammu</div>
        <div>controls</div>
      </div>
    );
  }

  render() {
    const styles = this.getStyle();
    return (
      <div
        className="ice-player-container"
        width={styles.width}
      >
        {this.renderPalyer(styles)}
        <div>Bar</div>
      </div>
    );
  }
}
