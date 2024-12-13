import { startApiServer } from './apiServer.js';
import { startGameManager } from './gameManager.js';

main()

async function main() {
  startGameManager();

  const apiServer = startApiServer();

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    apiServer.close();
    process.exit();
  });
}