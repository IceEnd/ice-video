import React, { PropTypes } from 'react';

const renderLoadingInfo = (startStatus) => {
  const { video, danmuku, controller } = startStatus;
  const tips = ['', '', '[完成]', '[失败]'];
  return (
    <div className="loading-tips-container">
      <ul>
        <li style={{ visibility: `${video === 0 ? 'hidden' : 'visible'}` }}>
          视频核动力注入...<i>{tips[video]}</i>
        </li>
        <li style={{ visibility: `${danmuku === 0 ? 'hidden' : 'visible'}` }}>
          主武器弹幕装填...<i>{tips[danmuku]}</i>
        </li>
        <li style={{ visibility: `${controller === 0 ? 'hidden' : 'visible'}` }}>
          驾驶舱神经同步...<i>{tips[controller]}</i>
        </li>
        <li style={{ visibility: `${(controller === 0 || controller === 1) ? 'hidden' : 'visible'}` }}>
          {video === 3 ? '初号机启动失败.' : '初号机就绪.'}
        </li>
      </ul>
    </div>
  );
};

const Start = (props) => {
  const { startStatus, showStart } = props;
  const svgHtml = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#loading_start" />';
  return (
    <div
      className="player-loading"
      style={{ display: `${showStart ? 'block' : 'none'}` }}
    >
      <svg className="loading-icon" version="1.1" fill="white" dangerouslySetInnerHTML={{ __html: svgHtml }} />
      {renderLoadingInfo(startStatus)}
    </div>
  );
};

Start.displayName = 'IceVideoStart';
Start.propTypes = {
  showStart: PropTypes.bool.isRequired,
  startStatus: PropTypes.shape({
    video: PropTypes.oneOf([0, 1, 2, 3]),
    barrage: PropTypes.oneOf([0, 1, 2, 3]),
    controller: PropTypes.oneOf([0, 1, 2, 3]),
  }),
};

export default Start;
