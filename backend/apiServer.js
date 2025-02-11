import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as rpcMethods from './rpcMethods.js';
import { SET_COOKIE_SYMBOL } from './rpcMethods.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

export function startApiServer() {
  const app = express();
  const PORT = 8000;
  
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  app.use(cors({
    origin: process.env.CURRENT_HOST,
    credentials: true
  }));

  app.use(express.json());
  app.use(cookieParser());

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

      let result = await rpcMethods[method]({...args, cookies: req.cookies});
      
      if (result && result[SET_COOKIE_SYMBOL]) {
        let cookie = result[SET_COOKIE_SYMBOL];
        res.cookie(cookie.name, cookie.value, cookie.options);
        result = result.responseData;
      }

      res.json({data: result});
    } catch (error) {
      console.error(error);
      res.json({ error: 'Unhandled server error' });
    }
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`API Server listening on port ${PORT}`);
  });
} 