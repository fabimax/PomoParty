import * as databaseSchema from './databaseSchema.js';
import db from './database.js';
import * as yup from 'yup';
import { eq, sql } from 'drizzle-orm';
import * as cryptography from './cryptography.js';

const userSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .matches( /^[a-zA-Z0-9._\-!#$%^&*()+=<>?/\[\]{}|~]*$/, 'Username contains forbidden characters')
    .max(30, 'Too long! Username must be less than 30 characters long')
    .test('unique', 'Username is already taken', async function(value) {
      if (!value) return true; // Skip if empty, let required validation handle it
      const existingUser = await db.select()
        .from(databaseSchema.users)
        .where(sql`LOWER(${databaseSchema.users.username}) = ${value.toLowerCase()}`)
        .get();
      return !existingUser;
    }),
  
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Too long! Email must be less than 255 characters long')
    .test('unique', 'Email is already registered', async function(value) {
      if (!value) return true; // Skip if empty, let required validation handle it
      const existingUser = await db.select()
        .from(databaseSchema.users)
        .where(sql`LOWER(${databaseSchema.users.email}) = ${value.toLowerCase()}`)
        .get();
      return !existingUser;
    }),
  
  password: yup.string()
    .required('Password is required')
    .min(15, 'Too short! Password must be at least 15 characters long')
    .max(1024, 'Too long! Password must be less than 1024 characters long'),
  
  repeatPassword: yup.string()
    .required('Please repeat your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

export async function createUser({username, email, password}) {
  let {success: isUserInfoValid, errors: userInfoErrors } = await validateNewUser({username, email, password, repeatPassword: password});
  if (!isUserInfoValid) {
    console.error(userInfoErrors);
    throw new Error('Invalid user info');
  }
  let uuid = crypto.randomUUID();
  let passwordHash = await cryptography.hashPassword(password);
  await db.insert(databaseSchema.users).values({ uuid, username, email, passwordHash });
  return uuid;
}

export async function validateNewUser(user) {
  try {
    const validatedData = await userSchema.validate(user, { abortEarly: false });
    return {
      success: true,
    };
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      throw error;
    }

    const errors = error.inner.reduce((acc, err) => {
      if (!acc[err.path]) {
        acc[err.path] = [];
      }
      acc[err.path].push(err.message);
      return acc;
    }, {});
      
    return {
      success: false,
      errors
    };
  }
}

const loginSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .test('userExists', 'User not found', async function(value) {
      let user = await db.select().from(databaseSchema.users).where(eq(databaseSchema.users.username, value)).get();
      return !!user;
    }),
  
  password: yup.string()
    .required('Password is required')
    .test('passwordCorrect', 'Wrong password', async function(value) {
      let user = await db.select().from(databaseSchema.users).where(eq(databaseSchema.users.username, this.parent.username)).get();
      if (!user) {
        return true;
      }
      return await cryptography.isPasswordCorrect(value, user.passwordHash);
    }),
});

export async function getUsers() {
  return await db.select().from(databaseSchema.users);
}

export async function validateLogin(credentials) {
  try {
    await loginSchema.validate(credentials, { abortEarly: false });

    let user = await db.select().from(databaseSchema.users).where(eq(databaseSchema.users.username, credentials.username)).get();

    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      userId: user.uuid
    };
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      throw error;
    }

    const errors = error.inner.reduce((acc, err) => {
      if (!acc[err.path]) {
        acc[err.path] = [];
      }
      acc[err.path].push(err.message);
      return acc;
    }, {});
      
    return {
      success: false,
      errors
    };
  }
}

export async function getAuthJWT({userId, password}) {
  let user = await db.select().from(databaseSchema.users).where(eq(databaseSchema.users.uuid, userId)).get();
  if (!user) {
    throw new Error('User not found');
  }

  if (await cryptography.isPasswordCorrect(password, user.passwordHash)) {
    return cryptography.signJWT({version: 1, userId: user.uuid});
  } else {
    throw new Error('Wrong password, you should have validated it first');
  }
}

export function callerIdFromJWT(jwt) {
  if (!jwt) {
    return null;
  }
  let parsedJWT = cryptography.parseJWT(jwt);
  if (!parsedJWT) {
    return null;
  }
  return parsedJWT.userId;
}

export async function getUserById(userId) {
  let user = await db.select().from(databaseSchema.users).where(eq(databaseSchema.users.uuid, userId)).get();
  return {
    id: user.uuid,
    username: user.username,
    email: user.email
  };
}