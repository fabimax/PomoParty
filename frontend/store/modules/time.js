import moment from 'moment';
import { actions } from '../actions';
import { sendNotification } from './notifications';

const initialState = {
  secondsRemaining: 0,
  nextEvent: 'Game starts',
  isNowBreakTime: false,
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

export const updateTimeState = () => (dispatch, getState) => {
  const previousState = getState().time;
  const now = moment()
  const currentMinute = now.minutes();
  
  let isFirstGamePeriod = (currentMinute >= 30 && currentMinute < 35);
  let isSecondGamePeriod = (currentMinute >= 0 && currentMinute < 5);
  let isGamePeriod = isFirstGamePeriod || isSecondGamePeriod;

  // Calculate next game interval start time
  const getNextGameStart = (currentTime) => {
    const hour = currentTime.hour();
    const minute = currentTime.minute();
    
    if (minute < 30) {
      // Next game is at :30
      return moment(currentTime).hour(hour).minute(30).second(0);
    } else if (minute < 60) {
      // Next game is at next hour :00
      return moment(currentTime).add(1, 'hour').minute(0).second(0);
    }
  };

  let secondsToNext;
  if (isGamePeriod) {
    // If we're in a game period, next event is 5 minutes from the period start
    const periodStart = isFirstGamePeriod ? 30 : 0;
    const periodEnd = moment(now).minute(periodStart + 5).second(0);
    if (periodStart === 0) {
      // Handle case when we're in the :00-:05 period
      periodEnd.hour(now.hour());
    }
    secondsToNext = periodEnd.diff(now, 'seconds');
  } else {
    // If we're in work period, get time to next game period
    secondsToNext = getNextGameStart(now).diff(now, 'seconds');
  }

  if (process.env.ALWAYS_FRONTEND_BREAK_TIME === 'true') {
    isGamePeriod = true;
  }

  if (!previousState.isNowBreakTime && isGamePeriod) {
    dispatch(sendNotification('Break Time!', {
      body: 'Time for a 5-minute game break!',
      icon: '/favicon.ico'
    }));
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