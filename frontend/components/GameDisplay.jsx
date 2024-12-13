import React from 'react';
import { useSelector } from 'react-redux';

export default function GameDisplay() {
  const { iframeSrc } = useSelector(state => state.games.ogar);
  const { isNowBreakTime } = useSelector(state => state.time);

  const containerStyle = {
    width: '100%',
    maxWidth: '90vw',
    height: '900px',
    margin: '0 auto',
    display: 'block',
  };

  if (!isNowBreakTime) {
    return (
      <div 
        style={{
          ...containerStyle,
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#16db93',
          fontSize: '2rem',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
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
      style={containerStyle}
    ></iframe>
  );
} 