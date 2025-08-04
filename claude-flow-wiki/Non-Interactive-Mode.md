# 🤖 Non-Interactive and Headless Mode Guide

## Overview

Claude Flow supports fully automated, non-interactive operation for CI/CD pipelines, containerized environments, and headless servers. This guide covers everything you need to run Claude Flow without user interaction.

## Table of Contents

- [How It Works](#how-it-works)
- [Environment Detection](#environment-detection)
- [Command Line Flags](#command-line-flags)
- [Authentication](#authentication)
- [JSON Output Format](#json-output-format)
- [Docker & Container Usage](#docker--container-usage)
- [Common Use Cases](#common-use-cases)
- [Troubleshooting](#troubleshooting)

## How It Works

### Automatic Detection

Claude Flow automatically detects non-interactive environments by checking:

1. **TTY Availability**
   - `process.stdin.isTTY` - Input terminal check
   - `process.stdout.isTTY` - Output terminal check

2. **CI/CD Environments**
   - GitHub Actions (`GITHUB_ACTIONS`)
   - GitLab CI (`GITLAB_CI`)
   - Jenkins (`JENKINS_URL`)
   - CircleCI (`CIRCLECI`)
   - Travis CI (`TRAVIS`)
   - AWS CodeBuild (`CODEBUILD_BUILD_ID`)

3. **Container Environments**
   - Docker (`DOCKER_CONTAINER`)
   - Kubernetes (`KUBERNETES_SERVICE_HOST`)

4. **Terminal Types**
   - WSL (`WSL_DISTRO_NAME`, `WSL_INTEROP`)
   - Windows Command Prompt
   - VS Code Terminal (`TERM_PROGRAM`)

5. **Environment Variables**
   - `CLAUDE_FLOW_NON_INTERACTIVE=true`

### Behavior in Non-Interactive Mode

When non-interactive mode is active:

- **No prompts**: All interactive prompts use default values
- **No spinners**: Simple text-based progress indicators
- **No colors**: Plain text output (unless forced)
- **Auto permissions**: Enables `--dangerously-skip-permissions` by default
- **Structured output**: JSON format available for parsing

## Environment Detection

### Setting Environment Variables

```bash
# Force non-interactive mode
export CLAUDE_FLOW_NON_INTERACTIVE=true

# Set API key for authentication
export ANTHROPIC_API_KEY="sk-ant-..."

# Optional: Claude API key (alternative)
export CLAUDE_API_KEY="sk-ant-..."
```

### Detection Priority

1. Explicit flags (`--no-interactive`, `--headless`)
2. Environment variable (`CLAUDE_FLOW_NON_INTERACTIVE`)
3. JSON output format (`--output-format json`)
4. CI/CD environment detection
5. TTY availability check

## Command Line Flags

### Basic Flags

```bash
# Explicit non-interactive mode
npx claude-flow@alpha swarm "task" --no-interactive

# Headless mode (forces non-interactive + JSON output)
npx claude-flow@alpha swarm "task" --headless

# JSON output (auto-enables non-interactive)
npx claude-flow@alpha swarm "task" --output-format json

# Save output to file
npx claude-flow@alpha swarm "task" --output-format json --output-file results.json
```

### Advanced Flags

```bash
# Disable auto permissions (requires manual approval)
npx claude-flow@alpha swarm "task" --no-interactive --no-auto-permissions

# Stream JSON output (real-time updates)
npx claude-flow@alpha swarm "task" --output-format stream-json

# JSON-formatted logs
npx claude-flow@alpha swarm "task" --json-logs

# Verbose output in non-interactive mode
npx claude-flow@alpha swarm "task" --no-interactive --verbose
```

## Authentication

### Required Setup

Non-interactive mode requires API keys via environment variables:

```bash
# Option 1: Anthropic API Key
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Option 2: Claude API Key (alternative)
export CLAUDE_API_KEY="sk-ant-api03-..."

# Run command
npx claude-flow@alpha swarm "analyze codebase" --no-interactive
```

### Authentication Validation

Claude Flow validates authentication before execution:

```javascript
// Automatic validation in non-interactive mode
if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_API_KEY) {
  console.error('❌ Non-interactive mode requires API key');
  console.error('Set ANTHROPIC_API_KEY or CLAUDE_API_KEY');
  process.exit(1);
}
```

## JSON Output Format

### Standard JSON Output

```bash
npx claude-flow@alpha swarm "build API" --output-format json
```

Output structure:
```json
{
  "swarmId": "swarm-abc123",
  "objective": "build API",
  "status": "completed",
  "startTime": "2024-07-31T12:00:00Z",
  "endTime": "2024-07-31T12:15:00Z",
  "metadata": {
    "version": "2.0.0-alpha",
    "strategy": "auto",
    "mode": "centralized",
    "maxAgents": 5
  },
  "agents": [
    {
      "agentId": "agent-1",
      "name": "Architect",
      "type": "architect",
      "status": "completed",
      "outputs": ["Designed REST API structure"],
      "errors": []
    }
  ],
  "tasks": [
    {
      "taskId": "task-1",
      "name": "Design API",
      "status": "completed",
      "assignedTo": "agent-1"
    }
  ],
  "results": {
    "outputs": ["API design complete", "Endpoints documented"],
    "errors": [],
    "insights": ["Consider rate limiting for public endpoints"],
    "artifacts": {
      "apiSpec": { "type": "openapi", "path": "./api-spec.yaml" }
    }
  },
  "summary": {
    "totalAgents": 5,
    "totalTasks": 10,
    "completedTasks": 10,
    "failedTasks": 0,
    "successRate": 1.0,
    "duration": "15m"
  }
}
```

### Streaming JSON Output

```bash
npx claude-flow@alpha swarm "task" --output-format stream-json
```

Real-time updates as newline-delimited JSON:
```json
{"type":"init","swarmId":"swarm-abc123","timestamp":"2024-07-31T12:00:00Z"}
{"type":"agent_spawn","agentId":"agent-1","agentType":"coder","timestamp":"2024-07-31T12:00:01Z"}
{"type":"task_start","taskId":"task-1","taskName":"Implement auth","timestamp":"2024-07-31T12:00:02Z"}
{"type":"progress","taskId":"task-1","progress":50,"timestamp":"2024-07-31T12:05:00Z"}
{"type":"task_complete","taskId":"task-1","status":"success","timestamp":"2024-07-31T12:10:00Z"}
{"type":"complete","status":"success","summary":{...},"timestamp":"2024-07-31T12:15:00Z"}
```

## Docker & Container Usage

### Basic Docker Setup

```dockerfile
FROM node:18-alpine

# Install Claude Flow
RUN npm install -g claude-flow@alpha

# Set non-interactive mode
ENV CLAUDE_FLOW_NON_INTERACTIVE=true

# Add API key at runtime
ENV ANTHROPIC_API_KEY=""

# Run command
CMD ["npx", "claude-flow@alpha", "swarm", "analyze", "--output-format", "json"]
```

### Docker Compose Example

```yaml
version: '3.8'

services:
  claude-flow:
    image: node:18-alpine
    environment:
      - CLAUDE_FLOW_NON_INTERACTIVE=true
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./code:/workspace
    working_dir: /workspace
    command: |
      sh -c "
        npm install -g claude-flow@alpha &&
        npx claude-flow@alpha swarm 'analyze codebase' --output-format json --output-file /workspace/analysis.json
      "
```

### Kubernetes Job Example

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: claude-flow-analysis
spec:
  template:
    spec:
      containers:
      - name: claude-flow
        image: node:18-alpine
        env:
        - name: CLAUDE_FLOW_NON_INTERACTIVE
          value: "true"
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: claude-secrets
              key: api-key
        command:
        - sh
        - -c
        - |
          npm install -g claude-flow@alpha
          npx claude-flow@alpha swarm "analyze and optimize" \
            --output-format json \
            --output-file /results/analysis.json
        volumeMounts:
        - name: results
          mountPath: /results
      volumes:
      - name: results
        persistentVolumeClaim:
          claimName: analysis-results
      restartPolicy: Never
```

## Common Use Cases

### 1. CI/CD Pipeline Analysis

```yaml
# .github/workflows/claude-analysis.yml
name: Code Analysis with Claude Flow

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Claude Flow
        run: npm install -g claude-flow@alpha
      
      - name: Run Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-flow@alpha swarm "analyze code quality and security" \
            --output-format json \
            --output-file analysis-results.json
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: analysis-results
          path: analysis-results.json
```

### 2. Scheduled Code Review

```bash
#!/bin/bash
# scheduled-review.sh

export ANTHROPIC_API_KEY="sk-ant-..."
export CLAUDE_FLOW_NON_INTERACTIVE=true

# Run daily code review
npx claude-flow@alpha swarm "review recent commits for issues" \
  --output-format json \
  --output-file "reviews/review-$(date +%Y%m%d).json"

# Process results
if [ $? -eq 0 ]; then
  # Send notification or create issues
  echo "Review complete: reviews/review-$(date +%Y%m%d).json"
fi
```

### 3. API Documentation Generation

```javascript
// generate-docs.js
const { exec } = require('child_process');
const fs = require('fs');

async function generateAPIDocs() {
  const command = `
    npx claude-flow@alpha swarm "generate OpenAPI documentation from code" \
      --no-interactive \
      --output-format json
  `;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    
    const result = JSON.parse(stdout);
    const apiSpec = result.results.artifacts.apiSpec;
    
    fs.writeFileSync('openapi.yaml', apiSpec.content);
    console.log('API documentation generated successfully');
  });
}

generateAPIDocs();
```

### 4. Batch Processing Multiple Tasks

```bash
#!/bin/bash
# batch-process.sh

tasks=(
  "analyze security vulnerabilities"
  "optimize database queries"
  "review API endpoints"
  "check dependency updates"
)

for task in "${tasks[@]}"; do
  echo "Processing: $task"
  
  npx claude-flow@alpha swarm "$task" \
    --no-interactive \
    --output-format json \
    --output-file "results/${task// /-}.json" &
done

# Wait for all background jobs
wait

echo "All tasks completed"
```

## Troubleshooting

### Common Issues

#### 1. "Interactive mode not available"

**Cause**: Terminal doesn't support TTY
**Solution**: Use `--no-interactive` flag or set `CLAUDE_FLOW_NON_INTERACTIVE=true`

#### 2. "API key required"

**Cause**: Missing authentication in non-interactive mode
**Solution**: Set `ANTHROPIC_API_KEY` or `CLAUDE_API_KEY` environment variable

#### 3. "Process hangs in WSL"

**Cause**: WSL raw mode issues
**Solution**: Use `--no-interactive` flag or run in native Linux

#### 4. "No output in CI"

**Cause**: CI environment detection
**Solution**: Use `--output-format json` or `--verbose` flag

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Verbose output
npx claude-flow@alpha swarm "task" --no-interactive --verbose

# Debug environment detection
DEBUG=claude-flow:* npx claude-flow@alpha swarm "task" --no-interactive

# JSON logs for parsing
npx claude-flow@alpha swarm "task" --json-logs
```

### Environment Validation

Test your environment setup:

```bash
# Check environment detection
npx claude-flow@alpha env check

# Validate API key
npx claude-flow@alpha auth validate --no-interactive

# Test non-interactive mode
npx claude-flow@alpha test non-interactive
```

## Best Practices

### 1. Always Set API Keys

```bash
# In .env file
ANTHROPIC_API_KEY=sk-ant-...

# In CI/CD secrets
# GitHub: Settings > Secrets > Actions
# GitLab: Settings > CI/CD > Variables
```

### 2. Use JSON Output for Automation

```bash
# Parse results with jq
npx claude-flow@alpha swarm "task" --output-format json | jq '.summary'

# Save for later processing
npx claude-flow@alpha swarm "task" --output-format json > results.json
```

### 3. Handle Errors Gracefully

```bash
#!/bin/bash
set -e

npx claude-flow@alpha swarm "task" --no-interactive || {
  echo "Task failed"
  exit 1
}
```

### 4. Monitor Resource Usage

```bash
# Limit execution time
timeout 30m npx claude-flow@alpha swarm "task" --no-interactive

# Monitor memory usage
/usr/bin/time -v npx claude-flow@alpha swarm "task" --no-interactive
```

## Related Documentation

- [GitHub Actions Tutorial](GitHub-Actions-Tutorial) - Complete GitHub Actions integration
- [WebSocket Server Tutorial](WebSocket-Server-Tutorial) - Headless WebSocket deployment
- [Docker Guide](Docker-Guide) - Containerization best practices
- [API Reference](API-Reference) - Complete API documentation