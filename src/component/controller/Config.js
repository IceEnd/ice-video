import React, { Component, PropTypes } from 'react';

const colorGrups = ['white', 'black', 'ghostwhite', 'snow', 'whitesmoke', 'silver', 'darkgray', 'grey', 'dimgray',
  'lavender', 'skyblue', 'royalblue', 'mediumblue', 'purple', 'blue', 'steelblue', 'darkblue', 'navy', 'blueviolet',
  'lightpink', 'pink', 'hotpink', 'peachpuff', 'deeppink', 'mediumvioletred', 'red', 'crimson', 'firebrick', 'darkred',
  'aquamarine', 'mediumaquamarine', 'cyan', 'springgreen', 'lightgreen', 'seagreen', 'forestgreen', 'limegreen', 'green', 'darkgreen',
  'ivory', 'wheat', 'lemonchiffon', 'khaki', 'bisque', 'lightgoldenrodyellow', 'Yellow', 'gold', 'goldenrod', 'orange',
  'tan', 'lightcoral', 'peru', 'olivedrab', 'chocolate', 'sienna', 'brown', 'saddlebrown', 'dimgray', 'maroon',
];

export default class Controller extends Component {
  static displayName = 'IcePlayerControllerConfig';

  static propTypes = {
    danmukuConfig: PropTypes.shape({
      fontColor: PropTypes.string,
      fontSize: PropTypes.oneOf(['small', 'middle', 'large']),
      model: PropTypes.oneOf(['roll', 'top', 'bottom']),
    }),
    playerConfig: PropTypes.shape({
      opacity: PropTypes.number,
      scale: PropTypes.string,
      onOff: PropTypes.bool,
    }),

    setDanmukuConfig: PropTypes.func.isRequired,
    setPlayerConfig: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      menu: 'danmuku',         // danmuku player
      dragOpacity: false,
      dragOpacityWidth: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  getLeft = (element) => {
    let left = element.offsetLeft;
    if (element.offsetParent !== null) {
      left += this.getLeft(element.offsetParent);
    }
    return left;
  }

  setMenu = name =>
    () => {
      this.setState({ menu: name });
    }

  setOpacity = (e) => {
    e.preventDefault();
    if (this.state.dragOpacity) {
      this.setState({
        dragOpacity: false,
      });
    }
  }

  setOnOff = config =>
    () => {
      this.props.setPlayerConfig(config);
    }

  hanldeOnDanmuku = config =>
    () => {
      this.props.setDanmukuConfig(config);
    }

  handleOnIndicatorMouseDown = (e) => {
    e.preventDefault();
    const { offsetWidth } = this.opacityBar;
    const left = this.getLeft(this.opacityBar);
    this.setState({
      dragOpacity: true,
      dragOpacityWidth: (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth),
    });
  }

  handleOnOpacityMouseMove = (e) => {
    e.preventDefault();
    if (this.state.dragOpacity) {
      const { offsetWidth } = this.opacityBar;
      const left = this.getLeft(this.opacityBar);
      const result = (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth);
      this.setState({
        dragOpacityWidth: result,
      });
      this.props.setPlayerConfig({ opacity: result });
    }
  }

  handleOnOpacityBarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { offsetWidth } = this.opacityBar;
    const left = this.getLeft(this.opacityBar);
    this.props.setPlayerConfig({
      opacity: (this.computeLeftX(e.clientX, left, offsetWidth) / offsetWidth),
    });
  }

  computeLeftX = (X, left, width) => {
    let leftX;
    if (X < left) {
      leftX = 0;
    } else if (X > left + width) {
      leftX = width;
    } else {
      leftX = X - left;
    }
    return leftX;
  }

  render() {
    const { menu, dragOpacity, dragOpacityWidth } = this.state;
    const { model, fontSize, fontColor } = this.props.danmukuConfig;
    const { opacity, onOff } = this.props.playerConfig;
    const rollIcon = '<use class="model-roll-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danmuku-roll" />';
    const topIcon = '<use class="model-top-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danmuku-top" />';
    const bottomIcon = '<use class="model-bottom-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danmuku-bottom" />';
    return (
      <div className="video-config-container">
        <div className="video-config" data-status={menu}>
          <div className="video-config-bar">
            <ul>
              <li className="danmuku-li" onClick={this.setMenu('danmuku')}>弹幕设置</li>
              <li className="player-li" onClick={this.setMenu('player')}>播放器设置</li>
            </ul>
          </div>
          <div className="video-config-content">
            <div className="config-group danmuku-group">
              <div className="config-item danmuku-font" data-status={fontSize}>
                <span className="row-title">字号</span>
                <div className="row-selection">
                  <span className="selection-name small" onClick={this.hanldeOnDanmuku({ fontSize: 'small' })}>小</span>
                  <span className="selection-name middle" onClick={this.hanldeOnDanmuku({ fontSize: 'middle' })}>中</span>
                  <span className="selection-name large" onClick={this.hanldeOnDanmuku({ fontSize: 'large' })}>大</span>
                </div>
              </div>
              <div className="config-item danmuku-model" data-status={model}>
                <span className="row-title">模式</span>
                <div className="row-selection">
                  <div className="selection-span model-roll" onClick={this.hanldeOnDanmuku({ model: 'roll' })}>
                    <svg className="model-svg model-roll-svg" version="1.1" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: rollIcon }} />
                    <span className="selection-name roll">滚动</span>
                  </div>
                  <div className="selection-span model-top" onClick={this.hanldeOnDanmuku({ model: 'top' })}>
                    <svg className="model-svg model-top-svg" version="1.1" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: topIcon }} />
                    <span className="selection-name top">顶部</span>
                  </div>
                  <div className="selection-span model-bottom" onClick={this.hanldeOnDanmuku({ model: 'bottom' })}>
                    <svg className="model-svg model-bottom-svg" version="1.1" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: bottomIcon }} />
                    <span className="selection-name bottom">底部</span>
                  </div>
                </div>
              </div>
              <div className="config-item danmuku-color" data-status={fontColor}>
                <span className="row-title">颜色</span>
                <div className="row-selection">
                  {colorGrups.map(color =>
                    (
                      <span
                        className={`color-item ${fontColor === color ? 'active' : ''}`}
                        key={color}
                        style={{ backgroundColor: color }}
                        onClick={this.hanldeOnDanmuku({ fontColor: color })}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="config-group player-group">
              <div className="config-item danmuku-opacity">
                <span className="row-title">透明</span>
                <div
                  className="row-selection"
                  onMouseMove={this.handleOnOpacityMouseMove}
                  onMouseLeave={this.setOpacity}
                  onMouseUp={this.setOpacity}
                >
                  <div
                    className="opacity-bar"
                    ref={node => (this.opacityBar = node)}
                    onClick={this.handleOnOpacityBarClick}
                  >
                    <div
                      className="opacity-bar-level"
                      style={{ width: `${dragOpacity ? dragOpacityWidth * 100 : opacity * 100}%` }}
                    >
                      <button
                        className="opacity-bar-indicator"
                        onMouseDown={this.handleOnIndicatorMouseDown}
                        onMouseUp={this.setOpacity}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="config-item player-on-off" data-status={`${onOff ? 'on' : 'off'}`}>
                <span className="row-title">弹幕</span>
                <div className="row-selection">
                  <span className="selection-name on" onClick={this.setOnOff({ onOff: true })}>开</span>
                  <span className="selection-name off" onClick={this.setOnOff({ onOff: false })}>关</span>
                </div>
              </div>
              <div className="config-item player-size" data-status="normal">
                <span className="row-title">比例</span>
                <div className="row-selection">
                  <span className="selection-name normal">16:9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
