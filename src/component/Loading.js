import React, { Component, PropTypes } from 'react';

import loadingstart from '../assets/images/icon/loadingstart.svg';

export default class Loading extends Component {
  static displayName = 'IcePlayerLoading';

  static propTypes = {
    showLoading: PropTypes.bool.isRequired,
    playerTips: PropTypes.shape({
      videoTip: PropTypes.oneOf(['', '[完成]', '[失败]']),
      barrageTip: PropTypes.oneOf(['', '[完成]', '[失败]']),
      controlTip: PropTypes.oneOf(['', '[完成]', '[失败]']),
    }),
    playerStatus: PropTypes.number.isRequired,  // 0:加载视屏 1:加载弹幕 2:设置控制台 3:就绪  4:加载失败
  };

  componentWillMount() {
  }

  renderLoadingInfo() {
    const { playerStatus, playerTips } = this.props;
    let visibilitys = ['hidden', 'hidden', 'hidden', 'hidden'];
    switch (playerStatus) {
      case 0:
      case 4:
        visibilitys = ['visible', 'hidden', 'hidden', 'hidden'];
        break;
      case 1:
        visibilitys = ['visible', 'visible', 'hidden', 'hidden'];
        break;
      case 2:
        visibilitys = ['visible', 'visible', 'visible', 'hidden'];
        break;
      case 3:
        visibilitys = ['visible', 'visible', 'visible', 'visible'];
        break;
      default:
    }
    return (
      <div className="loading-tips-container">
        <ul>
          <li style={{ visibility: visibilitys[0] }}>视屏核动力注入...<i>{playerTips.videoTip}</i></li>
          <li style={{ visibility: visibilitys[1] }}>主武器弹幕装填...<i>{playerTips.barrageTip}</i></li>
          <li style={{ visibility: visibilitys[2] }}>驾驶舱神经同步...<i>{playerTips.controlTip}</i></li>
          <li style={{ visibility: visibilitys[3] }}>{playerStatus === 4 ? '初号机启动失败.' : '初号机就绪.'}</li>
        </ul>
      </div>
    );
  }

  render() {
    const { showLoading } = this.props;
    return (
      <div
        className="player-loading"
        style={{ display: `${showLoading ? 'block' : 'none'}` }}
      >
        <img className="loading-icon" alt="" src={loadingstart} />
        {this.renderLoadingInfo()}
      </div>
    );
  }
}
