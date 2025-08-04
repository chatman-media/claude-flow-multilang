# Claude Code Configuration for High-Performance Development

## 🏎️ CRITICAL: Performance-First Development Approach

**MANDATORY RULE**: Every operation must be optimized for maximum performance:

1. **Profile First** → Measure before optimizing
2. **Benchmark Everything** → Track performance metrics
3. **Optimize Hotpaths** → Focus on critical code paths
4. **Minimize Overhead** → Reduce unnecessary operations
5. **Cache Aggressively** → Leverage all caching layers

## 🚀 Performance Swarm Configuration

### Initialize Performance-Optimized Swarm

```javascript
// ✅ CORRECT: High-performance swarm setup
[Single Message with BatchTool]:
  // Performance-optimized topology
  mcp__claude-flow__swarm_init { 
    topology: "star",  // Minimal communication overhead
    maxAgents: 6,      // Balanced for performance
    strategy: "specialized"
  }
  
  // Specialized performance agents
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Performance Engineer" }
  mcp__claude-flow__agent_spawn { type: "optimizer", name: "Code Optimizer" }
  mcp__claude-flow__agent_spawn { type: "analyst", name: "Profiling Analyst" }
  mcp__claude-flow__agent_spawn { type: "architect", name: "Performance Architect" }
  mcp__claude-flow__agent_spawn { type: "monitor", name: "Metrics Monitor" }
  mcp__claude-flow__agent_spawn { type: "coordinator", name: "Performance Lead" }
  
  // Performance todos
  TodoWrite { todos: [
    {id: "profile", content: "Profile baseline performance", status: "in_progress", priority: "high"},
    {id: "hotspots", content: "Identify performance hotspots", status: "pending", priority: "high"},
    {id: "optimize-algo", content: "Optimize critical algorithms", status: "pending", priority: "high"},
    {id: "cache-strategy", content: "Implement caching strategy", status: "pending", priority: "high"},
    {id: "lazy-load", content: "Add lazy loading", status: "pending", priority: "medium"},
    {id: "code-split", content: "Implement code splitting", status: "pending", priority: "medium"},
    {id: "benchmark", content: "Run performance benchmarks", status: "pending", priority: "high"},
    {id: "memory-opt", content: "Optimize memory usage", status: "pending", priority: "medium"},
    {id: "db-indexes", content: "Add database indexes", status: "pending", priority: "high"},
    {id: "monitor-setup", content: "Setup performance monitoring", status: "pending", priority: "medium"}
  ]}
```

## 📊 Performance Profiling Pattern

### Agent Coordination for Profiling

```javascript
// Performance Engineer Agent
Task(`You are the Performance Engineer agent.

MANDATORY COORDINATION:
1. START: npx claude-flow@alpha hooks pre-task --description "Profiling application performance"
2. PROFILE: Run comprehensive profiling tools
3. STORE: npx claude-flow@alpha hooks notify --message "Profile results: [metrics]"
4. ANALYZE: Identify bottlenecks and hotspots

TASKS:
- Setup profiling infrastructure (Node.js profiler, browser DevTools)
- Profile CPU usage patterns
- Analyze memory allocation
- Measure I/O operations
- Track network latency
- Generate flame graphs
- Create performance reports
`)

// Profiling Analyst Agent
Task(`You are the Profiling Analyst agent.

MANDATORY COORDINATION:
1. LOAD: npx claude-flow@alpha hooks session-restore --load-memory true
2. ANALYZE: Review profiling data from Performance Engineer
3. IDENTIFY: Find optimization opportunities
4. RECOMMEND: Create optimization strategies

TASKS:
- Analyze flame graphs for hotspots
- Review memory heap snapshots
- Identify N+1 query problems
- Find unnecessary re-renders
- Detect memory leaks
- Calculate Big-O complexity
- Prioritize optimizations by impact
`)
```

## ⚡ Performance Optimization Patterns

### 1. Algorithm Optimization

```javascript
// Code Optimizer Agent Task
Task(`You are the Code Optimizer agent specializing in algorithm optimization.

OPTIMIZATION TARGETS:
1. Time Complexity: Reduce from O(n²) to O(n log n) or better
2. Space Complexity: Minimize memory allocation
3. Cache Efficiency: Improve data locality
4. Parallel Processing: Utilize all CPU cores

IMPLEMENT:
- Replace nested loops with hash maps
- Use binary search for sorted data
- Implement memoization for repeated calculations
- Add worker threads for CPU-intensive tasks
- Optimize recursive algorithms with iteration
- Use typed arrays for numeric operations
`)
```

### 2. Caching Strategy Implementation

```javascript
// Multi-Layer Caching Pattern
[BatchTool]:
  // Create caching infrastructure
  Write("src/cache/memory-cache.js", `
    class MemoryCache {
      constructor(maxSize = 1000, ttl = 3600) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
        this.hits = 0;
        this.misses = 0;
      }
      
      get(key) {
        const item = this.cache.get(key);
        if (!item) {
          this.misses++;
          return null;
        }
        if (Date.now() > item.expiry) {
          this.cache.delete(key);
          this.misses++;
          return null;
        }
        this.hits++;
        return item.value;
      }
      
      set(key, value) {
        if (this.cache.size >= this.maxSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        this.cache.set(key, {
          value,
          expiry: Date.now() + (this.ttl * 1000)
        });
      }
      
      getStats() {
        return {
          size: this.cache.size,
          hitRate: this.hits / (this.hits + this.misses),
          hits: this.hits,
          misses: this.misses
        };
      }
    }
  `)
  
  Write("src/cache/redis-cache.js", `
    const Redis = require('ioredis');
    
    class RedisCache {
      constructor() {
        this.client = new Redis({
          enableOfflineQueue: false,
          lazyConnect: true,
          maxRetriesPerRequest: 3
        });
        this.pipeline = null;
      }
      
      async get(key) {
        try {
          const value = await this.client.get(key);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Redis get error:', error);
          return null;
        }
      }
      
      async set(key, value, ttl = 3600) {
        try {
          await this.client.setex(key, ttl, JSON.stringify(value));
        } catch (error) {
          console.error('Redis set error:', error);
        }
      }
      
      startPipeline() {
        this.pipeline = this.client.pipeline();
      }
      
      async executePipeline() {
        if (!this.pipeline) return;
        const results = await this.pipeline.exec();
        this.pipeline = null;
        return results;
      }
    }
  `)
```

### 3. Database Query Optimization

```javascript
// Database optimization patterns
[BatchTool]:
  Write("src/db/query-optimizer.js", `
    class QueryOptimizer {
      // Use connection pooling
      static createPool(config) {
        return mysql.createPool({
          ...config,
          connectionLimit: 20,
          queueLimit: 0,
          waitForConnections: true,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0
        });
      }
      
      // Batch queries to reduce round trips
      static async batchQuery(queries) {
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          const results = [];
          
          for (const query of queries) {
            const [rows] = await connection.execute(query.sql, query.params);
            results.push(rows);
          }
          
          await connection.commit();
          return results;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
      }
      
      // Use prepared statements
      static async executePrepared(sql, params) {
        const [rows] = await pool.execute(sql, params);
        return rows;
      }
      
      // Index hints for complex queries
      static optimizeQuery(query) {
        return query
          .replace('SELECT', 'SELECT /*+ INDEX(users idx_user_email) */')
          .replace('JOIN', 'JOIN /*+ USE_HASH(orders) */');
      }
    }
  `)
  
  // Create database indexes
  Bash("mysql -u root -p < create-indexes.sql")
```

## 🔥 Performance Benchmarking

### Automated Benchmark Suite

```javascript
// Performance benchmarking setup
[BatchTool]:
  Write("benchmarks/suite.js", `
    const Benchmark = require('benchmark');
    const suite = new Benchmark.Suite();
    
    // Memory usage tracking
    function getMemoryUsage() {
      const usage = process.memoryUsage();
      return {
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
        external: Math.round(usage.external / 1024 / 1024),
        rss: Math.round(usage.rss / 1024 / 1024)
      };
    }
    
    // CPU profiling
    const startCPUProfile = () => {
      const profiler = require('v8-profiler-next');
      profiler.startProfiling('CPU profile');
      return profiler;
    };
    
    // Benchmark configuration
    suite
      .add('Algorithm v1', function() {
        algorithmV1(testData);
      })
      .add('Algorithm v2 (optimized)', function() {
        algorithmV2(testData);
      })
      .add('Algorithm v3 (parallel)', function() {
        algorithmV3(testData);
      })
      .on('cycle', function(event) {
        console.log(String(event.target));
        console.log('Memory:', getMemoryUsage());
      })
      .on('complete', function() {
        console.log('Fastest:', this.filter('fastest').map('name'));
        generateReport(this);
      })
      .run({ async: true });
  `)
  
  // Load testing script
  Write("benchmarks/load-test.js", `
    const autocannon = require('autocannon');
    
    async function runLoadTest() {
      const result = await autocannon({
        url: 'http://localhost:3000',
        connections: 100,
        pipelining: 10,
        duration: 30,
        requests: [
          { method: 'GET', path: '/api/users' },
          { method: 'POST', path: '/api/data', body: JSON.stringify({test: true}) }
        ]
      });
      
      console.log('Latency (ms):', result.latency);
      console.log('Requests/sec:', result.requests);
      console.log('Throughput:', result.throughput);
      
      // Store results for tracking
      await storeMetrics(result);
    }
  `)
```

## 📈 Performance Monitoring Setup

### Real-time Performance Tracking

```javascript
// Monitoring infrastructure
[BatchTool]:
  Write("src/monitoring/performance-monitor.js", `
    const { performance, PerformanceObserver } = require('perf_hooks');
    
    class PerformanceMonitor {
      constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.setupObservers();
      }
      
      setupObservers() {
        // Monitor long tasks
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              this.recordMetric('longTask', {
                name: entry.name,
                duration: entry.duration,
                timestamp: Date.now()
              });
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['measure', 'function'] });
        
        // Monitor resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('resource', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
              cached: entry.transferSize === 0
            });
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      }
      
      measure(name, fn) {
        performance.mark(\`\${name}-start\`);
        const result = fn();
        performance.mark(\`\${name}-end\`);
        performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
        return result;
      }
      
      async measureAsync(name, fn) {
        performance.mark(\`\${name}-start\`);
        const result = await fn();
        performance.mark(\`\${name}-end\`);
        performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
        return result;
      }
      
      recordMetric(type, data) {
        if (!this.metrics.has(type)) {
          this.metrics.set(type, []);
        }
        this.metrics.get(type).push(data);
        
        // Alert on threshold breach
        if (type === 'longTask' && data.duration > 100) {
          this.alert('Long task detected', data);
        }
      }
      
      getReport() {
        const report = {};
        for (const [type, data] of this.metrics) {
          report[type] = {
            count: data.length,
            average: data.reduce((sum, d) => sum + d.duration, 0) / data.length,
            max: Math.max(...data.map(d => d.duration)),
            min: Math.min(...data.map(d => d.duration))
          };
        }
        return report;
      }
    }
  `)
```

## 🎯 Performance Best Practices

### 1. Frontend Optimization

```javascript
// React performance optimization
Write("src/components/optimized-component.jsx", `
  import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
  
  // Lazy load heavy components
  const HeavyChart = lazy(() => import('./HeavyChart'));
  
  // Memoized component
  const OptimizedList = memo(({ items, onItemClick }) => {
    // Memoize expensive calculations
    const sortedItems = useMemo(() => {
      return items.sort((a, b) => b.score - a.score);
    }, [items]);
    
    // Memoize callbacks
    const handleClick = useCallback((id) => {
      onItemClick(id);
    }, [onItemClick]);
    
    return (
      <div>
        {sortedItems.map(item => (
          <div key={item.id} onClick={() => handleClick(item.id)}>
            {item.name}
          </div>
        ))}
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart data={sortedItems} />
        </Suspense>
      </div>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison for deeper optimization
    return prevProps.items.length === nextProps.items.length &&
           prevProps.items.every((item, index) => 
             item.id === nextProps.items[index].id
           );
  });
`)
```

### 2. Backend Optimization

```javascript
// Node.js performance patterns
Write("src/server/optimized-server.js", `
  const cluster = require('cluster');
  const os = require('os');
  const compression = require('compression');
  
  if (cluster.isMaster) {
    // Fork workers for each CPU core
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
      console.log(\`Worker \${worker.process.pid} died\`);
      cluster.fork();
    });
  } else {
    const app = express();
    
    // Enable compression
    app.use(compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6
    }));
    
    // Implement request pooling
    const requestPool = new Map();
    
    app.use(async (req, res, next) => {
      const key = \`\${req.method}:\${req.path}\`;
      
      if (requestPool.has(key)) {
        // Return cached response for identical requests
        const cached = requestPool.get(key);
        if (Date.now() - cached.timestamp < 1000) {
          return res.json(cached.data);
        }
      }
      
      next();
    });
    
    // Stream large responses
    app.get('/api/large-data', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
      });
      
      const stream = getLargeDataStream();
      stream.pipe(res);
    });
  }
`)
```

## 🔧 Performance Debugging Tools

### Advanced Performance Analysis

```javascript
// Performance debugging utilities
[BatchTool]:
  Write("src/debug/performance-debugger.js", `
    class PerformanceDebugger {
      static profileFunction(fn, iterations = 1000) {
        const measurements = [];
        
        // Warm up
        for (let i = 0; i < 10; i++) {
          fn();
        }
        
        // Actual measurements
        for (let i = 0; i < iterations; i++) {
          const start = process.hrtime.bigint();
          fn();
          const end = process.hrtime.bigint();
          measurements.push(Number(end - start) / 1000000); // Convert to ms
        }
        
        // Statistical analysis
        measurements.sort((a, b) => a - b);
        return {
          mean: measurements.reduce((a, b) => a + b) / measurements.length,
          median: measurements[Math.floor(measurements.length / 2)],
          p95: measurements[Math.floor(measurements.length * 0.95)],
          p99: measurements[Math.floor(measurements.length * 0.99)],
          min: measurements[0],
          max: measurements[measurements.length - 1],
          stdDev: this.calculateStdDev(measurements)
        };
      }
      
      static detectMemoryLeaks() {
        const heapSnapshots = [];
        let lastHeapUsed = 0;
        
        setInterval(() => {
          const memUsage = process.memoryUsage();
          const currentHeapUsed = memUsage.heapUsed;
          
          if (currentHeapUsed > lastHeapUsed * 1.1) {
            console.warn('Potential memory leak detected');
            heapSnapshots.push({
              timestamp: Date.now(),
              heapUsed: currentHeapUsed,
              delta: currentHeapUsed - lastHeapUsed
            });
          }
          
          lastHeapUsed = currentHeapUsed;
        }, 10000);
        
        return heapSnapshots;
      }
      
      static traceAsyncOperations() {
        const async_hooks = require('async_hooks');
        const fs = require('fs');
        
        const asyncOperations = new Map();
        
        const asyncHook = async_hooks.createHook({
          init(asyncId, type, triggerAsyncId) {
            asyncOperations.set(asyncId, {
              type,
              triggerAsyncId,
              startTime: Date.now()
            });
          },
          destroy(asyncId) {
            const op = asyncOperations.get(asyncId);
            if (op) {
              op.duration = Date.now() - op.startTime;
              if (op.duration > 100) {
                fs.writeSync(1, \`Slow async operation: \${op.type} took \${op.duration}ms\\n\`);
              }
              asyncOperations.delete(asyncId);
            }
          }
        });
        
        asyncHook.enable();
      }
    }
  `)
  
  Write("src/debug/flame-graph-generator.js", `
    const v8Profiler = require('v8-profiler-next');
    const fs = require('fs');
    
    class FlameGraphGenerator {
      static async generateCPUProfile(duration = 10000) {
        const title = 'CPU Profile';
        v8Profiler.startProfiling(title, true);
        
        await new Promise(resolve => setTimeout(resolve, duration));
        
        const profile = v8Profiler.stopProfiling(title);
        const profileData = await new Promise((resolve, reject) => {
          profile.export((error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        
        fs.writeFileSync('cpu-profile.cpuprofile', profileData);
        profile.delete();
        
        // Convert to flamegraph format
        this.convertToFlameGraph('cpu-profile.cpuprofile');
      }
      
      static generateHeapSnapshot() {
        const snapshot = v8Profiler.takeSnapshot();
        const snapshotData = snapshot.export();
        
        fs.writeFileSync('heap-snapshot.heapsnapshot', snapshotData);
        snapshot.delete();
      }
    }
  `)
```

## 📊 Performance Coordination Memory Pattern

```javascript
// Store performance metrics in swarm memory
[BatchTool]:
  mcp__claude-flow__memory_usage {
    action: "store",
    key: "performance/baseline",
    value: JSON.stringify({
      timestamp: Date.now(),
      metrics: {
        responseTime: { p50: 45, p95: 120, p99: 250 },
        throughput: { rps: 5000, concurrent: 100 },
        resources: { cpu: 45, memory: 512, disk: 20 },
        errors: { rate: 0.01, types: ["timeout", "5xx"] }
      }
    })
  }
  
  mcp__claude-flow__memory_usage {
    action: "store",
    key: "performance/optimizations",
    value: JSON.stringify({
      applied: [
        { type: "caching", impact: "+30% throughput" },
        { type: "algorithm", impact: "-50% CPU usage" },
        { type: "database", impact: "-70% query time" }
      ],
      pending: [
        { type: "cdn", expectedImpact: "-80% latency" },
        { type: "compression", expectedImpact: "-60% bandwidth" }
      ]
    })
  }
```

## 🎯 Performance Monitoring Dashboard

```javascript
// Real-time performance dashboard
Write("src/dashboard/performance-dashboard.html", `
<!DOCTYPE html>
<html>
<head>
  <title>Performance Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    .metric-card {
      background: #f0f0f0;
      padding: 20px;
      margin: 10px;
      border-radius: 8px;
      display: inline-block;
    }
    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: #333;
    }
    .metric-label {
      font-size: 14px;
      color: #666;
    }
    .alert {
      background: #ff4444;
      color: white;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>Performance Dashboard</h1>
  
  <div id="metrics">
    <div class="metric-card">
      <div class="metric-value" id="response-time">-</div>
      <div class="metric-label">Response Time (ms)</div>
    </div>
    <div class="metric-card">
      <div class="metric-value" id="throughput">-</div>
      <div class="metric-label">Requests/sec</div>
    </div>
    <div class="metric-card">
      <div class="metric-value" id="cpu-usage">-</div>
      <div class="metric-label">CPU Usage (%)</div>
    </div>
    <div class="metric-card">
      <div class="metric-value" id="memory-usage">-</div>
      <div class="metric-label">Memory (MB)</div>
    </div>
  </div>
  
  <div id="alerts"></div>
  
  <canvas id="performance-chart"></canvas>
  
  <script>
    const ws = new WebSocket('ws://localhost:3001/metrics');
    const chart = new Chart(document.getElementById('performance-chart'), {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Response Time',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update metrics
      document.getElementById('response-time').textContent = data.responseTime;
      document.getElementById('throughput').textContent = data.throughput;
      document.getElementById('cpu-usage').textContent = data.cpu + '%';
      document.getElementById('memory-usage').textContent = data.memory;
      
      // Update chart
      chart.data.labels.push(new Date().toLocaleTimeString());
      chart.data.datasets[0].data.push(data.responseTime);
      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update();
      
      // Show alerts
      if (data.alerts && data.alerts.length > 0) {
        const alertsDiv = document.getElementById('alerts');
        alertsDiv.innerHTML = data.alerts.map(alert => 
          '<div class="alert">' + alert + '</div>'
        ).join('');
      }
    };
  </script>
</body>
</html>
`)
```

## 🚀 Performance Optimization Checklist

### Before Deployment Checklist

1. **Profiling Complete** ✓
   - CPU profiling done
   - Memory profiling done
   - I/O profiling done

2. **Optimizations Applied** ✓
   - Critical algorithms optimized
   - Caching implemented
   - Database indexed
   - Code splitting done

3. **Benchmarks Passed** ✓
   - Response time < 100ms (p95)
   - Throughput > 1000 rps
   - Memory usage stable
   - CPU usage < 70%

4. **Monitoring Setup** ✓
   - Real-time dashboard
   - Alert thresholds
   - Performance logs
   - Metrics collection

5. **Load Testing** ✓
   - Stress test passed
   - Spike test passed
   - Endurance test passed
   - Scalability verified

Remember: **Measure → Optimize → Verify → Monitor**