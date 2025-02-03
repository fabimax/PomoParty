import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as authentication from '../store/modules/authentication';
import { requestNotificationPermission } from '../store/modules/notifications';
import StandaloneSaveableTextInput from './StandaloneSaveableTextInput';

export default function ProfileDisplay() {
  const currentUser = useSelector(state => state.authentication.currentUser);
  const profileSettings = useSelector(state => state.authentication.profileSettings);
  const notificationPermission = useSelector(state => state.notifications.permission);
  const dispatch = useDispatch();

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded shadow-lg border border-gray-700 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">
        You are logged in as {currentUser.username}
      </h2>
      <StandaloneSaveableTextInput
        label="Username"
        placeholder="Enter your username"
        value={profileSettings.username.localValue}
        onChange={e => dispatch(authentication.updateLocalProfileSetting('username', e.target.value))}
        errorMessages={profileSettings.username.errorMessages}
        isDisabled={profileSettings.username.isDisabled}
        isLoading={profileSettings.username.isLoading}
        isControlsShown={profileSettings.username.isControlsShown}
        onCancel={() => dispatch(authentication.cancelLocalProfileSetting('username'))}
        onSave={() => dispatch(authentication.saveProfileSetting('username'))}
      />
      <StandaloneSaveableTextInput
        label="Email"
        placeholder="Enter your email"
        value={profileSettings.email.localValue}
        onChange={e => dispatch(authentication.updateLocalProfileSetting('email', e.target.value))}
        errorMessages={profileSettings.email.errorMessages}
        isDisabled={profileSettings.email.isDisabled}
        isLoading={profileSettings.email.isLoading}
        isControlsShown={profileSettings.email.isControlsShown}
        onCancel={() => dispatch(authentication.cancelLocalProfileSetting('email'))}
        onSave={() => dispatch(authentication.saveProfileSetting('email'))}
      />
      
      {notificationPermission !== 'granted' && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => dispatch(requestNotificationPermission())}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md w-full"
          >
            Enable Notifications
          </button>
        </div>
      )}

      <button 
        className="bg-red-500 text-white px-4 py-2 rounded mt-4" 
        onClick={() => dispatch(authentication.logout())}
      >
        Log Out
      </button>
    </div>
  );
} 