export const VIDEO_LOADING = 'VIDEO_LOADING';
export const VIDEO_LOAD_COMPLETE = 'VIDEO_LOAD_COMPLETE';
export const BARRAGE_LOADING = 'BARRAGE_LOADING';
export const BARRAGE_LOADING_COMPLETE = 'BARRAGE_LOADING_COMPLETE';
export const PLAYER_READY = 'PLAYER_READY';

export function videoLoading() {
  return {
    type: VIDEO_LOADING,
    playerStatus: 0,    // 0:加载视频 1:视频加载完毕 2:加载弹幕 3:弹幕加载完毕 4:就绪
  };
}

export function videoLoadingComplete() {
  return {
    type: VIDEO_LOAD_COMPLETE,
    playerStatus: 1,
  };
}

export function barrageLoading() {
  return {
    type: BARRAGE_LOADING,
    playerStatus: 2,
  };
}

export function barrageLoadingComplete() {
  return {
    type: BARRAGE_LOADING_COMPLETE,
    playerStatus: 3,
  };
}

export function ready() {
  return {
    type: PLAYER_READY,
    showLoading: false,
    playerStatus: 4,
  };
}
