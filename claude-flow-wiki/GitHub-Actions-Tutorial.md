# 🚀 GitHub Actions Integration Tutorial

## Overview

This comprehensive guide shows how to integrate Claude Flow with GitHub Actions for automated AI-powered workflows. Learn to set up continuous integration, automated code reviews, and intelligent task automation.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Basic Setup](#basic-setup)
- [Workflow Examples](#workflow-examples)
- [Advanced Patterns](#advanced-patterns)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Requirements

- GitHub repository with Actions enabled
- Anthropic API key
- Node.js 18+ in workflow environment
- Basic understanding of GitHub Actions

### Getting Your API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Generate an API key
3. Add to GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key

## Basic Setup

### Minimal Workflow

Create `.github/workflows/claude-flow.yml`:

```yaml
name: Claude Flow Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    types: [ opened, synchronize ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Claude Flow
        run: npm install -g claude-flow@alpha
        
      - name: Run Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze code quality" \
            --output-format json \
            --output-file analysis.json
            
      - name: Upload Results
        uses: actions/upload-artifact@v4
        with:
          name: analysis-results
          path: analysis.json
```

## Workflow Examples

### 1. Automated Code Review on PR

```yaml
name: AI Code Review

on:
  pull_request:
    types: [ opened, synchronize ]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      
    steps:
      - name: Checkout PR
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Get full history for better analysis
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Claude Flow
        run: npm install -g claude-flow@alpha
        
      - name: Get Changed Files
        id: changed-files
        uses: tj-actions/changed-files@v40
        
      - name: Run Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Create file list for review
          echo "${{ steps.changed-files.outputs.all_changed_files }}" > changed_files.txt
          
          # Run AI review
          npx claude-flow@alpha swarm "review code changes in changed_files.txt for bugs, security issues, and improvements" \
            --agents 5 \
            --output-format json \
            --output-file review.json
            
      - name: Parse Review Results
        id: parse-review
        run: |
          # Extract insights and format as markdown
          REVIEW_COMMENT=$(node -e "
            const review = require('./review.json');
            const insights = review.results.insights || [];
            const issues = review.results.errors || [];
            
            console.log('## 🤖 AI Code Review\\n');
            
            if (issues.length > 0) {
              console.log('### ⚠️ Issues Found\\n');
              issues.forEach(issue => console.log('- ' + issue));
              console.log('\\n');
            }
            
            if (insights.length > 0) {
              console.log('### 💡 Suggestions\\n');
              insights.forEach(insight => console.log('- ' + insight));
            }
            
            console.log('\\n---\\n*Powered by Claude Flow ' + review.metadata.version + '*');
          ")
          
          # Save to file for comment
          echo "$REVIEW_COMMENT" > review_comment.md
          
      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const comment = fs.readFileSync('review_comment.md', 'utf8');
            
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### 2. Daily Security Scan

```yaml
name: Security Analysis

on:
  schedule:
    - cron: '0 8 * * *' # Daily at 8 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Environment
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          npm install -g claude-flow@alpha
          npm ci # Install project dependencies for analysis
          
      - name: Run Security Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze codebase for security vulnerabilities, check dependencies, review authentication" \
            --agents 8 \
            --mode distributed \
            --output-format json \
            --output-file security-report.json
            
      - name: Generate Report
        run: |
          # Convert JSON to markdown report
          node -e "
            const report = require('./security-report.json');
            const date = new Date().toISOString().split('T')[0];
            
            let markdown = '# Security Report - ' + date + '\\n\\n';
            markdown += '## Summary\\n';
            markdown += '- Total Issues: ' + (report.results.errors?.length || 0) + '\\n';
            markdown += '- Agents Used: ' + report.summary.totalAgents + '\\n';
            markdown += '- Success Rate: ' + (report.summary.successRate * 100).toFixed(1) + '%\\n\\n';
            
            if (report.results.errors?.length > 0) {
              markdown += '## Issues Found\\n';
              report.results.errors.forEach((error, i) => {
                markdown += (i + 1) + '. ' + error + '\\n';
              });
            }
            
            if (report.results.insights?.length > 0) {
              markdown += '\\n## Recommendations\\n';
              report.results.insights.forEach((insight, i) => {
                markdown += (i + 1) + '. ' + insight + '\\n';
              });
            }
            
            require('fs').writeFileSync('SECURITY_REPORT.md', markdown);
          "
          
      - name: Create Issue if Problems Found
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('security-report.json', 'utf8'));
            
            if (report.results.errors && report.results.errors.length > 0) {
              const markdown = fs.readFileSync('SECURITY_REPORT.md', 'utf8');
              
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: `Security Alert: ${report.results.errors.length} issues found`,
                body: markdown,
                labels: ['security', 'automated']
              });
            }
```

### 3. Test Generation on New Features

```yaml
name: Auto-Generate Tests

on:
  push:
    paths:
      - 'src/**/*.js'
      - 'src/**/*.ts'
    branches:
      - 'feature/*'

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Claude Flow
        run: npm install -g claude-flow@alpha
        
      - name: Identify New Code
        id: new-code
        uses: tj-actions/changed-files@v40
        with:
          files: |
            src/**/*.js
            src/**/*.ts
          files_ignore: |
            **/*.test.js
            **/*.test.ts
            **/*.spec.js
            **/*.spec.ts
            
      - name: Generate Tests
        if: steps.new-code.outputs.any_changed == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Generate tests for changed files
          for file in ${{ steps.new-code.outputs.all_changed_files }}; do
            echo "Generating tests for: $file"
            
            npx claude-flow@alpha sparc tdd "create comprehensive unit tests for $file" \
              --no-interactive \
              --output-format json \
              --output-file "test-${file//\//-}.json"
          done
          
      - name: Create PR with Tests
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "test: add AI-generated tests"
          title: "🧪 Add tests for new features"
          body: |
            ## AI-Generated Tests
            
            This PR adds comprehensive test coverage for recent changes.
            
            ### Files tested:
            ${{ steps.new-code.outputs.all_changed_files }}
            
            Please review the generated tests before merging.
          branch: auto-tests/${{ github.ref_name }}
          base: ${{ github.ref_name }}
```

### 4. Documentation Generation

```yaml
name: Auto-Generate Documentation

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'lib/**'
  workflow_dispatch:
    inputs:
      scope:
        description: 'Documentation scope'
        required: false
        default: 'full'
        type: choice
        options:
          - full
          - api
          - guides
          - examples

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Tools
        run: |
          npm install -g claude-flow@alpha
          npm install -g jsdoc typedoc
          
      - name: Generate Documentation
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          SCOPE="${{ github.event.inputs.scope || 'full' }}"
          
          # Run documentation generation
          npx claude-flow@alpha swarm "generate comprehensive $SCOPE documentation, API references, usage examples, and tutorials" \
            --agents 6 \
            --strategy parallel \
            --output-format json \
            --output-file docs-output.json
            
      - name: Process Documentation
        run: |
          # Extract documentation from results
          node -e "
            const output = require('./docs-output.json');
            const fs = require('fs');
            
            // Create docs directory
            if (!fs.existsSync('docs/generated')) {
              fs.mkdirSync('docs/generated', { recursive: true });
            }
            
            // Process artifacts
            Object.entries(output.results.artifacts || {}).forEach(([key, artifact]) => {
              if (artifact.content) {
                fs.writeFileSync('docs/generated/' + key + '.md', artifact.content);
              }
            });
            
            // Create index
            const insights = output.results.insights || [];
            let index = '# Generated Documentation\\n\\n';
            index += 'Generated on: ' + new Date().toISOString() + '\\n\\n';
            index += '## Contents\\n\\n';
            
            fs.readdirSync('docs/generated').forEach(file => {
              if (file.endsWith('.md') && file !== 'index.md') {
                index += '- [' + file.replace('.md', '') + '](./' + file + ')\\n';
              }
            });
            
            fs.writeFileSync('docs/generated/index.md', index);
          "
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/generated
          destination_dir: api-docs
```

## Advanced Patterns

### 1. Matrix Strategy for Multiple Analyses

```yaml
name: Comprehensive Analysis Matrix

on:
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday

jobs:
  analysis-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        analysis-type:
          - "security vulnerabilities"
          - "performance bottlenecks"
          - "code quality issues"
          - "dependency updates"
          - "architectural improvements"
        agent-count: [3, 5, 8]
        
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Run Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze ${{ matrix.analysis-type }}" \
            --agents ${{ matrix.agent-count }} \
            --output-format json \
            --output-file "results-${{ matrix.analysis-type }}-${{ matrix.agent-count }}.json"
            
      - name: Upload Results
        uses: actions/upload-artifact@v4
        with:
          name: analysis-${{ matrix.analysis-type }}-${{ matrix.agent-count }}
          path: results-*.json
```

### 2. Conditional Workflows

```yaml
name: Smart Analysis

on:
  pull_request:
    types: [ opened, synchronize ]

jobs:
  determine-analysis:
    runs-on: ubuntu-latest
    outputs:
      needs-security: ${{ steps.check.outputs.security }}
      needs-performance: ${{ steps.check.outputs.performance }}
      needs-tests: ${{ steps.check.outputs.tests }}
      
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Check Changed Files
        id: check
        uses: tj-actions/changed-files@v40
        
      - name: Determine Analysis Needs
        run: |
          # Check for security-sensitive changes
          if echo "${{ steps.check.outputs.all_changed_files }}" | grep -E "(auth|security|crypto|password)"; then
            echo "security=true" >> $GITHUB_OUTPUT
          fi
          
          # Check for performance-critical changes
          if echo "${{ steps.check.outputs.all_changed_files }}" | grep -E "(database|cache|api|worker)"; then
            echo "performance=true" >> $GITHUB_OUTPUT
          fi
          
          # Check for missing tests
          if echo "${{ steps.check.outputs.all_changed_files }}" | grep -E "\.js$|\.ts$" | grep -v test; then
            echo "tests=true" >> $GITHUB_OUTPUT
          fi
          
  security-analysis:
    needs: determine-analysis
    if: needs.determine-analysis.outputs.needs-security == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Run Security Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "deep security analysis of authentication changes" \
            --agents 8 \
            --mode distributed
            
  performance-analysis:
    needs: determine-analysis
    if: needs.determine-analysis.outputs.needs-performance == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Run Performance Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze performance impact and suggest optimizations" \
            --agents 5
```

### 3. Parallel Job Orchestration

```yaml
name: Parallel Analysis Pipeline

on:
  workflow_dispatch:

jobs:
  orchestrate:
    runs-on: ubuntu-latest
    outputs:
      swarm-id: ${{ steps.init.outputs.swarm-id }}
      
    steps:
      - name: Initialize Swarm
        id: init
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Initialize distributed swarm
          OUTPUT=$(npx claude-flow@alpha hive init \
            --topology mesh \
            --agents 10 \
            --distributed \
            --output-format json)
            
          SWARM_ID=$(echo "$OUTPUT" | jq -r '.swarmId')
          echo "swarm-id=$SWARM_ID" >> $GITHUB_OUTPUT
          
  analyze-frontend:
    needs: orchestrate
    runs-on: ubuntu-latest
    steps:
      - name: Frontend Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze frontend code" \
            --swarm-id ${{ needs.orchestrate.outputs.swarm-id }} \
            --focus frontend
            
  analyze-backend:
    needs: orchestrate
    runs-on: ubuntu-latest
    steps:
      - name: Backend Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze backend code" \
            --swarm-id ${{ needs.orchestrate.outputs.swarm-id }} \
            --focus backend
            
  analyze-database:
    needs: orchestrate
    runs-on: ubuntu-latest
    steps:
      - name: Database Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze database schema and queries" \
            --swarm-id ${{ needs.orchestrate.outputs.swarm-id }} \
            --focus database
            
  consolidate:
    needs: [analyze-frontend, analyze-backend, analyze-database]
    runs-on: ubuntu-latest
    steps:
      - name: Consolidate Results
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm consolidate \
            --swarm-id ${{ needs.orchestrate.outputs.swarm-id }} \
            --output-format json \
            --output-file final-report.json
```

## Security Best Practices

### 1. API Key Management

```yaml
# Use GitHub Secrets
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  
# Never commit keys
# ❌ WRONG
env:
  ANTHROPIC_API_KEY: "sk-ant-api03-..."
  
# ✅ CORRECT
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 2. Limit Permissions

```yaml
jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      contents: read      # Read-only access
      issues: write       # Write issues only
      pull-requests: write # Comment on PRs
```

### 3. Validate Outputs

```yaml
- name: Validate Output
  run: |
    # Check for sensitive data in output
    if grep -E "(password|secret|key|token)" analysis.json; then
      echo "⚠️ Sensitive data detected in output!"
      exit 1
    fi
```

### 4. Use Environment Protection

```yaml
# In repository settings, create environment rules
jobs:
  production-analysis:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Critical Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.PROD_ANTHROPIC_KEY }}
```

## Performance Optimization

### 1. Cache Dependencies

```yaml
- name: Cache Claude Flow
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-claude-flow-${{ hashFiles('**/package-lock.json') }}
    
- name: Install Claude Flow
  run: |
    if ! command -v claude-flow &> /dev/null; then
      npm install -g claude-flow@alpha
    fi
```

### 2. Optimize Agent Count

```yaml
- name: Dynamic Agent Scaling
  run: |
    # Scale agents based on repository size
    FILE_COUNT=$(find . -type f -name "*.js" -o -name "*.ts" | wc -l)
    
    if [ $FILE_COUNT -lt 100 ]; then
      AGENTS=3
    elif [ $FILE_COUNT -lt 500 ]; then
      AGENTS=5
    else
      AGENTS=8
    fi
    
    npx claude-flow@alpha swarm "analyze" --agents $AGENTS
```

### 3. Parallel Execution

```yaml
- name: Parallel Analysis
  run: |
    # Run multiple analyses in parallel
    npx claude-flow@alpha swarm "security scan" --output-file security.json &
    npx claude-flow@alpha swarm "performance check" --output-file perf.json &
    npx claude-flow@alpha swarm "code quality" --output-file quality.json &
    
    # Wait for all to complete
    wait
```

### 4. Conditional Execution

```yaml
- name: Skip if No Changes
  id: check-changes
  run: |
    if git diff --quiet HEAD^ HEAD -- src/; then
      echo "skip=true" >> $GITHUB_OUTPUT
    fi
    
- name: Run Analysis
  if: steps.check-changes.outputs.skip != 'true'
  run: npx claude-flow@alpha swarm "analyze changes"
```

## Troubleshooting

### Common Issues

#### 1. "API key not found"

```yaml
# Debug secret availability
- name: Debug Secrets
  run: |
    if [ -z "${{ secrets.ANTHROPIC_API_KEY }}" ]; then
      echo "❌ Secret ANTHROPIC_API_KEY not set"
      exit 1
    fi
    echo "✅ API key is configured"
```

#### 2. "Command not found: claude-flow"

```yaml
# Ensure global installation
- name: Install Globally
  run: |
    npm install -g claude-flow@alpha
    export PATH="$PATH:$(npm config get prefix)/bin"
    which claude-flow
```

#### 3. "Timeout exceeded"

```yaml
# Increase timeout
- name: Long Analysis
  timeout-minutes: 30 # Default is 6 hours
  run: |
    npx claude-flow@alpha swarm "complex analysis" \
      --timeout 25 # Task timeout in minutes
```

#### 4. "Out of memory"

```yaml
# Use larger runner
jobs:
  analyze:
    runs-on: ubuntu-latest-4-cores # More resources
    steps:
      - name: Analysis
        run: |
          # Limit concurrent agents
          npx claude-flow@alpha swarm "analyze" \
            --agents 3 \
            --max-memory 2048
```

### Debug Mode

```yaml
- name: Enable Debug Logging
  env:
    DEBUG: "claude-flow:*"
    CLAUDE_FLOW_VERBOSE: "true"
  run: |
    npx claude-flow@alpha swarm "debug analysis" \
      --verbose \
      --dry-run
```

### Workflow Debugging

```yaml
- name: Debug Context
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    echo "Actor: ${{ github.actor }}"
    echo "Workflow: ${{ github.workflow }}"
```

## Best Practices Summary

1. **Always use secrets** for API keys
2. **Cache dependencies** to improve speed
3. **Use matrix builds** for comprehensive testing
4. **Implement error handling** and retries
5. **Monitor API usage** to control costs
6. **Use artifacts** for result persistence
7. **Implement timeouts** for long-running tasks
8. **Validate outputs** before using them
9. **Use conditional execution** to save resources
10. **Keep workflows modular** and reusable

## Related Resources

- [Non-Interactive Mode Guide](Non-Interactive-Mode)
- [WebSocket Server Tutorial](WebSocket-Server-Tutorial)
- [Claude Flow API Reference](API-Reference)
- [GitHub Actions Documentation](https://docs.github.com/actions)