import React, { Component } from 'react';

export default class Controller extends Component {
  static displayName = 'IcePlayerControllerConfig';

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const settingHtml = '<use class="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_setting" />';
    return (
      <button
        className="video-control-item video-btn-setting"
        aria-label="设置"
      >
        <svg className="video-svg" version="1.1" viewBox="0 0 36 36" dangerouslySetInnerHTML={{ __html: settingHtml }} />
      </button>
    );
  }
}
