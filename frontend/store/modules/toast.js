import { createActions, stateTransformReducer } from '../actions';

let actions = createActions({
  showToast: 'SHOW_TOAST',
})

export const toastReducer = stateTransformReducer({
    message: null,
    type: null,
    id: null,
  }, {
  [actions.showToast.type]: (state, payload) => {
    state.message = payload.message;
    state.type = payload.type;
    state.id = payload.id;
  }
})

export const showToast = ({message, type}) => (dispatch) => {
  console.log(`${type} toast: ${message}`);
  dispatch(actions.showToast.create({ message, type, id: Math.random() }));
}
