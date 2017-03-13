import React, { Component, PropTypes } from 'react';

export default class Video extends Component {
  static displayName = 'IcePlayerVideo';

  static propTypes = {
    src: PropTypes.string,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.string,
    poster: PropTypes.string,

    handleOnLoadStart: PropTypes.func.isRequired,
    handleOnLoadedMetadata: PropTypes.func.isRequired,
    handleOnLoadedData: PropTypes.func.isRequired,
    handleOnCanPaly: PropTypes.func.isRequired,
    handleOnWaiting: PropTypes.func.isRequired,
    handleOnError: PropTypes.func.isRequired,
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
    this.props.handleOnWaiting();
  }

  onCanPlay = () => {
    this.props.handleOnCanPaly();
  }

  onError = () => {
    const error = this.video.error;
    this.props.handleOnError(error);
  }

  getBuffered = () => {
    const { buffered } = this.video;
    let end = 0;
    try {
      end = buffered.end(0) || 0;
      end = parseInt((end * 1000) + 1, 10) / 1000;
    } catch (e) {
      // continue regardless of error
    }
    return end;
  }

  getCurrentTime = () => this.video.currentTime;

  setCurrentTime = (time) => {
    this.video.currentTime = time;
  }

  setLoop = (loop) => {
    this.video.loop = loop;
  }

  setMuted = (muted) => {
    this.video.muted = muted;
  }

  setVolume = (volume) => {
    this.video.volume = volume;
  }

  play = () => {
    this.video.play();
  }

  pause = () => {
    this.video.pause();
  }

  render() {
    return (
      <video
        className="react-video"
        src={this.props.src}
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
      />
    );
  }
}
