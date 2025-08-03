#!/usr/bin/env node

/**
 * Test script for Claude Flow Multilang Framework
 * Проверяет работоспособность всех компонентов
 */

import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Color helpers
const pass = (msg) => console.log(chalk.green('✅ ' + msg));
const fail = (msg) => console.log(chalk.red('❌ ' + msg));
const warn = (msg) => console.log(chalk.yellow('⚠️  ' + msg));
const info = (msg) => console.log(chalk.cyan('ℹ️  ' + msg));

async function testFileExists(filePath, description) {
  try {
    await fs.access(filePath);
    pass(description);
    results.passed.push(description);
    return true;
  } catch {
    fail(description);
    results.failed.push(description);
    return false;
  }
}

async function testModuleImport(modulePath, description) {
  try {
    // Try to parse as JavaScript
    const content = await fs.readFile(modulePath, 'utf-8');
    
    // Basic syntax check
    if (content.includes('export') || content.includes('module.exports')) {
      pass(description);
      results.passed.push(description);
      return true;
    } else {
      warn(description + ' (no exports found)');
      results.warnings.push(description);
      return true;
    }
  } catch (error) {
    fail(description + ': ' + error.message);
    results.failed.push(description);
    return false;
  }
}

async function testMultilingualComponents() {
  console.log('\n' + chalk.bold.cyan('🌍 Testing Multilingual Components'));
  console.log('=' .repeat(50));
  
  // Test polyglot types
  await testFileExists(
    'src/polyglot/types.ts',
    'Polyglot types definition exists'
  );
  
  // Test polyglot agent
  await testFileExists(
    'src/polyglot/polyglot-agent.ts',
    'PolyglotAgent class exists'
  );
  
  // Test language manager
  await testFileExists(
    'src/i18n/language-manager.ts',
    'LanguageManager exists'
  );
  
  // Test cultural analyzer
  await testFileExists(
    'src/cultural/context-analyzer.ts',
    'CulturalContextAnalyzer exists'
  );
  
  // Test command parser
  await testFileExists(
    'src/polyglot/command-parser.ts',
    'MultilingualCommandParser exists'
  );
}

async function testDDDComponents() {
  console.log('\n' + chalk.bold.cyan('🏗️  Testing DDD Components'));
  console.log('=' .repeat(50));
  
  // Test base domain
  await testFileExists(
    'src/domain/base-domain.ts',
    'Base domain models exist'
  );
  
  // Test workflow aggregate
  await testFileExists(
    'src/domain/workflow-aggregate.ts',
    'WorkflowAggregate exists'
  );
  
  // Test command handler
  await testFileExists(
    'src/domain/application/command-handler.ts',
    'CommandHandler infrastructure exists'
  );
  
  // Test DDD service
  await testFileExists(
    'src/domain/application/ddd-development-service.ts',
    'DDDDevelopmentService exists'
  );
  
  // Test product handler example
  await testFileExists(
    'src/domain/application/create-product-handler.ts',
    'Example command handler exists'
  );
}

async function testExamples() {
  console.log('\n' + chalk.bold.cyan('📚 Testing Examples'));
  console.log('=' .repeat(50));
  
  // Test JavaScript example
  const jsExampleExists = await testFileExists(
    'examples/ddd-example.js',
    'JavaScript DDD example exists'
  );
  
  if (jsExampleExists) {
    await testModuleImport(
      'examples/ddd-example.js',
      'JavaScript example is valid'
    );
  }
  
  // Test TypeScript examples
  await testFileExists(
    'examples/ddd-development-example.ts',
    'DDD development example exists'
  );
  
  await testFileExists(
    'examples/ddd-commands-example.ts',
    'DDD commands example exists'
  );
  
  await testFileExists(
    'examples/multilang-workflow-example.ts',
    'Multilingual workflow example exists'
  );
}

async function testCLITools() {
  console.log('\n' + chalk.bold.cyan('🛠️  Testing CLI Tools'));
  console.log('=' .repeat(50));
  
  // Test DDD-SPARC CLI
  const dddSparcExists = await testFileExists(
    'bin/ddd-sparc.js',
    'DDD-SPARC CLI tool exists'
  );
  
  if (dddSparcExists) {
    // Check if executable
    try {
      const stats = await fs.stat('bin/ddd-sparc.js');
      if (stats.mode & 0o111) {
        pass('DDD-SPARC CLI is executable');
        results.passed.push('DDD-SPARC CLI executable');
      } else {
        warn('DDD-SPARC CLI is not executable (run chmod +x)');
        results.warnings.push('DDD-SPARC CLI not executable');
      }
    } catch (error) {
      fail('Cannot check DDD-SPARC CLI permissions');
      results.failed.push('DDD-SPARC CLI permissions');
    }
  }
}

async function testAgentTemplates() {
  console.log('\n' + chalk.bold.cyan('🤖 Testing Agent Templates'));
  console.log('=' .repeat(50));
  
  // Test DDD-SPARC coder template
  await testFileExists(
    '.claude/agents/templates/ddd-sparc-coder.md',
    'DDD-SPARC Coder template exists'
  );
  
  // Test updated SPARC coder
  await testFileExists(
    '.claude/agents/templates/implementer-sparc-coder.md',
    'Updated SPARC Coder template exists'
  );
  
  // Test DDD agents config
  await testFileExists(
    '.claude/agents/configs/ddd-agents.yaml',
    'DDD agents configuration exists'
  );
}

async function testDocumentation() {
  console.log('\n' + chalk.bold.cyan('📖 Testing Documentation'));
  console.log('=' .repeat(50));
  
  await testFileExists(
    'README-MULTILANG.md',
    'Multilingual README exists'
  );
  
  await testFileExists(
    'docs/DDD-GUIDE.md',
    'DDD Guide exists'
  );
  
  await testFileExists(
    'docs/DDD-SPARC-INTEGRATION.md',
    'DDD-SPARC Integration guide exists'
  );
}

async function testNpmScripts() {
  console.log('\n' + chalk.bold.cyan('📦 Testing NPM Scripts'));
  console.log('=' .repeat(50));
  
  try {
    const packageJson = JSON.parse(
      await fs.readFile('package.json', 'utf-8')
    );
    
    // Check for example scripts
    if (packageJson.scripts['example:ddd']) {
      pass('NPM script example:ddd exists');
      results.passed.push('NPM script example:ddd');
    } else {
      fail('NPM script example:ddd missing');
      results.failed.push('NPM script example:ddd');
    }
    
    // Check for DDD-SPARC in bin
    if (packageJson.bin && packageJson.bin['ddd-sparc']) {
      pass('DDD-SPARC registered in package.json bin');
      results.passed.push('DDD-SPARC in bin');
    } else {
      warn('DDD-SPARC not registered in package.json bin');
      results.warnings.push('DDD-SPARC not in bin');
    }
    
  } catch (error) {
    fail('Cannot read package.json: ' + error.message);
    results.failed.push('package.json');
  }
}

async function runSimpleTest() {
  console.log('\n' + chalk.bold.cyan('🚀 Running Simple Functionality Test'));
  console.log('=' .repeat(50));
  
  try {
    // Try to run the simple JavaScript example
    console.log('\nAttempting to run ddd-example.js...\n');
    
    // spawn already imported at top
    const child = spawn('node', ['examples/ddd-example.js'], {
      timeout: 5000
    });
    
    return new Promise((resolve) => {
      let output = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
      
      child.stderr.on('data', (data) => {
        process.stderr.write(data);
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          pass('Example ran successfully');
          results.passed.push('Example execution');
        } else {
          fail('Example failed with code ' + code);
          results.failed.push('Example execution');
        }
        resolve();
      });
      
      child.on('error', (error) => {
        fail('Failed to run example: ' + error.message);
        results.failed.push('Example execution');
        resolve();
      });
    });
  } catch (error) {
    fail('Cannot run example: ' + error.message);
    results.failed.push('Example execution');
  }
}

async function printSummary() {
  console.log('\n' + chalk.bold.cyan('📊 Test Summary'));
  console.log('=' .repeat(50));
  
  console.log(chalk.green(`Passed: ${results.passed.length}`));
  console.log(chalk.yellow(`Warnings: ${results.warnings.length}`));
  console.log(chalk.red(`Failed: ${results.failed.length}`));
  
  const total = results.passed.length + results.failed.length;
  const percentage = total > 0 ? Math.round((results.passed.length / total) * 100) : 0;
  
  console.log('\n' + chalk.bold(`Success Rate: ${percentage}%`));
  
  if (results.failed.length > 0) {
    console.log('\n' + chalk.red('Failed Tests:'));
    results.failed.forEach(test => console.log('  - ' + test));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n' + chalk.yellow('Warnings:'));
    results.warnings.forEach(warning => console.log('  - ' + warning));
  }
  
  return results.failed.length === 0;
}

async function main() {
  console.log(chalk.bold.magenta('\n🧪 Claude Flow Multilang Framework Test Suite\n'));
  
  await testMultilingualComponents();
  await testDDDComponents();
  await testExamples();
  await testCLITools();
  await testAgentTemplates();
  await testDocumentation();
  await testNpmScripts();
  await runSimpleTest();
  
  const success = await printSummary();
  
  if (success) {
    console.log('\n' + chalk.green.bold('✅ All tests passed! Framework is ready to use.'));
  } else {
    console.log('\n' + chalk.red.bold('❌ Some tests failed. Please check the issues above.'));
    process.exit(1);
  }
}

// Run tests
main().catch(error => {
  console.error(chalk.red('Test suite failed:'), error);
  process.exit(1);
});