import { rpc } from '../api';
import { showToast } from './modules/toast';

export const standardApiRequest = ({method, args, errorMessage, dispatchSetLoading, dispatchIfSuccess, dispatchIfError}) => async (dispatch) => {
  if (dispatchSetLoading) {
    dispatchThunkOrAction(dispatch, dispatchSetLoading, true);
  }
  const { data, error } = await rpc(method, args);
  if (dispatchSetLoading) {
    dispatchThunkOrAction(dispatch, dispatchSetLoading, false);
  }

  if (error) {
    dispatch(showToast({message: errorMessage || error, type: 'error'}));
    if (dispatchIfError) {
      dispatchThunkOrAction(dispatch, dispatchIfError, error);
    }
    throw error;
  } 

  if (dispatchIfSuccess) {
    dispatchThunkOrAction(dispatch, dispatchIfSuccess, data);
  }

  return data;
};

function dispatchThunkOrAction(dispatch, thunkOrAction, data) {
  if (typeof thunkOrAction === 'function') {
    dispatch(thunkOrAction(data));
  } else if (thunkOrAction.create){
    dispatch(thunkOrAction.create(data));
  } else {
    dispatch(thunkOrAction);
  }
}