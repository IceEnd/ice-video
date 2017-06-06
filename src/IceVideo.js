import 'isomorphic-fetch';
import React, { Component, PropTypes } from 'react';
import SVG from './component/SVG';
import Video from './component/Video';
import Start from './component/Start';
import Controller from './component/controller/Controller';
import Danmuku from './component/Danmuku';
import fScreen from './util/fullScreen';

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
    duration: PropTypes.number,

    getDanmukuUrl: PropTypes.string.isRequired,
    sendDanmukuUrl: PropTypes.string.isRequired,
    controls: PropTypes.bool,
    scale: PropTypes.string,
    src: PropTypes.string.isRequired,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    poster: '',
    loop: false,
    volume: 0.8,
    controls: true,
    scale: '16:9',
    duration: 6000,
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
      playerStatus: 0,       // -1:  加载失败 0: 加载中 1: 加载完成 2: 运行中 3: 播放完毕
      playerAction: 0,       // 0: 等待  1: 播放 2: 暂停  3: 拖放前进 4: 播放完毕
      controllerShow: false,
      userActivity: true,
      cursorShow: true,
      loading: false,
      danmuku: [],
      fullScreen: false,        // 全屏幕
      video: {
        playTimes: 0,             // 播放次数
        duration: 0,              // 时长
        currentTime: 0,           // 当前播放时间(s)
        bufferedTime: 0,        // 缓冲状态
        volume: this.props.volume,
        muted: false,             // 是否关闭声音
        loop: this.props.loop,  // 是否洗脑循环
      },
      danmukuConfig: {
        fontColor: 'white',
        fontSize: 'middle',
        model: 'roll',
      },
      playerConfig: {
        opacity: 1,
        scale: 'normal',
        onOff: true,
      },
    };
  }

  componentDidMount() {
    this.video.setVolume(this.props.volume);
    fScreen.addEventListener(this.fullScreenChange);
    this.startBufferedTimer();
  }

  componentWillUnmount() {
    this.clearAllTimer();
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

  getCurrentTime = (time) => {        // 获取播放时间
    this.setState({ video: Object.assign(this.state.video, { currentTime: time }) });
  }

  setCurrentTime = (time) => {       // 当前时间计时器
    this.setState({
      playerAction: 3,
      video: Object.assign(this.state.video, { currentTime: time }),
    });
    this.video.setCurrentTime(time);
    this.setState({
      playerAction: 1,
    });
  }

  setVolume = (num) => {    // 设置音量
    this.setState({
      video: Object.assign(this.state.video, { volume: num }),
    });
    this.video.setVolume(num);
  }

  setMuted = (noOff) => {   // 设置静音
    this.setState({
      video: Object.assign(this.state.video, { muted: noOff }),
    });
    this.video.setMuted(noOff);
  }

  setLoop = (noOff) => {    // 设置循环
    this.setState({
      video: Object.assign(this.state.video, { loop: noOff }),
    });
    this.video.setLoop(noOff);
  }

  setDanmukuConfig = (config) => {
    this.setState({
      danmukuConfig: Object.assign(this.state.danmukuConfig, config),
    });
  }

  setPlayerConfig = (config) => {
    this.setState({
      playerConfig: Object.assign(this.state.playerConfig, config),
    });
  }

  getBuffered = () => {   // 获取缓冲时长
    this.setState({
      video: Object.assign(this.state.video, { bufferedTime: this.video.getBufferedEnd() }),
    });
  }

  handleOnLoadStart = () => {
    if (this.state.video.playTimes === 0) {
      this.setState({
        playerStatus: 0,
        startStatus: Object.assign(this.state.startStatus, { video: 1 }),
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
        loading: false,
      });
      this.fetchDanmuku();
    }
    this.setState({
      loading: false,
    });
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

  handleOnPlay = (start) => {
    const { video } = this.state;
    if (start) {
      this.setState({
        video: Object.assign(video, { playTimes: 1 }),
        playerStatus: 2,
        playerAction: 1,
        controllerShow: true,
        loading: false,
      });
    } else {
      this.setState({ playerAction: 1, loading: false });
    }
    this.video.play();
    this.startCurrentTimer();
  }

  handleOnPause = () => {
    this.setState({ playerAction: 2 });
    this.video.pause();
    this.clearCurrentTimer();
  }

  handleOnMouseMove = () => {
    this.startControlsTimer();
  }

  fullScreenChange = () => {
    if (fScreen.isFullscreen()) {
      this.setState({ fullScreen: true });
    } else {
      this.setState({ fullScreen: false });
      this.danmuku.onWindowResize();
    }
  }

  handleOnFullScreen = () => {
    if (fScreen.isFullscreen()) {
      fScreen.exit();
    } else {
      fScreen.request(this.player);
    }
  }

  fetchDanmuku = () => {
    fetch(this.props.getDanmukuUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (!response.ok) {
        return Promise.reject({
          retCode: -1,
          retMsg: '弹幕加载失败',
        });
      }
      return response.json();
    }).then((res) => {
      if (res.retCode === 0) {
        this.setState({
          startStatus: Object.assign(this.state.startStatus, { danmuku: 2, controller: 1 }),
          danmuku: res.retData.danmuku,
        });
      } else {
        this.setState({
          startStatus: Object.assign(this.state.startStatus, { danmuku: 3, controller: 1 }),
        });
      }
      this.loadDanmuku();
    }).catch((error) => {
      console.error(error);
      this.setState({
        startStatus: Object.assign(this.state.startStatus, { danmuku: 3, controller: 1 }),
      });
      this.loadDanmuku();
    });
  }

  sendDanmu = (msg) => {
    const danmu = Object.assign(
      {},
      {
        content: msg,
        date: new Date(),
        timePoint: this.state.video.currentTime,
      },
      { ...this.state.danmukuConfig },
    );
    fetch(this.props.sendDanmukuUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(danmu),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject({
            retCode: -1,
            retMsg: '弹幕发送失败',
          });
        }
        return response.json();
      })
      .then((res) => {
        if (res.retCode === 0) {
          this.danmuku.insertDanmuku(danmu);
        } else {
          console.warn(res.retMsg);
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  loadDanmuku = () => {
    this.controlsSetStateTimer = setTimeout(() => {
      this.setState({
        startStatus: Object.assign(this.state.startStatus, { controller: 2 }),
      });
    }, 500);
    this.videoSetStateTimer = setTimeout(() => {
      this.setState({
        playerStatus: this.state.startStatus.video === 2 ? 1 : -1,
        showStart: false,
      });
    }, 1000);
    if (this.props.autoPlay && this.state.startStatus.video === 2) {
      this.autoPlayTimer = setTimeout(() => {
        this.playIcon.click();
        this.startControlsTimer();
      }, 1200);
    }
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
      cursorShow: true,
    });
    clearTimeout(this.controlsHideTimer);
    this.controlsHideTimer = setTimeout(() => {
      let cursor = true;
      if (fScreen.isFullscreen()) {
        cursor = false;
      }
      this.setState({
        userActivity: false,
        cursorShow: cursor,
      });
    }, 3000);
  }

  clearControlsTimer = () => {
    clearTimeout(this.controlsHideTimer);
    this.controlsHideTimer = null;
  }

  clearAllTimer = () => {
    clearTimeout(this.controlsSetStateTimer);
    this.controlsSetStateTimer = null;
    clearTimeout(this.videoSetStateTimer);
    this.videoSetStateTimer = null;
    clearTimeout(this.autoPlayTimer);
    this.autoPlayTimer = null;
    this.clearBufferedTimer();
    this.clearCurrentTimer();
    this.clearControlsTimer();
  }

  startBufferedTimer = () => {    // 缓冲时长计时器
    if (this.bufferedTimer) {
      return;
    }
    this.bufferedTimer = setInterval(() => {
      const buffered = this.video.getBuffered();
      this.setState({
        video: Object.assign(this.state.video, { bufferedTime: buffered }),
      });
      if (buffered >= this.state.video.duration) {
        this.clearBufferedTimer();
      }
    }, 1000);
  }

  clearBufferedTimer = () => {    // 清除缓冲时长计时器
    clearInterval(this.bufferedTimer);
    this.bufferedTimer = null;
  }

  startCurrentTimer = () => {   // 当前播放时间计时器
    if (this.currentTimer) {
      return;
    }
    this.currentTimer = setInterval(() => {
      this.setState({
        video: Object.assign(this.state.video, { currentTime: this.video.getCurrentTime() }),
      });
    }, 1000);
  }

  clearCurrentTimer = () => {   // 清除播放时间计时器
    clearInterval(this.currentTimer);
    this.currentTimer = null;
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
      <button className="play-button" onClick={() => this.handleOnPlay(true)} ref={node => (this.playIcon = node)}>
        <svg className="play-svg" version="1.1" fill="white" dangerouslySetInnerHTML={{ __html: svgHtml }} />
      </button>
    );
  }

  renderPalyer = (styles) => {
    const video = {
      loop: this.props.loop,
      autoPlay: this.props.autoPlay,
      preload: this.props.preload,
      poster: this.props.poster,
      src: this.props.src,
    };
    const videoFunc = {
      handleOnLoadStart: this.handleOnLoadStart,
      handleOnLoadedMetadata: this.handleOnLoadedMetadata,
      handleOnLoadedData: this.handleOnLoadedData,
      handleOnCanPaly: this.handleOnCanPaly,
      handleOnError: this.handleOnError,
      handleOnWaiting: this.handleOnWaiting,
      handleOnEneded: this.handleOnEneded,
    };
    const controllerFunc = {
      handleOnPause: this.handleOnPause,
      handleOnPlay: this.handleOnPlay,
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
      setDanmukuConfig: this.setDanmukuConfig,
      setPlayerConfig: this.setPlayerConfig,
      sendDanmu: this.sendDanmu,
      handleOnFullScreen: this.handleOnFullScreen,
    };
    const loadingHtml = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_loading" />';
    const onOff = this.state.playerConfig.onOff;
    const opacityValue = this.state.playerConfig.opacity;
    const { userActivity, cursorShow, fullScreen } = this.state;
    return (
      <div
        className={`player-container video-react-container ${fullScreen ? 'full-screen' : ''} ${userActivity ? 'player-user-activity' : 'player-user-inactivity'} ${cursorShow ? '' : 'cursor-hide'}`}
        style={{ paddingTop: styles.paddingTop }}
        ref={node => (this.player = node)}
        onMouseMove={this.handleOnMouseMove}
      >
        {this.renderStart()}
        {this.renderPlay()}
        <div style={{ display: `${this.state.playerStatus === -1 ? 'block' : 'none'}` }}>Error</div>
        <svg className="video-loading-svg" style={{ display: `${this.state.loading ? 'block' : 'none'}` }} version="1.1" viewBox="0 0 44 44" stroke="#d09500" dangerouslySetInnerHTML={{ __html: loadingHtml }} />
        { onOff && (
          <div className="canvas-container" style={{ opacity: opacityValue }}>
            <Danmuku
              danmuku={this.state.danmuku}
              playerAction={this.state.playerAction}
              currentTime={this.state.video.currentTime}
              loading={this.state.loading}
              duration={this.props.duration}
              ref={node => (this.danmuku = node)}
            />
          </div>
        )}
        <Video
          key="video"
          {...video}
          {...videoFunc}
          ref={node => (this.video = node)}
        >
          {this.props.children}
        </Video>
        <Controller
          video={this.state.video}
          volume={this.state.volume}
          controls={this.props.controls}
          playerAction={this.state.playerAction}
          show={this.state.controllerShow}
          danmukuConfig={this.state.danmukuConfig}
          playerConfig={this.state.playerConfig}
          fullScreen={this.state.fullScreen}
          {...controllerFunc}
        />
      </div>
    );
  }

  render() {
    const styles = this.getStyle();
    return (
      <div
        className="ice-player-container"
      >
        <SVG />
        {this.renderPalyer(styles)}
      </div>
    );
  }
}
