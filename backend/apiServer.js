import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import openid from 'express-openid-connect';
const { auth: authBak, requiresAuth } = openid;
import dotenv from 'dotenv';
import * as auth from './authentication.js';
import * as rpcMethods from './rpcMethods.js';

dotenv.config();

export function startApiServer() {
  const app = express();
  const PORT = 8000;
  
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  const authConfig = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.CURRENT_HOST,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    secret: process.env.AUTH0_SECRET,
  };

  app.use(authBak(authConfig));

  if (process.env.NODE_ENV === 'development') {
    app.use(cors({
      origin: 'http://localhost:1234',
      credentials: true
    }));
  } else {
    app.use(cors({
      origin: process.env.CURRENT_HOST,
      credentials: true
    }));
  }

  app.use(express.json());

  app.use('/', express.static(path.join(__dirname, '../dist')));

  app.post('/rpc', async (req, res) => {
    try {
      if (process.env.SIMULATE_RPC_DELAY_MS) {
        await new Promise(resolve => setTimeout(resolve, process.env.SIMULATE_RPC_DELAY_MS));
      }
      const { method, args } = req.body;
      if (!method) {
        return res.json({ error: 'Method is required' });
      }
      if (!rpcMethods[method]) {
        return res.json({ error: `RPC method "${method}" not found` });
      }
      const data = await rpcMethods[method]({args});
      res.json({data: data || true});
    } catch (error) {
      console.error(error);
      res.json({ error: 'Unhandled server error' });
    }
  });

  app.get('/profile', requiresAuth(), (req, res) => {
    res.json(req.oidc.user);
  });

  const availableRooms = Array.from({length: 20}, (_, i) => 8081 + i);

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

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  const server = app.listen(PORT, () => {
    console.log(`API Server listening on port ${PORT}`);
  });
} 