const initialState = {
  ogar: {
    iframeSrc: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8100' 
      : 'https://pomoparty-ogar.liz-lovelace.com',
    isFullscreen: false
  }
};

export function gamesReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        ogar: {
          ...state.ogar,
          isFullscreen: !state.ogar.isFullscreen
        }
      };
    default:
      return state;
  }
} 