const initialState = {
  ogar: {
    iframeSrc: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8100' 
      : 'https://pomoparty-ogar.liz-lovelace.com'
  }
};

export function gamesReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
} 