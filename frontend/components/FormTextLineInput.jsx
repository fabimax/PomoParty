import React from 'react';

export default function FormTextLineInput({ 
  value, 
  onChange, 
  placeholder,
  className = "",
  label,
  subLabel,
  type = "text",
  errorMessages = [],
  disabled = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <div className="mb-1">
          <label className={`cursor-text w-min block text-base font-semibold`}>
            {label}
          </label>
          {subLabel && (
            <span className={`block text-sm`}>
              {subLabel}
            </span>
          )}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400 ${
          errorMessages.length > 0 ? 'border-red-500' : 'border-gray-600'
        } ${
          disabled 
            ? 'bg-gray-800 text-gray-500' 
            : ''
        } ${className}`}
      />
      {errorMessages.map((error, index) => (
        <p key={index} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ))}
    </div>
  );
} 