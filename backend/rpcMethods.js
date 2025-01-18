import * as authentication from './authentication.js';

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

export async function getCurrentUser({cookies}) {
  const userId = callerIdFromCookies(cookies);
  if (!userId) {
    return null;
  }
  return await authentication.getUserById(userId);
}