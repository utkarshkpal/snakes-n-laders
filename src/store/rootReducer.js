import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import gameData from './items/gameReducer';

const root = combineReducers({
  gameData,
  router: routerReducer,
});

export default root;
