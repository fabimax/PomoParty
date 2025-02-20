import * as authentication from './authentication.js';
import * as chat from './chat.js';
import moment from 'moment';
import { eq } from 'drizzle-orm';

export const SET_COOKIE_SYMBOL = Symbol('SET_COOKIE');

function responseWithCookie({responseData, cookie}) {
  return {
    [SET_COOKIE_SYMBOL]: cookie,
    responseData,
  };
}

function callerIdFromCookies(cookies) {
  if (!cookies) {
    return null;
  }
  return authentication.callerIdFromJWT(cookies['pomoparty-auth']);
}

export async function validateNewUser({username, email, password, repeatPassword}) {
  username = username.trim();
  email = email.trim();
  return await authentication.validateNewUser({username, email, password, repeatPassword});
}

export async function createUser({username, email, password}) {
  username = username.trim();
  email = email.trim();
  return await authentication.createUser({username, email, password});
}

export async function validateLogin({username, password}) {
  username = username.trim();
  return await authentication.validateLogin({username, password});
} 

export async function getCurrentUser({cookies}) {
  const userId = callerIdFromCookies(cookies);
  if (!userId) {
    return null;
  }
  return await authentication.getUserById(userId);
}

export async function updateUserSetting({cookies, field, value}) {
  const userId = callerIdFromCookies(cookies);
  if (!userId) {
    throw new Error('User not logged in');
  }
  if (!['username', 'email'].includes(field)) {
    throw new Error('Invalid field');
  }
  value = value.trim();
  let {success, updatedUser, errors} = await authentication.updateUserSetting({userId, field, value});
  if (success) {
    return {
      success,
      updatedUser: {
        id: updatedUser.uuid,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    }
  } else {
    return {
      success,
      errors,
    }
  }
}

export async function getAuthCookie({userId, password}) {
  const jwt = await authentication.getAuthJWT({userId, password});
  return responseWithCookie({
    responseData: true,
    cookie: {
      name: 'pomoparty-auth',
      value: jwt,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV != 'development',
        sameSite: 'strict'
      }
    }
  });
}

export async function clearAuthCookie() {
  return responseWithCookie({
    responseData: true,
    cookie: {
      name: 'pomoparty-auth',
      value: '',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV != 'development',
        sameSite: 'strict',
        expires: new Date(0)
      }
    }
  });
}

export async function getChatMessages() {
  return await chat.getAllMessages();
}

export async function sendChatMessage({ cookies, text }) {
  const userId = callerIdFromCookies(cookies);
  
  const validationResult = await chat.validateMessage({ text });
  if (!validationResult.success) {
    return validationResult;
  }

  await chat.createMessage({
    userId,
    text,
  });

  return { success: true };
}