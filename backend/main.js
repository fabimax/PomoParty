// import Docker from 'dockerode';
// import { startReverseProxy } from './reverseProxy.js';
import { startApiServer } from './apiServer.js';
import { startGameManager } from './gameManager.js';
// import { db } from './db/index.js';
// import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

main()
async function main() {
    // Run migrations
    /*
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: './backend/db/migrations' });
    */

    startGameManager();
    const apiServer = startApiServer();
    // Start the reverse proxy
    /*
    const proxyServer = startReverseProxy();
    */
    
    // Launch rooms in parallel
    /*
    console.time('launchRooms');
    await Promise.all(ports.map(port => launchRoom(port)));
    console.timeEnd('launchRooms');
    console.log(`Launched ${containerCount} rooms starting from port ${startPort}`);
    */

    // Update the cleanup handler
    process.on('SIGINT', async () => {
        console.log('Shutting down...');
        // proxyServer.close();
        apiServer.close();
        // await cleanupOgar3Containers();
        process.exit();
    });

}