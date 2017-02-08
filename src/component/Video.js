import React, { Component, PropTypes } from 'react';

export default class Video extends Component {
  static displayName = 'Video';

  static propTypes = {
    children: PropTypes.any,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.string,
    volume: PropTypes.number,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    loop: false,
    volume: 0.8,
    controls: true,
  };

  render() {
    return (
      <video
        className="react-video"
        loop={this.props.loop}
        autoPlay={this.props.autoPlay}
        preload={this.props.preload}
        volume={this.props.volume}
      >
        {this.props.children}
        Your browser does not support the video.
      </video>
    );
  }
}
