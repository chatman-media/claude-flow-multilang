# Troubleshooting - Common Issues and Solutions

This guide helps you diagnose and resolve common issues with Claude Flow, including error messages, performance problems, and configuration issues.

## Common Errors and Solutions

### Agent Spawn Failures

#### Error: "Agent spawn failed: Maximum agents exceeded"
```bash
Error: E010 - Resource limit exceeded
Maximum agents per swarm: 50
```

**Causes:**
- Swarm has reached maximum agent capacity
- Resource limits preventing new agent creation

**Solutions:**
1. Check current agent count:
   ```bash
   claude-flow agent list --swarm-id <id>
   ```

2. Remove idle agents:
   ```bash
   claude-flow agent cleanup --idle-timeout 300
   ```

3. Increase swarm capacity:
   ```bash
   claude-flow swarm scale 75 --max 100
   ```

4. Create additional swarm:
   ```bash
   claude-flow swarm init --topology mesh --max-agents 50
   ```

#### Error: "Agent type not recognized"
```bash
Error: Unknown agent type 'custom-agent'
```

**Solutions:**
1. List available agent types:
   ```bash
   claude-flow agent types --list
   ```

2. Check for typos in agent type name

3. Use closest matching agent type with custom capabilities:
   ```bash
   claude-flow agent spawn specialist \
     --capabilities "custom-logic,domain-specific"
   ```

### Memory Operation Issues

#### Error: "Memory operation failed: Namespace full"
```bash
Error: E004 - Memory operation failed
Namespace 'project-data' has exceeded 1GB limit
```

**Solutions:**
1. Check namespace usage:
   ```bash
   claude-flow memory analytics --namespace project-data
   ```

2. Clean up old entries:
   ```bash
   claude-flow memory cleanup \
     --namespace project-data \
     --older-than 30d
   ```

3. Compress namespace:
   ```bash
   claude-flow memory compress --namespace project-data
   ```

4. Increase namespace limit (config):
   ```bash
   claude-flow config set memory.namespace.limit 2GB
   ```

#### Error: "Memory key not found"
```bash
Error: Key 'config/database' not found in namespace 'default'
```

**Solutions:**
1. List available keys:
   ```bash
   claude-flow memory usage --action list --namespace default
   ```

2. Search for similar keys:
   ```bash
   claude-flow memory search "config*" --namespace default
   ```

3. Check if using correct namespace:
   ```bash
   claude-flow memory usage \
     --action retrieve \
     --key "config/database" \
     --namespace "project-config"
   ```

### Task Orchestration Problems

#### Error: "Task orchestration failed: Circular dependency detected"
```bash
Error: E003 - Task orchestration error
Circular dependency: A -> B -> C -> A
```

**Solutions:**
1. Visualize task dependencies:
   ```bash
   claude-flow task visualize --task-id <id> --format graph
   ```

2. Break circular dependency:
   ```javascript
   // Instead of circular dependencies
   const tasks = {
     A: { deps: ['B'] },  // A depends on B
     B: { deps: ['C'] },  // B depends on C
     C: { deps: ['A'] }   // C depends on A - CIRCULAR!
   };
   
   // Refactor to remove circularity
   const tasks = {
     prepare: { deps: [] },
     A: { deps: ['prepare'] },
     B: { deps: ['A'] },
     C: { deps: ['A'] }
   };
   ```

3. Use parallel execution where possible:
   ```bash
   claude-flow task orchestrate \
     --task "Process data" \
     --strategy parallel \
     --ignore-soft-deps
   ```

#### Error: "Task timeout exceeded"
```bash
Error: Task 'complex-analysis' exceeded timeout of 3600 seconds
```

**Solutions:**
1. Increase timeout:
   ```bash
   claude-flow task orchestrate \
     --task "Complex analysis" \
     --timeout 7200
   ```

2. Break into smaller tasks:
   ```bash
   claude-flow task orchestrate \
     --task "Analysis part 1" \
     --checkpoint \
     --continue-on-timeout
   ```

3. Use adaptive strategy:
   ```bash
   claude-flow task orchestrate \
     --task "Large dataset processing" \
     --strategy adaptive \
     --scale-on-demand
   ```

### Swarm Coordination Issues

#### Error: "Swarm initialization failed: Invalid topology"
```bash
Error: E005 - Swarm initialization failed
Topology 'custom' is not supported
```

**Solutions:**
1. Use supported topology:
   ```bash
   # Supported: hierarchical, mesh, ring, star
   claude-flow swarm init --topology hierarchical
   ```

2. Check topology compatibility:
   ```bash
   claude-flow swarm validate-topology \
     --agents "coder:5,tester:3" \
     --topology mesh
   ```

#### Error: "Swarm communication timeout"
```bash
Error: Agent communication timeout after 30s
Swarm: swarm-123, Agent: agent-456
```

**Solutions:**
1. Check swarm health:
   ```bash
   claude-flow swarm status <swarm-id> --detailed
   ```

2. Restart communication layer:
   ```bash
   claude-flow swarm repair <swarm-id> --fix-communication
   ```

3. Reduce swarm load:
   ```bash
   claude-flow load balance --swarm-id <id> --redistribute
   ```

### GitHub Integration Errors

#### Error: "GitHub API rate limit exceeded"
```bash
Error: E007 - GitHub API error
Rate limit exceeded. Reset at 2024-01-15T12:00:00Z
```

**Solutions:**
1. Check rate limit status:
   ```bash
   claude-flow github rate-limit --check
   ```

2. Use authenticated requests:
   ```bash
   export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
   claude-flow config set github.token $GITHUB_TOKEN
   ```

3. Implement caching:
   ```bash
   claude-flow config set github.cache.enabled true
   claude-flow config set github.cache.ttl 3600
   ```

4. Batch operations:
   ```bash
   claude-flow github batch-operations \
     --operations "analyze,metrics,issues" \
     --repo owner/repo
   ```

#### Error: "Repository access denied"
```bash
Error: 403 - Access denied to repository 'private/repo'
```

**Solutions:**
1. Verify token permissions:
   ```bash
   claude-flow github check-permissions --token $GITHUB_TOKEN
   ```

2. Update token scopes:
   - Required scopes: `repo`, `read:org`, `workflow`

3. Check repository visibility:
   ```bash
   claude-flow github repo info private/repo --check-access
   ```

### Neural Network Training Issues

#### Error: "Neural training failed: Insufficient data"
```bash
Error: E006 - Neural training error
Training data has only 50 samples, minimum 1000 required
```

**Solutions:**
1. Augment training data:
   ```bash
   claude-flow neural augment \
     --input-data ./small-dataset.json \
     --augmentation-factor 20 \
     --output ./augmented-data.json
   ```

2. Use transfer learning:
   ```bash
   claude-flow neural train \
     --pattern-type optimization \
     --base-model "pretrained-general" \
     --fine-tune ./small-dataset.json
   ```

3. Reduce model complexity:
   ```bash
   claude-flow neural train \
     --pattern-type prediction \
     --model-size small \
     --epochs 20
   ```

#### Error: "WASM module initialization failed"
```bash
Error: Failed to initialize WASM SIMD module
```

**Solutions:**
1. Check WASM support:
   ```bash
   claude-flow system check --wasm-support
   ```

2. Fallback to non-SIMD:
   ```bash
   claude-flow config set neural.wasm.simd false
   ```

3. Update Node.js version:
   ```bash
   # Requires Node.js 16+ for WASM SIMD
   node --version
   ```

## Performance Issues

### Slow Agent Response Times

**Symptoms:**
- Agents taking >30s to respond
- Task completion times increasing
- Timeout errors

**Diagnostics:**
```bash
# Check agent performance
claude-flow agent metrics <agent-id> --period 1h

# Monitor resource usage
claude-flow performance report --components agents --format detailed

# Identify bottlenecks
claude-flow bottleneck analyze --component swarm
```

**Solutions:**

1. **Optimize agent allocation:**
   ```bash
   claude-flow topology optimize --swarm-id <id>
   ```

2. **Reduce agent workload:**
   ```javascript
   // Split large tasks
   const subtasks = splitTask(largeTask, { maxSize: 1000 });
   await orchestrate(subtasks, { parallel: true });
   ```

3. **Enable agent pooling:**
   ```bash
   claude-flow config set agents.pooling.enabled true
   claude-flow config set agents.pooling.idle-timeout 300
   ```

4. **Implement caching:**
   ```bash
   claude-flow config set agents.cache.results true
   claude-flow config set agents.cache.ttl 1800
   ```

### High Memory Usage

**Symptoms:**
- Memory usage >80%
- Frequent garbage collection
- Out of memory errors

**Solutions:**

1. **Memory profiling:**
   ```bash
   claude-flow memory profile --duration 300 --export profile.json
   ```

2. **Cleanup strategies:**
   ```bash
   # Automatic cleanup
   claude-flow memory auto-cleanup \
     --threshold 80 \
     --strategy lru \
     --preserve-critical
   
   # Manual cleanup
   claude-flow memory cleanup \
     --older-than 7d \
     --exclude-namespaces "critical,config"
   ```

3. **Optimize memory usage:**
   ```javascript
   // Use streaming for large data
   const stream = await claudeFlow.data.stream({
     source: 'large-dataset',
     batchSize: 100,
     processInMemory: false
   });
   ```

### Slow Workflow Execution

**Symptoms:**
- Workflows taking hours instead of minutes
- Sequential execution when parallel possible
- Resource underutilization

**Solutions:**

1. **Analyze workflow:**
   ```bash
   claude-flow workflow analyze <workflow-id> \
     --identify-bottlenecks \
     --suggest-optimizations
   ```

2. **Optimize parallelism:**
   ```yaml
   # workflow.yaml
   optimization:
     parallel_stages:
       - [test, lint, security-scan]
       - [build-frontend, build-backend]
     max_concurrent: 10
     resource_allocation: dynamic
   ```

3. **Implement workflow caching:**
   ```bash
   claude-flow workflow cache enable \
     --workflow-id <id> \
     --cache-key-strategy content-hash
   ```

## Configuration Problems

### Environment Variable Issues

**Problem:** Claude Flow not recognizing environment variables

**Solutions:**

1. **Check variable loading:**
   ```bash
   claude-flow config env --verify
   ```

2. **Set variables correctly:**
   ```bash
   # .env file
   CLAUDE_FLOW_API_KEY=xxx
   GITHUB_TOKEN=ghp_xxx
   NODE_ENV=production
   
   # Load explicitly
   claude-flow config load-env --file .env
   ```

3. **Debug configuration:**
   ```bash
   claude-flow config debug --show-sources
   ```

### Configuration File Errors

**Problem:** "Invalid configuration file"

**Solutions:**

1. **Validate configuration:**
   ```bash
   claude-flow config validate --file claude-flow.config.json
   ```

2. **Fix common issues:**
   ```json
   {
     "version": "1.0",  // Required
     "swarm": {
       "defaultTopology": "hierarchical",  // Valid topology
       "maxAgents": 50  // Number, not string
     },
     "memory": {
       "defaultNamespace": "default",
       "persistence": true
     }
   }
   ```

3. **Reset to defaults:**
   ```bash
   claude-flow config reset --backup-current
   ```

## Network and Connectivity Issues

### WebSocket Connection Failures

**Problem:** Real-time features not working

**Solutions:**

1. **Test WebSocket connectivity:**
   ```bash
   claude-flow network test --protocol websocket
   ```

2. **Configure proxy settings:**
   ```bash
   claude-flow config set network.proxy.websocket "ws://proxy:8080"
   ```

3. **Fallback options:**
   ```bash
   claude-flow config set network.fallback.enabled true
   claude-flow config set network.fallback.polling-interval 5000
   ```

### API Connection Timeouts

**Problem:** Frequent timeouts when calling APIs

**Solutions:**

1. **Increase timeouts:**
   ```bash
   claude-flow config set network.timeout.default 60000
   claude-flow config set network.timeout.github 120000
   ```

2. **Implement retry logic:**
   ```bash
   claude-flow config set network.retry.enabled true
   claude-flow config set network.retry.max-attempts 3
   claude-flow config set network.retry.backoff exponential
   ```

## Recovery Procedures

### Corrupted State Recovery

When swarm or workflow state becomes corrupted:

```bash
# 1. Create backup
claude-flow state backup --all --output backup.tar.gz

# 2. Analyze corruption
claude-flow state analyze --check-integrity

# 3. Attempt repair
claude-flow state repair --auto-fix

# 4. If repair fails, restore from checkpoint
claude-flow state restore --checkpoint last-known-good
```

### Emergency Shutdown

When system becomes unresponsive:

```bash
# 1. Graceful shutdown attempt
claude-flow emergency shutdown --timeout 30

# 2. Force shutdown if needed
claude-flow emergency shutdown --force --save-state

# 3. Clean up resources
claude-flow cleanup --all --remove-locks

# 4. Restart with recovery
claude-flow init --recover-from shutdown-state.json
```

## Debugging Tools

### Enable Debug Logging

```bash
# Verbose logging
claude-flow --verbose <command>

# Debug specific component
DEBUG=claude-flow:agents claude-flow agent spawn coder

# Full debug mode
claude-flow config set debug.enabled true
claude-flow config set debug.level trace
```

### Performance Profiling

```bash
# CPU profiling
claude-flow profile cpu --duration 60 --output cpu-profile.json

# Memory profiling
claude-flow profile memory --interval 1000 --output memory-profile.json

# Network profiling
claude-flow profile network --capture-packets --output network.pcap
```

### Health Checks

```bash
# System health check
claude-flow health check --comprehensive

# Component-specific checks
claude-flow health check --components "agents,memory,network"

# Continuous monitoring
claude-flow health monitor --interval 30 --alert-on-issues
```

## Preventive Measures

### Regular Maintenance

1. **Daily tasks:**
   ```bash
   claude-flow maintenance daily
   ```

2. **Weekly tasks:**
   ```bash
   claude-flow maintenance weekly --include-optimization
   ```

3. **Monthly tasks:**
   ```bash
   claude-flow maintenance monthly --deep-clean
   ```

### Monitoring Setup

```bash
# Setup alerts
claude-flow monitor setup \
  --metrics "cpu,memory,errors" \
  --thresholds "cpu:80,memory:85,errors:10" \
  --notify webhook,email

# Dashboard
claude-flow monitor dashboard --port 3000
```

## Getting Help

### Diagnostic Information

When reporting issues, include:

```bash
# Generate diagnostic report
claude-flow diagnostic report --full --output diagnostic.zip
```

This includes:
- System information
- Configuration
- Recent logs
- Performance metrics
- Error traces

### Community Resources

- GitHub Issues: Report bugs and feature requests
- Discord: Real-time help from community
- Documentation: Check latest docs for updates
- FAQ: Common questions and answers

## Next Steps

- Review [Development Patterns](./Development-Patterns.md) to avoid common pitfalls
- Check [API Reference](./API-Reference.md) for correct command usage
- Explore [Performance Guide](./Performance-Guide.md) for optimization tips