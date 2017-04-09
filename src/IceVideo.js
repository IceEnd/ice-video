import 'isomorphic-fetch';
import React, { Component, PropTypes } from 'react';
import SVG from './component/SVG';
import Video from './component/Video';
import Start from './component/Start';
import Controller from './component/Controller';
import Danmuku from './component/Danmuku';

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
      loading: false,
      danmuku: [],
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

  componentDidMount() {
    this.video.setVolume(this.props.volume);
    this.startBufferedTimer();
  }

  componentWillUnmount() {
    this.clearBufferedTimer();
    this.clearCurrentTimer();
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
    this.video.setCurrentTime(time);
    this.setState({
      playerAction: 1,
    });
  }

  setVolume = (num) => {
    this.setState({
      video: Object.assign(this.state.video, { volume: num / 100 }),
    });
    this.video.setVolume(num / 100);
  }

  setMuted = (noOff) => {
    this.setState({
      video: Object.assign(this.state.video, { muted: noOff }),
    });
    this.video.setMuted(noOff);
  }

  setLoop = (noOff) => {
    this.setState({
      video: Object.assign(this.state.video, { loop: noOff }),
    });
    this.video.setLoop(noOff);
  }

  getBuffered = () => {
    this.setState({
      video: Object.assign(this.state.video, { bufferedTime: this.video.getBufferedEnd() }),
    });
  }

  startBufferedTimer = () => {
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

  clearBufferedTimer = () => {
    clearInterval(this.bufferedTimer);
    this.bufferedTimer = null;
  }

  startCurrentTimer = () => {
    if (this.currentTimer) {
      return;
    }
    this.currentTimer = setInterval(() => {
      this.setState({
        video: Object.assign(this.state.video, { currentTime: this.video.getCurrentTime() }),
      });
    }, 200);
  }

  clearCurrentTimer = () => {
    clearInterval(this.currentTimer);
    this.currentTimer = null;
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
    const danmu = {
      content: msg,
      date: new Date(),
      timePoint: this.state.video.currentTime,
    };
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
          console.warn('send success');
        } else {
          console.warn(res.retMsg);
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  loadDanmuku = () => {
    setTimeout(() => {
      this.setState({
        startStatus: Object.assign(this.state.startStatus, { controller: 2 }),
      });
    }, 500);
    setTimeout(() => {
      this.setState({
        playerStatus: this.state.startStatus.video === 2 ? 1 : -1,
        showStart: false,
      });
    }, 1000);
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
      <button className="play-button" onClick={() => this.handleOnPlay(true)} >
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
      sendDanmu: this.sendDanmu,
    };
    const loadingHtml = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_loading" />';
    return (
      <div
        className="player-container video-react-container"
        style={{ paddingTop: styles.paddingTop }}
      >
        {this.renderStart()}
        {this.renderPlay()}
        <div style={{ display: `${this.state.playerStatus === -1 ? 'block' : 'none'}` }}>Error</div>
        <svg className="video-loading-svg" style={{ display: `${this.state.loading ? 'block' : 'none'}` }} version="1.1" viewBox="0 0 44 44" stroke="#d09500" dangerouslySetInnerHTML={{ __html: loadingHtml }} />
        <Danmuku
          danmuku={this.state.danmuku}
          playerAction={this.state.playerAction}
          currentTime={this.state.video.currentTime}
          loading={this.state.loading}
        />
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
