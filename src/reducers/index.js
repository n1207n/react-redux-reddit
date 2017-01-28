import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import postState from './postReducers';

const rootReducer = combineReducers({
  postState,
  routing: routerReducer
});

export default rootReducer;
