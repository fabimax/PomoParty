import React from 'react';
import { useSelector } from 'react-redux';

export default function App() {
  return (
    <>
    <header>
        <div className="auth-container">
            <span id="username-display"></span>
            <a href="/login" id="authButton">Login</a>
        </div>
    </header>

    <main>
        <section id="hero">
            <h2>Next Game Starts In:</h2>
            <div id="countdownTimer">Game Time</div>

            <p className="gameTimes">Games start at :25 and :55 every hour!</p>
            
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
        </section>
        
        <section id="game-container" style={{ display: 'none' }}>
            <iframe 
                width="800" 
                height="600" 
                title="PomoParty Game"
            ></iframe>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 PomoParty. All rights reserved.</p>
    </footer>
    </>
  );
}

/*
<script>
    async function checkAuthStatus() {
        try {
            const response = await fetch('/profile', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const user = await response.json();
                document.getElementById('username-display').textContent = user.name;
                document.getElementById('authButton').textContent = 'Logout';
                document.getElementById('authButton').href = '/logout';
            } else {
                document.getElementById('username-display').textContent = '';
                document.getElementById('authButton').textContent = 'Login';
                document.getElementById('authButton').href = '/login';
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    // Check auth status when page loads
    checkAuthStatus();

    let currentIframe = null;

    document.getElementById('joinRoom').addEventListener('click', async () => {
        const port = document.getElementById('portInput').value;
        const errorElement = document.getElementById('error-message');
        const gameContainer = document.getElementById('game-container');
        
        // Clear previous error
        errorElement.textContent = '';
        
        // Validate port
        if (!port || port < 8081 || port > 8100) {
            errorElement.textContent = 'Please enter a valid port between 8081 and 8100';
            return;
        }
        
        try {
            const response = await fetch('/getRoomKey', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ port })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Remove existing iframe if it exists
                if (currentIframe) {
                    currentIframe.remove();
                }

                // Create new iframe
                const iframe = document.createElement('iframe');
                iframe.width = '800';
                iframe.height = '600';
                iframe.frameBorder = '0';
                iframe.title = 'PomoParty Game';
                
                // Set the src after adding to DOM to ensure clean state
                gameContainer.innerHTML = '';
                gameContainer.appendChild(iframe);
                gameContainer.style.display = 'block';
                
                // Store reference to current iframe
                currentIframe = iframe;
                
                // Set src last to trigger fresh connection
                iframe.src = 'http://localhost:8080';
            } else {
                errorElement.textContent = data.error || 'Failed to join room';
            }
        } catch (error) {
            console.error('Failed to join room:', error);
            errorElement.textContent = 'Failed to connect to server';
        }
    });
</script>
*/