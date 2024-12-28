import { actions } from '../actions';
import { rpc } from '../../api';
import * as router from './router';

const initialState = {
  users: [],
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
    case actions.authentication.setUsers.type:
      return { ...state, users: action.payload };
    default:
      return state;
  }
}

export const submitRegistrationForm = ({ username, email, password, repeatPassword }) => async (dispatch) => {
  dispatch(actions.authentication.registrationFormStartLoading.create());
  
  const { data: validationInfo, error } = await rpc('validateNewUser', { username, email, password, repeatPassword });
  if (error) {
    //TODO: send error to unrecoverable toast
    console.error(error);
    dispatch(actions.authentication.registrationFormStopLoading.create());
    return;
  }
  if (!validationInfo.success) {
    dispatch(actions.authentication.registrationFormSetErrorMessages.create(validationInfo.errors));
    dispatch(actions.authentication.registrationFormStopLoading.create());
    return;
  }

  dispatch(actions.authentication.registrationFormStopLoading.create());
  dispatch(actions.authentication.registrationFormSetErrorMessages.create({}));
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

  dispatch(actions.authentication.loginFormStopLoading.create());
  dispatch(actions.authentication.loginFormSetErrorMessages.create({}));
  dispatch(router.navigateTo('/'));
};

export const fetchUsers = () => async (dispatch) => {
  const { data, error } = await rpc('getUsers');
  if (!error) {
    dispatch(actions.authentication.setUsers.create(data));
  }
}; 