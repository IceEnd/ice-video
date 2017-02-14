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
  };

  componentDidUpdate() {
    this.updateSuccess();
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

  render() {
    const { controls, playerStatus, show, video } = this.props;
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
    } else {
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
        >
          <span className="video-process-list">
            <div
              className="video-process-load"
              style={{ width: `${video.bufferedLength * 100}%` }}
            />
            <div
              className="video-process-play"
              style={{ width: `${(video.currentTime / video.duration) * 100}%` }}
            >
              <button className="video-process-scrubber-indicator" />
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
            className="react-video-control-btn react-video-control-item video-div-volume"
            aria-label="音量"
            data-status={volumeStatus}
          >
            <button className="btn">
              <svg className="react-video-svg" version="1.1" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: volumeHtml }} />
            </button>
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
