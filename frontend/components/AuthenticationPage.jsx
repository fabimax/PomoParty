import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

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
      <p className="text-center text-sm text-gray-500 mt-4">(for now these only check the variables and don't actually do anything else)</p>
    </div>
  );
} 