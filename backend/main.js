import { startApiServer } from './apiServer.js';
import { startGameManager } from './gameManager.js';

main()

async function main() {
  // startGameManager();

  startApiServer();

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    process.exit();
  });
}