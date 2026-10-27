import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

try { Object.assign(process.env, parseEnv(readFileSync('.env.local', 'utf8'))); } catch {}
async function findPort(first) {
  for (let port = first; port < first + 30; port++) {
    const available = await new Promise(resolve => {
      const probe = createServer();
      probe.once('error', () => resolve(false));
      probe.listen(port, '127.0.0.1', () => probe.close(() => resolve(true)));
    });
    if (available) return port;
  }
  throw new Error('No available local port');
}
const frontendPort = await findPort(Number(process.env.PORT || 3000));
const apiPort = await findPort(frontendPort + 1);
const env = { ...process.env, NEXT_PUBLIC_AVAILABILITY_API_URL: process.env.NEXT_PUBLIC_AVAILABILITY_API_URL || `http://127.0.0.1:${apiPort}` };
const api = spawn(process.execPath, ['--import', 'tsx', 'scripts/serve.mjs'], { stdio: 'inherit', env: { ...env, API_ONLY: '1', PORT: String(apiPort), AVAILABILITY_ALLOWED_ORIGIN: `http://localhost:${frontendPort},http://127.0.0.1:${frontendPort}` } });
const frontend = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', String(frontendPort), '--hostname', '0.0.0.0'], { stdio: 'inherit', env });
let stopping = false;
function stop(code = 0) { if (stopping) return; stopping = true; api.kill(); frontend.kill(); process.exitCode = code; }
process.on('SIGINT', () => stop()); process.on('SIGTERM', () => stop());
api.on('exit', code => stop(code || 0)); frontend.on('exit', code => stop(code || 0));
