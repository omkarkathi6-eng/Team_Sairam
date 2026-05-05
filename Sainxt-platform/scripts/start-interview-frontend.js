const { exec } = require('child_process');
const path = require('path');

const interviewFrontendPath = path.join(__dirname, '../interview-frontend');

console.log('Starting interview frontend development server...');

const viteProcess = exec('npm run dev', { cwd: interviewFrontendPath });

viteProcess.stdout.on('data', (data) => {
  console.log(`[Vite] ${data}`);
});

viteProcess.stderr.on('data', (data) => {
  console.error(`[Vite Error] ${data}`);
});

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping interview frontend...');
  viteProcess.kill();
  process.exit();
});
