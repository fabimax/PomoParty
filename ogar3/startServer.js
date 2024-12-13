const GameServer = require('./GameServer.js');

// Get config from command line argument if provided
let config = {};
if (process.argv[2]) {
    try {
        config = JSON.parse(process.argv[2]);
    } catch (e) {
        console.error('Invalid config JSON provided:', e);
    }
}

// Create and start server
const server = new GameServer();

// Override provided config values
for (let key in config) {
    if (config.hasOwnProperty(key)) {
        server.config[key] = config[key];
    }
}

server.start();
