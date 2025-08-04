# MCP Tools - Complete Tool Reference (87 Tools)

## Overview

The Model Context Protocol (MCP) tools provide a comprehensive suite of 87 specialized tools for AI orchestration, swarm coordination, neural processing, and system management. These tools are integrated with Claude Code through the `mcp__claude-flow__` namespace.

## Table of Contents

1. [Swarm Management (16 tools)](#swarm-management)
2. [Neural & AI (15 tools)](#neural--ai)
3. [Memory & Persistence (10 tools)](#memory--persistence)
4. [Performance & Analytics (10 tools)](#performance--analytics)
5. [GitHub Integration (6 tools)](#github-integration)
6. [Dynamic Agent Architecture (6 tools)](#dynamic-agent-architecture)
7. [Workflow & Automation (8 tools)](#workflow--automation)
8. [System Utilities (16 tools)](#system-utilities)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)
11. [Tool Composition Patterns](#tool-composition-patterns)

## Swarm Management

### Core Swarm Tools

#### 1. `swarm_init`
Initialize swarm with topology and configuration.
```yaml
Parameters:
  - topology: hierarchical|mesh|ring|star (required)
  - strategy: auto (default)
  - maxAgents: 8 (default)
```

#### 2. `agent_spawn`
Create specialized AI agents.
```yaml
Parameters:
  - type: coordinator|researcher|coder|analyst|architect|tester|reviewer|optimizer|documenter|monitor|specialist (required)
  - name: string (optional)
  - swarmId: string (optional)
  - capabilities: array (optional)
```

#### 3. `task_orchestrate`
Orchestrate complex task workflows.
```yaml
Parameters:
  - task: string (required)
  - strategy: parallel|sequential|adaptive|balanced
  - priority: low|medium|high|critical
  - dependencies: array
```

#### 4. `swarm_status`
Monitor swarm health and performance.
```yaml
Parameters:
  - swarmId: string (optional)
```

#### 5. `agent_list`
List active agents & capabilities.
```yaml
Parameters:
  - swarmId: string (optional)
```

#### 6. `agent_metrics`
Agent performance metrics.
```yaml
Parameters:
  - agentId: string (optional)
```

#### 7. `swarm_monitor`
Real-time swarm monitoring.
```yaml
Parameters:
  - swarmId: string (optional)
  - interval: number (optional)
```

#### 8. `topology_optimize`
Auto-optimize swarm topology.
```yaml
Parameters:
  - swarmId: string (optional)
```

#### 9. `load_balance`
Distribute tasks efficiently.
```yaml
Parameters:
  - tasks: array (optional)
  - swarmId: string (optional)
```

#### 10. `coordination_sync`
Sync agent coordination.
```yaml
Parameters:
  - swarmId: string (optional)
```

#### 11. `swarm_scale`
Auto-scale agent count.
```yaml
Parameters:
  - swarmId: string (optional)
  - targetSize: number (optional)
```

#### 12. `swarm_destroy`
Gracefully shutdown swarm.
```yaml
Parameters:
  - swarmId: string (required)
```

#### 13. `task_status`
Check task execution status.
```yaml
Parameters:
  - taskId: string (required)
```

#### 14. `task_results`
Get task completion results.
```yaml
Parameters:
  - taskId: string (required)
```

#### 15. `parallel_execute`
Execute tasks in parallel.
```yaml
Parameters:
  - tasks: array (required)
```

#### 16. `batch_process`
Batch processing.
```yaml
Parameters:
  - items: array (required)
  - operation: string (required)
```

## Neural & AI

### Core Neural Tools

#### 17. `neural_status`
Check neural network status.
```yaml
Parameters:
  - modelId: string (optional)
```

#### 18. `neural_train`
Train neural patterns with WASM SIMD acceleration.
```yaml
Parameters:
  - pattern_type: coordination|optimization|prediction (required)
  - training_data: string (required)
  - epochs: 50 (default)
```

#### 19. `neural_patterns`
Analyze cognitive patterns.
```yaml
Parameters:
  - action: analyze|learn|predict (required)
  - operation: string (optional)
  - outcome: string (optional)
  - metadata: object (optional)
```

#### 20. `neural_predict`
Make AI predictions.
```yaml
Parameters:
  - modelId: string (required)
  - input: string (required)
```

#### 21. `model_load`
Load pre-trained models.
```yaml
Parameters:
  - modelPath: string (required)
```

#### 22. `model_save`
Save trained models.
```yaml
Parameters:
  - modelId: string (required)
  - path: string (required)
```

#### 23. `wasm_optimize`
WASM SIMD optimization.
```yaml
Parameters:
  - operation: string (optional)
```

#### 24. `inference_run`
Run neural inference.
```yaml
Parameters:
  - modelId: string (required)
  - data: array (required)
```

#### 25. `pattern_recognize`
Pattern recognition.
```yaml
Parameters:
  - data: array (required)
  - patterns: array (optional)
```

#### 26. `cognitive_analyze`
Cognitive behavior analysis.
```yaml
Parameters:
  - behavior: string (required)
```

#### 27. `learning_adapt`
Adaptive learning.
```yaml
Parameters:
  - experience: object (required)
```

#### 28. `neural_compress`
Compress neural models.
```yaml
Parameters:
  - modelId: string (required)
  - ratio: number (optional)
```

#### 29. `ensemble_create`
Create model ensembles.
```yaml
Parameters:
  - models: array (required)
  - strategy: string (optional)
```

#### 30. `transfer_learn`
Transfer learning.
```yaml
Parameters:
  - sourceModel: string (required)
  - targetDomain: string (required)
```

#### 31. `neural_explain`
AI explainability.
```yaml
Parameters:
  - modelId: string (required)
  - prediction: object (required)
```

## Memory & Persistence

### Core Memory Tools

#### 32. `memory_usage`
Store/retrieve persistent memory with TTL and namespacing.
```yaml
Parameters:
  - action: store|retrieve|list|delete|search (required)
  - key: string (conditional)
  - value: string (conditional)
  - namespace: default (default)
  - ttl: number (optional)
```

#### 33. `memory_search`
Search memory with patterns.
```yaml
Parameters:
  - pattern: string (required)
  - namespace: string (optional)
  - limit: 10 (default)
```

#### 34. `memory_persist`
Cross-session persistence.
```yaml
Parameters:
  - sessionId: string (optional)
```

#### 35. `memory_namespace`
Namespace management.
```yaml
Parameters:
  - namespace: string (required)
  - action: string (required)
```

#### 36. `memory_backup`
Backup memory stores.
```yaml
Parameters:
  - path: string (optional)
```

#### 37. `memory_restore`
Restore from backups.
```yaml
Parameters:
  - backupPath: string (required)
```

#### 38. `memory_compress`
Compress memory data.
```yaml
Parameters:
  - namespace: string (optional)
```

#### 39. `memory_sync`
Sync across instances.
```yaml
Parameters:
  - target: string (required)
```

#### 40. `cache_manage`
Manage coordination cache.
```yaml
Parameters:
  - action: string (required)
  - key: string (conditional)
```

#### 41. `memory_analytics`
Analyze memory usage.
```yaml
Parameters:
  - timeframe: string (optional)
```

## Performance & Analytics

### Core Performance Tools

#### 42. `performance_report`
Generate performance reports with real-time metrics.
```yaml
Parameters:
  - format: summary|detailed|json (default: summary)
  - timeframe: 24h|7d|30d (default: 24h)
```

#### 43. `bottleneck_analyze`
Identify performance bottlenecks.
```yaml
Parameters:
  - component: string (optional)
  - metrics: array (optional)
```

#### 44. `token_usage`
Analyze token consumption.
```yaml
Parameters:
  - operation: string (optional)
  - timeframe: 24h (default)
```

#### 45. `benchmark_run`
Performance benchmarks.
```yaml
Parameters:
  - suite: string (optional)
```

#### 46. `metrics_collect`
Collect system metrics.
```yaml
Parameters:
  - components: array (optional)
```

#### 47. `trend_analysis`
Analyze performance trends.
```yaml
Parameters:
  - metric: string (required)
  - period: string (optional)
```

#### 48. `cost_analysis`
Cost and resource analysis.
```yaml
Parameters:
  - timeframe: string (optional)
```

#### 49. `quality_assess`
Quality assessment.
```yaml
Parameters:
  - target: string (required)
  - criteria: array (optional)
```

#### 50. `error_analysis`
Error pattern analysis.
```yaml
Parameters:
  - logs: array (optional)
```

#### 51. `usage_stats`
Usage statistics.
```yaml
Parameters:
  - component: string (optional)
```

## GitHub Integration

### Core GitHub Tools

#### 52. `github_repo_analyze`
Repository analysis.
```yaml
Parameters:
  - repo: string (required)
  - analysis_type: code_quality|performance|security
```

#### 53. `github_pr_manage`
Pull request management.
```yaml
Parameters:
  - repo: string (required)
  - action: review|merge|close (required)
  - pr_number: number (conditional)
```

#### 54. `github_issue_track`
Issue tracking & triage.
```yaml
Parameters:
  - repo: string (required)
  - action: string (required)
```

#### 55. `github_release_coord`
Release coordination.
```yaml
Parameters:
  - repo: string (required)
  - version: string (required)
```

#### 56. `github_workflow_auto`
Workflow automation.
```yaml
Parameters:
  - repo: string (required)
  - workflow: object (required)
```

#### 57. `github_code_review`
Automated code review.
```yaml
Parameters:
  - repo: string (required)
  - pr: number (required)
```

## Dynamic Agent Architecture

### Core DAA Tools

#### 58. `daa_agent_create`
Create dynamic agents.
```yaml
Parameters:
  - agent_type: string (required)
  - capabilities: array (optional)
  - resources: object (optional)
```

#### 59. `daa_capability_match`
Match capabilities to tasks.
```yaml
Parameters:
  - task_requirements: array (required)
  - available_agents: array (optional)
```

#### 60. `daa_resource_alloc`
Resource allocation.
```yaml
Parameters:
  - resources: object (required)
  - agents: array (optional)
```

#### 61. `daa_lifecycle_manage`
Agent lifecycle management.
```yaml
Parameters:
  - agentId: string (required)
  - action: string (required)
```

#### 62. `daa_communication`
Inter-agent communication.
```yaml
Parameters:
  - from: string (required)
  - to: string (required)
  - message: object (required)
```

#### 63. `daa_consensus`
Consensus mechanisms.
```yaml
Parameters:
  - agents: array (required)
  - proposal: object (required)
```

## Workflow & Automation

### Core Workflow Tools

#### 64. `workflow_create`
Create custom workflows.
```yaml
Parameters:
  - name: string (required)
  - steps: array (required)
  - triggers: array (optional)
```

#### 65. `workflow_execute`
Execute predefined workflows.
```yaml
Parameters:
  - workflowId: string (required)
  - params: object (optional)
```

#### 66. `workflow_export`
Export workflow definitions.
```yaml
Parameters:
  - workflowId: string (required)
  - format: string (optional)
```

#### 67. `automation_setup`
Setup automation rules.
```yaml
Parameters:
  - rules: array (required)
```

#### 68. `pipeline_create`
Create CI/CD pipelines.
```yaml
Parameters:
  - config: object (required)
```

#### 69. `scheduler_manage`
Manage task scheduling.
```yaml
Parameters:
  - action: string (required)
  - schedule: object (optional)
```

#### 70. `trigger_setup`
Setup event triggers.
```yaml
Parameters:
  - events: array (required)
  - actions: array (required)
```

#### 71. `workflow_template`
Manage workflow templates.
```yaml
Parameters:
  - action: string (required)
  - template: object (optional)
```

## System Utilities

### Core System Tools

#### 72. `sparc_mode`
Run SPARC development modes.
```yaml
Parameters:
  - mode: dev|api|ui|test|refactor (required)
  - task_description: string (required)
  - options: object (optional)
```

#### 73. `terminal_execute`
Execute terminal commands.
```yaml
Parameters:
  - command: string (required)
  - args: array (optional)
```

#### 74. `config_manage`
Configuration management.
```yaml
Parameters:
  - action: string (required)
  - config: object (optional)
```

#### 75. `features_detect`
Feature detection.
```yaml
Parameters:
  - component: string (optional)
```

#### 76. `security_scan`
Security scanning.
```yaml
Parameters:
  - target: string (required)
  - depth: string (optional)
```

#### 77. `backup_create`
Create system backups.
```yaml
Parameters:
  - destination: string (optional)
  - components: array (optional)
```

#### 78. `restore_system`
System restoration.
```yaml
Parameters:
  - backupId: string (required)
```

#### 79. `log_analysis`
Log analysis & insights.
```yaml
Parameters:
  - logFile: string (required)
  - patterns: array (optional)
```

#### 80. `diagnostic_run`
System diagnostics.
```yaml
Parameters:
  - components: array (optional)
```

#### 81. `health_check`
System health monitoring.
```yaml
Parameters:
  - components: array (optional)
```

#### 82. `state_snapshot`
Create state snapshots.
```yaml
Parameters:
  - name: string (optional)
```

#### 83. `context_restore`
Restore execution context.
```yaml
Parameters:
  - snapshotId: string (required)
```

#### 84. `github_sync_coord`
Multi-repo sync coordination.
```yaml
Parameters:
  - repos: array (required)
```

#### 85. `github_metrics`
Repository metrics.
```yaml
Parameters:
  - repo: string (required)
```

#### 86. `daa_fault_tolerance`
Fault tolerance & recovery.
```yaml
Parameters:
  - agentId: string (required)
  - strategy: string (optional)
```

#### 87. `daa_optimization`
Performance optimization.
```yaml
Parameters:
  - target: string (required)
  - metrics: array (optional)
```

## Usage Examples

### Example 1: Creating a Development Swarm

```javascript
// Initialize swarm with hierarchical topology
await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  strategy: "auto",
  maxAgents: 8
});

// Spawn specialized agents
await mcp__claude-flow__agent_spawn({
  type: "coordinator",
  name: "MainCoordinator",
  capabilities: ["task-distribution", "monitoring"]
});

await mcp__claude-flow__agent_spawn({
  type: "coder",
  name: "ImplementationAgent",
  capabilities: ["typescript", "react", "nodejs"]
});

await mcp__claude-flow__agent_spawn({
  type: "tester",
  name: "QualityAgent",
  capabilities: ["unit-testing", "integration-testing"]
});

// Orchestrate task workflow
await mcp__claude-flow__task_orchestrate({
  task: "Implement user authentication system",
  strategy: "parallel",
  priority: "high",
  dependencies: ["database-setup", "api-design"]
});
```

### Example 2: Neural Network Training

```javascript
// Train coordination patterns
await mcp__claude-flow__neural_train({
  pattern_type: "coordination",
  training_data: JSON.stringify({
    scenarios: [
      { agents: 3, tasks: 10, completion_time: 45 },
      { agents: 5, tasks: 20, completion_time: 60 }
    ]
  }),
  epochs: 100
});

// Make predictions
const prediction = await mcp__claude-flow__neural_predict({
  modelId: "coordination-model",
  input: JSON.stringify({ agents: 4, tasks: 15 })
});

// Analyze patterns
await mcp__claude-flow__neural_patterns({
  action: "analyze",
  operation: "task-distribution",
  outcome: "optimal",
  metadata: { efficiency: 0.92 }
});
```

### Example 3: Memory Management

```javascript
// Store project context
await mcp__claude-flow__memory_usage({
  action: "store",
  key: "project-context",
  value: JSON.stringify({
    name: "Auth System",
    stack: ["TypeScript", "React", "Node.js"],
    requirements: ["JWT", "OAuth2", "2FA"]
  }),
  namespace: "development",
  ttl: 86400 // 24 hours
});

// Search for related memories
const results = await mcp__claude-flow__memory_search({
  pattern: "auth*",
  namespace: "development",
  limit: 20
});

// Create memory backup
await mcp__claude-flow__memory_backup({
  path: "./backups/memory-backup-2025-01-25.db"
});
```

### Example 4: GitHub Workflow Automation

```javascript
// Analyze repository
await mcp__claude-flow__github_repo_analyze({
  repo: "myorg/myproject",
  analysis_type: "code_quality"
});

// Create automated workflow
await mcp__claude-flow__github_workflow_auto({
  repo: "myorg/myproject",
  workflow: {
    name: "CI/CD Pipeline",
    triggers: ["push", "pull_request"],
    jobs: {
      test: {
        steps: ["checkout", "setup-node", "install", "test"]
      },
      deploy: {
        needs: ["test"],
        steps: ["build", "deploy"]
      }
    }
  }
});

// Manage pull request
await mcp__claude-flow__github_pr_manage({
  repo: "myorg/myproject",
  action: "review",
  pr_number: 123
});
```

### Example 5: Performance Monitoring

```javascript
// Generate performance report
const report = await mcp__claude-flow__performance_report({
  format: "detailed",
  timeframe: "7d"
});

// Analyze bottlenecks
await mcp__claude-flow__bottleneck_analyze({
  component: "task-orchestration",
  metrics: ["latency", "throughput", "cpu-usage"]
});

// Run benchmarks
await mcp__claude-flow__benchmark_run({
  suite: "swarm-coordination"
});

// Analyze trends
await mcp__claude-flow__trend_analysis({
  metric: "response-time",
  period: "30d"
});
```

## Best Practices

### 1. Tool Selection
- Choose tools based on task requirements
- Use specialized agents for specific domains
- Combine tools for complex workflows

### 2. Swarm Management
- Initialize swarms with appropriate topology
- Monitor swarm health regularly
- Scale agents based on workload
- Gracefully shutdown swarms when done

### 3. Memory Management
- Use namespaces to organize data
- Set appropriate TTL values
- Regular backups for critical data
- Compress old data to save space

### 4. Performance Optimization
- Monitor performance metrics continuously
- Identify and address bottlenecks early
- Use parallel execution for independent tasks
- Optimize neural models for inference

### 5. Error Handling
- Implement fault tolerance strategies
- Monitor error patterns
- Use consensus mechanisms for critical decisions
- Maintain execution snapshots for recovery

### 6. Security Considerations
- Regular security scans
- Secure inter-agent communication
- Validate inputs and outputs
- Monitor for anomalous behavior

## Tool Composition Patterns

### Pattern 1: SPARC Development Pipeline
```javascript
// 1. Initialize development swarm
await swarm_init({ topology: "mesh" });

// 2. Spawn SPARC agents
await agent_spawn({ type: "specification" });
await agent_spawn({ type: "pseudocode" });
await agent_spawn({ type: "architecture" });
await agent_spawn({ type: "refinement" });

// 3. Execute SPARC workflow
await sparc_mode({
  mode: "dev",
  task_description: "Build authentication system"
});

// 4. Monitor progress
await swarm_monitor({ interval: 5000 });
```

### Pattern 2: Distributed AI Training
```javascript
// 1. Create agent swarm for distributed training
await swarm_init({ topology: "star", maxAgents: 16 });

// 2. Distribute training data
await daa_resource_alloc({
  resources: { 
    data: training_dataset,
    compute: "gpu-cluster"
  }
});

// 3. Train in parallel
await parallel_execute({
  tasks: [
    { type: "train", model: "pattern-1" },
    { type: "train", model: "pattern-2" },
    { type: "train", model: "pattern-3" }
  ]
});

// 4. Create ensemble
await ensemble_create({
  models: ["pattern-1", "pattern-2", "pattern-3"],
  strategy: "weighted-average"
});
```

### Pattern 3: Continuous Integration Pipeline
```javascript
// 1. Setup workflow automation
await workflow_create({
  name: "CI/CD Pipeline",
  steps: [
    { action: "checkout", type: "git" },
    { action: "test", type: "parallel" },
    { action: "build", type: "sequential" },
    { action: "deploy", type: "conditional" }
  ],
  triggers: ["push", "pull_request"]
});

// 2. Monitor execution
await workflow_execute({
  workflowId: "ci-cd-pipeline",
  params: { branch: "main" }
});

// 3. Analyze results
await performance_report({ format: "json" });
```

### Pattern 4: Multi-Repository Coordination
```javascript
// 1. Initialize multi-repo swarm
await github_sync_coord({
  repos: ["frontend", "backend", "shared-libs"]
});

// 2. Spawn repository agents
for (const repo of repos) {
  await agent_spawn({
    type: "repo-architect",
    name: `${repo}-manager`,
    capabilities: ["sync", "merge", "release"]
  });
}

// 3. Coordinate releases
await github_release_coord({
  repo: "main-project",
  version: "2.0.0"
});
```

### Pattern 5: Adaptive Learning System
```javascript
// 1. Initialize cognitive system
await neural_patterns({
  action: "learn",
  operation: "initialize-cognitive-system"
});

// 2. Continuous learning loop
await learning_adapt({
  experience: {
    type: "user-interaction",
    feedback: "positive",
    context: "task-completion"
  }
});

// 3. Pattern recognition
await pattern_recognize({
  data: interaction_logs,
  patterns: ["success", "failure", "optimization"]
});

// 4. Adapt behavior
await cognitive_analyze({
  behavior: "task-execution-strategy"
});
```

## Integration with Claude Code

### Using MCP Tools in Claude Code

1. **Direct Invocation**: Call tools directly using the `mcp__claude-flow__` prefix
2. **Batch Operations**: Combine multiple tools in a single operation
3. **Async Handling**: All tools support async/await patterns
4. **Error Recovery**: Built-in error handling and recovery mechanisms

### Example Integration

```javascript
// In Claude Code conversation
User: "Create a swarm to analyze and optimize our codebase"

// Claude Code response with MCP tools
await mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 12
});

const agents = await Promise.all([
  mcp__claude-flow__agent_spawn({ type: "code-analyzer" }),
  mcp__claude-flow__agent_spawn({ type: "performance-benchmarker" }),
  mcp__claude-flow__agent_spawn({ type: "security-manager" }),
  mcp__claude-flow__agent_spawn({ type: "optimizer" })
]);

await mcp__claude-flow__task_orchestrate({
  task: "Comprehensive codebase analysis and optimization",
  strategy: "adaptive",
  priority: "high"
});

const report = await mcp__claude-flow__performance_report({
  format: "detailed",
  timeframe: "24h"
});
```

## Conclusion

The MCP Tools suite provides a comprehensive set of 87 specialized tools for AI orchestration, swarm management, and system optimization. By understanding each tool's capabilities and following best practices, you can build sophisticated AI-powered systems that leverage distributed intelligence, adaptive learning, and efficient resource management.

Remember to:
- Choose the right tools for your specific use case
- Compose tools effectively for complex workflows
- Monitor performance and optimize continuously
- Implement proper error handling and recovery
- Keep security considerations in mind

For the latest updates and additional documentation, refer to the Claude Flow repository and MCP specification.