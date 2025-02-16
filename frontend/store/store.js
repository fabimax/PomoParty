import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

import { routerReducer, initializeHistoryListener } from './modules/router';
import { gamesReducer } from './modules/games';
import { timeReducer, startTimeUpdates } from './modules/time';
import { notificationsReducer, initializeNotifications } from './modules/notifications';
import { authenticationReducer, initializeCurrentUser } from './modules/authentication';
import { toastReducer } from './modules/toast';
import { chatReducer } from './modules/chat';

const rootReducer = combineReducers({
  router: routerReducer,
  games: gamesReducer,
  time: timeReducer,
  notifications: notificationsReducer,
  authentication: authenticationReducer,
  toast: toastReducer,
  chat: chatReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(initializeHistoryListener());
store.dispatch(startTimeUpdates());
store.dispatch(initializeNotifications());
store.dispatch(initializeCurrentUser());

export default store;