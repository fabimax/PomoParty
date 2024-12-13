import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import './Timer.css';

export default function Timer() {
  const { secondsRemaining, nextEvent } = useSelector(state => state.time);

  const formatTime = (totalSeconds) => {
    const duration = moment.duration(totalSeconds, 'seconds');
    return `${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <h2 className="timer-heading">{nextEvent} In:</h2>
      <div className="countdown-display">{formatTime(secondsRemaining)}</div>
      <p className="game-times">Games start at :25 and :55 every hour!</p>
    </div>
  );
} 