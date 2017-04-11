import React, { Component, PropTypes } from 'react';

export default class Volume extends Component {
  static displayName = 'IcePlayerControllerVolume';

  static propTypes = {
    volume: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired,
    setVolume: PropTypes.func.isRequired,
    setMuted: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragVolume: false,
      dragVolumeWidth: 0,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { volume, muted } = nextProps;
    return volume !== this.props.volume || muted !== this.props.muted;
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
    if (this.props.muted) {
      flag = false;
    } else {
      flag = true;
    }
    this.props.setMuted(flag);
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
    const { volume, muted } = this.props;
    const {
      dragVolume,
      dragVolumeWidth,
    } = this.state;
    const volumeHtml = '<use class="video-svg-volume video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume" /><use class="video-svg-volume-damping video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume_damping" /><use class="video-svg-volume-mute video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_volume_mute" />';
    let volumeStatus = '';
    if (volume >= 0.5) {
      volumeStatus = 'normal';
    } else if (volume < 0.5 && volume > 0) {
      volumeStatus = 'damping';
    } else {
      volumeStatus = 'mute';
    }
    if (muted) {
      volumeStatus = 'mute';
    }
    return (
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
            style={{ width: `${dragVolume ? dragVolumeWidth : volume * 100}%` }}
          >
            <button
              className="video-btn-volume-bar-indicator"
              onMouseDown={this.handleOnVolumeIndicatorMouseDown}
              onMouseUp={this.setVolume}
            />
          </div>
        </div>
      </div>
    );
  }
}
