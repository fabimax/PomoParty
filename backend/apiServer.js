import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import openid from 'express-openid-connect';
const { auth, requiresAuth } = openid;
import dotenv from 'dotenv';
import { db } from './db/index.js';
import { rooms } from './db/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config();

export function startApiServer() {
    const app = express();
    const PORT = 8000;
    
    // Get the directory name in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const config = {
        authRequired: false,
        auth0Logout: true,
        baseURL: process.env.CURRENT_HOST,
        clientID: process.env.AUTH0_CLIENT_ID,
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
        secret: process.env.AUTH0_SECRET,
    };


    app.use(auth(config));

    app.use(cors({
        origin: process.env.CURRENT_HOST,

        credentials: true
    }));
    app.use(express.json());

    app.use('/', express.static(path.join(__dirname, '../dist')));

    // Add a route to get user profile
    app.get('/profile', requiresAuth(), (req, res) => {
        res.json(req.oidc.user);
    });

    const availableRooms = Array.from({length: 20}, (_, i) => 8081 + i);

    // Update getRoomKey to require authentication
    app.post('/getRoomKey', requiresAuth(), async (req, res) => {
        const { port } = req.body;
        const portNumber = parseInt(port);

        if (!availableRooms.includes(portNumber)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid port. Must be between 8081 and 8100' 
            });
        }

        res.cookie('room', portNumber, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        res.json({ 
            success: true,
            user: req.oidc.user
        });
    });

    const server = app.listen(PORT, () => {
        console.log(`API Server listening on port ${PORT}`);
    });

    return server;
} 