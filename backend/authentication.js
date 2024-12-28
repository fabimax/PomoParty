import * as schema from './databaseSchema.js';
import db from './database.js';
import * as yup from 'yup';

// TODO!: username and email uniqueness
const userSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .matches( /^[a-zA-Z0-9._\-!@#$%^&*()+=<>?/\[\]{}|~]*$/, 'Username contains forbidden characters')
    .max(30, 'Too long! Username must be less than 30 characters long')
    .transform(value => value?.trim()),
  
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Too long! Email must be less than 255 characters long'),
  
  password: yup.string()
    .required('Password is required')
    .min(15, 'Too short! Password must be at least 15 characters long')
    .max(1024, 'Too long! Password must be less than 1024 characters long'),
  
  repeatPassword: yup.string()
    .required('Please repeat your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

const loginSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .transform(value => value?.trim()),
  
  password: yup.string()
    .required('Password is required')
});

export async function getUsers() {
  return await db.select().from(schema.users);
}

export async function createUser({username}) {
  let uuid = crypto.randomUUID();
  await db.insert(schema.users).values({ uuid, username });
}

export async function validateNewUser(user) {
  try {
    const validatedData = await userSchema.validate(user, { abortEarly: false });
    return {
      success: true,
      data: validatedData
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

export async function validateLogin(credentials) {
  try {
    const validatedData = await loginSchema.validate(credentials, { abortEarly: false });
    
    // Here you would typically check if the user exists and verify password
    // For now, we'll just validate the format
    return {
      success: true,
      data: validatedData
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