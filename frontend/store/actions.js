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
  },

  authentication: {
    setUsers: createActionType('SET_USERS'),
    registrationFormStartLoading: createActionType('REGISTRATION_FORM_START_LOADING'),
    registrationFormStopLoading: createActionType('REGISTRATION_FORM_STOP_LOADING'),
    registrationFormSetErrorMessages: createActionType('REGISTRATION_FORM_SET_ERROR_MESSAGES'),
    loginFormStartLoading: createActionType('LOGIN_FORM_START_LOADING'),
    loginFormStopLoading: createActionType('LOGIN_FORM_STOP_LOADING'),
    loginFormSetErrorMessages: createActionType('LOGIN_FORM_SET_ERROR_MESSAGES'),
    startLoadingCurrentUser: createActionType('START_LOADING_CURRENT_USER'),
    updateCurrentUser: createActionType('UPDATE_CURRENT_USER'),
  }
}; 