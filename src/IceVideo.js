import React, { Component, PropTypes } from 'react';
import SVG from './component/SVG';
import Video from './component/Video';
import Start from './component/Start';
import Controller from './component/Controller';

export default class IcePlayer extends Component {
  static displayName = 'IceVideo';

  static propTypes = {
    children: PropTypes.any,

    width: PropTypes.number,
    height: PropTypes.number,

    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
    volume: PropTypes.number,
    poster: PropTypes.string,

    // getdanmukuUrl: PropTypes.string.isRequired,
    // postdanmukuUrl: PropTypes.string.isRequired,
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
      showStart: true,
      startStatus: {
        video: 0,    // 0 未开始 1 正在加载 2 完成  3 失败
        danmuku: 0,
        controller: 0,
      },
      /**
      *    -1:  加载失败
      *    0:   加载中
      *    1:   加载完成
      *    2:   运行中
      *    3:   运行完毕
      */
      playerStatus: 0,
      playerAction: 0,       // 0: 等待  1: 播放 2: 暂停  3: 拖放前进 4: 播放完毕
      volumeAction: 0,       // 0: 无指令 1: 调整 2: 静音/取消静音
      loopAction: 0,         // 0: 无指令 1: 调整
      controllerShow: false,
      userActivity: true,
      loading: false,
      video: {
        playTimes: 0,             // 播放次数
        duration: 0,              // 时长
        currentTime: 0,           // 当前播放时间(s)
        fullScreen: false,        // 全屏幕
        bufferedTime: 0,        // 缓冲状态
        volume: this.props.volume,
        muted: false,             // 是否关闭声音
        loop: this.props.loop,  // 是否洗脑循环
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
      playerAction: 3,
      video: Object.assign(this.state.video, { currentTime: time }),
    });
  }

  setCurrentTimeComplete = () => {
    this.setState({
      playerAction: 1,
      video: Object.assign(this.state.video, { locationTime: false }),
    });
  }

  setVolume = (num) => {
    this.setState({
      volumeAction: 1,
      video: Object.assign(this.state.video, { volume: num / 100 }),
    });
  }

  setMuted = (noOff) => {
    this.setState({
      volumeAction: 2,
      video: Object.assign(this.state.video, { muted: noOff }),
    });
  }

  setVolumeComplete = () => {
    this.setState({ volumeAction: 0 });
  }

  setLoop = (noOff) => {
    this.setState({
      loopAction: 1,
      video: Object.assign(this.state.video, { loop: noOff }),
    });
  }

  setLoopComplete = () => {
    this.setState({ loopAction: 0 });
  }

  getBuffered = (time) => {
    this.setState({
      video: Object.assign(this.state.video, { bufferedTime: time }),
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
        video: Object.assign(this.state.video, { duration: time }),
      });
    }
  }

  handleOnLoadedData = () => {
    if (this.state.video.playTimes === 0) {
      this.setState({ startStatus: Object.assign(this.state.startStatus, { video: 1 }) });
    }
  }

  handleOnCanPaly = () => {
    if (this.state.video.playTimes === 0) {
      this.setState({
        startStatus: Object.assign(this.state.startStatus, { video: 2, danmuku: 1 }),
      });
      setTimeout(() => {
        this.setState({
          startStatus: Object.assign(this.state.startStatus, { danmuku: 2, controller: 1 }),
        });
      }, 500);
      setTimeout(() => {
        this.setState({
          startStatus: Object.assign(this.state.startStatus, { controller: 2 }),
        });
      }, 1000);
      setTimeout(() => {
        this.setState({
          playerStatus: this.state.startStatus.video === 2 ? 1 : -1,
          showStart: false,
        });
      }, 1500);
    }
  }

  handleOnError = (error) => {
    this.setState({
      playerStatus: -1,
      startStatus: Object.assign({}, this.state.playerTips, { video: 3 }),
      message: error,
    });
  }

  handleOnWaiting = () => {
    this.setState({
      loading: true,
    });
  }

  handleOnEneded =() => {
    this.setState({
      playerStatus: 3,
      playerAction: 2,
    });
  }

  handleControlSucess = () => {
  }

  handlePlay = (start) => {
    const { video } = this.state;
    if (start) {
      this.setState({
        video: Object.assign(video, { playTimes: 1 }),
        playerStatus: 2,
        playerAction: 1,
        controllerShow: true,
      });
    } else {
      this.setState({ playerAction: 1 });
    }
  }

  handlePause = () => {
    this.setState({ playerAction: 2 });
  }

  handleOnMouseMove = () => {
    this.startControlsTimer();
  }

  showControls = () => {
    clearTimeout(this.controlsHideTimer);
    this.setState({
      userActivity: true,
    });
  }

  hideControls = () => {
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

  renderStart = () => {
    const { showStart, startStatus } = this.state;
    return (
      <Start
        showStart={showStart}
        startStatus={startStatus}
      />
    );
  }

  renderPlay = () => {
    const { playerStatus } = this.state;
    if (playerStatus !== 1) {
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
      volume: this.state.video.volume,
      poster: this.props.poster,
      playerAction: this.state.playerAction,
      volumeAction: this.state.volumeAction,
      loopAction: this.state.loopAction,
      palyTimes: this.state.video.playTimes,
      timing: this.state.video.currentTime,
      loading: this.state.loading,
      video: this.state.video,
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
      handleOnWaiting: this.handleOnWaiting,
      setVolumeComplete: this.setVolumeComplete,
      setLoopComplete: this.setLoopComplete,
      handleOnEneded: this.handleOnEneded,
    };
    const controllerFunc = {
      handlePause: this.handlePause,
      handlePlay: this.handlePlay,
      startControlsTimer: this.startControlsTimer,
      handleProcess: this.handleProcess,
      handleStopProcess: this.handleStopProcess,
      handleControlSucess: this.handleControlSucess,
      setCurrentTime: this.setCurrentTime,
      showControls: this.showControls,
      hideControls: this.hideControls,
      setVolume: this.setVolume,
      setMuted: this.setMuted,
      setLoop: this.setLoop,
    };
    return (
      <div
        className="player-container video-react-container"
        style={{ paddingTop: styles.paddingTop }}
      >
        {this.renderStart()}
        {this.renderPlay()}
        <div style={{ display: `${this.state.playerStatus === -1 ? 'block' : 'none'}` }}>Error</div>
        <Video
          key="video"
          {...video}
          {...videoFunc}
        >
          {this.props.children}
        </Video>
        <div>dammuku</div>
        <Controller
          video={this.state.video}
          volume={this.state.volume}
          controls={this.props.controls}
          playerAction={this.state.playerAction}
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
      </div>
    );
  }
}
