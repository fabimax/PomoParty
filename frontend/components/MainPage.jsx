import React from 'react';
import GameDisplay from './GameDisplay';
import Chat from './Chat';

export default function MainPage() {
  return (
    <div>
      <p className="game-times">Five-minute games start at :00 and :30 every hour!</p>
      <GameDisplay />
      <Chat />
    </div>
  );
} 