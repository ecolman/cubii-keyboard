import { combineReducers } from 'redux';
import { connectRouter } from "connected-react-router";

import { reducer as settingsReducer } from './settings';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  settings: settingsReducer
});

export default rootReducer;