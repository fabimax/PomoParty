import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

import { routerReducer, initializeHistoryListener } from './modules/router';
import { gamesReducer } from './modules/games';
import { timeReducer, startTimeUpdates } from './modules/time';
import { notificationsReducer, initializeNotifications } from './modules/notifications';

const rootReducer = combineReducers({
  router: routerReducer,
  games: gamesReducer,
  time: timeReducer,
  notifications: notificationsReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(initializeHistoryListener());
store.dispatch(startTimeUpdates());
store.dispatch(initializeNotifications());

export default store;