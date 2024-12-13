import React from 'react';
import { useSelector } from 'react-redux';
import Timer from './Timer';
import GameDisplay from './GameDisplay';

export default function App() {
  return (
    <>
    {/*<header>
         <div className="auth-container">
            <span id="username-display"></span>
            <a href="/login" id="authButton">Login</a>
        </div> 
    </header>*/}

    <main>
        <section id="hero">
            <Timer />
            
            {/*
            <div id="room-join">
                <input 
                    type="number" 
                    id="portInput" 
                    placeholder="Enter port (8081-8100)"
                    min="8081"
                    max="8100"
                />
                <button id="joinRoom">Join Game</button>
                <div id="error-message" style={{ color: 'red' }}></div>
            </div>
            */}
        </section>
        
        <section id="game-container">
            <GameDisplay />
        </section>
    </main>

    <footer>
        <p>&copy; 2024 PomoParty. All rights reserved.</p>
    </footer>
    </>
  );
}