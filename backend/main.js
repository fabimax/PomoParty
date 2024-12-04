import Docker from 'dockerode';
import { startReverseProxy } from './reverseProxy.js';
import { startApiServer } from './apiServer.js';
import { db } from './db/index.js';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const docker = new Docker();

async function main() {
    // Run migrations
    /*
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: './backend/db/migrations' });
    */
    
    const startPort = 8081;
    const containerCount = 20;
    
    // Create array of ports
    const ports = Array.from(
        {length: containerCount}, 
        (_, i) => startPort + i
    );
    
    // Start the API server
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

console.time('main');
await main();
console.timeEnd('main');
async function launchRoom(port) {
    const container = await docker.createContainer({
        Image: 'pomotest',
        ExposedPorts: {
            '8081/tcp': {}
        },
        HostConfig: {
            PortBindings: {
                '8081/tcp': [
                    {
                        HostPort: port.toString()
                    }
                ]
            }
        },
        Labels: {
            'app': 'ogar3'
        }
    });

    await container.start();
    return container;
}

async function cleanupOgar3Containers() {
    const containers = await docker.listContainers({
        all: true,
        filters: {
            label: ['app=ogar3']
        }
    });

    const runningContainers = containers.filter(containerInfo => containerInfo.State === 'running');
    
    await Promise.all(runningContainers.map(containerInfo => 
        docker.getContainer(containerInfo.Id).kill()
    ));

    await Promise.all(containers.map(containerInfo => 
        docker.getContainer(containerInfo.Id).remove()
    ));
}

