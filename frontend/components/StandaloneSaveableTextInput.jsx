import React from 'react';
import { AiOutlineLoading3Quarters as LoadingIcon } from "react-icons/ai";

export default function StandaloneSaveableTextInput({ 
  value, 
  onChange, 
  placeholder,
  className = "",
  label,
  subLabel,
  type = "text",
  errorMessages = [],
  isDisabled = false,
  isLoading = false,
  isControlsShown = false,
  onCancel,
  onSave,
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
      <div className="flex gap-2">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className={`flex-1 p-2 border rounded bg-gray-700 text-white placeholder-gray-400 ${
            errorMessages.length > 0 ? 'border-red-500' : 'border-gray-600'
          } ${
            isDisabled 
              ? 'opacity-50' 
              : ''
          } ${className}`}
        />
        {isControlsShown && !isLoading && (
          <>
            <button className={`px-4 py-2 bg-green-600 text-white rounded transition-colors hover:bg-green-700`} onClick={onSave} disabled={isDisabled}>
              Save
            </button>
            <button className={`px-4 py-2 border border-gray-500 text-gray-300 hover:bg-gray-700 rounded transition-colors`} onClick={onCancel} disabled={isDisabled}>
              Cancel
            </button>
          </>
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <LoadingIcon className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>
      {errorMessages.map((error, index) => (
        <p key={index} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ))}
    </div>
  );
} 