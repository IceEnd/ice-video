import React, { Component, PropTypes } from 'react';

export default class Video extends Component {
  static displayName = 'IcePlayerVideo';

  static propTypes = {
    children: PropTypes.any,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.string,
    volume: PropTypes.number,
    poster: PropTypes.string,
    playerAction: PropTypes.number,
    volumeAction: PropTypes.number,
    loopAction: PropTypes.number,
    timing: PropTypes.number,
    video: PropTypes.shape({
      volume: PropTypes.number,
      muted: PropTypes.bool,
      loop: PropTypes.bool,
    }),
    // loading: PropTypes.bool,

    handleOnLoadStart: PropTypes.func.isRequired,
    handleOnLoadedMetadata: PropTypes.func.isRequired,
    handleOnLoadedData: PropTypes.func.isRequired,
    handleOnCanPaly: PropTypes.func.isRequired,
    handleOnError: PropTypes.func.isRequired,
    getCurrentTime: PropTypes.func.isRequired,
    getBuffered: PropTypes.func.isRequired,
    setCurrentTimeComplete: PropTypes.func.isRequired,
    setVolumeComplete: PropTypes.func.isRequired,
    setLoopComplete: PropTypes.func.isRequired,
    handleOnEneded: PropTypes.func.handleOnEneded,
    // handleOnWaiting: PropTypes.func.isRequired,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    loop: false,
    volume: 0.8,
    controls: true,
  };

  constructor(props) {
    super(props);
    this.video = null;
  }

  componentDidMount() {
    this.video.volume = this.props.volume;
    this.startBufferedTimer();
  }

  componentDidUpdate() {
    this.videoControll();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  onLoadStart = () => {
    this.props.handleOnLoadStart();
  }

  onLoadedMetaData = () => {
    const duration = this.video.duration;
    this.props.handleOnLoadedMetadata(duration);
  }

  onLoadedData = () => {
    this.props.handleOnLoadedData();
  }

  onWaiting = () => {
    // this.props.handleOnWaiting();
  }

  onCanPlay = () => {
    if (this.props.playerAction === 0) {
      this.props.handleOnCanPaly();
    } else if (this.props.playerAction === 2) {
      this.video.pause();
    } else if (this.props.playerAction === 1) {
      this.video.play();
    }
  }

  onError = () => {
    const error = this.video.error;
    this.props.handleOnError(error);
  }

  getBufferedEnd = (buffered) => {
    let end = 0;
    try {
      end = buffered.end(0) || 0;
      end = parseInt((end * 1000) + 1, 10) / 1000;
    } catch (e) {
      // continue regardless of error
    }
    return end;
  }

  handleOnEnded = () => {
    if (!this.props.video.loop) {
      this.props.handleOnEneded();
    }
  }

  startBufferedTimer = () => {
    if (this.bufferedTimer) {
      return;
    }
    this.bufferedTimer = setInterval(() => {
      const { buffered, duration } = this.video;
      const end = this.getBufferedEnd(buffered);
      if (end < duration) {
        this.props.getBuffered((end));
      } else {
        this.props.getBuffered((end));
        this.clearBufferedTimer();
      }
    }, 1000);
  }

  startCurrentTimer = () => {
    if (this.processTimer) {
      return;
    }
    this.processTimer = setInterval(() => {
      const currentTime = this.video.currentTime;
      this.props.getCurrentTime(currentTime);
    }, 1000);
  }

  clearCurrentTimer = () => {
    clearInterval(this.processTimer);
    this.processTimer = null;
  }

  clearBufferedTimer = () => {
    clearInterval(this.bufferedTimer);
    this.bufferedTimer = null;
  }

  videoControll = () => {
    const { playerAction, volumeAction, loopAction, video, timing } = this.props;
    if (playerAction === 1) {
      this.video.play();
      this.startCurrentTimer();
    } else if (playerAction === 2) {
      this.video.pause();
      this.clearCurrentTimer();
    } else if (playerAction === 3) {
      this.video.currentTime = timing;
      this.props.setCurrentTimeComplete();
    }
    switch (volumeAction) {
      case 0:
        break;
      case 1:
        this.video.volume = video.volume;
        this.props.setVolumeComplete();
        break;
      case 2:
        this.video.muted = video.muted;
        this.props.setVolumeComplete();
        break;
      default:
        break;
    }
    if (loopAction === 1) {
      this.video.loop = video.loop;
      this.props.setLoopComplete();
    }
  }

  render() {
    return (
      <video
        className="react-video"
        loop={this.props.loop}
        autoPlay={this.props.autoPlay}
        preload={this.props.preload}
        poster={this.props.poster}
        ref={node => (this.video = node)}

        onCanPlay={this.onCanPlay}
        onError={this.onError}
        onLoadStart={this.onLoadStart}
        onLoadedMetadata={this.onLoadedMetaData}
        onLoadedData={this.onLoadedData}
        onWaiting={this.onWaiting}
        onProgress={this.onProgress}
        onPlay={this.onPlay}
        onEnded={this.handleOnEnded}
      >
        {this.props.children}
        Your browser does not support the video.
      </video>
    );
  }
}

/*
readyState
0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息
1 = HAVE_METADATA - 关于音频/视频就绪的元数据
2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
*/
