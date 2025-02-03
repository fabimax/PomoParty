import { rpc } from '../../api';
import * as router from './router';
import { showToast } from './toast';
import { standardApiRequest } from '../standardApiRequest';
import { createActions } from '../actions';
import { stateTransformReducer } from '../actions';

let actions = createActions({
  registrationFormSetLoading: 'REGISTRATION_FORM_SET_LOADING',
  registrationFormSetErrorMessages: 'REGISTRATION_FORM_SET_ERROR_MESSAGES',
  loginFormSetLoading: 'LOGIN_FORM_SET_LOADING',
  loginFormSetErrorMessages: 'LOGIN_FORM_SET_ERROR_MESSAGES',
  currentUserSetLoading: 'CURRENT_USER_SET_LOADING',
  updateCurrentUser: 'UPDATE_CURRENT_USER',
  updateLocalProfileSetting: 'UPDATE_LOCAL_PROFILE_SETTING',
  cancelLocalProfileSetting: 'CANCEL_LOCAL_PROFILE_SETTING',
  setProfileSettingUpdating: 'SET_PROFILE_SETTING_UPDATING',
  updateProfileSettingError: 'UPDATE_PROFILE_SETTING_ERROR',
  // updateProfileFromRemote: 'UPDATE_PROFILE_FROM_REMOTE',
});

export const authenticationReducer = stateTransformReducer({
  currentUser: {
    isLoggedIn: false,
    id: null,
    username: null,
    email: null,
    loading: true,
  },
  profileSettings: {
    username: {
      localValue: null,
      isLoading: false,
      isDisabled: false,
      isControlsShown: false,
      errorMessages: [],
    },
    email: {
      localValue: null,
      isLoading: false,
      isDisabled: false,
      isControlsShown: false,
      errorMessages: [],
    },
  },
  registrationForm: {
    loading: false,
    validationErrors: {}
  },
  loginForm: {
    loading: false,
    validationErrors: {}
  },
  }, {

  [actions.updateCurrentUser.type]: (state, payload) => {
    for (let [key, value] of Object.entries(payload)) {
      state.currentUser[key] = value;
      stateUpdateLocalProfileSetting(state, key, value);
    }
  },

  [actions.updateLocalProfileSetting.type]: (state, payload) => {
    stateUpdateLocalProfileSetting(state, payload.key, payload.value);
  },

  [actions.cancelLocalProfileSetting.type]: (state, payload) => {
    if (!Object.keys(state.profileSettings).includes(payload.key)) {
      return console.error(`Profile setting key ${payload.key} not found`);
    }
    state.profileSettings[payload.key].localValue = state.currentUser[payload.key];
    state.profileSettings[payload.key].isControlsShown = false;
    state.profileSettings[payload.key].errorMessages = [];
  },

  [actions.setProfileSettingUpdating.type]: (state, payload) => {
    if (!Object.keys(state.profileSettings).includes(payload.key)) {
      return console.error(`Profile setting key ${payload.key} not found`);
    }
    state.profileSettings[payload.key].isLoading = payload.isUpdating;
    state.profileSettings[payload.key].isDisabled = payload.isUpdating;
    if (payload.isUpdating) {
      state.profileSettings[payload.key].errorMessages = [];
    }
  },

  [actions.updateProfileSettingError.type]: (state, payload) => {
    if (Object.keys(state.profileSettings).includes(payload.key)) {
      state.profileSettings[payload.key].errorMessages = payload.errors;
    }
  },

  [actions.currentUserSetLoading.type]: (state, isLoading) => {
    state.currentUser.loading = isLoading;
  },

  [actions.registrationFormSetLoading.type]: (state, isLoading) => {
    state.registrationForm.loading = isLoading;
  },

  [actions.registrationFormSetErrorMessages.type]: (state, payload) => {
    state.registrationForm.validationErrors = payload;
  },

  [actions.loginFormSetLoading.type]: (state, isLoading) => {
    state.loginForm.loading = isLoading;
  },

  [actions.loginFormSetErrorMessages.type]: (state, payload) => {
    state.loginForm.validationErrors = payload;
  },
});

function stateUpdateLocalProfileSetting(state, key, value) {
  if (!Object.keys(state.profileSettings).includes(key)) {
    return;
  }
  state.profileSettings[key].localValue = value;
  if (value !== state.currentUser[key]) {
    state.profileSettings[key].isControlsShown = true;
  } else {
    state.profileSettings[key].isControlsShown = false;
  }
}

export const submitLoginForm = ({ username, password }) => async (dispatch) => {
  let validationInfo = await dispatch(standardApiRequest({
    method: 'validateLogin',
    args: { username, password },
    errorMessage: 'Failed to validate log in',
    dispatchSetLoading: actions.loginFormSetLoading,
  }));
  
  if (!validationInfo.success) {
    dispatch(actions.loginFormSetErrorMessages.create(validationInfo.errors));
    return;
  }

  dispatch(actions.loginFormSetErrorMessages.create({}));

  await dispatch(standardApiRequest({
    method: 'getAuthCookie',
    args: { userId: validationInfo.userId, password },
    errorMessage: 'Failed to log in',
    dispatchSetLoading: actions.loginFormSetLoading,
  }));

  await dispatch(initializeCurrentUser());
  dispatch(router.navigateTo('/'));
  dispatch(showToast({message: 'You are now logged in', type: 'success'}));
};


export const submitRegistrationForm = ({ username, email, password, repeatPassword }) => async (dispatch) => {
  let validationInfo = await dispatch(standardApiRequest({
    method: 'validateNewUser',
    args: { username, email, password, repeatPassword },
    errorMessage: 'Failed to validate registration',
    dispatchSetLoading: actions.registrationFormSetLoading,
  }));

  if (!validationInfo.success) {
    dispatch(actions.registrationFormSetErrorMessages.create(validationInfo.errors));
    return;
  }

  dispatch(actions.registrationFormSetErrorMessages.create({}));

  let userId = await dispatch(standardApiRequest({
    method: 'createUser',
    args: { username, email, password },
    errorMessage: 'Failed to create user',
    dispatchSetLoading: actions.registrationFormSetLoading,
  }));

  await dispatch(standardApiRequest({
    method: 'getAuthCookie',
    args: { userId, password },
    errorMessage: 'Failed to log in',
    dispatchSetLoading: actions.registrationFormSetLoading,
  }));

  await dispatch(initializeCurrentUser());
  dispatch(router.navigateTo('/'));
  dispatch(showToast({message: 'You are now logged in', type: 'success'}));
};

export const updateLocalProfileSetting = (key, value) => async (dispatch) => {
  dispatch(actions.updateLocalProfileSetting.create({ key, value }));
};

export const cancelLocalProfileSetting = (key) => async (dispatch) => {
  dispatch(actions.cancelLocalProfileSetting.create({ key }));
};

export const saveProfileSetting = (key) => async (dispatch, getState) => {
  let state = getState().authentication;
  let result = await dispatch(standardApiRequest({
    method: 'updateUserSetting',
    args: { field: key, value: state.profileSettings[key].localValue },
    errorMessage: 'Failed to edit profile',
    dispatchSetLoading: isUpdating => actions.setProfileSettingUpdating.create({ key, isUpdating }),
  }));
  if (!result.success) {
    dispatch(actions.updateProfileSettingError.create({ key, errors: result.errors }));
    return;
  }
  dispatch(actions.updateCurrentUser.create({[key]: result.updatedUser[key]}));
  dispatch(showToast({message: 'Profile updated', type: 'success'}));
};

export const initializeCurrentUser = () => async (dispatch) => {
  let currentUser = await dispatch(standardApiRequest({
    method: 'getCurrentUser',
    errorMessage: 'Failed to get current user',
    dispatchSetLoading: actions.currentUserSetLoading,
  }));
  if (!currentUser) {
    dispatch(actions.updateCurrentUser.create({ isLoggedIn: false }));
    return;
  }
  dispatch(actions.updateCurrentUser.create({ isLoggedIn: true, ...currentUser }));
};

export const logout = () => async (dispatch) => {
  await dispatch(standardApiRequest({
    method: 'clearAuthCookie',
    errorMessage: 'Failed to log out',
  }));

  await dispatch(initializeCurrentUser());
  dispatch(showToast({message: 'You are now logged out', type: 'success'}));
};
