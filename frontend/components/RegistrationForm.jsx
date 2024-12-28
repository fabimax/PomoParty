import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as authentication from '../store/modules/authentication';
import FormTextLineInput from './FormTextLineInput';
import { AiOutlineLoading3Quarters as LoadingIcon } from "react-icons/ai";

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.authentication.users);
  const { loading, validationErrors } = useSelector(state => state.authentication.registrationForm);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authentication.submitRegistrationForm({ 
      username: formData.username,
      email: formData.email,
      password: formData.password,
      repeatPassword: formData.repeatPassword
    }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="mb-4">
        <FormTextLineInput
          label="Username"
          value={formData.username}
          onChange={handleChange('username')}
          placeholder="Enter a username"
          errorMessages={validationErrors.username || []}
          disabled={loading}
        />
        <FormTextLineInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="Enter your email"
          errorMessages={validationErrors.email || []}
          disabled={loading}
        />
        <FormTextLineInput
          label="Password"
          subLabel="At least 15 characters"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="Enter your password"
          errorMessages={validationErrors.password || []}
          disabled={loading}
        />
        <FormTextLineInput
          label="Repeat&nbsp;Password"
          type="password"
          value={formData.repeatPassword}
          onChange={handleChange('repeatPassword')}
          placeholder="Repeat your password"
          errorMessages={validationErrors.repeatPassword || []}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded transition-colors duration-200 flex items-center justify-center ${
            loading ? 'bg-blue-700 cursor-wait' : 'hover:bg-blue-500'
          }`}
        >
          Create user
          {loading && (
            <LoadingIcon className="ml-2 animate-spin" />
          )}
        </button>
      </form>
    </div>
  );
} 