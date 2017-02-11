import React, { Component, PropTypes } from 'react';

export default class Controller extends Component {
  static displayName = 'IcePlayerController';

  static propTypes = {
    // duration: PropTypes.number.isRequired,
    // volume: PropTypes.number.isRequired,
    controls: PropTypes.bool.isRequired,
    playerStatus: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,

    handlePause: PropTypes.func.isRequired,
    handlePlay: PropTypes.func.isRequired,
    startControlsTimer: PropTypes.func.isRequired,
  };

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
    const { controls, playerStatus, show } = this.props;
    if (!controls) {
      return null;
    }
    const pauseIcon = '<use class="video-svg-play video-svg-symbol" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_play" /><use class="video-svg-pause video-svg-symbol" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_pause" />';
    let playStatus = '';
    if (playerStatus === 5) {
      playStatus = 'pause';
    } else {
      playStatus = 'play';
    }
    return (
      <div
        className={`react-video-control-bar ${show ? '' : 'react-video-control-bar-hidden'}`}
      >
        <button
          className="react-video-control-btn react-video-control-item video-btn-play"
          data-status={playStatus}
          onClick={this.handlePlayIcon}
        >
          <svg className="react-video-svg" version="1.1" viewBox="0 0 36 36" dangerouslySetInnerHTML={{ __html: pauseIcon }} />
        </button>
      </div>
    );
  }
}
