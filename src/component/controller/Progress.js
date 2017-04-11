import React, { Component, PropTypes } from 'react';

import formatTime from '../../util/compute';

export default class Progress extends Component {
  static displayName = 'IcePlayerControllerProcess';

  static propTypes = {
    duration: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    bufferedTime: PropTypes.number.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
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

  shouldComponentUpdate(nextProps) {
    const { duration, currentTime, bufferedTime } = nextProps;
    return duration !== this.props.duration ||
      currentTime !== this.props.currentTime ||
      bufferedTime !== this.props.bufferedTime;
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
      const time = (this.state.dragProgressWidth / 100) * this.props.duration;
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
      const time = (this.state.dragProgressWidth / 100) * this.props.duration;
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
    * this.props.duration;
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
    const { currentTime, bufferedTime, duration } = this.props;
    const {
      processMouseLeft,
      processMouseDispaly,
      dragProgress,
      dragProgressWidth,
    } = this.state;
    return (
      <div className="video-progress" aria-label="进度轴">
        <div className="video-time-display">
          <span className="video-time">{formatTime(currentTime)}</span>
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
            <div className="video-process-load" style={{ width: `${(bufferedTime / duration) * 100}%` }} />
            <span
              className={`video-process-mouse-display ${processMouseDispaly ? 'video-process-mouse-display-show' : ''}`}
              data-time={`${processMouseDispaly ? formatTime((processMouseLeft / this.processBar.offsetWidth) * duration) : 0}`}
              style={{ left: `${processMouseLeft}px` }}
            />
            <div className="video-process-play" style={{ width: `${dragProgress ? dragProgressWidth : (currentTime / duration) * 100}%` }}>
              <button
                className="video-process-scrubber-indicator"
                onMouseDown={this.processScrubberMoveDown}
                onMouseUp={this.processMouseUp}
              />
            </div>
          </span>
        </div>
        <div className="video-time-display">
          <span className="video-time">{formatTime(duration)}</span>
        </div>
      </div>
    );
  }
}
