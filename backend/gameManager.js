import { startRoom, stopRoomAtPort } from './ogar3Server.js';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

export async function startGameManager() {
  updateGameServerStatus();
  setInterval(updateGameServerStatus, 1000);
}

function updateGameServerStatus() {
  if (shouldGameBeRunning()) {
    startRoom({port: 8100});
  } else {
    stopRoomAtPort(8100);
  }
}

function shouldGameBeRunning() {
  if (process.env.ALWAYS_BACKEND_GAMESERVER_RUNNING === 'true') {
    return true;
  }

  const now = moment();
  const minute = now.minutes();
  const second = now.seconds();
  
  const isFirstGamePeriod = 
    (minute === 24 && second >= 30) ||
    (minute >= 25 && minute <= 29) ||
    (minute === 30 && second < 30);
      
  const isSecondGamePeriod = 
    (minute === 54 && second >= 30) ||
    (minute >= 55 && minute <= 59) ||
    (minute === 0 && second < 30);
  
  return isFirstGamePeriod || isSecondGamePeriod;
}