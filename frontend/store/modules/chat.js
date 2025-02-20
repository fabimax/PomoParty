import { createActions } from '../actions';
import { stateTransformReducer } from '../actions';
import { standardApiRequest } from '../standardApiRequest';

const actions = createActions({
  setChatMessages: 'SET_CHAT_MESSAGES',
  setChatLoading: 'SET_CHAT_LOADING',
  setDraftMessage: 'SET_DRAFT_MESSAGE',
  setAutoRefreshing: 'SET_AUTO_REFRESHING',
  setChatValidationErrors: 'SET_CHAT_VALIDATION_ERRORS',
});

export const chatReducer = stateTransformReducer({
  shownMessages: [],
  loading: false,
  draftMessage: '',
  isAutoRefreshing: false,
  validationErrors: {},
}, {
  [actions.setChatMessages.type]: (state, messages) => {
    state.shownMessages = messages;
  },
  [actions.setChatLoading.type]: (state, isLoading) => {
    state.loading = isLoading;
  },
  [actions.setDraftMessage.type]: (state, text) => {
    state.draftMessage = text;
  },
  [actions.setAutoRefreshing.type]: (state, isRefreshing) => {
    state.isAutoRefreshing = isRefreshing;
  },
  [actions.setChatValidationErrors.type]: (state, errors) => {
    state.validationErrors = errors;
  },
});

export const updateDraftMessage = (text) => (dispatch) => {
  dispatch(actions.setDraftMessage.create(text));
};

export const enableAutoChatRefreshing = () => async (dispatch) => {
  try {
    await dispatch(fetchChatMessages());
  } catch (err) { }
  dispatch(actions.setAutoRefreshing.create(true));
};

export const disableAutoChatRefreshing = () => (dispatch) => {
  dispatch(actions.setAutoRefreshing.create(false));
};

export const fetchChatMessages = () => async (dispatch) => {
  const messages = await dispatch(standardApiRequest({
    method: 'getChatMessages',
    errorMessage: 'Failed to fetch chat messages',
  }));
  
  if (messages) {
    dispatch(actions.setChatMessages.create(messages));
  }
};

export const initializeChat = () => (dispatch, getState) => {
  setInterval(() => {
    if (!getState().chat.isAutoRefreshing) {
      return;
    }
    dispatch(fetchChatMessages());
  }, 3000);
};

export const sendChatMessage = () => async (dispatch, getState) => {
  const text = getState().chat.draftMessage;
  if (!text.trim()) return;

  console.log('sending chat message');
  const result = await dispatch(standardApiRequest({
    method: 'sendChatMessage',
    args: { text },
    errorMessage: 'Failed to send message',
    dispatchSetLoading: actions.setChatLoading,
  }));

  if (!result.success) {
    dispatch(actions.setChatValidationErrors.create(result.errors || {}));
    return;
  }

  dispatch(actions.setChatValidationErrors.create({}));
  console.log('sent chat message');

  await dispatch(fetchChatMessages());
  dispatch(actions.setDraftMessage.create(''));
}; 