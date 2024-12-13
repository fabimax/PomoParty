import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import moment from 'moment';

const initialState = {
  router: {
    currentPath: window.location.pathname,
  },
  games: {
    ogar: {
      iframeSrc: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8100' 
        : 'https://pomoparty-ogar.liz-lovelace.com'
    }
  },
  time: {
    secondsRemaining: 0,
    nextEvent: 'Game starts',
    isNowBreakTime: false
  }
};

function routerReducer(state = initialState.router, action) {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        ...state,
        currentPath: action.payload
      };
    case 'SYNC_ROUTE':
      return {
        ...state,
        currentPath: action.payload
      };
    default:
      return state;
  }
}

function gamesReducer(state = initialState.games, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function timeReducer(state = initialState.time, action) {
  switch (action.type) {
    case 'UPDATE_TIME_STATE':
      return {
        ...state,
        secondsRemaining: action.payload.secondsRemaining,
        nextEvent: action.payload.nextEvent,
        isNowBreakTime: action.payload.isNowBreakTime
      };
    default:
      return state;
  }
}

export const navigateTo = (path) => (dispatch) => {
  window.history.pushState(null, '', path);
  
  dispatch({
    type: 'NAVIGATE_TO',
    payload: path
  });
};

export const initializeHistoryListener = () => (dispatch) => {
  window.addEventListener('popstate', () => {
    dispatch({
      type: 'SYNC_ROUTE',
      payload: window.location.pathname
    });
  });

};

export const updateTimeState = () => (dispatch) => {
  const now = moment();
  const currentMinute = now.minutes();
  
  // Determine if we're in a game period (5 minute periods starting at :25 and :55)
  let isGamePeriod = (currentMinute >= 25 && currentMinute < 30) || 
                      (currentMinute >= 55 && currentMinute < 60);

  // Calculate next interval based on current time
  let nextIntervalMinute;
  let secondsToNext;
  
  if (isGamePeriod) {
    // During game periods, count down 5 minutes
    nextIntervalMinute = currentMinute < 30 ? 30 : 0; // Next work period starts at :30 or :00
    const nextInterval = moment(now).minutes(nextIntervalMinute).seconds(0);
    if (nextIntervalMinute === 0) nextInterval.add(1, 'hour');
    secondsToNext = nextInterval.diff(now, 'seconds');
  } else {
    // During work periods, count down to next game
    nextIntervalMinute = currentMinute < 25 ? 25 : 55;
    secondsToNext = moment(now)
      .minutes(nextIntervalMinute)
      .seconds(0)
      .diff(now, 'seconds');
  }

  if (process.env.ALWAYS_FRONTEND_BREAK_TIME === 'true') {
    isGamePeriod = true;
  }

  dispatch({
    type: 'UPDATE_TIME_STATE',
    payload: {
      secondsRemaining: secondsToNext,
      nextEvent: isGamePeriod ? 'Work starts' : 'Game starts',
      isNowBreakTime: isGamePeriod
    }
  });
};

export const startTimeUpdates = () => (dispatch) => {
  dispatch(updateTimeState());
  setInterval(() => {
    dispatch(updateTimeState());
  }, 1000);
};

const rootReducer = combineReducers({
  router: routerReducer,
  games: gamesReducer,
  time: timeReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(initializeHistoryListener());
store.dispatch(startTimeUpdates()); // Start the time updates when store initializes

export default store;

