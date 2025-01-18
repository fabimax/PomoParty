import { actions } from '../actions';
import { rpc } from '../../api';
import * as router from './router';

const initialState = {
  currentUser: {
    isLoggedIn: false,
    id: null,
    username: null,
    loading: true,
  },
  registrationForm: {
    loading: false,
    validationErrors: {}
  },
  loginForm: {
    loading: false,
    validationErrors: {}
  }
};

export function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case actions.authentication.registrationFormStartLoading.type:
      return { 
        ...state, 
        registrationForm: { ...state.registrationForm, loading: true } 
      };
    case actions.authentication.registrationFormStopLoading.type:
      return { 
        ...state, 
        registrationForm: { ...state.registrationForm, loading: false } 
      };
    case actions.authentication.registrationFormSetErrorMessages.type:
      return { 
        ...state, 
        registrationForm: { ...state.registrationForm, validationErrors: action.payload } 
      };
    case actions.authentication.loginFormStartLoading.type:
      return { 
        ...state, 
        loginForm: { ...state.loginForm, loading: true } 
      };
    case actions.authentication.loginFormStopLoading.type:
      return { 
        ...state, 
        loginForm: { ...state.loginForm, loading: false } 
      };
    case actions.authentication.loginFormSetErrorMessages.type:
      return { 
        ...state, 
        loginForm: { ...state.loginForm, validationErrors: action.payload } 
      };
    case actions.authentication.updateCurrentUser.type:
      return { 
        ...state, 
        currentUser: { ...state.currentUser, ...action.payload, loading: false } 
      };
    case actions.authentication.startLoadingCurrentUser.type:
      return { 
        ...state, 
        currentUser: { ...state.currentUser, loading: true } 
      };
    default:
      return state;
  }
}

export const submitRegistrationForm = ({ username, email, password, repeatPassword }) => async (dispatch) => {
  dispatch(actions.authentication.registrationFormStartLoading.create());
  
  const { data: validationInfo, error: validationError } = await rpc('validateNewUser', { username, email, password, repeatPassword });

  if (validationError) {
    // TODO: send error to unrecoverable toast
    console.error(validationError);
    dispatch(actions.authentication.registrationFormStopLoading.create());
    return;
  }

  if (!validationInfo.success) {
    dispatch(actions.authentication.registrationFormSetErrorMessages.create(validationInfo.errors));
    dispatch(actions.authentication.registrationFormStopLoading.create());
    return;
  }

  const { data: userId, error: createUserError } = await rpc('createUser', { username, email, password });

  if (createUserError) {
    // TODO: send error to unrecoverable toast
    console.error(createUserError);
    dispatch(actions.authentication.registrationFormStopLoading.create());
    return;
  }

  dispatch(actions.authentication.registrationFormSetErrorMessages.create({}));

  const { data: authCookieInfo, error: authCookieError } = await rpc('getAuthCookie', { userId, password });

  if (authCookieError) {
    // TODO: send error to unrecoverable toast
    console.error(authCookieError);
    dispatch(actions.authentication.registrationFormStopLoading.create());
    return;
  }

  await dispatch(initializeCurrentUser());
  dispatch(actions.authentication.registrationFormStopLoading.create());
  dispatch(router.navigateTo('/'));
};

export const submitLoginForm = ({ username, password }) => async (dispatch) => {
  dispatch(actions.authentication.loginFormStartLoading.create());
  
  const { data: validationInfo, error } = await rpc('validateLogin', { username, password });
  if (error) {
    console.error(error);
    dispatch(actions.authentication.loginFormStopLoading.create());
    return;
  }
  
  if (!validationInfo.success) {
    dispatch(actions.authentication.loginFormSetErrorMessages.create(validationInfo.errors));
    dispatch(actions.authentication.loginFormStopLoading.create());
    return;
  }

  dispatch(actions.authentication.loginFormSetErrorMessages.create({}));

  const { error: authCookieError } = await rpc('getAuthCookie', { userId: validationInfo.userId, password });
  if (authCookieError) {
    // TODO: send error to unrecoverable toast
    console.error(authCookieError);
    dispatch(actions.authentication.loginFormStopLoading.create());
    return;
  }

  await dispatch(initializeCurrentUser());
  dispatch(actions.authentication.loginFormStopLoading.create());
  dispatch(router.navigateTo('/'));
};

export const logout = () => async (dispatch) => {
  await rpc('clearAuthCookie');
  await dispatch(initializeCurrentUser());
};

export const initializeCurrentUser = () => async (dispatch) => {
  dispatch(actions.authentication.startLoadingCurrentUser.create());
  const { data: currentUser, error } = await rpc('getCurrentUser');
  if (error) {
    // TODO: send error to unrecoverable toast
    console.error(error);
    dispatch(actions.authentication.updateCurrentUser.create({ isLoggedIn: false }));
    return;
  }
  if (!currentUser) {
    dispatch(actions.authentication.updateCurrentUser.create({ isLoggedIn: false }));
    return;
  }
  dispatch(actions.authentication.updateCurrentUser.create({ isLoggedIn: true, ...currentUser }));
};