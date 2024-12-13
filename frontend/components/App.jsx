import React from 'react';
import Timer from './Timer';
import GameDisplay from './GameDisplay';
import './App.css';

export default function App() {
  return (
    <>
      <main>
        <Timer />
      
        <GameDisplay />
      </main>

      <footer className="footer">
        <p>&copy; 2024 PomoParty. All rights reserved.</p>
      </footer>
    </>
  );
}