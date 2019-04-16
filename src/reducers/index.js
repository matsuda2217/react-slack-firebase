import { combineReducers } from 'redux';
import user_reducer from './userReducer';
import channel_reducer from './channelReducer';
import color_reducer from './colorReducer';

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  color: color_reducer,
});

export default rootReducer;