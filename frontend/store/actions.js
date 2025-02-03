const createActionType = (type) => ({
  type,
  create: (payload) => ({ type, payload })
});

export function createActions(actions) {
  let newActions = {};
  for (let actionName of Object.keys(actions)) {
    newActions[actionName] = createActionType(actionName);
  }
  return newActions;
}

export function stateTransformReducer(initialState, transformers) {
  return (state = initialState, action) => {
    if (transformers[action.type]) {
      let newState = JSON.parse(JSON.stringify(state));
      transformers[action.type](newState, action.payload);
      return newState;
    }
    return state;
  }
}

export const actions = {
  router: {
    navigateTo: createActionType('NAVIGATE_TO'),
    syncRoute: createActionType('SYNC_ROUTE'),
  },
  
  time: {
    updateTimeState: createActionType('UPDATE_TIME_STATE'),
  },

  notifications: {
    setPermission: createActionType('SET_NOTIFICATION_PERMISSION'),
  },

  games: {
    toggleFullscreen: createActionType('TOGGLE_FULLSCREEN'),
  },
}; 