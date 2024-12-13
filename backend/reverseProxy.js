// WARNING: THIS FILE HAS NOT BEEN REFACTORED


import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

// Configuration
const PROXY_PORT = 9000;
const TARGET_PORT = 8084;
const TARGET_HOST = 'localhost';
const TARGET_URL = `http://${TARGET_HOST}:${TARGET_PORT}`;

// Create Express app
const app = express();

// Add cookie parser middleware
app.use(cookieParser());

// Log middleware to inspect cookies
app.use((req, res, next) => {
    if (req.cookies) {
        console.log('Cookies:', req.cookies);
    }
    next();
});

// Create proxy middleware
const proxyMiddleware = createProxyMiddleware({
    target: TARGET_URL,
    ws: true, // Enable WebSocket proxy
    changeOrigin: true,
    logLevel: 'debug',
    
    // Optional: Modify headers or handle specific paths
    onProxyReq: (proxyReq, req, res) => {
        // You can modify proxy request headers here if needed
        console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
    },

    // Handle WebSocket upgrades
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
        console.log('WebSocket connection:', req.url);
    },

    // Handle proxy errors
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
    }
});

// Apply proxy middleware to all routes
app.use('/', proxyMiddleware);

// Start the server
const server = app.listen(PROXY_PORT, () => {
    console.log(`Reverse Proxy Server running on port ${PROXY_PORT}`);
    console.log(`Forwarding to ${TARGET_URL}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
