import React from 'react';
import { useSelector } from 'react-redux';
import './GameDisplay.css';

export default function GameDisplay() {
  const { iframeSrc } = useSelector(state => state.games.ogar);
  const { isNowBreakTime } = useSelector(state => state.time);

  if (!isNowBreakTime) {
    return (
      <div className="game-container waiting-screen">
        Waiting for a new game to start...
      </div>
    );
  }

  return (
    <iframe 
      width="1600" 
      height="900" 
      title="PomoParty"
      src={iframeSrc}
      className="game-container"
    ></iframe>
  );
} 