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

  const now = moment()
  const minute = now.minutes();
  const second = now.seconds();
  
  const isFirstGamePeriod = 
    (minute >= 29 && minute <= 35);
      
  const isSecondGamePeriod = 
    (minute === 59) ||
    (minute >= 0 && minute <= 5)

  return isFirstGamePeriod || isSecondGamePeriod;
}