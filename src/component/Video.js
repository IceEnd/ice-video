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
    playerStatus: PropTypes.string,

    handleOnLoadStart: PropTypes.func,
    handleOnLoadedMetadata: PropTypes.func,
    handleOnLoadedData: PropTypes.func,
    handleOnCanPaly: PropTypes.func,
    handleOnError: PropTypes.func,
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
    this.videoControll();
  }

  componentDidUpdate() {
    this.videoControll();
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

  onCanPlay = () => {
    this.props.handleOnCanPaly();
  }

  onError = () => {
    const error = this.video.error;
    this.props.handleOnError(error);
  }

  videoControll = () => {
    const { playerStatus } = this.props;
    if (playerStatus === 5) {
      this.video.play();
    } else if (playerStatus === 6) {
      this.video.pause();
    }
  }

  render() {
    return (
      <video
        className="react-video"
        loop={this.props.loop}
        autoPlay={this.props.autoPlay}
        preload={this.props.preload}
        volume={this.props.volume}
        poster={this.props.poster}
        ref={node => (this.video = node)}

        onCanPlay={this.onCanPlay}
        onError={this.onError}
        onLoadStart={this.onLoadStart}
        onLoadedMetadata={this.onLoadedMetaData}
        onLoadedData={this.onLoadedData}
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
