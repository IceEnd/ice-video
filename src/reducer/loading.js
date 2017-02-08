import { VIDEO_LOADING, VIDEO_LOAD_COMPLETE, BARRAGE_LOADING, BARRAGE_LOADING_COMPLETE, PLAYER_READY } from '../action/loading';

function loading(state = { showLoading: true }, action) {
  switch (action.type) {
    case VIDEO_LOADING:
    case VIDEO_LOAD_COMPLETE:
    case BARRAGE_LOADING:
    case BARRAGE_LOADING_COMPLETE:
      return Object.assign({}, state, {
        showLoading: true,
        playerStatus: action.playerStatus,
      });
    case PLAYER_READY:
      return Object.assign({}, state, {
        showLoading: false,
        playerStatus: action.playerStatus,
      });
    default:
      return state;
  }
}

export default loading;
