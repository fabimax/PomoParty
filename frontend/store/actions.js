const createActionType = (type) => ({
  type,
  create: (payload) => ({ type, payload })
});

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
  }
}; 