#!/usr/bin/env node

// Main CLI entry point for claude-flow-multilang
// This file ensures the package can be executed via npx

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try different paths in order of preference
const possiblePaths = [
  // Direct path to simple-cli.js
  join(__dirname, 'src', 'cli', 'simple-cli.js'),
  // Bin path for npm global installs
  join(__dirname, 'bin', 'claude-flow.js'),
  // Shell script version
  join(__dirname, 'bin', 'claude-flow')
];

// Find the first existing file
let execPath = null;
for (const path of possiblePaths) {
  if (existsSync(path)) {
    execPath = path;
    break;
  }
}

if (!execPath) {
  console.error('❌ Could not find claude-flow executable');
  console.error('Searched paths:', possiblePaths);
  process.exit(1);
}

// Determine how to execute based on file extension
const isShellScript = !execPath.endsWith('.js');
const args = isShellScript ? [execPath, ...process.argv.slice(2)] : [execPath, ...process.argv.slice(2)];
const command = isShellScript ? 'sh' : 'node';

const child = spawn(command, args, {
  stdio: 'inherit',
  shell: false
});

child.on('error', (err) => {
  console.error('Failed to start claude-flow:', err.message);
  
  // If it's a shell script that failed, try the JS version
  if (isShellScript) {
    console.log('Trying JavaScript version...');
    const jsPath = join(__dirname, 'src', 'cli', 'simple-cli.js');
    if (existsSync(jsPath)) {
      const jsChild = spawn('node', [jsPath, ...process.argv.slice(2)], {
        stdio: 'inherit',
        shell: false
      });
      
      jsChild.on('error', (jsErr) => {
        console.error('JavaScript version also failed:', jsErr.message);
        process.exit(1);
      });
      
      jsChild.on('exit', (code) => {
        process.exit(code || 0);
      });
    } else {
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
});

child.on('exit', (code) => {
  process.exit(code || 0);
});