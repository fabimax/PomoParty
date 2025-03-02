import { createActions } from '../actions';
import { stateTransformReducer } from '../actions';
import { standardApiRequest } from '../standardApiRequest';

const actions = createActions({
  setTodos: 'SET_TODOS',
  setTodoLoading: 'SET_TODO_LOADING',
  setDraftTodo: 'SET_DRAFT_TODO',
  setEditingTodoId: 'SET_EDITING_TODO_ID',
  setEditText: 'SET_EDIT_TEXT',
});

export const todoReducer = stateTransformReducer({
  todos: [],
  loading: false,
  draftTodo: '',
  editingTodoId: null,
  editText: '',
}, {
  [actions.setTodos.type]: (state, newTodos) => {
    let todos = [];
    for (const todo of newTodos) {
      todos.push({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        createdAt: todo.createdAt,
      });
    }
    state.todos = todos;
  },
  [actions.setTodoLoading.type]: (state, isLoading) => {
    state.loading = isLoading;
  },
  [actions.setDraftTodo.type]: (state, text) => {
    state.draftTodo = text;
  },
  [actions.setEditingTodoId.type]: (state, id) => {
    state.editingTodoId = id;
  },
  [actions.setEditText.type]: (state, text) => {
    state.editText = text;
  },
});

export const fetchTodos = () => async (dispatch) => {
  const todos = await dispatch(standardApiRequest({
    method: 'getMyTodos',
    errorMessage: 'Failed to fetch todos',
    dispatchSetLoading: actions.setTodoLoading,
  }));
  
  if (todos) {
    dispatch(actions.setTodos.create(todos));
  }
};

export const updateDraftTodo = (text) => (dispatch) => {
  dispatch(actions.setDraftTodo.create(text));
};

export const createTodo = () => async (dispatch, getState) => {
  const text = getState().todo.draftTodo;
  if (!text.trim()) return;

  const result = await dispatch(standardApiRequest({
    method: 'createTodo',
    args: { text },
    errorMessage: 'Failed to create todo',
    dispatchSetLoading: actions.setTodoLoading,
  }));

  if (result) {
    dispatch(actions.setTodos.create(result));
    dispatch(actions.setDraftTodo.create(''));
  }
};

export const setTodoComplete = (uuid, complete) => async (dispatch) => {
  const result = await dispatch(standardApiRequest({
    method: 'setTodoComplete',
    args: { uuid, complete },
    errorMessage: 'Failed to update todo',
    dispatchSetLoading: actions.setTodoLoading,
  }));

  if (result) {
    dispatch(actions.setTodos.create(result));
  }
};

export const deleteTodo = (uuid) => async (dispatch) => {
  const result = await dispatch(standardApiRequest({
    method: 'deleteTodo',
    args: { uuid },
    errorMessage: 'Failed to delete todo',
    dispatchSetLoading: actions.setTodoLoading,
  }));

  if (result) {
    dispatch(actions.setTodos.create(result));
  }
};

export const startEditingTodo = (todoId) => (dispatch, getState) => {
  const todo = getState().todo.todos.find(todo => todo.id === todoId);
  if (todo) {
    dispatch(actions.setEditingTodoId.create(todoId));
    dispatch(actions.setEditText.create(todo.text));
  }
};

export const updateEditText = (text) => (dispatch) => {
  dispatch(actions.setEditText.create(text));
};

export const editTodoText = (uuid, newText) => async (dispatch) => {
  if (!newText.trim()) return;
  
  const result = await dispatch(standardApiRequest({
    method: 'editTodoText',
    args: { uuid, newText },
    errorMessage: 'Failed to update todo',
    dispatchSetLoading: actions.setTodoLoading,
  }));

  if (result) {
    dispatch(actions.setTodos.create(result));
    dispatch(actions.setEditingTodoId.create(null));
    dispatch(actions.setEditText.create(''));
  }
}; 

export const cancelEditing = () => (dispatch) => {
  dispatch(actions.setEditingTodoId.create(null));
  dispatch(actions.setEditText.create(''));
};