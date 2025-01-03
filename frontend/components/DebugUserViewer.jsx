import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as authentication from '../store/modules/authentication';

export default function DebugUserViewer() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.authentication.users);

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <button 
        onClick={() => dispatch(authentication.fetchUsers())}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200"
      >
        Fetch Users
      </button>
      <pre className="bg-gray-900 p-4 rounded overflow-auto">
        {JSON.stringify(users, null, 2)}
      </pre>
    </div>
  );
} 