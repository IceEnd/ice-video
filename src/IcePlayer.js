import React, { Component, PropTypes } from 'react';

export default class IcePlayer extends Component {
  static displayName = 'IcePlayer';

  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    volume: PropTypes.number,
    getBarrageUrl: PropTypes.string.isRequired,
    postBarrageUrl: PropTypes.string.isRequired,
    controls: PropTypes.bool,
    fluid: PropTypes.bool.isRequired,
    scale: PropTypes.string,
  };

  static defaultProps = {
    autoPlay: false,
    loop: false,
    volume: 0.8,
    controls: true,
    fluid: true,
    scale: '16:9',
  };

  getStyle = () => {
    const styles = {};
    if (this.props.width && this.props.height) {
      styles.width = this.props.width;
      styles.paddingTop = this.props.height;
    } else {
      styles.width = '100%';
      switch (this.props.scale) {
        case '4:3':
          styles.paddingTop = '75%';
          break;
        case '16:9':
        default:
          styles.paddingTop = '56.25%';
          break;
      }
    }
    return styles;
  }

  render() {
    const styles = this.getStyle();
    return (
      <div
        width={styles.width}
      >
        <div
          width={styles.width}
          paddingTop={styles.paddingTop}
        >
          <div>Loading...</div>
          <div>Shortcut</div>
          <video
            src={this.props.src}
            width={this.props.width}
            height={this.props.height}
            loop={this.props.loop}
            autoPlay={this.props.autoPlay}
          >
            Your browser does not support the video.
          </video>
          <div>dammu</div>
          <div>controls</div>
        </div>
        <div>Bar</div>
      </div>
    );
  }
}
