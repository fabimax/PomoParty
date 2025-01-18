import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { useSelector, useDispatch } from 'react-redux';
import * as authentication from '../store/modules/authentication';

export default function AuthenticationPage() {
  const currentUser = useSelector(state => state.authentication.currentUser);
  const dispatch = useDispatch();

  if (currentUser.loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-4">
      { !currentUser.isLoggedIn && 
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
          <RegistrationForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          <LoginForm />
        </div>
      </div>
      }
      { currentUser.isLoggedIn &&
        <div>
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded shadow-lg border border-gray-700 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center">You are logged in as {currentUser.username}</h2>
            <p >Email: {currentUser.email}</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={() => dispatch(authentication.logout())}>Log Out</button>
          </div>
        </div>
      }
    </div>
  );
} 