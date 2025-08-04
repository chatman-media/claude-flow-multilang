# Claude Code Configuration for Scalability-Focused Development

## 🌐 CRITICAL: Build for Scale from Day One

**MANDATORY RULE**: Every component must be designed for horizontal scaling:

1. **Stateless Services** → No local state, all state externalized
2. **Load Distribution** → Balance across multiple instances
3. **Cache Everything** → Multi-layer caching strategy
4. **Queue Heavy Work** → Async processing for intensive tasks
5. **Monitor at Scale** → Distributed tracing and metrics

## 🚀 Scalability Swarm Configuration

### Initialize Scale-Ready Swarm

```javascript
// ✅ CORRECT: Scalability-focused swarm setup
[Single Message with BatchTool]:
  // Distributed topology for scalability
  mcp__claude-flow__swarm_init { 
    topology: "mesh",      // Distributed coordination
    maxAgents: 8,          // Scale team
    strategy: "adaptive"   // Dynamic scaling
  }
  
  // Specialized scalability agents
  mcp__claude-flow__agent_spawn { type: "architect", name: "Scale Architect" }
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Load Balancer Expert" }
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Cache Engineer" }
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Queue Specialist" }
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Database Scaler" }
  mcp__claude-flow__agent_spawn { type: "monitor", name: "Scale Monitor" }
  mcp__claude-flow__agent_spawn { type: "optimizer", name: "Performance Tuner" }
  mcp__claude-flow__agent_spawn { type: "coordinator", name: "Scale Lead" }
  
  // Scalability todos
  TodoWrite { todos: [
    {id: "arch", content: "Design scalable architecture", status: "in_progress", priority: "high"},
    {id: "stateless", content: "Make services stateless", status: "pending", priority: "high"},
    {id: "loadbalance", content: "Implement load balancing", status: "pending", priority: "high"},
    {id: "cache-layers", content: "Setup multi-layer caching", status: "pending", priority: "high"},
    {id: "queue-system", content: "Implement message queuing", status: "pending", priority: "high"},
    {id: "db-sharding", content: "Design database sharding", status: "pending", priority: "high"},
    {id: "auto-scale", content: "Setup auto-scaling", status: "pending", priority: "medium"},
    {id: "circuit-break", content: "Add circuit breakers", status: "pending", priority: "medium"},
    {id: "rate-limit", content: "Implement rate limiting", status: "pending", priority: "medium"},
    {id: "monitoring", content: "Setup distributed monitoring", status: "pending", priority: "high"}
  ]}
```

## 🏗️ Scalable Architecture Patterns

### Microservices Architecture

```javascript
// Scale Architect Agent Task
Task(`You are the Scale Architect agent designing for massive scale.

MANDATORY COORDINATION:
1. START: npx claude-flow@alpha hooks pre-task --description "Designing scalable architecture"
2. DESIGN: Create horizontally scalable service architecture
3. STORE: npx claude-flow@alpha hooks notify --message "Architecture decisions: [patterns]"
4. VALIDATE: Ensure all components can scale independently

IMPLEMENT:
- Service mesh architecture
- API gateway pattern
- Event-driven communication
- CQRS for read/write separation
- Saga pattern for distributed transactions
- Service discovery and registration
`)

// Implementation structure
[BatchTool]:
  // Create microservice structure
  Bash("mkdir -p services/{api-gateway,user-service,order-service,payment-service,notification-service}")
  Bash("mkdir -p infrastructure/{service-mesh,load-balancer,message-queue,cache}")
  
  // API Gateway
  Write("services/api-gateway/index.js", `
    const express = require('express');
    const httpProxy = require('http-proxy-middleware');
    const CircuitBreaker = require('opossum');
    const RateLimiter = require('express-rate-limit');
    
    const app = express();
    
    // Rate limiting
    const limiter = RateLimiter({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests',
      standardHeaders: true,
      legacyHeaders: false,
    });
    
    app.use(limiter);
    
    // Service registry
    const services = {
      users: process.env.USER_SERVICE_URL || 'http://user-service:3001',
      orders: process.env.ORDER_SERVICE_URL || 'http://order-service:3002',
      payments: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3003'
    };
    
    // Circuit breaker for each service
    const breakers = {};
    for (const [name, url] of Object.entries(services)) {
      breakers[name] = new CircuitBreaker(
        httpProxy.createProxyMiddleware({
          target: url,
          changeOrigin: true
        }),
        {
          timeout: 3000,
          errorThresholdPercentage: 50,
          resetTimeout: 30000
        }
      );
    }
    
    // Route to services
    app.use('/api/users', breakers.users);
    app.use('/api/orders', breakers.orders);
    app.use('/api/payments', breakers.payments);
    
    // Health check
    app.get('/health', (req, res) => {
      const health = {
        status: 'healthy',
        services: {}
      };
      
      for (const [name, breaker] of Object.entries(breakers)) {
        health.services[name] = {
          state: breaker.stats.state,
          failures: breaker.stats.failures,
          successes: breaker.stats.successes
        };
      }
      
      res.json(health);
    });
  `)
```

## ⚖️ Load Balancing Strategies

### Multi-Layer Load Balancing

```javascript
// Load Balancer Expert Agent
Task(`You are the Load Balancer Expert implementing distribution strategies.

IMPLEMENT:
1. DNS load balancing for geographic distribution
2. Layer 4 load balancing for TCP/UDP
3. Layer 7 load balancing for HTTP/HTTPS
4. Consistent hashing for session affinity
5. Health checks and automatic failover
`)

// HAProxy configuration
Write("infrastructure/load-balancer/haproxy.cfg", `
global
    maxconn 50000
    log stdout local0
    user haproxy
    group haproxy
    daemon
    
    # Performance tuning
    tune.ssl.default-dh-param 2048
    tune.bufsize 32768
    
defaults
    mode http
    log global
    option httplog
    option dontlognull
    option http-server-close
    option forwardfor except 127.0.0.0/8
    option redispatch
    retries 3
    timeout http-request 10s
    timeout queue 1m
    timeout connect 10s
    timeout client 1m
    timeout server 1m
    timeout http-keep-alive 10s
    timeout check 10s
    maxconn 10000

# Statistics
stats enable
stats uri /stats
stats refresh 30s

# API Backend
backend api_servers
    balance roundrobin
    option httpchk GET /health
    
    # Dynamic server addition via API
    server-template api 10 _api._tcp.service.consul resolvers consul resolve-prefer ipv4 check

    # Stick sessions using cookies
    cookie SERVERID insert indirect nocache
    
    # Circuit breaker behavior
    option allbackups
    
frontend api_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/api.pem
    
    # Rate limiting
    stick-table type ip size 100k expire 30s store http_req_rate(10s)
    http-request track-sc0 src
    http-request deny if { sc_http_req_rate(0) gt 100 }
    
    # Compression
    compression algo gzip
    compression type text/html text/plain text/css application/json
    
    # Security headers
    http-response set-header X-Frame-Options DENY
    http-response set-header X-Content-Type-Options nosniff
    
    default_backend api_servers
`)

// Nginx load balancer alternative
Write("infrastructure/load-balancer/nginx.conf", `
upstream api_backend {
    least_conn;  # Least connections algorithm
    
    # Health checks
    zone backend 64k;
    
    # Servers with weights
    server api1.example.com:3000 weight=5 max_fails=3 fail_timeout=30s;
    server api2.example.com:3000 weight=5 max_fails=3 fail_timeout=30s;
    server api3.example.com:3000 weight=3 max_fails=3 fail_timeout=30s;
    
    # Backup servers
    server api-backup1.example.com:3000 backup;
    server api-backup2.example.com:3000 backup;
    
    # Keep alive connections
    keepalive 32;
}

server {
    listen 80;
    listen 443 ssl http2;
    
    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;
    limit_req zone=api burst=200 nodelay;
    
    # Caching
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g;
    proxy_cache api_cache;
    proxy_cache_valid 200 1m;
    proxy_cache_use_stale error timeout invalid_header updating;
    
    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
`)
```

## 💾 Multi-Layer Caching Strategy

### Comprehensive Caching Implementation

```javascript
// Cache Engineer Agent
Task(`You are the Cache Engineer implementing multi-layer caching.

MANDATORY COORDINATION:
1. Browser cache with proper headers
2. CDN cache for static assets
3. Application-level memory cache
4. Redis for distributed cache
5. Database query cache

OPTIMIZE:
- Cache invalidation strategies
- Cache warming techniques
- Cache hit ratio monitoring
`)

// Caching infrastructure
[BatchTool]:
  Write("infrastructure/cache/cache-manager.js", `
    const Redis = require('ioredis');
    const LRU = require('lru-cache');
    
    class CacheManager {
      constructor() {
        // Local memory cache (L1)
        this.memoryCache = new LRU({
          max: 500,
          maxAge: 1000 * 60 * 5, // 5 minutes
          updateAgeOnGet: true
        });
        
        // Redis cache (L2)
        this.redisCache = new Redis.Cluster([
          { host: 'redis-node-1', port: 6379 },
          { host: 'redis-node-2', port: 6379 },
          { host: 'redis-node-3', port: 6379 }
        ], {
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          retryDelayOnFailover: 100,
          retryDelayOnClusterDown: 300,
        });
        
        // Cache statistics
        this.stats = {
          hits: 0,
          misses: 0,
          l1Hits: 0,
          l2Hits: 0
        };
      }
      
      async get(key, options = {}) {
        // Check L1 cache
        const l1Value = this.memoryCache.get(key);
        if (l1Value !== undefined) {
          this.stats.hits++;
          this.stats.l1Hits++;
          return l1Value;
        }
        
        // Check L2 cache
        try {
          const l2Value = await this.redisCache.get(key);
          if (l2Value) {
            this.stats.hits++;
            this.stats.l2Hits++;
            const parsed = JSON.parse(l2Value);
            
            // Populate L1 cache
            this.memoryCache.set(key, parsed);
            return parsed;
          }
        } catch (error) {
          console.error('Redis error:', error);
        }
        
        this.stats.misses++;
        return null;
      }
      
      async set(key, value, options = {}) {
        const ttl = options.ttl || 3600; // 1 hour default
        
        // Set in L1 cache
        this.memoryCache.set(key, value);
        
        // Set in L2 cache
        try {
          await this.redisCache.setex(
            key,
            ttl,
            JSON.stringify(value)
          );
        } catch (error) {
          console.error('Redis set error:', error);
        }
      }
      
      async invalidate(pattern) {
        // Clear from L1 cache
        const keys = this.memoryCache.keys();
        for (const key of keys) {
          if (key.match(pattern)) {
            this.memoryCache.del(key);
          }
        }
        
        // Clear from L2 cache
        try {
          const stream = this.redisCache.scanStream({
            match: pattern,
            count: 100
          });
          
          stream.on('data', async (keys) => {
            if (keys.length) {
              await this.redisCache.del(...keys);
            }
          });
        } catch (error) {
          console.error('Redis invalidation error:', error);
        }
      }
      
      getHitRatio() {
        const total = this.stats.hits + this.stats.misses;
        return total > 0 ? this.stats.hits / total : 0;
      }
    }
  `)
  
  // CDN configuration
  Write("infrastructure/cache/cdn-config.js", `
    // CloudFront configuration example
    const cloudFrontConfig = {
      DefaultCacheBehavior: {
        TargetOriginId: 'api-origin',
        ViewerProtocolPolicy: 'redirect-to-https',
        AllowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
        CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        Compress: true,
        
        ForwardedValues: {
          QueryString: true,
          Headers: ['Authorization', 'CloudFront-Forwarded-Proto'],
          Cookies: { Forward: 'none' }
        },
        
        MinTTL: 0,
        DefaultTTL: 86400,
        MaxTTL: 31536000
      },
      
      CacheBehaviors: [
        {
          PathPattern: '/api/*',
          TargetOriginId: 'api-origin',
          ViewerProtocolPolicy: 'https-only',
          MinTTL: 0,
          DefaultTTL: 0,
          MaxTTL: 0,
          ForwardedValues: {
            QueryString: true,
            Headers: ['*'],
            Cookies: { Forward: 'all' }
          }
        },
        {
          PathPattern: '/static/*',
          TargetOriginId: 's3-origin',
          ViewerProtocolPolicy: 'redirect-to-https',
          MinTTL: 86400,
          DefaultTTL: 604800,
          MaxTTL: 31536000,
          Compress: true
        }
      ]
    };
  `)
```

## 📬 Message Queue Architecture

### Scalable Async Processing

```javascript
// Queue Specialist Agent
Task(`You are the Queue Specialist implementing distributed message processing.

IMPLEMENT:
1. Message broker setup (RabbitMQ/Kafka)
2. Work queue patterns
3. Pub/sub for event distribution
4. Dead letter queues
5. Message persistence and replay
`)

// RabbitMQ implementation
[BatchTool]:
  Write("infrastructure/message-queue/rabbitmq-manager.js", `
    const amqp = require('amqplib');
    
    class RabbitMQManager {
      constructor(urls) {
        this.urls = urls; // Array of RabbitMQ URLs for HA
        this.connection = null;
        this.channel = null;
        this.consumers = new Map();
      }
      
      async connect() {
        try {
          // Connect to cluster
          this.connection = await amqp.connect(this.urls, {
            heartbeat: 60,
            reconnect: true,
            reconnectDelay: 5000
          });
          
          this.channel = await this.connection.createChannel();
          
          // Set prefetch for work distribution
          await this.channel.prefetch(10);
          
          // Handle connection events
          this.connection.on('error', this.handleError.bind(this));
          this.connection.on('close', this.handleClose.bind(this));
          
        } catch (error) {
          console.error('RabbitMQ connection error:', error);
          throw error;
        }
      }
      
      async createQueue(name, options = {}) {
        const queueOptions = {
          durable: true,
          exclusive: false,
          autoDelete: false,
          arguments: {
            'x-message-ttl': 86400000, // 24 hours
            'x-max-length': 1000000,
            'x-overflow': 'reject-publish',
            ...options.arguments
          }
        };
        
        await this.channel.assertQueue(name, queueOptions);
        
        // Create dead letter queue
        const dlqName = \`\${name}.dlq\`;
        await this.channel.assertQueue(dlqName, {
          durable: true,
          arguments: {
            'x-message-ttl': 604800000 // 7 days
          }
        });
        
        // Bind main queue to DLQ
        await this.channel.bindQueue(
          name,
          '',
          name,
          { 'x-dead-letter-exchange': '', 'x-dead-letter-routing-key': dlqName }
        );
      }
      
      async publish(queue, message, options = {}) {
        const messageBuffer = Buffer.from(JSON.stringify(message));
        
        const publishOptions = {
          persistent: true,
          timestamp: Date.now(),
          contentType: 'application/json',
          ...options
        };
        
        return this.channel.sendToQueue(queue, messageBuffer, publishOptions);
      }
      
      async consume(queue, handler, options = {}) {
        const consumerTag = await this.channel.consume(
          queue,
          async (msg) => {
            if (!msg) return;
            
            try {
              const content = JSON.parse(msg.content.toString());
              await handler(content, msg);
              
              // Acknowledge message
              this.channel.ack(msg);
            } catch (error) {
              console.error('Message processing error:', error);
              
              // Reject and send to DLQ after max retries
              const retries = (msg.properties.headers['x-retries'] || 0) + 1;
              if (retries >= 3) {
                this.channel.reject(msg, false);
              } else {
                // Republish with retry count
                await this.publish(queue, JSON.parse(msg.content), {
                  headers: { 'x-retries': retries }
                });
                this.channel.ack(msg);
              }
            }
          },
          { noAck: false, ...options }
        );
        
        this.consumers.set(queue, consumerTag);
      }
      
      async createExchange(name, type = 'topic', options = {}) {
        await this.channel.assertExchange(name, type, {
          durable: true,
          autoDelete: false,
          ...options
        });
      }
      
      // Pub/Sub pattern
      async publishToExchange(exchange, routingKey, message) {
        const messageBuffer = Buffer.from(JSON.stringify(message));
        
        return this.channel.publish(
          exchange,
          routingKey,
          messageBuffer,
          { persistent: true }
        );
      }
    }
  `)
  
  // Kafka alternative for high throughput
  Write("infrastructure/message-queue/kafka-manager.js", `
    const { Kafka } = require('kafkajs');
    
    class KafkaManager {
      constructor(brokers) {
        this.kafka = new Kafka({
          clientId: 'scalable-app',
          brokers: brokers,
          connectionTimeout: 10000,
          requestTimeout: 30000,
          retry: {
            initialRetryTime: 100,
            retries: 8
          }
        });
        
        this.producer = null;
        this.consumers = new Map();
      }
      
      async initProducer() {
        this.producer = this.kafka.producer({
          allowAutoTopicCreation: false,
          transactionTimeout: 30000,
          idempotent: true,
          maxInFlightRequests: 5,
          compression: 1 // GZIP
        });
        
        await this.producer.connect();
      }
      
      async produce(topic, messages, options = {}) {
        const records = messages.map(msg => ({
          key: msg.key || null,
          value: JSON.stringify(msg.value),
          partition: msg.partition,
          headers: msg.headers
        }));
        
        await this.producer.send({
          topic,
          messages: records,
          acks: -1, // Wait for all replicas
          timeout: 30000,
          compression: 1
        });
      }
      
      async createConsumer(groupId, topics, handler) {
        const consumer = this.kafka.consumer({
          groupId,
          sessionTimeout: 30000,
          rebalanceTimeout: 60000,
          heartbeatInterval: 3000,
          maxBytesPerPartition: 1048576, // 1MB
          maxWaitTimeInMs: 5000
        });
        
        await consumer.connect();
        await consumer.subscribe({
          topics,
          fromBeginning: false
        });
        
        await consumer.run({
          autoCommit: false,
          eachMessage: async ({ topic, partition, message }) => {
            try {
              const value = JSON.parse(message.value.toString());
              await handler({
                topic,
                partition,
                offset: message.offset,
                key: message.key?.toString(),
                value,
                headers: message.headers,
                timestamp: message.timestamp
              });
              
              // Commit offset after successful processing
              await consumer.commitOffsets([{
                topic,
                partition,
                offset: (parseInt(message.offset) + 1).toString()
              }]);
            } catch (error) {
              console.error('Kafka message processing error:', error);
              // Implement retry logic or DLQ
            }
          }
        });
        
        this.consumers.set(groupId, consumer);
      }
    }
  `)
```

## 🗄️ Database Scaling Strategies

### Horizontal Database Scaling

```javascript
// Database Scaler Agent
Task(`You are the Database Scaler implementing horizontal scaling patterns.

IMPLEMENT:
1. Read replicas for load distribution
2. Database sharding strategies
3. Connection pooling optimization
4. Query result caching
5. Write-through caching
`)

// Database sharding implementation
[BatchTool]:
  Write("infrastructure/database/shard-manager.js", `
    const crypto = require('crypto');
    
    class ShardManager {
      constructor(shards) {
        this.shards = shards; // Array of database connections
        this.shardCount = shards.length;
        this.consistentHash = new ConsistentHash(shards);
      }
      
      // Hash-based sharding
      getShardByKey(key) {
        const hash = crypto.createHash('md5').update(key).digest('hex');
        const shardIndex = parseInt(hash.substring(0, 8), 16) % this.shardCount;
        return this.shards[shardIndex];
      }
      
      // Range-based sharding
      getShardByRange(value) {
        const rangeSize = Math.ceil(Number.MAX_SAFE_INTEGER / this.shardCount);
        const shardIndex = Math.floor(value / rangeSize);
        return this.shards[Math.min(shardIndex, this.shardCount - 1)];
      }
      
      // Geographic sharding
      getShardByRegion(region) {
        const regionMap = {
          'us-east': this.shards[0],
          'us-west': this.shards[1],
          'eu-west': this.shards[2],
          'asia-pacific': this.shards[3]
        };
        return regionMap[region] || this.shards[0];
      }
      
      // Execute query on specific shard
      async query(shardKey, sql, params) {
        const shard = this.getShardByKey(shardKey);
        return shard.query(sql, params);
      }
      
      // Execute query on all shards (scatter-gather)
      async queryAll(sql, params) {
        const promises = this.shards.map(shard => 
          shard.query(sql, params)
        );
        
        const results = await Promise.all(promises);
        return this.mergeResults(results);
      }
      
      // Cross-shard join (simplified)
      async crossShardJoin(table1, table2, joinKey) {
        // Step 1: Get data from all shards
        const table1Data = await this.queryAll(
          \`SELECT * FROM \${table1}\`
        );
        
        const table2Data = await this.queryAll(
          \`SELECT * FROM \${table2}\`
        );
        
        // Step 2: Perform join in application
        const joined = [];
        for (const row1 of table1Data) {
          for (const row2 of table2Data) {
            if (row1[joinKey] === row2[joinKey]) {
              joined.push({ ...row1, ...row2 });
            }
          }
        }
        
        return joined;
      }
      
      // Rebalancing data across shards
      async rebalance() {
        // Implementation for moving data between shards
        // This is complex and should be done carefully
      }
    }
    
    // Consistent hashing for dynamic shard addition/removal
    class ConsistentHash {
      constructor(nodes, virtualNodes = 150) {
        this.nodes = nodes;
        this.virtualNodes = virtualNodes;
        this.ring = new Map();
        this.sortedKeys = [];
        
        this.buildRing();
      }
      
      buildRing() {
        for (const node of this.nodes) {
          for (let i = 0; i < this.virtualNodes; i++) {
            const virtualKey = \`\${node.id}-\${i}\`;
            const hash = this.hash(virtualKey);
            this.ring.set(hash, node);
          }
        }
        
        this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
      }
      
      hash(key) {
        return crypto.createHash('md5').update(key).digest().readUInt32BE(0);
      }
      
      getNode(key) {
        const hash = this.hash(key);
        
        // Binary search for the first key >= hash
        let left = 0;
        let right = this.sortedKeys.length - 1;
        
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (this.sortedKeys[mid] === hash) {
            return this.ring.get(this.sortedKeys[mid]);
          } else if (this.sortedKeys[mid] < hash) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }
        
        // Wrap around to the first node
        const index = left >= this.sortedKeys.length ? 0 : left;
        return this.ring.get(this.sortedKeys[index]);
      }
    }
  `)
  
  // Read replica configuration
  Write("infrastructure/database/read-replica-manager.js", `
    class ReadReplicaManager {
      constructor(master, replicas) {
        this.master = master;
        this.replicas = replicas;
        this.currentReplica = 0;
        this.healthChecks = new Map();
        
        this.startHealthChecks();
      }
      
      // Round-robin read distribution
      getReadConnection() {
        const healthyReplicas = this.replicas.filter(replica => 
          this.healthChecks.get(replica.id) !== false
        );
        
        if (healthyReplicas.length === 0) {
          console.warn('No healthy replicas, falling back to master');
          return this.master;
        }
        
        const replica = healthyReplicas[this.currentReplica % healthyReplicas.length];
        this.currentReplica++;
        return replica;
      }
      
      // Always write to master
      getWriteConnection() {
        return this.master;
      }
      
      // Execute read query with replica
      async read(sql, params) {
        const connection = this.getReadConnection();
        try {
          return await connection.query(sql, params);
        } catch (error) {
          console.error('Read replica error:', error);
          // Fallback to master
          return this.master.query(sql, params);
        }
      }
      
      // Execute write query on master
      async write(sql, params) {
        return this.master.query(sql, params);
      }
      
      // Health checking
      startHealthChecks() {
        setInterval(() => {
          this.replicas.forEach(async (replica) => {
            try {
              await replica.query('SELECT 1');
              this.healthChecks.set(replica.id, true);
            } catch (error) {
              console.error(\`Replica \${replica.id} health check failed:\`, error);
              this.healthChecks.set(replica.id, false);
            }
          });
        }, 5000);
      }
      
      // Lag monitoring
      async getReplicationLag() {
        const lags = await Promise.all(
          this.replicas.map(async (replica) => {
            try {
              const result = await replica.query('SHOW SLAVE STATUS');
              return {
                replica: replica.id,
                lag: result[0].Seconds_Behind_Master
              };
            } catch (error) {
              return {
                replica: replica.id,
                lag: null,
                error: error.message
              };
            }
          })
        );
        
        return lags;
      }
    }
  `)
```

## 🚀 Auto-Scaling Implementation

### Dynamic Resource Scaling

```javascript
// Auto-scaling configuration
[BatchTool]:
  Write("infrastructure/auto-scaling/scaler.js", `
    const AWS = require('aws-sdk');
    const k8s = require('@kubernetes/client-node');
    
    class AutoScaler {
      constructor(config) {
        this.config = config;
        this.metrics = new Map();
        this.scalingInProgress = false;
        
        // AWS Auto Scaling
        this.autoScaling = new AWS.AutoScaling();
        
        // Kubernetes client
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        this.k8sApi = kc.makeApiClient(k8s.AppsV1Api);
        this.k8sMetrics = kc.makeApiClient(k8s.MetricsV1beta1Api);
      }
      
      // Monitor metrics and trigger scaling
      async monitorAndScale() {
        if (this.scalingInProgress) return;
        
        try {
          const metrics = await this.collectMetrics();
          const scalingDecision = this.makeScalingDecision(metrics);
          
          if (scalingDecision.action !== 'none') {
            this.scalingInProgress = true;
            await this.executeScaling(scalingDecision);
            this.scalingInProgress = false;
          }
        } catch (error) {
          console.error('Auto-scaling error:', error);
          this.scalingInProgress = false;
        }
      }
      
      async collectMetrics() {
        const metrics = {
          cpu: await this.getCPUMetrics(),
          memory: await this.getMemoryMetrics(),
          requestRate: await this.getRequestRate(),
          responseTime: await this.getResponseTime(),
          queueLength: await this.getQueueLength()
        };
        
        // Store metrics history
        this.metrics.set(Date.now(), metrics);
        
        // Keep only last 5 minutes
        const fiveMinutesAgo = Date.now() - 300000;
        for (const [timestamp] of this.metrics) {
          if (timestamp < fiveMinutesAgo) {
            this.metrics.delete(timestamp);
          }
        }
        
        return metrics;
      }
      
      makeScalingDecision(metrics) {
        const { 
          cpuThreshold = 70,
          memoryThreshold = 80,
          responseTimeThreshold = 1000,
          minInstances = 2,
          maxInstances = 20
        } = this.config;
        
        // Get current instance count
        const currentInstances = this.getCurrentInstances();
        
        // Scale up conditions
        if (
          metrics.cpu > cpuThreshold ||
          metrics.memory > memoryThreshold ||
          metrics.responseTime > responseTimeThreshold
        ) {
          const targetInstances = Math.min(
            currentInstances + Math.ceil(currentInstances * 0.5),
            maxInstances
          );
          
          return {
            action: 'scale-up',
            currentInstances,
            targetInstances,
            reason: this.getScaleReason(metrics)
          };
        }
        
        // Scale down conditions
        if (
          metrics.cpu < cpuThreshold * 0.3 &&
          metrics.memory < memoryThreshold * 0.3 &&
          metrics.responseTime < responseTimeThreshold * 0.3
        ) {
          const targetInstances = Math.max(
            currentInstances - Math.floor(currentInstances * 0.25),
            minInstances
          );
          
          return {
            action: 'scale-down',
            currentInstances,
            targetInstances,
            reason: 'Low resource utilization'
          };
        }
        
        return { action: 'none' };
      }
      
      async executeScaling(decision) {
        console.log(\`Executing \${decision.action}: \${decision.currentInstances} -> \${decision.targetInstances}\`);
        
        // Kubernetes scaling
        if (this.config.platform === 'kubernetes') {
          await this.k8sApi.patchNamespacedDeploymentScale(
            this.config.deploymentName,
            this.config.namespace,
            {
              spec: { replicas: decision.targetInstances }
            }
          );
        }
        
        // AWS Auto Scaling
        if (this.config.platform === 'aws') {
          await this.autoScaling.setDesiredCapacity({
            AutoScalingGroupName: this.config.asgName,
            DesiredCapacity: decision.targetInstances,
            HonorCooldown: false
          }).promise();
        }
        
        // Log scaling event
        await this.logScalingEvent(decision);
        
        // Wait for instances to stabilize
        await this.waitForStabilization(decision.targetInstances);
      }
      
      // Predictive scaling based on patterns
      async predictiveScale() {
        const history = Array.from(this.metrics.values());
        if (history.length < 10) return;
        
        // Simple trend analysis
        const cpuTrend = this.calculateTrend(history.map(m => m.cpu));
        const requestTrend = this.calculateTrend(history.map(m => m.requestRate));
        
        // Predict future load
        if (cpuTrend > 0.1 || requestTrend > 0.15) {
          console.log('Predictive scaling: Increasing trend detected');
          const currentInstances = this.getCurrentInstances();
          const targetInstances = Math.min(
            currentInstances + 2,
            this.config.maxInstances
          );
          
          await this.executeScaling({
            action: 'predictive-scale-up',
            currentInstances,
            targetInstances,
            reason: 'Predicted load increase'
          });
        }
      }
      
      calculateTrend(values) {
        if (values.length < 2) return 0;
        
        // Simple linear regression
        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        return slope;
      }
    }
  `)
```

## 🔐 Scalability Security Patterns

### Rate Limiting and DDoS Protection

```javascript
// Distributed rate limiting
Write("infrastructure/security/rate-limiter.js", `
  const Redis = require('ioredis');
  
  class DistributedRateLimiter {
    constructor(redisCluster) {
      this.redis = redisCluster;
      this.scripts = this.loadLuaScripts();
    }
    
    loadLuaScripts() {
      // Sliding window rate limiting
      const slidingWindow = \`
        local key = KEYS[1]
        local window = tonumber(ARGV[1])
        local limit = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local clearBefore = now - window
        
        redis.call('zremrangebyscore', key, 0, clearBefore)
        
        local current = redis.call('zcard', key)
        if current < limit then
          redis.call('zadd', key, now, now)
          redis.call('expire', key, window)
          return { 1, limit - current - 1 }
        else
          return { 0, 0 }
        end
      \`;
      
      // Token bucket algorithm
      const tokenBucket = \`
        local key = KEYS[1]
        local rate = tonumber(ARGV[1])
        local capacity = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local requested = tonumber(ARGV[4])
        
        local bucket = redis.call('hmget', key, 'tokens', 'last_refill')
        local tokens = tonumber(bucket[1]) or capacity
        local last_refill = tonumber(bucket[2]) or now
        
        local elapsed = math.max(0, now - last_refill)
        local new_tokens = math.min(capacity, tokens + (elapsed * rate))
        
        if new_tokens >= requested then
          new_tokens = new_tokens - requested
          redis.call('hmset', key, 'tokens', new_tokens, 'last_refill', now)
          redis.call('expire', key, capacity / rate)
          return { 1, new_tokens }
        else
          redis.call('hmset', key, 'tokens', new_tokens, 'last_refill', now)
          return { 0, new_tokens }
        end
      \`;
      
      return { slidingWindow, tokenBucket };
    }
    
    async checkLimit(identifier, options = {}) {
      const {
        window = 60000, // 1 minute
        limit = 100,
        algorithm = 'sliding'
      } = options;
      
      const key = \`rate_limit:\${identifier}\`;
      const now = Date.now();
      
      try {
        let result;
        
        if (algorithm === 'sliding') {
          result = await this.redis.eval(
            this.scripts.slidingWindow,
            1,
            key,
            window,
            limit,
            now
          );
        } else if (algorithm === 'token') {
          const rate = limit / (window / 1000); // tokens per second
          result = await this.redis.eval(
            this.scripts.tokenBucket,
            1,
            key,
            rate,
            limit,
            now,
            1
          );
        }
        
        return {
          allowed: result[0] === 1,
          remaining: result[1],
          resetAt: now + window
        };
      } catch (error) {
        console.error('Rate limit error:', error);
        // Fail open in case of Redis failure
        return { allowed: true, remaining: limit, resetAt: now + window };
      }
    }
    
    // Global rate limiting across all instances
    async checkGlobalLimit(options = {}) {
      const {
        window = 60000,
        limit = 10000,
        namespace = 'global'
      } = options;
      
      return this.checkLimit(namespace, { window, limit });
    }
    
    // IP-based rate limiting
    async checkIPLimit(ip, options = {}) {
      return this.checkLimit(\`ip:\${ip}\`, options);
    }
    
    // User-based rate limiting
    async checkUserLimit(userId, options = {}) {
      return this.checkLimit(\`user:\${userId}\`, options);
    }
    
    // API key rate limiting with tiers
    async checkAPIKeyLimit(apiKey, tier = 'basic') {
      const limits = {
        basic: { window: 3600000, limit: 1000 },    // 1000/hour
        pro: { window: 3600000, limit: 10000 },     // 10000/hour
        enterprise: { window: 3600000, limit: 100000 } // 100000/hour
      };
      
      return this.checkLimit(\`api:\${apiKey}\`, limits[tier]);
    }
  }
`)
```

## 📊 Scalability Monitoring Dashboard

```javascript
// Real-time scalability metrics
Write("infrastructure/monitoring/scalability-dashboard.js", `
  const express = require('express');
  const WebSocket = require('ws');
  
  class ScalabilityDashboard {
    constructor() {
      this.app = express();
      this.metrics = {
        instances: new Map(),
        loadBalancer: {},
        cache: {},
        database: {},
        queues: {}
      };
      
      this.setupEndpoints();
      this.startMetricsCollection();
    }
    
    setupEndpoints() {
      // Dashboard HTML
      this.app.get('/', (req, res) => {
        res.send(\`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Scalability Dashboard</title>
            <style>
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
              .metric-box { 
                background: #f5f5f5; 
                padding: 20px; 
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .metric-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .metric-value { font-size: 36px; color: #2196F3; }
              .sub-metric { font-size: 14px; color: #666; margin-top: 5px; }
              .status-good { color: #4CAF50; }
              .status-warning { color: #FF9800; }
              .status-critical { color: #F44336; }
            </style>
          </head>
          <body>
            <h1>Scalability Dashboard</h1>
            
            <div class="grid">
              <div class="metric-box">
                <div class="metric-title">Active Instances</div>
                <div class="metric-value" id="instances">-</div>
                <div class="sub-metric" id="instance-health">Health: -</div>
              </div>
              
              <div class="metric-box">
                <div class="metric-title">Load Balancer</div>
                <div class="metric-value" id="requests-per-sec">-</div>
                <div class="sub-metric" id="lb-distribution">Distribution: -</div>
              </div>
              
              <div class="metric-box">
                <div class="metric-title">Cache Hit Rate</div>
                <div class="metric-value" id="cache-hit-rate">-</div>
                <div class="sub-metric" id="cache-size">Size: -</div>
              </div>
              
              <div class="metric-box">
                <div class="metric-title">Database Connections</div>
                <div class="metric-value" id="db-connections">-</div>
                <div class="sub-metric" id="db-replicas">Replicas: -</div>
              </div>
              
              <div class="metric-box">
                <div class="metric-title">Queue Depth</div>
                <div class="metric-value" id="queue-depth">-</div>
                <div class="sub-metric" id="queue-processing">Processing: -/sec</div>
              </div>
              
              <div class="metric-box">
                <div class="metric-title">Response Time</div>
                <div class="metric-value" id="response-time">-</div>
                <div class="sub-metric" id="response-percentiles">p95: -, p99: -</div>
              </div>
            </div>
            
            <canvas id="scaling-chart" width="800" height="400"></canvas>
            
            <script>
              const ws = new WebSocket('ws://localhost:3002/metrics');
              
              ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                // Update metrics
                document.getElementById('instances').textContent = data.instances.count;
                document.getElementById('instance-health').textContent = 
                  'Health: ' + data.instances.healthy + '/' + data.instances.count;
                
                document.getElementById('requests-per-sec').textContent = 
                  data.loadBalancer.requestsPerSec + ' req/s';
                document.getElementById('lb-distribution').textContent = 
                  'Distribution: ' + data.loadBalancer.distribution;
                
                document.getElementById('cache-hit-rate').textContent = 
                  (data.cache.hitRate * 100).toFixed(1) + '%';
                document.getElementById('cache-size').textContent = 
                  'Size: ' + data.cache.size + ' items';
                
                document.getElementById('db-connections').textContent = 
                  data.database.activeConnections + '/' + data.database.maxConnections;
                document.getElementById('db-replicas').textContent = 
                  'Replicas: ' + data.database.replicas + ' (lag: ' + data.database.replicationLag + 's)';
                
                document.getElementById('queue-depth').textContent = data.queues.depth;
                document.getElementById('queue-processing').textContent = 
                  'Processing: ' + data.queues.processingRate + '/sec';
                
                document.getElementById('response-time').textContent = 
                  data.performance.responseTime + 'ms';
                document.getElementById('response-percentiles').textContent = 
                  'p95: ' + data.performance.p95 + 'ms, p99: ' + data.performance.p99 + 'ms';
                
                // Update chart
                updateScalingChart(data.history);
              };
              
              function updateScalingChart(history) {
                // Chart implementation
              }
            </script>
          </body>
          </html>
        \`);
      });
      
      // WebSocket for real-time updates
      const wss = new WebSocket.Server({ port: 3002 });
      
      wss.on('connection', (ws) => {
        const interval = setInterval(() => {
          ws.send(JSON.stringify(this.getCurrentMetrics()));
        }, 1000);
        
        ws.on('close', () => {
          clearInterval(interval);
        });
      });
    }
    
    async getCurrentMetrics() {
      return {
        instances: await this.getInstanceMetrics(),
        loadBalancer: await this.getLoadBalancerMetrics(),
        cache: await this.getCacheMetrics(),
        database: await this.getDatabaseMetrics(),
        queues: await this.getQueueMetrics(),
        performance: await this.getPerformanceMetrics(),
        history: this.getScalingHistory()
      };
    }
  }
`)
```

## 🎯 Scalability Checklist

### Pre-Launch Scalability Verification

1. **Architecture** ✓
   - Stateless services
   - Microservices deployed
   - Service mesh configured
   - API gateway active

2. **Load Balancing** ✓
   - Multiple load balancers
   - Health checks configured
   - Failover tested
   - Geographic distribution

3. **Caching** ✓
   - CDN configured
   - Redis cluster running
   - Cache invalidation tested
   - Hit rates optimized

4. **Database** ✓
   - Read replicas active
   - Sharding implemented
   - Connection pooling
   - Query optimization

5. **Message Queues** ✓
   - Queue cluster running
   - Dead letter queues
   - Retry logic tested
   - Monitoring active

6. **Auto-scaling** ✓
   - Policies configured
   - Tested under load
   - Predictive scaling
   - Cost controls

Remember: **Design for 10x growth from day one!**