import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

const initialState = {
  router: {
    currentPath: window.location.pathname,
  },
};

function routerReducer(state = initialState.router, action) {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        ...state,
        currentPath: action.payload
      };
    case 'SYNC_ROUTE':
      return {
        ...state,
        currentPath: action.payload
      };
    default:
      return state;
  }
}

export const navigateTo = (path) => (dispatch) => {
  window.history.pushState(null, '', path);
  
  dispatch({
    type: 'NAVIGATE_TO',
    payload: path
  });
};

export const initializeHistoryListener = () => (dispatch) => {
  window.addEventListener('popstate', () => {
    dispatch({
      type: 'SYNC_ROUTE',
      payload: window.location.pathname
    });
  });

};

const rootReducer = combineReducers({
  router: routerReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(initializeHistoryListener()); 

export default store;

