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
    poster: PropTypes.string,

    // getBarrageUrl: PropTypes.string.isRequired,
    // postBarrageUrl: PropTypes.string.isRequired,
    // controls: PropTypes.bool,
    scale: PropTypes.string,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    poster: '',
    loop: false,
    volume: 0.8,
    controls: true,
    scale: '16:9',
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      playerTips: {
        videoTip: '',
        barrageTip: '',
        controlTip: '',
      },
      playerStatus: 0,
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

  handleOnLoadStart = () => {
    this.setState({
      playerStatus: 0,
    });
  }

  handleOnLoadedMetadata = (time) => {
    this.setState({
      duration: time,
    });
  }

  handleOnLoadedData = () => {
    this.setState({ playerTips: Object.assign({}, this.state.playerTips, { videoTip: '[完成]' }) });
  }

  handleOnCanPaly = () => {
    this.setState({
      playerStatus: 1,
    });
    setTimeout(() => {
      this.setState({
        playerStatus: 2,
        playerTips: Object.assign({}, this.state.playerTips, { videoTip: '[完成]', barrageTip: '[失败]' }),
      });
    }, 500);
    setTimeout(() => {
      this.setState({
        playerStatus: 3,
        playerTips: Object.assign({}, this.state.playerTips, { videoTip: '[完成]', barrageTip: '[失败]', controlTip: '[成功]' }),
      });
    }, 1000);
    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 1500);
  }

  handleOnError = (error) => {
    this.setState({
      playerStatus: 4,
      playerTips: Object.assign({}, this.state.playerTips, { videoTip: '[失败]' }),
      message: error,
    });
  }

  renderLoading = () => {
    const { showLoading, playerStatus, playerTips } = this.state;
    return (
      <Loading showLoading={showLoading} playerStatus={playerStatus} playerTips={playerTips} />
    );
  }

  renderPalyer = (styles) => {
    const video = {
      loop: this.props.loop,
      autoPlay: this.props.autoPlay,
      preload: this.props.preload,
      volume: this.props.volume,
      poster: this.props.poster,
    };
    const videoFunc = {
      handleOnLoadStart: this.handleOnLoadStart,
      handleOnLoadedMetadata: this.handleOnLoadedMetadata,
      handleOnLoadedData: this.handleOnLoadedData,
      handleOnCanPaly: this.handleOnCanPaly,
      handleOnError: this.handleOnError,
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
