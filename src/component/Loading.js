import React, { Component, PropTypes } from 'react';

export default class Loading extends Component {
  static displayName = 'IcePlayerLoading';

  static propTypes = {
    showLoading: PropTypes.bool.isRequired,
    playerStatus: PropTypes.number.isRequired,      // 0: 加载视频 1:视频加载完毕 2:弹幕填充 3:弹幕装填完毕 4:就绪
  };

  componentWillMount() {
  }

  render() {
    return (
      <div className="player-loading">
        {this.props.showLoading}
        {this.props.playerStatus}
      </div>
    );
  }
}
