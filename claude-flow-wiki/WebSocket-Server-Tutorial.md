# 🌐 WebSocket Server Tutorial with Headless Mode

## Overview

This tutorial shows how to deploy Claude Flow as a headless WebSocket server for real-time AI orchestration. Perfect for building interactive applications, chat interfaces, and distributed AI systems.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Basic WebSocket Server](#basic-websocket-server)
- [Headless Deployment](#headless-deployment)
- [Client Integration](#client-integration)
- [Advanced Features](#advanced-features)
- [Production Deployment](#production-deployment)
- [Security Considerations](#security-considerations)
- [Performance Tuning](#performance-tuning)

## Architecture Overview

### WebSocket Flow Diagram

```
┌─────────────┐     WebSocket      ┌──────────────────┐
│   Client    │ ←───────────────→  │  Claude Flow     │
│   (React,   │                     │  WebSocket       │
│   Vue, etc) │                     │  Server          │
└─────────────┘                     └────────┬─────────┘
                                             │
                                             ↓
                                    ┌──────────────────┐
                                    │  Headless        │
                                    │  Claude Flow     │
                                    │  Swarm Engine    │
                                    └──────────────────┘
```

### Key Components

1. **WebSocket Server**: Handles real-time bidirectional communication
2. **Message Queue**: Manages task distribution and results
3. **Swarm Engine**: Executes AI tasks in headless mode
4. **Session Manager**: Maintains client connections and state

## Basic WebSocket Server

### 1. Server Implementation

Create `claude-flow-ws-server.js`:

```javascript
const WebSocket = require('ws');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

class ClaudeFlowWebSocketServer {
  constructor(port = 8080) {
    this.port = port;
    this.wss = null;
    this.sessions = new Map();
    this.activeTasks = new Map();
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });
    
    this.wss.on('connection', (ws) => {
      const sessionId = uuidv4();
      this.handleConnection(ws, sessionId);
    });

    console.log(`Claude Flow WebSocket Server running on port ${this.port}`);
  }

  handleConnection(ws, sessionId) {
    console.log(`New connection: ${sessionId}`);
    
    // Store session
    this.sessions.set(sessionId, {
      ws,
      tasks: [],
      createdAt: new Date()
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      sessionId,
      status: 'connected',
      version: '2.0.0-alpha'
    }));

    // Handle messages
    ws.on('message', (message) => {
      this.handleMessage(sessionId, message);
    });

    // Handle disconnect
    ws.on('close', () => {
      console.log(`Disconnected: ${sessionId}`);
      this.sessions.delete(sessionId);
      this.cleanupTasks(sessionId);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`Error in session ${sessionId}:`, error);
      this.sendError(sessionId, error.message);
    });
  }

  async handleMessage(sessionId, message) {
    try {
      const data = JSON.parse(message);
      console.log(`Message from ${sessionId}:`, data.type);

      switch (data.type) {
        case 'swarm':
          await this.executeSwarm(sessionId, data);
          break;
        case 'status':
          await this.getStatus(sessionId, data.taskId);
          break;
        case 'cancel':
          await this.cancelTask(sessionId, data.taskId);
          break;
        case 'ping':
          this.sendMessage(sessionId, { type: 'pong' });
          break;
        default:
          this.sendError(sessionId, `Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Message handling error:', error);
      this.sendError(sessionId, error.message);
    }
  }

  async executeSwarm(sessionId, data) {
    const taskId = uuidv4();
    const { objective, options = {} } = data;

    // Validate input
    if (!objective) {
      this.sendError(sessionId, 'Objective is required');
      return;
    }

    // Send task acknowledgment
    this.sendMessage(sessionId, {
      type: 'task_created',
      taskId,
      objective,
      status: 'pending'
    });

    // Prepare command
    const args = ['swarm', objective];
    
    // Add options
    if (options.agents) args.push('--agents', options.agents);
    if (options.strategy) args.push('--strategy', options.strategy);
    if (options.mode) args.push('--mode', options.mode);
    if (options.timeout) args.push('--timeout', options.timeout);
    
    // Always use headless mode for WebSocket
    args.push('--headless');
    args.push('--output-format', 'stream-json');

    // Execute Claude Flow
    const claudeFlow = spawn('npx', ['claude-flow@alpha', ...args], {
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        CLAUDE_FLOW_NON_INTERACTIVE: 'true'
      }
    });

    // Store active task
    this.activeTasks.set(taskId, {
      sessionId,
      process: claudeFlow,
      startTime: new Date(),
      objective
    });

    // Handle stdout (stream-json format)
    claudeFlow.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        try {
          const event = JSON.parse(line);
          this.handleStreamEvent(sessionId, taskId, event);
        } catch (e) {
          // Not JSON, might be plain text output
          console.log('Non-JSON output:', line);
        }
      });
    });

    // Handle stderr
    claudeFlow.stderr.on('data', (data) => {
      console.error('Claude Flow stderr:', data.toString());
      this.sendMessage(sessionId, {
        type: 'task_log',
        taskId,
        level: 'error',
        message: data.toString()
      });
    });

    // Handle completion
    claudeFlow.on('close', (code) => {
      console.log(`Task ${taskId} completed with code ${code}`);
      
      this.sendMessage(sessionId, {
        type: 'task_complete',
        taskId,
        exitCode: code,
        status: code === 0 ? 'success' : 'failed'
      });

      this.activeTasks.delete(taskId);
    });
  }

  handleStreamEvent(sessionId, taskId, event) {
    // Forward stream events to client
    const clientEvent = {
      ...event,
      taskId,
      serverTime: new Date().toISOString()
    };

    this.sendMessage(sessionId, clientEvent);

    // Handle specific event types
    switch (event.type) {
      case 'agent_spawn':
        console.log(`Agent spawned: ${event.agentId} (${event.agentType})`);
        break;
      case 'task_progress':
        console.log(`Progress: ${event.progress}% - ${event.message}`);
        break;
      case 'error':
        console.error(`Task error: ${event.message}`);
        break;
    }
  }

  async getStatus(sessionId, taskId) {
    const task = this.activeTasks.get(taskId);
    
    if (!task) {
      this.sendMessage(sessionId, {
        type: 'status',
        taskId,
        status: 'not_found'
      });
      return;
    }

    this.sendMessage(sessionId, {
      type: 'status',
      taskId,
      status: 'running',
      objective: task.objective,
      startTime: task.startTime,
      duration: Date.now() - task.startTime.getTime()
    });
  }

  async cancelTask(sessionId, taskId) {
    const task = this.activeTasks.get(taskId);
    
    if (!task) {
      this.sendError(sessionId, `Task ${taskId} not found`);
      return;
    }

    // Kill the process
    task.process.kill('SIGTERM');
    this.activeTasks.delete(taskId);

    this.sendMessage(sessionId, {
      type: 'task_cancelled',
      taskId
    });
  }

  cleanupTasks(sessionId) {
    // Cancel all tasks for disconnected session
    for (const [taskId, task] of this.activeTasks) {
      if (task.sessionId === sessionId) {
        task.process.kill('SIGTERM');
        this.activeTasks.delete(taskId);
      }
    }
  }

  sendMessage(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (session && session.ws.readyState === WebSocket.OPEN) {
      session.ws.send(JSON.stringify(message));
    }
  }

  sendError(sessionId, error) {
    this.sendMessage(sessionId, {
      type: 'error',
      error,
      timestamp: new Date().toISOString()
    });
  }
}

// Start server
const server = new ClaudeFlowWebSocketServer(8080);
server.start();
```

### 2. Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Create app directory
WORKDIR /app

# Copy server files
COPY package*.json ./
COPY claude-flow-ws-server.js ./

# Install dependencies
RUN npm ci --only=production
RUN npm install -g claude-flow@alpha

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Switch to non-root user
USER nodejs

# Expose WebSocket port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start server
CMD ["node", "claude-flow-ws-server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  claude-flow-ws:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - CLAUDE_FLOW_NON_INTERACTIVE=true
    volumes:
      - ./workspace:/workspace
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - claude-flow-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - claude-flow-network

networks:
  claude-flow-network:
    driver: bridge

volumes:
  redis-data:
```

## Headless Deployment

### 1. Production Server with PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'claude-flow-ws',
    script: './claude-flow-ws-server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8080,
      CLAUDE_FLOW_NON_INTERACTIVE: 'true'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
```

Deploy with PM2:

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 monit
```

### 2. Kubernetes Deployment

Create `k8s-deployment.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: claude-flow-secrets
type: Opaque
data:
  anthropic-api-key: <base64-encoded-api-key>

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: claude-flow-config
data:
  server.js: |
    // WebSocket server code here
  config.json: |
    {
      "port": 8080,
      "maxConnections": 1000,
      "taskTimeout": 3600
    }

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claude-flow-ws
  labels:
    app: claude-flow-ws
spec:
  replicas: 3
  selector:
    matchLabels:
      app: claude-flow-ws
  template:
    metadata:
      labels:
        app: claude-flow-ws
    spec:
      containers:
      - name: claude-flow-ws
        image: your-registry/claude-flow-ws:latest
        ports:
        - containerPort: 8080
          name: websocket
        env:
        - name: NODE_ENV
          value: "production"
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: claude-flow-secrets
              key: anthropic-api-key
        - name: CLAUDE_FLOW_NON_INTERACTIVE
          value: "true"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: config
          mountPath: /app/config
      volumes:
      - name: config
        configMap:
          name: claude-flow-config

---
apiVersion: v1
kind: Service
metadata:
  name: claude-flow-ws-service
spec:
  selector:
    app: claude-flow-ws
  ports:
  - port: 80
    targetPort: 8080
    name: websocket
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: claude-flow-ws-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: claude-flow-ws
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Client Integration

### 1. JavaScript/TypeScript Client

Create `claude-flow-client.ts`:

```typescript
interface ClaudeFlowMessage {
  type: string;
  [key: string]: any;
}

interface SwarmOptions {
  agents?: number;
  strategy?: 'auto' | 'parallel' | 'sequential';
  mode?: 'centralized' | 'distributed';
  timeout?: number;
}

class ClaudeFlowClient {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private messageHandlers: Map<string, Function> = new Map();
  private taskCallbacks: Map<string, Function> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('Connected to Claude Flow WebSocket');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket connection closed');
          this.handleDisconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: ClaudeFlowMessage) {
    console.log('Received:', message.type);

    // Handle connection message
    if (message.type === 'connection') {
      this.sessionId = message.sessionId;
    }

    // Handle task-specific callbacks
    if (message.taskId && this.taskCallbacks.has(message.taskId)) {
      const callback = this.taskCallbacks.get(message.taskId);
      callback?.(message);
    }

    // Handle general message handlers
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }

    // Handle task completion
    if (message.type === 'task_complete') {
      this.taskCallbacks.delete(message.taskId);
    }
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  executeSwarm(
    objective: string, 
    options: SwarmOptions = {},
    onProgress?: (event: any) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const message = {
        type: 'swarm',
        objective,
        options
      };

      // Send swarm request
      this.ws.send(JSON.stringify(message));

      // Handle task creation response
      const handleTaskCreated = (msg: any) => {
        if (msg.type === 'task_created') {
          const taskId = msg.taskId;
          
          // Set up task-specific callback
          this.taskCallbacks.set(taskId, (event: any) => {
            if (onProgress) {
              onProgress(event);
            }

            if (event.type === 'task_complete') {
              if (event.status === 'success') {
                resolve(event);
              } else {
                reject(new Error(`Task failed: ${event.error || 'Unknown error'}`));
              }
            }
          });

          // Remove this handler
          this.off('task_created', handleTaskCreated);
        }
      };

      this.on('task_created', handleTaskCreated);
    });
  }

  on(event: string, handler: Function) {
    this.messageHandlers.set(event, handler);
  }

  off(event: string, handler?: Function) {
    if (handler) {
      const currentHandler = this.messageHandlers.get(event);
      if (currentHandler === handler) {
        this.messageHandlers.delete(event);
      }
    } else {
      this.messageHandlers.delete(event);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Usage example
async function main() {
  const client = new ClaudeFlowClient('ws://localhost:8080');
  
  try {
    await client.connect();
    
    // Execute swarm with progress tracking
    const result = await client.executeSwarm(
      'analyze codebase and suggest improvements',
      { agents: 5, strategy: 'parallel' },
      (event) => {
        switch (event.type) {
          case 'agent_spawn':
            console.log(`Agent spawned: ${event.agentType}`);
            break;
          case 'task_progress':
            console.log(`Progress: ${event.progress}%`);
            break;
          case 'insight':
            console.log(`Insight: ${event.message}`);
            break;
        }
      }
    );
    
    console.log('Analysis complete:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.disconnect();
  }
}

main();
```

### 2. React Integration

Create `useClaudeFlow.tsx`:

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { ClaudeFlowClient } from './claude-flow-client';

interface UseClaudeFlowOptions {
  url: string;
  autoConnect?: boolean;
}

interface SwarmTask {
  id: string;
  objective: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  agents: any[];
  insights: string[];
  errors: string[];
}

export function useClaudeFlow({ url, autoConnect = true }: UseClaudeFlowOptions) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [tasks, setTasks] = useState<Map<string, SwarmTask>>(new Map());
  const clientRef = useRef<ClaudeFlowClient | null>(null);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, autoConnect]);

  const connect = useCallback(async () => {
    if (clientRef.current || connecting) return;

    setConnecting(true);
    try {
      const client = new ClaudeFlowClient(url);
      await client.connect();
      clientRef.current = client;
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setConnecting(false);
    }
  }, [url, connecting]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
      setConnected(false);
    }
  }, []);

  const executeSwarm = useCallback(async (
    objective: string,
    options?: any
  ) => {
    if (!clientRef.current) {
      throw new Error('Not connected to Claude Flow');
    }

    const taskId = `task-${Date.now()}`;
    const task: SwarmTask = {
      id: taskId,
      objective,
      status: 'pending',
      progress: 0,
      agents: [],
      insights: [],
      errors: []
    };

    setTasks(prev => new Map(prev).set(taskId, task));

    try {
      const result = await clientRef.current.executeSwarm(
        objective,
        options,
        (event) => {
          setTasks(prev => {
            const updated = new Map(prev);
            const currentTask = updated.get(taskId);
            if (!currentTask) return prev;

            switch (event.type) {
              case 'task_created':
                currentTask.status = 'running';
                currentTask.id = event.taskId;
                break;
              case 'agent_spawn':
                currentTask.agents.push({
                  id: event.agentId,
                  type: event.agentType,
                  status: 'active'
                });
                break;
              case 'task_progress':
                currentTask.progress = event.progress;
                break;
              case 'insight':
                currentTask.insights.push(event.message);
                break;
              case 'error':
                currentTask.errors.push(event.message);
                break;
              case 'task_complete':
                currentTask.status = event.status === 'success' ? 'completed' : 'failed';
                currentTask.progress = 100;
                break;
            }

            return updated;
          });
        }
      );

      return result;
    } catch (error) {
      setTasks(prev => {
        const updated = new Map(prev);
        const task = updated.get(taskId);
        if (task) {
          task.status = 'failed';
          task.errors.push(error.message);
        }
        return updated;
      });
      throw error;
    }
  }, []);

  return {
    connected,
    connecting,
    connect,
    disconnect,
    executeSwarm,
    tasks: Array.from(tasks.values())
  };
}

// React component example
export function ClaudeFlowDashboard() {
  const { connected, connecting, executeSwarm, tasks } = useClaudeFlow({
    url: 'ws://localhost:8080'
  });

  const handleAnalyze = async () => {
    try {
      await executeSwarm('analyze codebase for improvements', {
        agents: 5,
        strategy: 'parallel'
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  return (
    <div>
      <h1>Claude Flow Dashboard</h1>
      
      <div>
        Status: {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
      </div>

      <button onClick={handleAnalyze} disabled={!connected}>
        Analyze Codebase
      </button>

      <div>
        <h2>Active Tasks</h2>
        {tasks.map(task => (
          <div key={task.id}>
            <h3>{task.objective}</h3>
            <p>Status: {task.status}</p>
            <p>Progress: {task.progress}%</p>
            <p>Agents: {task.agents.length}</p>
            {task.insights.length > 0 && (
              <div>
                <h4>Insights:</h4>
                <ul>
                  {task.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Advanced Features

### 1. Authentication & Authorization

Add JWT authentication to the WebSocket server:

```javascript
const jwt = require('jsonwebtoken');

class AuthenticatedClaudeFlowServer extends ClaudeFlowWebSocketServer {
  constructor(port, jwtSecret) {
    super(port);
    this.jwtSecret = jwtSecret;
  }

  handleConnection(ws, req) {
    // Extract token from query string or headers
    const token = this.extractToken(req);
    
    if (!token) {
      ws.send(JSON.stringify({ type: 'error', error: 'Authentication required' }));
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      const sessionId = uuidv4();
      
      // Store user info with session
      this.sessions.set(sessionId, {
        ws,
        userId: decoded.userId,
        permissions: decoded.permissions || [],
        tasks: [],
        createdAt: new Date()
      });

      // Continue with authenticated connection
      super.handleConnection(ws, sessionId);
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid token' }));
      ws.close(1008, 'Invalid token');
    }
  }

  extractToken(req) {
    // From query string: ws://localhost:8080?token=xxx
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    if (token) return token;

    // From Authorization header
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      return auth.substring(7);
    }

    return null;
  }

  // Override executeSwarm to check permissions
  async executeSwarm(sessionId, data) {
    const session = this.sessions.get(sessionId);
    
    // Check permissions
    if (!session.permissions.includes('swarm:execute')) {
      this.sendError(sessionId, 'Insufficient permissions');
      return;
    }

    // Check rate limits
    if (this.isRateLimited(session.userId)) {
      this.sendError(sessionId, 'Rate limit exceeded');
      return;
    }

    super.executeSwarm(sessionId, data);
  }
}
```

### 2. Scaling with Redis

Add Redis for horizontal scaling:

```javascript
const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');

class ScalableClaudeFlowServer extends ClaudeFlowWebSocketServer {
  constructor(port, redisUrl) {
    super(port);
    this.redis = new Redis(redisUrl);
    this.pubClient = this.redis.duplicate();
    this.subClient = this.redis.duplicate();
    
    // Subscribe to cross-server events
    this.setupRedisSubscriptions();
  }

  setupRedisSubscriptions() {
    this.subClient.subscribe('claude-flow:tasks');
    this.subClient.subscribe('claude-flow:results');

    this.subClient.on('message', (channel, message) => {
      const data = JSON.parse(message);
      
      switch (channel) {
        case 'claude-flow:tasks':
          this.handleDistributedTask(data);
          break;
        case 'claude-flow:results':
          this.handleDistributedResult(data);
          break;
      }
    });
  }

  async executeSwarm(sessionId, data) {
    const taskId = uuidv4();
    
    // Store task in Redis for persistence
    await this.redis.setex(
      `task:${taskId}`,
      3600, // 1 hour TTL
      JSON.stringify({
        sessionId,
        serverId: this.serverId,
        objective: data.objective,
        options: data.options,
        status: 'pending',
        createdAt: new Date()
      })
    );

    // Publish task to all servers
    await this.pubClient.publish('claude-flow:tasks', JSON.stringify({
      taskId,
      sessionId,
      serverId: this.serverId,
      objective: data.objective,
      options: data.options
    }));

    // Continue with local execution
    super.executeSwarm(sessionId, data);
  }

  async handleDistributedResult(data) {
    const { taskId, sessionId, result } = data;
    
    // Check if this session is on this server
    if (this.sessions.has(sessionId)) {
      this.sendMessage(sessionId, result);
    }
  }
}
```

### 3. Monitoring & Metrics

Add Prometheus metrics:

```javascript
const promClient = require('prom-client');

class MonitoredClaudeFlowServer extends ClaudeFlowWebSocketServer {
  constructor(port) {
    super(port);
    this.setupMetrics();
  }

  setupMetrics() {
    // Create metrics
    this.metrics = {
      connections: new promClient.Gauge({
        name: 'claude_flow_ws_connections',
        help: 'Number of active WebSocket connections'
      }),
      tasks: new promClient.Counter({
        name: 'claude_flow_tasks_total',
        help: 'Total number of tasks executed',
        labelNames: ['status']
      }),
      taskDuration: new promClient.Histogram({
        name: 'claude_flow_task_duration_seconds',
        help: 'Task execution duration',
        buckets: [1, 5, 10, 30, 60, 120, 300, 600]
      }),
      errors: new promClient.Counter({
        name: 'claude_flow_errors_total',
        help: 'Total number of errors',
        labelNames: ['type']
      })
    };

    // Register metrics
    promClient.register.registerMetric(this.metrics.connections);
    promClient.register.registerMetric(this.metrics.tasks);
    promClient.register.registerMetric(this.metrics.taskDuration);
    promClient.register.registerMetric(this.metrics.errors);

    // Expose metrics endpoint
    this.setupMetricsEndpoint();
  }

  setupMetricsEndpoint() {
    const express = require('express');
    const app = express();

    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', promClient.register.contentType);
      res.end(await promClient.register.metrics());
    });

    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        connections: this.sessions.size,
        activeTasks: this.activeTasks.size,
        uptime: process.uptime()
      });
    });

    app.listen(9090, () => {
      console.log('Metrics server listening on port 9090');
    });
  }

  handleConnection(ws, sessionId) {
    super.handleConnection(ws, sessionId);
    this.metrics.connections.inc();
  }

  handleDisconnect(sessionId) {
    super.handleDisconnect(sessionId);
    this.metrics.connections.dec();
  }

  async executeSwarm(sessionId, data) {
    const timer = this.metrics.taskDuration.startTimer();
    
    try {
      await super.executeSwarm(sessionId, data);
      this.metrics.tasks.inc({ status: 'success' });
    } catch (error) {
      this.metrics.tasks.inc({ status: 'failed' });
      this.metrics.errors.inc({ type: 'task_execution' });
      throw error;
    } finally {
      timer();
    }
  }
}
```

## Production Deployment

### 1. NGINX Configuration

```nginx
upstream claude_flow_ws {
    least_conn;
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    location /ws {
        proxy_pass http://claude_flow_ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    location /health {
        proxy_pass http://claude_flow_ws;
        proxy_set_header Host $host;
    }

    location /metrics {
        proxy_pass http://127.0.0.1:9090;
        allow 10.0.0.0/8;
        deny all;
    }
}
```

### 2. Systemd Service

Create `/etc/systemd/system/claude-flow-ws.service`:

```ini
[Unit]
Description=Claude Flow WebSocket Server
After=network.target

[Service]
Type=simple
User=claude-flow
Group=claude-flow
WorkingDirectory=/opt/claude-flow
Environment="NODE_ENV=production"
Environment="ANTHROPIC_API_KEY=sk-ant-..."
ExecStart=/usr/bin/node /opt/claude-flow/claude-flow-ws-server.js
Restart=always
RestartSec=10

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/claude-flow/logs

# Resource limits
LimitNOFILE=65535
MemoryLimit=2G
CPUQuota=200%

[Install]
WantedBy=multi-user.target
```

### 3. Monitoring Stack

Create `monitoring/docker-compose.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"

  alertmanager:
    image: prom/alertmanager:latest
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    ports:
      - "9093:9093"

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:
```

## Security Considerations

### 1. Input Validation

```javascript
function validateSwarmRequest(data) {
  // Validate objective
  if (!data.objective || typeof data.objective !== 'string') {
    throw new Error('Invalid objective');
  }

  if (data.objective.length > 1000) {
    throw new Error('Objective too long');
  }

  // Validate options
  if (data.options) {
    if (data.options.agents && (data.options.agents < 1 || data.options.agents > 20)) {
      throw new Error('Invalid agent count');
    }

    if (data.options.timeout && (data.options.timeout < 1 || data.options.timeout > 3600)) {
      throw new Error('Invalid timeout');
    }

    const validStrategies = ['auto', 'parallel', 'sequential'];
    if (data.options.strategy && !validStrategies.includes(data.options.strategy)) {
      throw new Error('Invalid strategy');
    }
  }

  // Sanitize objective for command injection
  const sanitized = data.objective.replace(/[;&|`$()<>]/g, '');
  if (sanitized !== data.objective) {
    throw new Error('Invalid characters in objective');
  }

  return true;
}
```

### 2. Rate Limiting

```javascript
const RateLimiter = require('rate-limiter-flexible');

class RateLimitedServer extends ClaudeFlowWebSocketServer {
  constructor(port) {
    super(port);
    
    this.rateLimiter = new RateLimiter.RateLimiterMemory({
      points: 10, // Number of requests
      duration: 60, // Per 60 seconds
      blockDuration: 60 // Block for 1 minute
    });
  }

  async executeSwarm(sessionId, data) {
    const session = this.sessions.get(sessionId);
    const key = session.userId || sessionId;

    try {
      await this.rateLimiter.consume(key);
      super.executeSwarm(sessionId, data);
    } catch (rejRes) {
      this.sendError(sessionId, `Rate limit exceeded. Try again in ${rejRes.msBeforeNext / 1000} seconds`);
    }
  }
}
```

### 3. API Key Security

```javascript
// Never expose API keys to clients
class SecureClaudeFlowServer extends ClaudeFlowWebSocketServer {
  constructor(port) {
    super(port);
    
    // Load API keys from secure storage
    this.apiKeys = this.loadApiKeys();
  }

  loadApiKeys() {
    // Use environment variable
    if (process.env.ANTHROPIC_API_KEY) {
      return { default: process.env.ANTHROPIC_API_KEY };
    }

    // Or load from secure key management service
    const AWS = require('aws-sdk');
    const secretsManager = new AWS.SecretsManager();
    
    return secretsManager.getSecretValue({ 
      SecretId: 'claude-flow/api-keys' 
    }).promise();
  }

  async executeSwarm(sessionId, data) {
    const session = this.sessions.get(sessionId);
    
    // Use user-specific or default API key
    const apiKey = this.apiKeys[session.userId] || this.apiKeys.default;
    
    // Set API key for this execution only
    const env = {
      ...process.env,
      ANTHROPIC_API_KEY: apiKey,
      CLAUDE_FLOW_NON_INTERACTIVE: 'true'
    };

    // Execute with secure environment
    // ... rest of execution
  }
}
```

## Performance Tuning

### 1. Connection Pooling

```javascript
class PooledClaudeFlowServer extends ClaudeFlowWebSocketServer {
  constructor(port, poolSize = 5) {
    super(port);
    this.poolSize = poolSize;
    this.processPool = [];
    this.initializePool();
  }

  initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.processPool.push({
        id: i,
        busy: false,
        process: null
      });
    }
  }

  async getAvailableWorker() {
    // Find available worker
    let worker = this.processPool.find(w => !w.busy);
    
    if (!worker) {
      // Wait for a worker to become available
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          worker = this.processPool.find(w => !w.busy);
          if (worker) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    worker.busy = true;
    return worker;
  }

  async executeSwarm(sessionId, data) {
    const worker = await this.getAvailableWorker();
    
    try {
      // Execute task with worker
      // ... execution logic
    } finally {
      worker.busy = false;
    }
  }
}
```

### 2. Message Compression

```javascript
const zlib = require('zlib');

class CompressedClaudeFlowServer extends ClaudeFlowWebSocketServer {
  sendMessage(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session || session.ws.readyState !== WebSocket.OPEN) return;

    const json = JSON.stringify(message);
    
    // Compress large messages
    if (json.length > 1024) {
      zlib.gzip(json, (err, compressed) => {
        if (err) {
          session.ws.send(json);
        } else {
          session.ws.send(compressed, { binary: true });
        }
      });
    } else {
      session.ws.send(json);
    }
  }
}
```

### 3. Caching Results

```javascript
const NodeCache = require('node-cache');

class CachedClaudeFlowServer extends ClaudeFlowWebSocketServer {
  constructor(port) {
    super(port);
    
    this.cache = new NodeCache({
      stdTTL: 3600, // 1 hour default TTL
      checkperiod: 120 // Check for expired keys every 2 minutes
    });
  }

  async executeSwarm(sessionId, data) {
    // Create cache key from objective and options
    const cacheKey = this.createCacheKey(data);
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.sendMessage(sessionId, {
        type: 'cached_result',
        result: cached,
        fromCache: true
      });
      return;
    }

    // Execute and cache result
    const originalHandler = this.handleStreamEvent.bind(this);
    const events = [];
    
    this.handleStreamEvent = (sessionId, taskId, event) => {
      events.push(event);
      originalHandler(sessionId, taskId, event);
      
      if (event.type === 'task_complete' && event.status === 'success') {
        this.cache.set(cacheKey, events);
      }
    };

    super.executeSwarm(sessionId, data);
  }

  createCacheKey(data) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify({
      objective: data.objective,
      options: data.options
    }));
    return hash.digest('hex');
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection drops frequently**
   - Check WebSocket timeout settings
   - Implement heartbeat/ping-pong
   - Use connection pooling

2. **High memory usage**
   - Limit concurrent tasks
   - Implement message size limits
   - Use streaming for large results

3. **Slow response times**
   - Enable caching
   - Use connection pooling
   - Optimize agent count

4. **Authentication issues**
   - Verify JWT configuration
   - Check token expiration
   - Validate CORS settings

## Related Resources

- [Non-Interactive Mode Guide](Non-Interactive-Mode)
- [GitHub Actions Tutorial](GitHub-Actions-Tutorial)
- [Claude Flow API Reference](API-Reference)
- [Docker Deployment Guide](Docker-Guide)