import React, { Component, PropTypes } from 'react';

export default class DanmukuInput extends Component {
  static displayName = 'IcePlayerControllerDanmukuInput';

  static propTypes = {
    showControls: PropTypes.func.isRequired,
    hideControls: PropTypes.func.isRequired,
    sendDanmu: PropTypes.func.isRequired,
  };

  shouldComponentUpdate() {
    return false;
  }

  handleOnInputFocus = () => {
    this.props.showControls();
  }

  handleOnInputBlur = () => {
    this.props.hideControls();
  }

  handleOnInputKeyUp = (event) => {
    this.props.showControls();
    if (event.keyCode === 13) {
      this.props.sendDanmu(this.input.value);
      this.input.value = '';
    }
  }

  render() {
    const sendHtml = '<use class="video-svg-send-btn video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#send_icon" />';
    return (
      <div className="video-control-item video-control-input">
        <input
          className="video-danmuku-input"
          type="text"
          placeholder="发个弹幕吐槽吧..."
          ref={node => (this.input = node)}
          onFocus={this.handleOnInputFocus}
          onBlur={this.handleOnInputBlur}
          onKeyUp={this.handleOnInputKeyUp}
        />
        <span className="video-control-item video-div-send">
          <button
            className="video-btn-send"
            aria-label="发送弹幕"
            data-msg="发送弹幕"
          >
            <svg
              className="video-svg"
              version="1.1"
              dangerouslySetInnerHTML={{ __html: sendHtml }}
            />
          </button>
        </span>
      </div>
    );
  }
}
