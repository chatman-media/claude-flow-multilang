# Memory System - SQLite-based Persistent Memory

## Overview

The Claude-Flow Memory System provides a powerful SQLite-based persistent memory infrastructure that enables cross-session state management, agent coordination, and intelligent data persistence. Located at `.swarm/memory.db`, this system serves as the central nervous system for all swarm operations.

## Architecture

### Database Structure

The memory system utilizes a SQLite database with 12 specialized tables, each designed for specific memory operations:

```sql
-- Core Memory Structure
.swarm/
└── memory.db
    ├── memory_store        -- General key-value storage
    ├── sessions           -- Session management
    ├── agents             -- Agent registry and state
    ├── tasks              -- Task tracking and status
    ├── agent_memory       -- Agent-specific memory
    ├── shared_state       -- Cross-agent shared state
    ├── events             -- Event log and history
    ├── patterns           -- Learned patterns and behaviors
    ├── performance_metrics -- Performance tracking
    ├── workflow_state     -- Workflow persistence
    ├── swarm_topology     -- Network topology data
    └── consensus_state    -- Distributed consensus data
```

## Table Schemas

### 1. memory_store
General purpose key-value storage with namespace support.

```sql
CREATE TABLE memory_store (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    namespace TEXT DEFAULT 'default',
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    UNIQUE(key, namespace)
);
```

### 2. sessions
Manages cross-session persistence and context.

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_accessed TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT
);
```

### 3. agents
Registry of all agents and their configurations.

```sql
CREATE TABLE agents (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    capabilities TEXT,
    state TEXT,
    swarm_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_active TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 4. tasks
Comprehensive task tracking and orchestration.

```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    assigned_to TEXT,
    dependencies TEXT,
    result TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT
);
```

### 5. agent_memory
Agent-specific memory for individual state management.

```sql
CREATE TABLE agent_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_id, key),
    FOREIGN KEY(agent_id) REFERENCES agents(id)
);
```

### 6. shared_state
Cross-agent communication and shared memory.

```sql
CREATE TABLE shared_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_by TEXT,
    version INTEGER DEFAULT 1,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 7. events
Comprehensive event logging and audit trail.

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    source TEXT NOT NULL,
    data TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 8. patterns
Machine learning patterns and behavioral data.

```sql
CREATE TABLE patterns (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    pattern_data TEXT NOT NULL,
    confidence REAL DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_used TEXT
);
```

### 9. performance_metrics
System performance tracking and optimization.

```sql
CREATE TABLE performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    value REAL NOT NULL,
    tags TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 10. workflow_state
Workflow persistence and recovery.

```sql
CREATE TABLE workflow_state (
    id TEXT PRIMARY KEY,
    workflow_type TEXT NOT NULL,
    state TEXT NOT NULL,
    checkpoint_data TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 11. swarm_topology
Network topology and agent relationships.

```sql
CREATE TABLE swarm_topology (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swarm_id TEXT NOT NULL,
    topology_type TEXT NOT NULL,
    nodes TEXT NOT NULL,
    edges TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 12. consensus_state
Distributed consensus and synchronization data.

```sql
CREATE TABLE consensus_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    proposer TEXT,
    acceptors TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Memory Operations

### Store Operation
```javascript
// Basic store operation
await memory.store('user_preferences', {
  theme: 'dark',
  language: 'en'
});

// Namespace-specific storage
await memory.store('api_key', 'sk-...', {
  namespace: 'credentials',
  ttl: 3600 // 1 hour expiration
});

// Agent-specific memory
await memory.storeAgentMemory('agent-123', 'task_history', [
  { task: 'analyze_code', result: 'success' }
]);
```

### Retrieve Operation
```javascript
// Basic retrieval
const preferences = await memory.retrieve('user_preferences');

// Namespace retrieval
const apiKey = await memory.retrieve('api_key', {
  namespace: 'credentials'
});

// Pattern matching search
const patterns = await memory.search('user_*', {
  namespace: 'default',
  limit: 10
});
```

### Query Operations
```javascript
// Complex queries with SQL
const recentTasks = await memory.query(`
  SELECT * FROM tasks 
  WHERE status = 'completed' 
  AND completed_at > datetime('now', '-1 day')
  ORDER BY completed_at DESC
`);

// Aggregate performance metrics
const avgResponseTime = await memory.query(`
  SELECT AVG(value) as avg_time 
  FROM performance_metrics 
  WHERE metric_name = 'response_time'
  AND timestamp > datetime('now', '-1 hour')
`);
```

### Delete Operations
```javascript
// Delete specific key
await memory.delete('temporary_data');

// Cleanup expired entries
await memory.cleanup({
  expiredBefore: new Date()
});

// Clear namespace
await memory.clearNamespace('temp');
```

## Cross-Session Persistence

The memory system ensures continuity across sessions through:

### Session Management
```javascript
// Create new session
const sessionId = await memory.createSession({
  user: 'developer',
  project: 'claude-flow',
  context: { ... }
});

// Resume session
const sessionData = await memory.resumeSession(sessionId);

// Update session
await memory.updateSession(sessionId, {
  lastActivity: new Date(),
  progress: 75
});
```

### State Recovery
```javascript
// Save workflow state
await memory.saveWorkflowState('build-pipeline', {
  stage: 'testing',
  completedSteps: ['lint', 'compile'],
  remainingSteps: ['test', 'deploy']
});

// Recover after crash
const workflowState = await memory.getWorkflowState('build-pipeline');
if (workflowState) {
  await resumeWorkflow(workflowState);
}
```

## Performance Benefits

### 1. **Lightning-Fast Access**
- SQLite provides microsecond-level query performance
- In-memory caching for frequently accessed data
- Optimized indexes on key columns

### 2. **Concurrent Access**
- WAL (Write-Ahead Logging) mode enables concurrent reads
- Row-level locking for write operations
- No blocking on read operations

### 3. **Data Integrity**
- ACID compliance ensures data consistency
- Automatic rollback on failures
- Transaction support for complex operations

### 4. **Scalability**
- Handles millions of records efficiently
- Automatic vacuum and optimization
- Configurable cache sizes

## Integration with Swarm Coordination

### Agent Coordination
```javascript
// Register agent in swarm
await memory.registerAgent({
  id: 'coder-001',
  type: 'coder',
  capabilities: ['javascript', 'python', 'testing'],
  swarmId: 'dev-swarm'
});

// Share state between agents
await memory.updateSharedState('current_task', {
  id: 'implement-auth',
  assignedAgents: ['coder-001', 'tester-001'],
  progress: 45
});

// Coordinate through events
await memory.logEvent({
  type: 'task_completed',
  source: 'coder-001',
  data: { taskId: 'implement-auth', duration: 1200 }
});
```

### Consensus Building
```javascript
// Propose consensus value
await memory.proposeConsensus('deployment_ready', {
  value: true,
  proposer: 'coordinator-001',
  acceptors: ['agent-001', 'agent-002', 'agent-003']
});

// Check consensus state
const consensus = await memory.getConsensusState('deployment_ready');
if (consensus.acceptors.length >= 2) {
  await proceedWithDeployment();
}
```

### Pattern Learning
```javascript
// Store learned pattern
await memory.storePattern({
  id: 'error-handling-001',
  type: 'code_pattern',
  patternData: {
    trigger: 'network_error',
    solution: 'exponential_backoff',
    successRate: 0.92
  }
});

// Apply learned patterns
const patterns = await memory.getPatterns('code_pattern');
const bestPattern = patterns.reduce((best, current) => 
  current.confidence > best.confidence ? current : best
);
```

## Best Practices

### 1. **Namespace Organization**
```javascript
// Use clear namespace conventions
const namespaces = {
  'auth': 'Authentication data',
  'cache': 'Temporary cached data',
  'config': 'Configuration settings',
  'tasks': 'Task-related data',
  'metrics': 'Performance metrics'
};
```

### 2. **TTL Management**
```javascript
// Set appropriate TTLs
await memory.store('session_token', token, {
  ttl: 3600,  // 1 hour for session tokens
  namespace: 'auth'
});

await memory.store('cached_results', results, {
  ttl: 300,   // 5 minutes for cache
  namespace: 'cache'
});
```

### 3. **Transaction Usage**
```javascript
// Use transactions for related operations
await memory.transaction(async (tx) => {
  await tx.store('task_status', 'completed');
  await tx.updateAgentMemory('agent-001', 'completed_tasks', count + 1);
  await tx.logEvent('task_completion', { taskId, agentId });
});
```

### 4. **Regular Maintenance**
```javascript
// Schedule regular cleanup
setInterval(async () => {
  await memory.cleanup({ expiredBefore: new Date() });
  await memory.vacuum();
  await memory.analyzePerformance();
}, 3600000); // Every hour
```

## Advanced Features

### Memory Analytics
```javascript
// Analyze memory usage patterns
const analytics = await memory.analyzeUsage({
  timeframe: '7d',
  groupBy: 'namespace'
});

// Identify hot keys
const hotKeys = await memory.getHotKeys({
  threshold: 100, // accessed > 100 times
  timeframe: '1h'
});
```

### Backup and Recovery
```javascript
// Create backup
await memory.backup('/backups/memory-backup.db');

// Restore from backup
await memory.restore('/backups/memory-backup.db');

// Export specific namespace
await memory.exportNamespace('config', '/exports/config.json');
```

### Performance Monitoring
```javascript
// Monitor query performance
memory.on('slow_query', (query, duration) => {
  console.log(`Slow query detected: ${query} took ${duration}ms`);
});

// Track memory growth
const stats = await memory.getStats();
console.log(`Database size: ${stats.size}MB, Tables: ${stats.tableCount}`);
```

## Troubleshooting

### Common Issues

1. **Database Locked**
   ```javascript
   // Enable WAL mode
   await memory.execute('PRAGMA journal_mode=WAL');
   ```

2. **Performance Degradation**
   ```javascript
   // Run optimization
   await memory.optimize();
   await memory.reindex();
   ```

3. **Memory Leaks**
   ```javascript
   // Check for orphaned data
   const orphans = await memory.findOrphanedRecords();
   await memory.cleanupOrphans();
   ```

## Conclusion

The Claude-Flow Memory System provides a robust, performant, and feature-rich persistent memory solution that enables sophisticated agent coordination, cross-session state management, and intelligent pattern learning. By leveraging SQLite's proven reliability and performance, the system ensures that your swarm operations maintain continuity, learn from experience, and operate efficiently at scale.