import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GameDisplay from './GameDisplay';
import AuthenticationPage from './AuthenticationPage';
import ToastOverlay from './ToastOverlay';
import { navigateTo } from '../store/modules/router';
import MainPage from './MainPage';
import './App.css';

export default function App() {
  const dispatch = useDispatch();
  const currentPath = useSelector(state => state.router.currentPath);
  const currentUser = useSelector(state => state.authentication.currentUser);

  let content = <p className="text-center text-2xl"> Page not found </p>;
  if (currentPath === '/') {
    content = <MainPage />;
  } else if (currentPath === '/profile') {
    content = <AuthenticationPage />;
  }

  return (
    <>
      <header className="bg-blue-900 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <button 
              onClick={() => dispatch(navigateTo('/'))}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              PomoParty
            </button>
          </h1>
          <nav>
            <button
              onClick={() => dispatch(navigateTo('/profile'))}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {currentUser.loading ? 'Loading...' : 
              currentUser.isLoggedIn ? currentUser.username : 'Register / Log in'}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {content}
      </main>

      <ToastOverlay />
    </>
  );
}