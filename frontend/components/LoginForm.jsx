import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as authentication from '../store/modules/authentication';
import FormTextLineInput from './FormTextLineInput';
import { AiOutlineLoading3Quarters as LoadingIcon } from "react-icons/ai";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, validationErrors } = useSelector(state => state.authentication.loginForm);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authentication.submitLoginForm({ 
      username: formData.username,
      password: formData.password
    }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="mb-4">
        <FormTextLineInput
          label="Username"
          value={formData.username}
          onChange={handleChange('username')}
          placeholder="Enter your username"
          errorMessages={validationErrors?.username || []}
          disabled={loading}
        />
        <FormTextLineInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="Enter your password"
          errorMessages={validationErrors?.password || []}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded transition-colors duration-200 flex items-center justify-center ${
            loading ? 'bg-blue-700 cursor-wait' : 'hover:bg-blue-500'
          }`}
        >
          Log in
          {loading && (
            <LoadingIcon className="ml-2 animate-spin" />
          )}
        </button>
      </form>
    </div>
  );
} 