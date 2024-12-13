import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function Timer() {
  const { secondsRemaining, nextEvent } = useSelector(state => state.time);

  const formatTime = (totalSeconds) => {
    const duration = moment.duration(totalSeconds, 'seconds');
    return `${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <h2 style={styles.heading}>{nextEvent} In:</h2>
      <div style={styles.countdownTimer}>{formatTime(secondsRemaining)}</div>
      <p style={styles.gameTimes}>Games start at :25 and :55 every hour!</p>
    </>
  );
}

const styles = {
  heading: {
    fontSize: '2.5rem',
    color: '#e94560',
    marginBottom: '0.5rem'
  },
  countdownTimer: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#16db93',
    margin: '1rem 0',
    textShadow: '0 0 10px rgba(22, 219, 147, 0.5)'
  },
  gameTimes: {
    fontSize: '1.2rem',
    color: '#16db93',
    marginBottom: '1rem',
    fontWeight: 'bold',
    animation: 'pulse 2s infinite',
  }
}; 