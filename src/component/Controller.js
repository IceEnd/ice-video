import React, { Component, PropTypes } from 'react';

export default class Controller extends Component {
  static displayName = 'IcePlayerController';

  static propTypes = {
    // duration: PropTypes.number.isRequired,
    // volume: PropTypes.number.isRequired,
    controls: PropTypes.bool.isRequired,
    // playerLoadingStatus: PropTypes.number.isRequired,
  };

  render() {
    if (this.props.controls) {
      return null;
    }
    return (
      <div className="react-video-control-bar">
        <button className="react-video-control-btn react-video-control-item">
          <i className="react-video-control-play" />
        </button>
      </div>
    );
  }
}
