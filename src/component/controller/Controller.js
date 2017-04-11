import React, { Component, PropTypes } from 'react';

import Progress from './Progress';
import DanmukuInput from './DanmukuInput';
import Volume from './Volume';
import Config from './Config';

export default class Controller extends Component {
  static displayName = 'IcePlayerController';

  static propTypes = {
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

  handleOnPlayIcon = () => {
    const { playerAction, startControlsTimer } = this.props;
    startControlsTimer();
    if (playerAction === 1) {            // 点击暂停
      this.props.handleOnPause();
    } else {                             // 点击播放
      this.props.handleOnPlay(false);
    }
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
    if (!controls) {
      return null;
    }
    const playHtml = '<use class="video-svg-play video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_play" /><use class="video-svg-pause video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_pause" />';
    const fullScreenHtml = '<use class="video-svg-fullscreen video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen" /><use class="video-svg-fullscreen-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen_true" />';
    const repeatHtml = '<use class="video-svg-repeat-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_repeat_true" /><use class="video-svg-repeat-false video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_repeat_false" />';
    let playStatus = '';
    if (playerAction === 1 || playerAction === 3) {
      playStatus = 'pause';
    } else if (playerAction === 2) {
      playStatus = 'play';
    }
    return (
      <div className={`video-control-main ${show ? '' : 'video-control-main-hidden'}`}>
        <Progress
          currentTime={this.props.video.currentTime}
          bufferedTime={this.props.video.bufferedTime}
          duration={this.props.video.duration}
          setCurrentTime={this.props.setCurrentTime}
        />
        <div className="video-control-bar">
          <button
            className="video-control-item video-btn-play"
            data-status={playStatus}
            aria-label="播放/暂停"
            onClick={this.handleOnPlayIcon}
          >
            <svg className="video-svg" version="1.1" viewBox="0 0 36 36" dangerouslySetInnerHTML={{ __html: playHtml }} />
          </button>
          <DanmukuInput
            showControls={this.props.showControls}
            hideControls={this.props.hideControls}
            sendDanmu={this.props.sendDanmu}
          />
          <div className="video-control-bar-right">
            <Volume
              video={this.props.video}
              volume={this.props.video.volume}
              muted={this.props.video.muted}
              setVolume={this.props.setVolume}
              setMuted={this.props.setMuted}
            />
            <Config />
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
