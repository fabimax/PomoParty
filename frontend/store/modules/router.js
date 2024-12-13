import { actions } from '../actions';

const initialState = {
  currentPath: window.location.pathname,
};

export function routerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.router.navigateTo.type:
    case actions.router.syncRoute.type:
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
  dispatch(actions.router.navigateTo.create(path));
};

export const initializeHistoryListener = () => (dispatch) => {
  window.addEventListener('popstate', () => {
    dispatch(actions.router.syncRoute.create(window.location.pathname));
  });
}; 