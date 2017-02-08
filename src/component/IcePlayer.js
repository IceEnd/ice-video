import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Player from './Player';

import '../assets/sass/player.scss';

class IcePlayer extends Component {
  static displayName = 'IcePlayer';

  static propTypes = {
    children: PropTypes.any,
    showLoading: PropTypes.bool,
    playerStatus: PropTypes.number,

    width: PropTypes.number,
    height: PropTypes.number,

    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
    volume: PropTypes.number,

    getBarrageUrl: PropTypes.string.isRequired,
    postBarrageUrl: PropTypes.string.isRequired,
    controls: PropTypes.bool,
    scale: PropTypes.string,
  };

  static defaultProps = {
    autoPlay: false,
    preload: 'auto',
    loop: false,
    volume: 0.8,
    controls: true,
    scale: '16:9',
    playerStatus: 0,
  };

  getStyle = () => {
    const styles = {};
    if (this.props.width && this.props.height) {
      styles.width = this.props.width;
      styles.paddingTop = this.props.height;
    } else {
      styles.width = '100%';
      switch (this.props.scale) {
        case '1:1':
          styles.paddingTop = '100%';
          break;
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
    const video = {
      loop: this.props.loop,
      autoPlay: this.props.autoPlay,
      preload: this.props.preload,
      volume: this.props.volume,
    };
    return (
      <div
        className="ice-player-container"
        width={styles.width}
      >
        <Player
          style={{ paddingTop: styles.paddingTop }}
          paddingTop={styles.paddingTop}
          video={{ ...video }}
          showLoading={this.props.showLoading}
          controls={this.props.controls}
          playerStatus={this.props.playerStatus}
        >
          {this.props.children}
        </Player>
        <div>Bar</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    showLoading,
    playerStatus,
  } = state;
  return {
    showLoading,
    playerStatus,
  };
}

export default connect(mapStateToProps)(IcePlayer);
