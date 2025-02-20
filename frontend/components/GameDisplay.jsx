import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../store/actions';
import Timer from './Timer';
import './GameDisplay.css';

export default function GameDisplay() {
  const dispatch = useDispatch();
  const { iframeSrc, isFullscreen } = useSelector(state => state.games.ogar);
  const { isNowBreakTime } = useSelector(state => state.time);

  if (!isNowBreakTime) {
    return (
      <div className="mb-8 game-container waiting-screen">
        <Timer styleMode="big" />
      </div>
    );
  }

  return (
    <div className={`mb-8 game-container-wrapper ${(isFullscreen && isNowBreakTime) ? 'fullscreen' : ''}`}>
      <iframe 
        width="1600" 
        height="900" 
        title="PomoParty"
        src={iframeSrc}
        className="game-container"
      ></iframe>
      <div className="overlay">
        <button 
          className="fullscreen-button"
          onClick={() => dispatch(actions.games.toggleFullscreen.create())}
          onMouseDown={(e) => e.preventDefault()}
          tabIndex="-1"
        > ⤢ </button>
        <Timer styleMode="compact" />
      </div>
    </div>
  );
} 