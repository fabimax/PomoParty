import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import ProfileDisplay from './ProfileDisplay';
import { useSelector } from 'react-redux';

export default function AuthenticationPage() {
  const currentUser = useSelector(state => state.authentication.currentUser);

  if (currentUser.loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-4">
      {!currentUser.isLoggedIn && 
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
      {currentUser.isLoggedIn && <ProfileDisplay />}
    </div>
  );
} 