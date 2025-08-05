#!/usr/bin/env node

// Fallback CLI entry point for claude-flow-multilang
// This file ensures the package can be executed via npx

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to run the main bin file
const binPath = join(__dirname, 'bin', 'claude-flow.js');

const child = spawn('node', [binPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: false
});

child.on('error', (err) => {
  console.error('Failed to start claude-flow:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});