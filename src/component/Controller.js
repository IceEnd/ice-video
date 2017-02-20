import React, { Component, PropTypes } from 'react';

import formatTime from '../util/compute';

export default class Controller extends Component {
  static displayName = 'IcePlayerController';

  static propTypes = {
    // volume: PropTypes.number.isRequired,
    controls: PropTypes.bool.isRequired,
    playerStatus: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    video: PropTypes.shape({
      playTimes: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      currentTime: PropTypes.number.isRequired,
      fullScreen: PropTypes.number.isRequired,
      bufferedLength: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
    }),

    handlePause: PropTypes.func.isRequired,
    handlePlay: PropTypes.func.isRequired,
    startControlsTimer: PropTypes.func.isRequired,
    handleControlSucess: PropTypes.func.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      processMouseLeft: 0,
      processMouseDispaly: false,
      dragProcess: false,
    };
  }

  componentDidUpdate() {
    this.updateSuccess();
  }

  componentWillUnmount() {
    clearTimeout(this.hideProcessMouseTimer);
  }

  updateSuccess = () => {
    if (this.props.playerStatus === 2) {
      this.props.handleControlSucess();
    }
  }

  handlePlayIcon = () => {
    const { playerStatus, startControlsTimer } = this.props;
    startControlsTimer();
    if (playerStatus === 5) {
      this.props.handlePause();
    } else {
      this.props.handlePlay(false);
    }
  }

  processMouseMove = (e) => {
    e.preventDefault();
    const { offsetLeft, offsetWidth } = this.processBar;
    const leftX = this.computeLeftX(e.clientX, offsetLeft, offsetWidth);
    this.setState({
      processMouseLeft: leftX,
      processMouseDispaly: true,
    });
    if (this.state.dragProcess) {
      this.setState({
        dragWidth: (leftX / offsetWidth) * 100,
      });
    }
    this.hideProcessMouse();
  }

  processMouseUp = (e) => {
    e.preventDefault();
    if (this.state.dragProcess) {
      const time = (this.state.dragWidth / 100) * this.props.video.duration;
      this.props.setCurrentTime(time);
      this.setState({
        dragProcess: false,
      });
    }
  }

  processMouseLeave = () => {
    clearTimeout(this.hideProcessMouseTimer);
    this.setState({
      processMouseDispaly: false,
      dragProcess: false,
    });
    if (this.state.dragProcess) {
      const time = (this.state.dragWidth / 100) * this.props.video.duration;
      this.props.setCurrentTime(time);
      this.setState({
        dragProcess: false,
      });
    }
  }

  processScrubberMoveDown = (e) => {
    e.preventDefault();
    const { offsetLeft, offsetWidth } = this.processBar;
    this.setState({
      dragProcess: true,
      dragWidth: (this.computeLeftX(e.clientX, offsetLeft, offsetWidth) / offsetWidth) * 100,
    });
  }

  processBarMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  processBarMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  processBarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { offsetLeft, offsetWidth } = this.processBar;
    const time = (this.computeLeftX(e.clientX, offsetLeft, offsetWidth) / offsetWidth)
    * this.props.video.duration;
    this.props.setCurrentTime(time);
  }


  hideProcessMouse = () => {
    clearTimeout(this.hideProcessMouseTimer);
    this.hideProcessMouseTimer = setTimeout(() => {
      this.setState({
        processMouseDispaly: false,
      });
    }, 1500);
  }

  computeLeftX = (X, offsetLeft, offsetWidth) => {
    let leftX;
    if (X < offsetLeft) {
      leftX = 0;
    } else if (X > offsetLeft + offsetWidth) {
      leftX = offsetWidth;
    } else {
      leftX = X - offsetLeft;
    }
    return leftX;
  }

  render() {
    const { controls, playerStatus, show, video } = this.props;
    const { processMouseLeft, processMouseDispaly } = this.state;
    if (!controls) {
      return null;
    }
    const playHtml = '<use class="video-svg-play video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_play" /><use class="video-svg-pause video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_pause" />';
    const settingHtml = '<use class="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_setting" />';
    const volumeHtml = '<use class="video-svg-volume video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume" /><use class="video-svg-volume-damping video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume_damping" /><use class="video-svg-volume-mute video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume_damping" />';
    const fullScreenHtml = '<use class="video-svg-fullscreen video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen" /><use class="video-svg-fullscreen-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen_true" />';
    let playStatus = '';
    if (playerStatus === 5) {
      playStatus = 'pause';
    } else if (playerStatus === 6) {
      playStatus = 'play';
    }
    let volumeStatus = '';
    if (video.volume >= 0.5) {
      volumeStatus = 'normal';
    } else if (video.volume < 0.5 && video.volume > 0) {
      volumeStatus = 'damping';
    } else {
      volumeStatus = 'mute';
    }
    return (
      <div
        className={`react-video-control-bar ${show ? '' : 'react-video-control-bar-hidden'}`}
      >
        <button
          className="react-video-control-btn react-video-control-item video-btn-play"
          data-status={playStatus}
          aria-label="播放/暂停"
          onClick={this.handlePlayIcon}
        >
          <svg className="react-video-svg" version="1.1" viewBox="0 0 36 36" dangerouslySetInnerHTML={{ __html: playHtml }} />
        </button>
        <div
          className="react-video-control-btn react-video-control-item video-current-time-display"
        >
          <span className="video-current-time">{formatTime(video.currentTime)}</span>
        </div>
        <div
          className="react-video-control-btn react-video-control-item video-process-control"
          aria-label="进度条"
          ref={node => (this.processBar = node)}
          onMouseMove={this.processMouseMove}
          onMouseLeave={this.processMouseLeave}
          onMouseUp={this.processMouseUp}
        >
          <span
            className="video-process-list"
            onClick={this.processBarClick}
            onMouseDown={this.processBarMouseDown}
            onMouseUp={this.processBarMouseUp}
          >
            <div
              className="video-process-load"
              style={{ width: `${video.bufferedLength * 100}%` }}
            />
            <span
              className={`video-process-mouse-display ${processMouseDispaly ? 'video-process-mouse-display-show' : ''}`}
              data-time={`${processMouseDispaly ? formatTime((processMouseLeft / this.processBar.offsetWidth) * video.duration) : 0}`}
              style={{ left: `${processMouseLeft}px` }}
            />
            <div
              className="video-process-play"
              style={{ width: `${this.state.dragProcess ? this.state.dragWidth : (video.currentTime / video.duration) * 100}%` }}
            >
              <button
                className="video-process-scrubber-indicator"
                onMouseDown={this.processScrubberMoveDown}
                onMouseUp={this.processMouseUp}
              />
            </div>
          </span>
        </div>
        <div
          className="react-video-control-btn react-video-control-item video-current-time-display"
        >
          <span className="video-current-time">{formatTime(video.duration)}</span>
        </div>
        <div className="react-video-control-bar-right">
          <div
            className="react-video-control-btn react-video-control-item video-btn-volume"
            aria-label="音量"
            data-status={volumeStatus}
          >
            <svg className="react-video-svg" version="1.1" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: volumeHtml }} />
            <div className="video-btn-volume-bar">
              <div
                className="video-btn-volume-bar-level"
                style={{ width: `${video.volume * 100}%` }}
              >
                <button className="video-btn-volume-bar-indicator" />
              </div>
            </div>
          </div>
          <button
            className="react-video-control-btn react-video-control-item video-btn-setting"
            aria-label="设置"
            data-status={playStatus}
          >
            <svg className="react-video-svg" version="1.1" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: settingHtml }} />
          </button>
          <button
            className="react-video-control-btn react-video-control-item video-btn-fullscreen"
            aria-label="全屏"
            data-status={video.fullScreen}
          >
            <svg className="react-video-svg" version="1.1" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: fullScreenHtml }} />
          </button>
        </div>
      </div>
    );
  }
}
