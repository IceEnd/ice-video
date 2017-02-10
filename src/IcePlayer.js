import React, { Component, PropTypes } from 'react';
import Video from './component/Video';
import StartLoading from './component/StartLoading';
import Controller from './component/Controller';

import loadingStart from './assets/images/icon/play-icon-white.svg';

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
      playerLoadingStatus: {
        video: 0,    // 0 未开始 1 完成  2 失败
        barrage: 0,
        controller: 0,
      },
      /**
      *    -1:  加载失败
      *    0:   加载视屏
      *    1:   加载弹幕
      *    2:   设置控制台
      *    3:   完成加载
      *    4:   就绪
      *    5:   启动运行
      */
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
    this.setState({ playerLoadingStatus: Object.assign({}, this.state.playerLoadingStatus,
      { video: 1 }) });
  }

  handleOnCanPaly = () => {
    this.setState({
      playerStatus: 1,
    });
    setTimeout(() => {
      this.setState({
        playerStatus: 2,
        playerLoadingStatus: Object.assign({}, this.state.playerLoadingStatus,
          { video: 1, barrage: 2 }),
      });
    }, 500);
    setTimeout(() => {
      this.setState({
        playerStatus: 3,
        playerLoadingStatus: Object.assign({}, this.state.playerLoadingStatus,
          { video: 1, barrage: 2, controller: 1 }),
      });
    }, 1000);
    setTimeout(() => {
      this.setState({
        showLoading: false,
        playerStatus: 4,
      });
    }, 1500);
  }

  handleOnError = (error) => {
    this.setState({
      playerStatus: 4,
      playerLoadingStatus: Object.assign({}, this.state.playerTips, { vide: 2 }),
      message: error,
    });
  }

  renderStartLoading = () => {
    const { showLoading, playerStatus, playerLoadingStatus } = this.state;
    return (
      <StartLoading
        showLoading={showLoading}
        playerStatus={playerStatus}
        playerLoadingStatus={playerLoadingStatus}
      />
    );
  }

  renderPlay = () => {
    const { playerStatus } = this.state;
    if (playerStatus !== 4) {
      return null;
    }
    return (
      <button className="play-button">
        <img alt="播放" src={loadingStart} />
      </button>
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
        {this.renderStartLoading()}
        {this.renderPlay()}
        <div style={{ display: 'none' }}>Shortcut</div>
        <Video
          key="video"
          {...video}
          {...videoFunc}
        >
          {this.props.children}
        </Video>
        <div>dammu</div>
        <Controller />
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
