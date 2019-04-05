import { combineReducers } from 'redux';
import user_reducer from './userReducer';

const rootReducer = combineReducers({
  user: user_reducer
});
export default rootReducer;