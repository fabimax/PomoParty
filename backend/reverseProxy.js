import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

export function startReverseProxy() {
    const app = express();
    const PORT = 8080;
    
    // Cache for proxy instances
    const proxyCache = new Map();

    app.use(cookieParser());

    const getOrCreateProxy = (portNumber) => {
        if (proxyCache.has(portNumber)) {
            return proxyCache.get(portNumber);
        }

        const proxy = createProxyMiddleware({
            target: `http://localhost:${portNumber}`,
            ws: true,
            changeOrigin: true,
            onError: (err, req, res) => {
                console.error('Proxy Error:', err);
                res.status(502).send('Proxy Error');
            }
        });

        proxyCache.set(portNumber, proxy);
        return proxy;
    };

    const handleRoomProxy = (req, res, next) => {
        const roomPort = req.cookies.room;
        
        if (!roomPort) {
            return res.status(400).send('Please join a room first');
        }

        const portNumber = parseInt(roomPort);
        if (isNaN(portNumber) || portNumber < 8081 || portNumber > 8100) {
            return res.status(400).send('Invalid room');
        }

        const proxy = getOrCreateProxy(portNumber);
        return proxy(req, res, next);
    };

    app.use('/', handleRoomProxy);

    const server = app.listen(PORT, () => {
        console.log(`Reverse proxy listening on port ${PORT}`);
    });

    server.on('upgrade', (req, socket, head) => {
        console.log('WebSocket upgrade request received');
        
        if (!req.headers.cookie) {
            console.log('No cookies found in upgrade request');
            socket.destroy();
            return;
        }

        const cookies = req.headers.cookie.split(';')
            .reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});

        const roomPort = cookies?.room;

        if (!roomPort) {
            console.log('No room cookie found in upgrade request');
            socket.destroy();
            return;
        }

        const portNumber = parseInt(roomPort);
        if (isNaN(portNumber) || portNumber < 8081 || portNumber > 8100) {
            console.log('Invalid room port number:', roomPort);
            socket.destroy();
            return;
        }

        console.log(`Upgrading WebSocket connection for room port: ${portNumber}`);
        const proxy = getOrCreateProxy(portNumber);
        
        proxy.upgrade(req, socket, head, (err) => {
            if (err) {
                console.error('WebSocket upgrade error:', err);
                socket.destroy();
            }
        });
    });

    return server;
}