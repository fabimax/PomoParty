import moment from 'moment';
import { actions } from '../actions';

const initialState = {
  secondsRemaining: 0,
  nextEvent: 'Game starts',
  isNowBreakTime: false
};

export function timeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.time.updateTimeState.type:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export const updateTimeState = () => (dispatch) => {
  const now = moment();
  const currentMinute = now.minutes();
  
  let isGamePeriod = (currentMinute >= 25 && currentMinute < 30) || 
                     (currentMinute >= 55 && currentMinute < 60);

  let nextIntervalMinute;
  let secondsToNext;
  
  if (isGamePeriod) {
    nextIntervalMinute = currentMinute < 30 ? 30 : 0;
    const nextInterval = moment(now).minutes(nextIntervalMinute).seconds(0);
    if (nextIntervalMinute === 0) nextInterval.add(1, 'hour');
    secondsToNext = nextInterval.diff(now, 'seconds');
  } else {
    nextIntervalMinute = currentMinute < 25 ? 25 : 55;
    secondsToNext = moment(now)
      .minutes(nextIntervalMinute)
      .seconds(0)
      .diff(now, 'seconds');
  }

  if (process.env.ALWAYS_FRONTEND_BREAK_TIME === 'true') {
    isGamePeriod = true;
  }

  dispatch(actions.time.updateTimeState.create({
    secondsRemaining: secondsToNext,
    nextEvent: isGamePeriod ? 'Work starts' : 'Game starts',
    isNowBreakTime: isGamePeriod
  }));
};

export const startTimeUpdates = () => (dispatch) => {
  dispatch(updateTimeState());
  setInterval(() => {
    dispatch(updateTimeState());
  }, 1000);
}; 