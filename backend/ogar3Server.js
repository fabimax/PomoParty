import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverProcesses = new Map();

export function startRoom({port}) {
    if (serverProcesses.has(port)) {
        return;
    }

    console.log(`Starting server on port ${port}`);

    const config = {
        serverPort: port
    };
    
    const process = spawn('node', [
        path.join(__dirname, '../ogar3/startServer.js'),
        JSON.stringify(config)
    ], { detached: false });

    serverProcesses.set(port, process);

    process.stdout.on('data', (data) => {
        console.write(chalk.dim(`Server ${port}: ${data}`));
    });

    process.stderr.on('data', (data) => {
        console.write(`Server ${port} error: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`Server ${port} exited with code ${code}`);
        serverProcesses.delete(port);
    });
}

export function stopRoomAtPort(port) {
    const process = serverProcesses.get(port);
    if (!process) {
        return;
    }

    console.log(`Stopping server on port ${port}`);

    process.kill('SIGTERM');
    serverProcesses.delete(port);
}

