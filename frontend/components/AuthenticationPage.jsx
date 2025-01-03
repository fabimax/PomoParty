import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import DebugUserViewer from './DebugUserViewer';

export default function AuthenticationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
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
      <DebugUserViewer />
    </div>
  );
} 