import { actions } from '../actions';

const initialState = {
  permission: 'default'
};

export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.notifications.setPermission.type:
      return { ...state, permission: action.payload };
    default:
      return state;
  }
};

export const sendNotification = (title, options = {}) => () => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

export const initializeNotifications = () => (dispatch) => {
  console.log('Current notification permission:', Notification.permission);
  dispatch(actions.notifications.setPermission.create(Notification.permission));
};

export const requestNotificationPermission = () => async (dispatch) => {
  const permission = await Notification.requestPermission();
  dispatch(actions.notifications.setPermission.create(permission));
  return permission;
};