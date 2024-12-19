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

  console.log(`Starting an ogar3 server on port ${port}`);

  const config = {
    serverPort: port
  };
  
  const ogarProcess = spawn('node', [
    path.join(__dirname, '../ogar3/startServer.js'),
    JSON.stringify(config)
  ], { detached: false });

  serverProcesses.set(port, ogarProcess);

  ogarProcess.stdout.on('data', (data) => {
    process.stdout.write(chalk.dim(`Ogar3 server ${port}: ${data}`));
  });

  ogarProcess.stderr.on('data', (data) => {
    process.stdout.write(`Ogar3 server ${port} error: ${data}`);
  });

  ogarProcess.on('close', (code) => {
    console.log(`Ogar3 server ${port} exited with code ${code}`);
    serverProcesses.delete(port);
  });
}

export function stopRoomAtPort(port) {
  const process = serverProcesses.get(port);
  if (!process) {
    return;
  }

  console.log(`Stopping ogar3 server on port ${port}`);

  process.kill('SIGTERM');
  serverProcesses.delete(port);
}

