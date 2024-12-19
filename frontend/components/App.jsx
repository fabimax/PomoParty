import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GameDisplay from './GameDisplay';
import { requestNotificationPermission } from '../store/modules/notifications';
import './App.css';

export default function App() {
  const dispatch = useDispatch();
  const notificationPermission = useSelector(state => state.notifications.permission);

  return (
    <>
      <h1 className="text-center text-4xl font-bold mt-8 mb-8">PomoParty</h1>
      <main>
        <p className="game-times">Games start at :25 and :55 every hour!</p>
        <GameDisplay />
        {notificationPermission !== 'granted' && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => dispatch(requestNotificationPermission())}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
            >
              Enable Notifications
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 PomoParty. All rights reserved.</p>
      </footer>
    </>
  );
}