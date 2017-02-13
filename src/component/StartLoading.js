import React, { PropTypes } from 'react';

const renderLoadingInfo = (playerStatus, playerLoadingStatus) => {
  let visibilitys = ['hidden', 'hidden', 'hidden', 'hidden'];
  switch (playerStatus) {
    case -1:
    case 0:
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
      visibilitys = ['visible', 'visible', 'visible', 'visible'];
      break;
  }
  const tips = ['', '[完成]', '[失败]'];
  return (
    <div className="loading-tips-container">
      <ul>
        <li style={{ visibility: visibilitys[0] }}>
          视屏核动力注入...<i>{tips[playerLoadingStatus.video]}</i>
        </li>
        <li style={{ visibility: visibilitys[1] }}>
          主武器弹幕装填...<i>{tips[playerLoadingStatus.barrage]}</i>
        </li>
        <li style={{ visibility: visibilitys[2] }}>
          驾驶舱神经同步...<i>{tips[playerLoadingStatus.controller]}</i>
        </li>
        <li style={{ visibility: visibilitys[3] }}>
          {playerStatus === -1 ? '初号机启动失败.' : '初号机就绪.'}
        </li>
      </ul>
    </div>
  );
};

const StartLoading = (props) => {
  const { playerStatus, playerLoadingStatus, showLoading } = props;
  const svgHtml = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#loading_start" />';
  return (
    <div
      className="player-loading"
      style={{ display: `${showLoading ? 'block' : 'none'}` }}
    >
      <svg className="loading-icon" version="1.1" fill="white" dangerouslySetInnerHTML={{ __html: svgHtml }} />
      {renderLoadingInfo(playerStatus, playerLoadingStatus)}
    </div>
  );
};

StartLoading.displayName = 'IcePlayerSVG';
StartLoading.propTypes = {
  showLoading: PropTypes.bool.isRequired,
  playerLoadingStatus: PropTypes.shape({
    video: PropTypes.oneOf([0, 1, 2]),
    barrage: PropTypes.oneOf([0, 1, 2]),
    controller: PropTypes.oneOf([0, 1, 2]),
  }),
  playerStatus: PropTypes.number.isRequired,  // 0:加载视屏 1:加载弹幕 2:设置控制台 3:就绪  -1:加载失败
};

export default StartLoading;
