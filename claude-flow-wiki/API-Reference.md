# API Reference - Complete API Documentation

This comprehensive reference documents all Claude Flow commands, their parameters, return values, and usage examples.

## Core Commands

### `claude-flow`
Main entry point for all Claude Flow operations.

```bash
claude-flow [command] [options]
```

**Global Options:**
- `--version, -v` - Display version information
- `--help, -h` - Show help for command
- `--config, -c <path>` - Specify config file location
- `--verbose` - Enable verbose logging
- `--json` - Output in JSON format
- `--no-color` - Disable colored output

## Swarm Management

### `swarm init`
Initialize a new swarm with specified topology and configuration.

```bash
claude-flow swarm init [options]
```

**Parameters:**
- `--topology, -t <type>` - **Required**. Swarm topology: `hierarchical`, `mesh`, `ring`, `star`
- `--max-agents, -m <number>` - Maximum number of agents (default: 8)
- `--strategy, -s <type>` - Coordination strategy: `auto`, `manual`, `adaptive` (default: auto)
- `--name, -n <name>` - Swarm identifier name
- `--memory-pool <size>` - Shared memory pool size in MB

**Returns:**
```json
{
  "swarmId": "swarm-123456",
  "topology": "hierarchical",
  "maxAgents": 8,
  "status": "initialized",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Example:**
```bash
claude-flow swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --name "dev-team" \
  --memory-pool 256
```

### `swarm status`
Monitor swarm health and performance metrics.

```bash
claude-flow swarm status [swarmId] [options]
```

**Parameters:**
- `swarmId` - Optional swarm identifier (uses current if omitted)
- `--detailed, -d` - Show detailed agent information
- `--metrics, -m` - Include performance metrics
- `--watch, -w` - Continuous monitoring mode

**Returns:**
```json
{
  "swarmId": "swarm-123456",
  "topology": "hierarchical",
  "agents": {
    "total": 8,
    "active": 6,
    "idle": 2
  },
  "health": "healthy",
  "uptime": "2h 15m",
  "tasksCompleted": 145,
  "performance": {
    "avgResponseTime": "1.2s",
    "throughput": "12 tasks/min"
  }
}
```

### `swarm scale`
Dynamically adjust swarm size.

```bash
claude-flow swarm scale <targetSize> [options]
```

**Parameters:**
- `targetSize` - **Required**. Target number of agents
- `--swarm-id, -s <id>` - Swarm to scale
- `--strategy <type>` - Scaling strategy: `immediate`, `gradual`, `auto`
- `--min <number>` - Minimum agents to maintain
- `--max <number>` - Maximum agents allowed

**Example:**
```bash
claude-flow swarm scale 15 \
  --strategy gradual \
  --min 5 \
  --max 20
```

### `swarm destroy`
Gracefully shutdown a swarm.

```bash
claude-flow swarm destroy <swarmId> [options]
```

**Parameters:**
- `swarmId` - **Required**. Swarm identifier to destroy
- `--force, -f` - Force immediate shutdown
- `--save-state` - Save swarm state before destruction
- `--timeout <seconds>` - Shutdown timeout (default: 30)

## Agent Management

### `agent spawn`
Create specialized AI agents for specific tasks.

```bash
claude-flow agent spawn <type> [options]
```

**Parameters:**
- `type` - **Required**. Agent type (see [Agent Types](#agent-types))
- `--task, -t <description>` - Task description for agent
- `--capabilities, -c <list>` - Comma-separated capabilities
- `--swarm-id, -s <id>` - Target swarm for agent
- `--priority <level>` - Task priority: `low`, `medium`, `high`, `critical`
- `--timeout <minutes>` - Task timeout
- `--memory-access <level>` - Memory access: `read`, `write`, `read-write`

**Returns:**
```json
{
  "agentId": "agent-789012",
  "type": "coder",
  "status": "active",
  "task": "Implement user authentication",
  "swarmId": "swarm-123456",
  "capabilities": ["typescript", "nodejs", "testing"]
}
```

**Example:**
```bash
claude-flow agent spawn backend-dev \
  --task "Create REST API for user management" \
  --capabilities "nodejs,express,postgresql" \
  --priority high \
  --memory-access read-write
```

### `agent list`
List active agents and their capabilities.

```bash
claude-flow agent list [options]
```

**Parameters:**
- `--swarm-id, -s <id>` - Filter by swarm
- `--type, -t <type>` - Filter by agent type
- `--status <status>` - Filter by status: `active`, `idle`, `busy`
- `--detailed, -d` - Show detailed information

**Returns:**
```json
{
  "agents": [
    {
      "id": "agent-001",
      "type": "coder",
      "status": "busy",
      "currentTask": "Implementing auth service",
      "uptime": "45m",
      "tasksCompleted": 12
    }
  ],
  "total": 8,
  "byType": {
    "coder": 3,
    "tester": 2,
    "reviewer": 1,
    "planner": 2
  }
}
```

### `agent metrics`
Get performance metrics for specific agent.

```bash
claude-flow agent metrics <agentId> [options]
```

**Parameters:**
- `agentId` - **Required**. Agent identifier
- `--period, -p <timeframe>` - Time period: `1h`, `24h`, `7d`, `30d`
- `--metrics, -m <list>` - Specific metrics to include

**Returns:**
```json
{
  "agentId": "agent-789012",
  "metrics": {
    "tasksCompleted": 45,
    "avgCompletionTime": "12.5 min",
    "successRate": "95.5%",
    "resourceUsage": {
      "cpu": "25%",
      "memory": "512MB"
    }
  }
}
```

## Task Orchestration

### `task orchestrate`
Orchestrate complex task workflows across agents.

```bash
claude-flow task orchestrate [options]
```

**Parameters:**
- `--task, -t <description>` - **Required**. Task description
- `--strategy, -s <type>` - Execution strategy: `parallel`, `sequential`, `adaptive`, `balanced`
- `--dependencies, -d <list>` - Task dependencies
- `--priority, -p <level>` - Priority level
- `--checkpoint` - Enable checkpointing
- `--memory-sync` - Synchronize memory across agents
- `--max-concurrent <number>` - Maximum concurrent operations

**Example:**
```bash
claude-flow task orchestrate \
  --task "Refactor authentication system" \
  --strategy parallel \
  --checkpoint \
  --memory-sync \
  --max-concurrent 5
```

### `task status`
Check task execution status.

```bash
claude-flow task status <taskId> [options]
```

**Parameters:**
- `taskId` - **Required**. Task identifier
- `--detailed, -d` - Show subtask details
- `--watch, -w` - Watch for updates

**Returns:**
```json
{
  "taskId": "task-345678",
  "status": "in-progress",
  "progress": 65,
  "subtasks": {
    "completed": 4,
    "inProgress": 2,
    "pending": 1
  },
  "estimatedCompletion": "15 min"
}
```

### `task results`
Retrieve task completion results.

```bash
claude-flow task results <taskId> [options]
```

**Parameters:**
- `taskId` - **Required**. Task identifier
- `--format, -f <type>` - Output format: `json`, `summary`, `detailed`
- `--artifacts` - Include generated artifacts

## Memory Management

### `memory usage`
Store, retrieve, and manage persistent memory.

```bash
claude-flow memory usage [options]
```

**Parameters:**
- `--action, -a <action>` - **Required**. Action: `store`, `retrieve`, `list`, `delete`, `search`
- `--key, -k <key>` - Memory key (required for store/retrieve/delete)
- `--value, -v <value>` - Value to store (required for store)
- `--namespace, -n <namespace>` - Memory namespace (default: "default")
- `--ttl <seconds>` - Time to live in seconds

**Examples:**
```bash
# Store memory
claude-flow memory usage \
  --action store \
  --key "project-config" \
  --value '{"database": "postgresql", "cache": "redis"}' \
  --namespace "architecture" \
  --ttl 86400

# Retrieve memory
claude-flow memory usage \
  --action retrieve \
  --key "project-config" \
  --namespace "architecture"

# List memories
claude-flow memory usage \
  --action list \
  --namespace "architecture"
```

### `memory search`
Search memory with patterns.

```bash
claude-flow memory search <pattern> [options]
```

**Parameters:**
- `pattern` - **Required**. Search pattern (supports wildcards)
- `--namespace, -n <namespace>` - Limit to namespace
- `--limit, -l <number>` - Maximum results (default: 10)
- `--regex` - Use regex pattern matching

**Example:**
```bash
claude-flow memory search "auth*" \
  --namespace "decisions" \
  --limit 20
```

### `memory backup`
Create memory backups.

```bash
claude-flow memory backup [options]
```

**Parameters:**
- `--path, -p <path>` - Backup destination path
- `--compress` - Compress backup
- `--encrypt` - Encrypt backup
- `--namespace <namespace>` - Specific namespace to backup

### `memory restore`
Restore from memory backup.

```bash
claude-flow memory restore <backupPath> [options]
```

**Parameters:**
- `backupPath` - **Required**. Path to backup file
- `--overwrite` - Overwrite existing memories
- `--namespace <namespace>` - Restore to specific namespace

## Neural Network Operations

### `neural train`
Train neural patterns with WASM SIMD acceleration.

```bash
claude-flow neural train [options]
```

**Parameters:**
- `--pattern-type, -p <type>` - **Required**. Pattern type: `coordination`, `optimization`, `prediction`
- `--training-data, -d <data>` - **Required**. Training data or file path
- `--epochs, -e <number>` - Training epochs (default: 50)
- `--model-id, -m <id>` - Model identifier
- `--learning-rate <rate>` - Learning rate (default: 0.001)

**Example:**
```bash
claude-flow neural train \
  --pattern-type optimization \
  --training-data "./data/performance-metrics.json" \
  --epochs 100 \
  --model-id "perf-optimizer-v2"
```

### `neural predict`
Make predictions using trained models.

```bash
claude-flow neural predict [options]
```

**Parameters:**
- `--model-id, -m <id>` - **Required**. Model identifier
- `--input, -i <data>` - **Required**. Input data for prediction
- `--confidence` - Include confidence scores
- `--explain` - Include prediction explanation

**Returns:**
```json
{
  "prediction": "high-load",
  "confidence": 0.92,
  "explanation": {
    "factors": [
      { "feature": "request_rate", "impact": 0.45 },
      { "feature": "time_of_day", "impact": 0.28 }
    ]
  }
}
```

### `neural status`
Check neural network status.

```bash
claude-flow neural status [modelId] [options]
```

**Parameters:**
- `modelId` - Optional model identifier
- `--detailed, -d` - Show detailed metrics
- `--performance` - Include performance benchmarks

## GitHub Integration

### `github repo analyze`
Comprehensive repository analysis.

```bash
claude-flow github repo analyze <repo> [options]
```

**Parameters:**
- `repo` - **Required**. Repository in format `owner/repo`
- `--analysis-type, -t <type>` - Analysis type: `code_quality`, `performance`, `security`
- `--branch, -b <branch>` - Target branch (default: main)
- `--depth <level>` - Analysis depth: `shallow`, `normal`, `deep`

**Example:**
```bash
claude-flow github repo analyze myorg/myrepo \
  --analysis-type security \
  --depth deep
```

### `github pr manage`
Pull request management operations.

```bash
claude-flow github pr manage [options]
```

**Parameters:**
- `--repo, -r <repo>` - **Required**. Repository
- `--action, -a <action>` - **Required**. Action: `review`, `merge`, `close`
- `--pr-number, -p <number>` - PR number
- `--auto-merge` - Enable auto-merge
- `--squash` - Squash commits on merge

## SPARC Methodology

### `sparc run`
Execute specific SPARC phase.

```bash
claude-flow sparc run <mode> <task> [options]
```

**Parameters:**
- `mode` - **Required**. SPARC mode: `specification`, `pseudocode`, `architecture`, `refinement`, `completion`
- `task` - **Required**. Task description
- `--parallel` - Enable parallel processing
- `--memory-persist` - Persist artifacts to memory
- `--include <items>` - Additional items to include

**Example:**
```bash
claude-flow sparc run architecture \
  "Design microservices for e-commerce platform" \
  --parallel \
  --memory-persist
```

### `sparc tdd`
Run complete TDD workflow using SPARC.

```bash
claude-flow sparc tdd <feature> [options]
```

**Parameters:**
- `feature` - **Required**. Feature description
- `--test-first` - Enforce test-first development
- `--coverage <percent>` - Minimum coverage requirement
- `--style <style>` - TDD style: `london`, `chicago`, `hybrid`

**Example:**
```bash
claude-flow sparc tdd \
  "Shopping cart with discount calculation" \
  --test-first \
  --coverage 90 \
  --style london
```

### `sparc pipeline`
Execute full SPARC pipeline.

```bash
claude-flow sparc pipeline <task> [options]
```

**Parameters:**
- `task` - **Required**. Overall task description
- `--checkpoints` - Enable phase checkpoints
- `--parallel-phases` - Run independent phases in parallel
- `--output <path>` - Output directory for artifacts

## Workflow Management

### `workflow create`
Create custom workflow definitions.

```bash
claude-flow workflow create [options]
```

**Parameters:**
- `--name, -n <name>` - **Required**. Workflow name
- `--steps, -s <steps>` - **Required**. Workflow steps (JSON)
- `--triggers, -t <triggers>` - Event triggers
- `--template <template>` - Use predefined template

**Example:**
```bash
claude-flow workflow create \
  --name "ci-cd-pipeline" \
  --steps '[{"name":"test","agent":"tester"},{"name":"build","agent":"builder"}]' \
  --triggers "push,pull_request"
```

### `workflow execute`
Execute workflow by ID or definition.

```bash
claude-flow workflow execute <workflowId> [options]
```

**Parameters:**
- `workflowId` - **Required**. Workflow identifier
- `--params, -p <params>` - Workflow parameters (JSON)
- `--async` - Execute asynchronously
- `--dry-run` - Simulate execution

### `workflow monitor`
Monitor running workflows.

```bash
claude-flow workflow monitor <workflowId> [options]
```

**Parameters:**
- `workflowId` - **Required**. Workflow to monitor
- `--interval, -i <seconds>` - Update interval
- `--metrics` - Include performance metrics

## Performance Analysis

### `performance report`
Generate comprehensive performance reports.

```bash
claude-flow performance report [options]
```

**Parameters:**
- `--format, -f <format>` - Output format: `summary`, `detailed`, `json`, `html`
- `--timeframe, -t <period>` - Analysis period: `24h`, `7d`, `30d`
- `--components <list>` - Specific components to analyze
- `--export <path>` - Export report to file

**Example:**
```bash
claude-flow performance report \
  --format html \
  --timeframe 7d \
  --export "./reports/weekly-performance.html"
```

### `bottleneck analyze`
Identify system bottlenecks.

```bash
claude-flow bottleneck analyze [options]
```

**Parameters:**
- `--component, -c <component>` - Component to analyze
- `--metrics, -m <list>` - Metrics to evaluate
- `--threshold <percent>` - Bottleneck threshold

**Returns:**
```json
{
  "bottlenecks": [
    {
      "component": "database",
      "severity": "high",
      "impact": "45% slowdown",
      "recommendation": "Add connection pooling"
    }
  ]
}
```

## Utility Commands

### `config`
Manage Claude Flow configuration.

```bash
claude-flow config <action> [key] [value] [options]
```

**Actions:**
- `get <key>` - Get configuration value
- `set <key> <value>` - Set configuration value
- `list` - List all configuration
- `reset` - Reset to defaults

**Example:**
```bash
claude-flow config set github.token "ghp_xxxxxxxxxxxx"
claude-flow config get github.token
claude-flow config list
```

### `hooks`
Manage execution hooks.

```bash
claude-flow hooks <hook-type> [options]
```

**Hook Types:**
- `pre-task` - Before task execution
- `post-task` - After task completion
- `pre-edit` - Before file edits
- `post-edit` - After file edits

**Parameters:**
- `--description, -d <text>` - Hook description
- `--task-id <id>` - Associated task ID
- `--file <path>` - Associated file path
- `--memory-key <key>` - Memory storage key

**Example:**
```bash
claude-flow hooks pre-task --description "Starting authentication refactor"
claude-flow hooks post-edit --file "./src/auth.js" --memory-key "refactor/auth"
```

## Agent Types Reference

### Core Development Agents
- `coder` - General implementation
- `reviewer` - Code review
- `tester` - Test creation
- `planner` - Strategic planning
- `researcher` - Information gathering

### Specialized Development
- `backend-dev` - Backend services
- `mobile-dev` - Mobile development
- `ml-developer` - Machine learning
- `cicd-engineer` - CI/CD pipelines
- `api-docs` - API documentation

### Architecture & Design
- `system-architect` - System design
- `architect` - Architecture planning
- `base-template-generator` - Boilerplate creation

### Testing Specialists
- `tdd-london-swarm` - London school TDD
- `production-validator` - Production validation

### GitHub Integration
- `github-modes` - GitHub operations
- `pr-manager` - PR management
- `code-review-swarm` - Review coordination
- `issue-tracker` - Issue management
- `release-manager` - Release coordination

### Swarm Coordination
- `hierarchical-coordinator` - Hierarchical swarms
- `mesh-coordinator` - Mesh networks
- `adaptive-coordinator` - Dynamic topology
- `collective-intelligence-coordinator` - Hive mind

### Distributed Systems
- `byzantine-coordinator` - Byzantine fault tolerance
- `raft-manager` - Raft consensus
- `gossip-coordinator` - Gossip protocols
- `consensus-builder` - Consensus algorithms

## Error Codes

### Common Error Codes
- `E001` - Invalid topology type
- `E002` - Agent spawn failure
- `E003` - Task orchestration error
- `E004` - Memory operation failed
- `E005` - Swarm initialization failed
- `E006` - Neural training error
- `E007` - GitHub API error
- `E008` - Workflow execution failed
- `E009` - Configuration error
- `E010` - Resource limit exceeded

### Error Response Format
```json
{
  "error": {
    "code": "E003",
    "message": "Task orchestration failed",
    "details": "Maximum concurrent limit exceeded",
    "timestamp": "2024-01-15T10:30:00Z",
    "recovery": "Reduce concurrent operations or increase limit"
  }
}
```

## Rate Limits

### Operation Limits
- Agent spawning: 100/minute
- Task orchestration: 50/minute
- Memory operations: 1000/minute
- Neural operations: 10/minute
- GitHub operations: Subject to GitHub API limits

### Resource Limits
- Maximum agents per swarm: 50
- Maximum memory per namespace: 1GB
- Maximum task duration: 6 hours
- Maximum workflow complexity: 100 steps

## Next Steps

- Review [Development Patterns](./Development-Patterns.md) for best practices
- Check [Troubleshooting](./Troubleshooting.md) for common issues
- Explore [SPARC Methodology](./SPARC-Methodology.md) for structured development