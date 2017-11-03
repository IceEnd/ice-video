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
      </div>
    );
  }
}
