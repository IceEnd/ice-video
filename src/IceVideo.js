import React, { Component, PropTypes } from 'react';
import SVG from './component/SVG';
import Video from './component/Video';
import StartLoading from './component/StartLoading';
import Controller from './component/Controller';

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
    controls: PropTypes.bool,
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
      *    2:   设置播放器
      *    3:   完成加载
      *    4:   就绪
      *    5:   播放
      *    6:   暂停
      *    7:   拖放前进
      */
      playerStatus: 0,
      controllerShow: false,
      userActivity: true,
      video: {
        playTimes: 0,             // 播放次数
        duration: 0,              // 时长
        currentTime: 0,           // 当前播放时间(s)
        fullScreen: false,        // 全屏幕
        bufferedLength: 0,        // 缓冲状态
        volume: this.props.volume,
        locationTime: false,      // 是否拖动进度条
        muted: false,             // 是否关闭声音
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

  getCurrentTime = (time) => {
    this.setState({ video: Object.assign(this.state.video, { currentTime: time }) });
  }

  setCurrentTime = (time) => {
    this.setState({
      video: Object.assign(this.state.video, { currentTime: time, locationTime: true }),
    });
  }

  setCurrentTimeComplete = () => {
    this.setState({
      video: Object.assign(this.state.video, { locationTime: false }),
    });
  }

  getBuffered = (length) => {
    this.setState({
      video: Object.assign(this.state.video, { bufferedLength: length }),
    });
  }

  handleOnLoadStart = () => {
    if (this.state.video.playTimes === 0) {
      this.setState({
        playerStatus: 0,
      });
    } else {
      this.setState({
        video: Object.assign(this.state.video, { palyTimes: this.state.video.playTimes + 1 }),
      });
    }
  }

  handleOnLoadedMetadata = (time) => {
    if (this.state.video.playTimes === 0) {
      this.setState({
        video: Object.assign({}, this.state.video, { duration: time }),
      });
    }
  }

  handleOnLoadedData = () => {
    if (this.state.video.playTimes === 0) {
      this.setState({ playerLoadingStatus: Object.assign({}, this.state.playerLoadingStatus,
        { video: 1 }) });
    }
  }

  handleOnCanPaly = () => {
    if (this.state.video.playTimes === 0) {
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
    }
  }

  handleOnError = (error) => {
    this.setState({
      playerStatus: -1,
      playerLoadingStatus: Object.assign({}, this.state.playerTips, { vide: 2 }),
      message: error,
    });
  }

  handleControlSucess = () => {
    this.setState({
      playerStatus: 3,
      playerLoadingStatus: Object.assign({}, this.state.playerLoadingStatus,
        { video: 1, barrage: 2, controller: 1 }),
    });
    setTimeout(() => {
      if (this.state.video.playTimes > 0) {
        this.setState({ playerStatus: 5 });
      } else {
        this.setState({ playerStatus: 4 });
      }
      this.setState({
        showLoading: false,
      });
    }, 500);
  }

  handlePlay = (start) => {
    if (start) {
      this.setState({
        video: Object.assign(this.state.video, { playTimes: 1 }),
        playerStatus: 5,
        controllerShow: true,
      });
    } else {
      this.setState({ playerStatus: 5 });
    }
  }

  handlePause = () => {
    this.setState({
      playerStatus: 6,
      video: Object.assign(this.state.video, { playTimes: 1 }),
    });
  }

  handleOnMouseMove = () => {
    this.startControlsTimer();
  }

  startControlsTimer = () => {
    this.setState({
      userActivity: true,
    });
    clearTimeout(this.controlsHideTimer);
    this.controlsHideTimer = setTimeout(() => {
      this.setState({
        userActivity: false,
      });
    }, 3000);
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
    const svgHtml = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#play_icon" />';
    return (
      <button className="play-button" onClick={() => this.handlePlay(true)} >
        <svg className="play-svg" version="1.1" fill="white" dangerouslySetInnerHTML={{ __html: svgHtml }} />
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
      playerStatus: this.state.playerStatus,
      palyTimes: this.state.video.playTimes,
      bufferedLength: this.state.video.bufferedLength,
      timing: this.state.video.currentTime,
      locationTime: this.state.video.locationTime,
    };
    const videoFunc = {
      handleOnLoadStart: this.handleOnLoadStart,
      handleOnLoadedMetadata: this.handleOnLoadedMetadata,
      handleOnLoadedData: this.handleOnLoadedData,
      handleOnCanPaly: this.handleOnCanPaly,
      handleOnError: this.handleOnError,
      getCurrentTime: this.getCurrentTime,
      getBuffered: this.getBuffered,
      setCurrentTimeComplete: this.setCurrentTimeComplete,
    };
    const controllerFunc = {
      handlePause: this.handlePause,
      handlePlay: this.handlePlay,
      startControlsTimer: this.startControlsTimer,
      handleProcess: this.handleProcess,
      handleStopProcess: this.handleStopProcess,
      handleControlSucess: this.handleControlSucess,
      setCurrentTime: this.setCurrentTime,
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
        <Controller
          video={this.state.video}
          volume={this.state.volume}
          controls={this.props.controls}
          playerStatus={this.state.playerStatus}
          show={this.state.controllerShow}
          {...controllerFunc}
        />
      </div>
    );
  }

  render() {
    const styles = this.getStyle();
    return (
      <div
        className={`ice-player-container ${this.state.userActivity ? 'player-user-activity' : 'player-user-inactivity'}`}
        width={styles.width}
        onMouseMove={this.handleOnMouseMove}
      >
        <SVG />
        {this.renderPalyer(styles)}
        <div>Bar</div>
      </div>
    );
  }
}
