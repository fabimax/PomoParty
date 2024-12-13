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

  games: {
    // Empty for now, but ready for future game actions
  }
}; 