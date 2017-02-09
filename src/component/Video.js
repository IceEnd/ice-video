import React, { Component, PropTypes } from 'react';

export default class Video extends Component {
  static displayName = 'IcePlayerVideo';

  static propTypes = {
    children: PropTypes.any,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.string,
    volume: PropTypes.number,

    handleOnCanPaly: PropTypes.func,
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
    console.log(1);
  }

  onCanPlay = () => {
    const duration = this.video.duration;
    this.props.handleOnCanPaly(duration);
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
        onClick={this.onCanPlay}
      >
        {this.props.children}
        Your browser does not support the video.
      </video>
    );
  }
}
