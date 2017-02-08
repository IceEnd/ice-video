import React, { Component, PropTypes } from 'react';

import Video from './Video';

export default class Player extends Component {
  static displayName = 'Player';

  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object.isRequired,
    showLoading: PropTypes.bool,
    playerStatus: PropTypes.number,

    video: PropTypes.shape({
      loop: PropTypes.bool,
      autoPlay: PropTypes.bool,
      preload: PropTypes.string,
      volume: PropTypes.number,
    }),
    controls: PropTypes.bool,
    playerStatus: PropTypes.number,

    dispatch: PropTypes.func,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    loop: false,
    volume: 0.8,
    controls: true,
    playerStatus: 0,
  };

  renderLoading() {
    return (
      <div style={{ display: `${this.props.showLoading ? '' : 'none'}` }}>Loading...</div>
    );
  }

  render() {
    return (
      <div
        className="player-container video-react-container"
        style={{ ...this.props.style }}
      >
        {this.renderLoading()}
        <div style={{ display: 'none' }}>Shortcut</div>
        <Video
          key="video"
          {...this.props.video}
          dispatch={this.props.dispatch}
        >
          {this.props.children}
        </Video>
        <div>dammu</div>
        <div>controls</div>
      </div>
    );
  }
}
