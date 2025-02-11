import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import clockImage from '../public/pomoclock.png';
import './Timer.css';

export default function Timer({ styleMode = 'big' }) {
  const { secondsRemaining, nextEvent } = useSelector(state => state.time);

  const formatTime = (totalSeconds) => {
    const duration = moment.duration(totalSeconds, 'seconds');
    return `${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;
  };

  if (styleMode === 'compact') {
    return (
      <div className="timer-container compact">
        <span className="compact-text">{nextEvent} in {formatTime(secondsRemaining)}</span>
      </div>
    );
  }

  return (
    <div className="timer-container">
      <img src={clockImage} alt="Pomodoro Clock" className="timer-image" />
      <div className="timer-content">
        <h2 className="timer-heading">{nextEvent} In:</h2>
        <div className="countdown-display">{formatTime(secondsRemaining)}</div>
      </div>
    </div>
  );
} 