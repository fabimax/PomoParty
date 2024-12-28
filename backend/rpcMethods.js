import * as authentication from './authentication.js';

export async function getUsers({args}) {
  return await authentication.getUsers();
}

export async function validateNewUser({args}) {
  let {username, email, password, repeatPassword} = args;
  return await authentication.validateNewUser({username, email, password, repeatPassword});
}

export async function createUser({args}) {
  let {username, email, password} = args;
  return await authentication.createUser({username});
}

export async function validateLogin({args}) {
  let {username, password} = args;
  return await authentication.validateLogin({username, password});
} 