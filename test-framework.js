#!/usr/bin/env node

/**
 * Simple test script for Claude Flow Multilang Framework
 * Tests basic functionality without dependencies
 */

import { promises as fs } from 'fs';
import { spawn } from 'child_process';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const pass = (msg) => console.log(colors.green + '✅ ' + msg + colors.reset);
const fail = (msg) => console.log(colors.red + '❌ ' + msg + colors.reset);
const warn = (msg) => console.log(colors.yellow + '⚠️  ' + msg + colors.reset);
const info = (msg) => console.log(colors.cyan + 'ℹ️  ' + msg + colors.reset);
const header = (msg) => console.log('\n' + colors.bold + colors.cyan + msg + colors.reset);

const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

async function checkFile(path, description) {
  try {
    await fs.access(path);
    pass(description);
    results.passed++;
    return true;
  } catch {
    fail(description);
    results.failed++;
    return false;
  }
}

async function runTests() {
  console.log(colors.bold + colors.cyan + '\n🧪 Testing Claude Flow Multilang Framework\n' + colors.reset);
  
  header('📁 Core Files');
  await checkFile('package.json', 'package.json exists');
  await checkFile('README-MULTILANG.md', 'Multilingual README exists');
  
  header('🌍 Multilingual Components');
  await checkFile('src/polyglot/types.ts', 'Polyglot types exist');
  await checkFile('src/polyglot/polyglot-agent.ts', 'PolyglotAgent exists');
  await checkFile('src/i18n/language-manager.ts', 'LanguageManager exists');
  await checkFile('src/cultural/context-analyzer.ts', 'CulturalContextAnalyzer exists');
  
  header('🏗️ DDD Components');
  await checkFile('src/domain/base-domain.ts', 'Base domain models exist');
  await checkFile('src/domain/workflow-aggregate.ts', 'WorkflowAggregate exists');
  await checkFile('src/domain/application/command-handler.ts', 'CommandHandler exists');
  await checkFile('src/domain/application/ddd-development-service.ts', 'DDDDevelopmentService exists');
  
  header('📚 Examples');
  await checkFile('examples/ddd-example.js', 'JavaScript example exists');
  await checkFile('examples/ddd-development-example.ts', 'DDD development example exists');
  await checkFile('examples/ddd-commands-example.ts', 'Commands example exists');
  await checkFile('examples/multilang-workflow-example.ts', 'Multilingual example exists');
  
  header('🛠️ CLI Tools');
  await checkFile('bin/ddd-sparc.js', 'DDD-SPARC CLI exists');
  
  header('🤖 Agent Templates');
  await checkFile('.claude/agents/templates/ddd-sparc-coder.md', 'DDD-SPARC template exists');
  await checkFile('.claude/agents/configs/ddd-agents.yaml', 'DDD agents config exists');
  
  header('📖 Documentation');
  await checkFile('docs/DDD-GUIDE.md', 'DDD Guide exists');
  await checkFile('docs/DDD-SPARC-INTEGRATION.md', 'Integration guide exists');
  
  header('🚀 Running Example Test');
  await runExample();
  
  printSummary();
}

async function runExample() {
  return new Promise((resolve) => {
    console.log('  Running ddd-example.js...');
    
    const child = spawn('node', ['examples/ddd-example.js'], {
      timeout: 5000
    });
    
    let output = '';
    let hasError = false;
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      hasError = true;
      console.error(colors.red + data.toString() + colors.reset);
    });
    
    child.on('close', (code) => {
      if (code === 0 && !hasError) {
        pass('Example executed successfully');
        results.passed++;
      } else {
        fail('Example failed with code ' + code);
        results.failed++;
      }
      resolve();
    });
    
    child.on('error', (error) => {
      fail('Failed to run example: ' + error.message);
      results.failed++;
      resolve();
    });
  });
}

function printSummary() {
  header('📊 Summary');
  
  const total = results.passed + results.failed;
  const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;
  
  console.log('  Passed: ' + colors.green + results.passed + colors.reset);
  console.log('  Failed: ' + colors.red + results.failed + colors.reset);
  console.log('  Success Rate: ' + colors.bold + percentage + '%' + colors.reset);
  
  if (results.failed === 0) {
    console.log('\n' + colors.green + colors.bold + '✅ All tests passed! Framework is ready to use.' + colors.reset + '\n');
  } else {
    console.log('\n' + colors.red + colors.bold + '❌ Some tests failed. Check the issues above.' + colors.reset + '\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error(colors.red + 'Test failed: ' + error.message + colors.reset);
  process.exit(1);
});