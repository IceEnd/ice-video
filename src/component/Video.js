import React, { Component, PropTypes } from 'react';

import { videoLoading, videoLoadingComplete } from '../action/loading';

export default class Video extends Component {
  static displayName = 'Video';

  static propTypes = {
    children: PropTypes.any,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.string,
    volume: PropTypes.number,

    dispatch: PropTypes.func,
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

  componentWillMount() {
    this.props.dispatch(videoLoading());
  }

  render() {
    return (
      <video
        className="react-video"
        loop={this.props.loop}
        autoPlay={this.props.autoPlay}
        preload={this.props.preload}
        volume={this.props.volume}
        ref={node => (this.video = node)}
      >
        {this.props.children}
        Your browser does not support the video.
      </video>
    );
  }
}
