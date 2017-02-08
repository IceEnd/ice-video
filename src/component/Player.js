import React, { Component, PropTypes } from 'react';

import Video from './Video';

export default class Player extends Component {
  static displayName = 'Player';

  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object.isRequired,
    video: PropTypes.shape({
      loop: PropTypes.bool,
      autoPlay: PropTypes.bool,
      preload: PropTypes.string,
      volume: PropTypes.number,
    }),
    controls: PropTypes.bool,
    playerStatus: PropTypes.number,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    loop: false,
    volume: 0.8,
    controls: true,
    playerStatus: 0,
  };

  render() {
    return (
      <div
        className="player-container video-react-container"
        style={{ ...this.props.style }}
      >
        <div style={{ display: 'none' }}>Loading...</div>
        <div style={{ display: 'none' }}>Shortcut</div>
        <Video
          key="video"
          {...this.props.video}
        >
          {this.props.children}
        </Video>
        <div>dammu</div>
        <div>controls</div>
      </div>
    );
  }
}
