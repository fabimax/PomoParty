import { createActions } from '../actions';
import { stateTransformReducer } from '../actions';
import { standardApiRequest } from '../standardApiRequest';

const actions = createActions({
  setChatMessages: 'SET_CHAT_MESSAGES',
  setChatLoading: 'SET_CHAT_LOADING',
  setDraftMessage: 'SET_DRAFT_MESSAGE',
});

export const chatReducer = stateTransformReducer({
  shownMessages: [],
  loading: false,
  draftMessage: '',
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
});

export const updateDraftMessage = (text) => (dispatch) => {
  dispatch(actions.setDraftMessage.create(text));
};

export const fetchChatMessages = () => async (dispatch) => {
  const messages = await dispatch(standardApiRequest({
    method: 'getChatMessages',
    errorMessage: 'Failed to fetch chat messages',
    dispatchSetLoading: actions.setChatLoading,
  }));
  
  if (messages) {
    dispatch(actions.setChatMessages.create(messages));
  }
};

export const sendChatMessage = () => async (dispatch, getState) => {
  const text = getState().chat.draftMessage;
  if (!text.trim()) return;

  await dispatch(standardApiRequest({
    method: 'sendChatMessage',
    args: { text },
    errorMessage: 'Failed to send message',
    dispatchSetLoading: actions.setChatLoading,
  }));

  await dispatch(fetchChatMessages());
  dispatch(actions.setDraftMessage.create(''));
}; 