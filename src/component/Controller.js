import React, { Component, PropTypes } from 'react';

import formatTime from '../util/compute';

export default class Controller extends Component {
  static displayName = 'IcePlayerController';

  static propTypes = {
    // volume: PropTypes.number.isRequired,
    controls: PropTypes.bool.isRequired,
    playerAction: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    video: PropTypes.shape({
      playTimes: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      currentTime: PropTypes.number.isRequired,
      fullScreen: PropTypes.number.isRequired,
      bufferedTime: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
      muted: PropTypes.bool.isRequired,
      loop: PropTypes.bool.isRequired,
    }),

    handleOnPause: PropTypes.func.isRequired,
    handleOnPlay: PropTypes.func.isRequired,
    startControlsTimer: PropTypes.func.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
    showControls: PropTypes.func.isRequired,
    hideControls: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
    setMuted: PropTypes.func.isRequired,
    setLoop: PropTypes.func.isRequired,
    sendDanmu: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      processMouseLeft: 0,
      processMouseDispaly: false,
      dragProgress: false,
      dragProgressWidth: 0,
      dragVolume: false,
      dragVolumeWidth: 0,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.hideProcessMouseTimer);
  }

  getLeft = (element) => {
    let left = element.offsetLeft;
    if (element.offsetParent !== null) {
      left += this.getLeft(element.offsetParent);
    }
    return left;
  }

  setVolume = (e) => {
    e.preventDefault();
    if (this.state.dragVolume) {
      this.setState({
        dragVolume: false,
      });
    }
  }

  handleOnPlayIcon = () => {
    const { playerAction, startControlsTimer } = this.props;
    startControlsTimer();
    if (playerAction === 1) {            // 点击暂停
      this.props.handleOnPause();
    } else {                             // 点击播放
      this.props.handleOnPlay(false);
    }
  }

  processMouseMove = (e) => {
    e.preventDefault();
    const { offsetWidth } = this.processBar;
    const left = this.getLeft(this.processBar);
    const leftX = this.computeLeftX(e.clientX, left, offsetWidth);
    this.setState({
      processMouseLeft: leftX,
      processMouseDispaly: true,
    });
    if (this.state.dragProgress) {
      this.setState({
        dragProgressWidth: (leftX / offsetWidth) * 100,
      });
    }
    this.hideProcessMouse();
  }

  processMouseUp = (e) => {
    e.preventDefault();
    if (this.state.dragProgress) {
      const time = (this.state.dragProgressWidth / 100) * this.props.video.duration;
      this.props.setCurrentTime(time);
      this.setState({
        dragProgress: false,
      });
    }
  }

  processMouseLeave = () => {
    clearTimeout(this.hideProcessMouseTimer);
    this.setState({
      processMouseDispaly: false,
      dragProgress: false,
    });
    if (this.state.dragProgress) {
      const time = (this.state.dragProgressWidth / 100) * this.props.video.duration;
      this.props.setCurrentTime(time);
      this.setState({
        dragProgress: false,
      });
    }
  }

  processScrubberMoveDown = (e) => {
    e.preventDefault();
    const { offsetWidth } = this.processBar;
    const left = this.getLeft(this.processBar);
    this.setState({
      dragProgress: true,
      dragProgressWidth:
        (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth) * 100,
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

  processBarClick = (e) => {                      // 进度条
    e.preventDefault();
    e.stopPropagation();
    const { offsetWidth } = this.processBar;
    const left = this.getLeft(this.processBar);
    const time = (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth)
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

  handleOnInputFocus = () => {
    this.props.showControls();
  }

  handleOnInputBlur = () => {
    this.props.hideControls();
  }

  handleOnInputKeyUp = (event) => {
    this.props.showControls();
    if (event.keyCode === 13) {
      console.warn(event.keyCode);
      this.props.sendDanmu(this.input.value);
      this.input.value = '';
    }
  }

  handleOnVolumeIndicatorMouseDown = (e) => {
    e.preventDefault();
    const { offsetWidth } = this.volumeBar;
    const left = this.getLeft(this.volumeBar);
    this.setState({
      dragVolume: true,
      dragVolumeWidth: (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth) * 100,
    });
  }

  handleOnVolumeMouseMove = (e) => {
    e.preventDefault();
    if (this.state.dragVolume) {
      const { offsetWidth } = this.volumeBar;
      const left = this.getLeft(this.volumeBar);
      this.setState({
        dragVolumeWidth: (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth) * 100,
      });
      this.props.setVolume(this.state.dragVolumeWidth);
    }
  }

  handleOnVolumeBarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { offsetWidth } = this.volumeBar;
    const left = this.getLeft(this.volumeBar);
    this.props.setVolume((this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth) * 100);
  }

  handleOnVolumeIconClick = (e) => {
    e.preventDefault();
    let flag;
    if (this.props.video.muted) {
      flag = false;
    } else {
      flag = true;
    }
    this.props.setMuted(flag);
  }

  handleOnRepeatClick = (e) => {
    e.preventDefault();
    let flag;
    if (this.props.video.loop) {
      flag = false;
    } else {
      flag = true;
    }
    this.props.setLoop(flag);
  }

  computeLeftX = (X, left, width) => {
    let leftX;
    if (X < left) {
      leftX = 0;
    } else if (X > left + width) {
      leftX = width;
    } else {
      leftX = X - left;
    }
    return leftX;
  }

  render() {
    const { controls, playerAction, show, video } = this.props;
    const {
      processMouseLeft,
      processMouseDispaly,
      dragProgress,
      dragProgressWidth,
      dragVolume,
      dragVolumeWidth,
    } = this.state;
    if (!controls) {
      return null;
    }
    const playHtml = '<use class="video-svg-play video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_play" /><use class="video-svg-pause video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_pause" />';
    const settingHtml = '<use class="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_setting" />';
    const volumeHtml = '<use class="video-svg-volume video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume" /><use class="video-svg-volume-damping video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume_damping" /><use class="video-svg-volume-mute video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume_mute" />';
    const fullScreenHtml = '<use class="video-svg-fullscreen video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen" /><use class="video-svg-fullscreen-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen_true" />';
    const repeatHtml = '<use class="video-svg-repeat-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_repeat_true" /><use class="video-svg-repeat-false video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_repeat_false" />';
    let playStatus = '';
    if (playerAction === 1 || playerAction === 3) {
      playStatus = 'pause';
    } else if (playerAction === 2) {
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
    if (video.muted) {
      volumeStatus = 'mute';
    }
    return (
      <div className={`video-control-main ${show ? '' : 'video-control-main-hidden'}`}>
        <div className="video-progress" aria-label="进度轴">
          <div className="video-time-display">
            <span className="video-time">{formatTime(video.currentTime)}</span>
          </div>
          <div
            className="video-progress-bar"
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
              <div className="video-process-load" style={{ width: `${(video.bufferedTime / video.duration) * 100}%` }} />
              <span
                className={`video-process-mouse-display ${processMouseDispaly ? 'video-process-mouse-display-show' : ''}`}
                data-time={`${processMouseDispaly ? formatTime((processMouseLeft / this.processBar.offsetWidth) * video.duration) : 0}`}
                style={{ left: `${processMouseLeft}px` }}
              />
              <div className="video-process-play" style={{ width: `${dragProgress ? dragProgressWidth : (video.currentTime / video.duration) * 100}%` }}>
                <button
                  className="video-process-scrubber-indicator"
                  onMouseDown={this.processScrubberMoveDown}
                  onMouseUp={this.processMouseUp}
                />
              </div>
            </span>
          </div>
          <div className="video-time-display">
            <span className="video-time">{formatTime(video.duration)}</span>
          </div>
        </div>
        <div className="video-control-bar">
          <button
            className="video-control-item video-btn-play"
            data-status={playStatus}
            aria-label="播放/暂停"
            onClick={this.handleOnPlayIcon}
          >
            <svg className="video-svg" version="1.1" viewBox="0 0 36 36" dangerouslySetInnerHTML={{ __html: playHtml }} />
          </button>
          <div className="video-control-item video-control-input">
            <input
              className="video-danmuku-input"
              type="text"
              placeholder="发个弹幕吐槽吧..."
              ref={node => (this.input = node)}
              onFocus={this.handleOnInputFocus}
              onBlur={this.handleOnInputBlur}
              onKeyUp={this.handleOnInputKeyUp}
            />
          </div>
          <div className="video-control-bar-right">
            <div
              className="video-control-item video-btn-volume"
              aria-label="音量"
              data-status={volumeStatus}
              onMouseMove={this.handleOnVolumeMouseMove}
              onMouseLeave={this.setVolume}
              onMouseUp={this.setVolume}
            >
              <svg
                className="video-svg"
                version="1.1"
                viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: volumeHtml }}
                onClick={this.handleOnVolumeIconClick}
              />
              <div
                className="video-btn-volume-bar"
                ref={node => (this.volumeBar = node)}
                onClick={this.handleOnVolumeBarClick}
              >
                <div
                  className="video-btn-volume-bar-level"
                  style={{ width: `${dragVolume ? dragVolumeWidth : video.volume * 100}%` }}
                >
                  <button
                    className="video-btn-volume-bar-indicator"
                    onMouseDown={this.handleOnVolumeIndicatorMouseDown}
                    onMouseUp={this.setVolume}
                  />
                </div>
              </div>
            </div>
            <button
              className="video-control-item video-btn-setting"
              aria-label="设置"
              data-status={playStatus}
            >
              <svg className="video-svg" version="1.1" viewBox="0 0 36 36" dangerouslySetInnerHTML={{ __html: settingHtml }} />
            </button>
            <button
              className="video-control-item video-btn-repeat"
              aria-label="循环"
              data-status={video.loop}
              data-msg={`${video.loop ? '关闭循环' : '洗脑循环'}`}
              onClick={this.handleOnRepeatClick}
            >
              <svg className="video-svg" version="1.1" viweBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: repeatHtml }} />
            </button>
            <button
              className="video-control-item video-btn-fullscreen"
              aria-label="全屏"
              data-status={video.fullScreen}
            >
              <svg className="video-svg" version="1.1" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: fullScreenHtml }} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
