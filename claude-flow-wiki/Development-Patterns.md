# Development Patterns - Best Practices and Examples

This guide covers proven patterns for effective development with Claude Flow, including best practices, common anti-patterns to avoid, and real-world examples.

## Core Development Patterns

### 1. Concurrent Agent Deployment Pattern

Always deploy multiple agents simultaneously for maximum efficiency.

#### ✅ Good Pattern
```bash
# Deploy complete development team concurrently
npx claude-flow task orchestrate \
  --task "Implement user dashboard feature" \
  --agents "planner,architect,coder,tester,reviewer" \
  --strategy parallel
```

#### ❌ Anti-Pattern
```bash
# Sequential deployment wastes time
npx claude-flow agent spawn planner --task "Plan feature"
# Wait for completion...
npx claude-flow agent spawn coder --task "Implement feature"
# Wait for completion...
npx claude-flow agent spawn tester --task "Test feature"
```

### 2. Memory-First Development Pattern

Use persistent memory to maintain context across sessions.

#### ✅ Good Pattern
```javascript
// Store architectural decisions
await claudeFlow.memory.store({
  namespace: 'architecture/decisions',
  key: 'database-choice',
  value: {
    decision: 'PostgreSQL',
    rationale: 'ACID compliance required',
    alternatives: ['MongoDB', 'DynamoDB'],
    date: new Date()
  },
  ttl: null // Permanent storage
});

// Reference in future sessions
const dbDecision = await claudeFlow.memory.retrieve({
  namespace: 'architecture/decisions',
  key: 'database-choice'
});
```

#### ❌ Anti-Pattern
```javascript
// Losing context between sessions
// No memory storage, decisions lost after session ends
const dbChoice = 'PostgreSQL'; // Lost when session ends
```

### 3. Test-Driven Swarm Pattern

Deploy testing agents before implementation agents.

#### ✅ Good Pattern
```bash
# TDD swarm deployment
npx claude-flow swarm init tdd-swarm \
  --topology mesh \
  --agents "tester:3,tdd-london-swarm:1,coder:2,reviewer:1"

# Tests created first, then implementation
npx claude-flow task orchestrate \
  --task "Build shopping cart with TDD" \
  --sequence "tests-first"
```

#### ❌ Anti-Pattern
```bash
# Implementation without tests
npx claude-flow agent spawn coder \
  --task "Build shopping cart"
# Tests added as afterthought
```

### 4. Hierarchical Coordination Pattern

Use hierarchical topology for complex projects with clear leadership needs.

#### ✅ Good Pattern
```javascript
const swarmConfig = {
  topology: 'hierarchical',
  queen: {
    type: 'hierarchical-coordinator',
    responsibilities: ['task-distribution', 'conflict-resolution']
  },
  workers: [
    { type: 'coder', count: 5 },
    { type: 'tester', count: 3 },
    { type: 'reviewer', count: 2 }
  ],
  communication: 'queen-mediated'
};
```

### 5. Checkpoint and Recovery Pattern

Implement checkpoints for long-running operations.

#### ✅ Good Pattern
```javascript
const workflow = {
  stages: [
    {
      name: 'data-migration',
      checkpoint: true,
      rollback: 'automatic',
      validation: {
        type: 'row-count',
        tolerance: 0.001
      }
    },
    {
      name: 'schema-update',
      checkpoint: true,
      preCheck: 'backup-exists',
      postCheck: 'integrity-verified'
    }
  ]
};
```

## Architecture Patterns

### Microservice Development Pattern

Structure microservices with proper boundaries and communication.

```javascript
const microservicePattern = {
  name: 'user-service',
  structure: {
    api: {
      routes: 'src/api/routes',
      middleware: 'src/api/middleware',
      validation: 'src/api/validation'
    },
    business: {
      services: 'src/services',
      models: 'src/models',
      rules: 'src/business-rules'
    },
    data: {
      repositories: 'src/repositories',
      entities: 'src/entities',
      migrations: 'src/migrations'
    }
  },
  communication: {
    sync: 'REST',
    async: 'RabbitMQ',
    events: 'EventBus'
  }
};
```

### Event-Driven Architecture Pattern

Implement loosely coupled, event-driven systems.

```javascript
// Event sourcing with CQRS
const eventDrivenPattern = {
  commands: {
    CreateOrder: {
      handler: 'OrderCommandHandler',
      validation: 'CreateOrderValidator',
      events: ['OrderCreated']
    }
  },
  events: {
    OrderCreated: {
      projections: ['OrderReadModel', 'InventoryProjection'],
      subscribers: ['EmailService', 'AnalyticsService']
    }
  },
  readModels: {
    OrderReadModel: {
      storage: 'PostgreSQL',
      updates: 'EventProjector'
    }
  }
};
```

### Repository Pattern with Unit of Work

Manage data access with proper abstraction.

```typescript
// Repository pattern implementation
interface IUserRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  save(user: User): Promise<void>;
}

class UserRepository implements IUserRepository {
  constructor(private uow: IUnitOfWork) {}
  
  async save(user: User): Promise<void> {
    await this.uow.users.add(user);
    await this.uow.commit();
  }
}

// Unit of Work pattern
class UnitOfWork implements IUnitOfWork {
  private _users: UserRepository;
  
  get users(): IUserRepository {
    return this._users ??= new UserRepository(this);
  }
  
  async commit(): Promise<void> {
    await this.db.transaction(async (trx) => {
      // Commit all changes
    });
  }
}
```

## Testing Patterns

### Comprehensive Test Strategy Pattern

Layer tests appropriately for maximum coverage and speed.

```javascript
const testStrategy = {
  unit: {
    coverage: 85,
    tools: ['Jest', 'Vitest'],
    pattern: 'src/**/*.test.ts',
    parallel: true
  },
  integration: {
    coverage: 70,
    tools: ['Jest', 'Supertest'],
    pattern: 'tests/integration/**/*.test.ts',
    database: 'test-containers'
  },
  e2e: {
    coverage: 'critical-paths',
    tools: ['Playwright', 'Cypress'],
    pattern: 'tests/e2e/**/*.spec.ts',
    environment: 'staging'
  }
};
```

### Mock Strategy Pattern

Use appropriate mocking strategies based on testing goals.

```javascript
// London School - Mock everything
describe('OrderService (London)', () => {
  let orderService;
  let mockRepo, mockPayment, mockInventory;
  
  beforeEach(() => {
    mockRepo = createMock<IOrderRepository>();
    mockPayment = createMock<IPaymentService>();
    mockInventory = createMock<IInventoryService>();
    
    orderService = new OrderService(mockRepo, mockPayment, mockInventory);
  });
  
  test('should process order with all dependencies', async () => {
    // Test interactions, not implementation
    when(mockInventory.checkStock(any())).thenResolve(true);
    when(mockPayment.charge(any())).thenResolve({ id: 'pay_123' });
    
    await orderService.placeOrder(orderData);
    
    verify(mockInventory.checkStock(orderData.items)).once();
    verify(mockPayment.charge(orderData.total)).once();
    verify(mockRepo.save(any())).once();
  });
});

// Chicago School - Use real implementations
describe('OrderService (Chicago)', () => {
  let orderService;
  let database;
  
  beforeEach(async () => {
    database = await createTestDatabase();
    const repo = new OrderRepository(database);
    const inventory = new InventoryService(database);
    const payment = new MockPaymentService(); // Only mock external
    
    orderService = new OrderService(repo, payment, inventory);
  });
  
  test('should create order with real data', async () => {
    const order = await orderService.placeOrder(orderData);
    
    // Test actual state changes
    expect(order.id).toBeDefined();
    expect(order.status).toBe('completed');
    
    const savedOrder = await database.orders.findById(order.id);
    expect(savedOrder).toMatchObject(order);
  });
});
```

## Error Handling Patterns

### Graceful Degradation Pattern

Handle failures without complete system breakdown.

```javascript
class ResilientService {
  async fetchUserData(userId) {
    try {
      // Primary data source
      return await this.primaryDB.getUser(userId);
    } catch (primaryError) {
      this.logger.warn('Primary DB failed', primaryError);
      
      try {
        // Fallback to cache
        const cached = await this.cache.getUser(userId);
        if (cached && this.isFreshEnough(cached)) {
          return cached;
        }
      } catch (cacheError) {
        this.logger.warn('Cache failed', cacheError);
      }
      
      try {
        // Last resort - read replica
        return await this.replicaDB.getUser(userId);
      } catch (replicaError) {
        // Circuit breaker pattern
        this.circuitBreaker.recordFailure();
        throw new ServiceUnavailableError('All data sources failed');
      }
    }
  }
}
```

### Circuit Breaker Pattern

Prevent cascading failures in distributed systems.

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.state = 'CLOSED';
    this.failures = 0;
    this.nextAttempt = Date.now();
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}
```

## Performance Patterns

### Caching Strategy Pattern

Implement multi-level caching for optimal performance.

```javascript
class CacheStrategy {
  constructor() {
    this.l1Cache = new MemoryCache({ max: 1000, ttl: 60 });
    this.l2Cache = new RedisCache({ ttl: 3600 });
    this.l3Cache = new CDNCache({ ttl: 86400 });
  }
  
  async get(key, fetcher) {
    // L1 - Memory cache (fastest)
    let value = await this.l1Cache.get(key);
    if (value) return value;
    
    // L2 - Redis cache
    value = await this.l2Cache.get(key);
    if (value) {
      await this.l1Cache.set(key, value);
      return value;
    }
    
    // L3 - CDN cache
    value = await this.l3Cache.get(key);
    if (value) {
      await this.promoteToFasterCaches(key, value);
      return value;
    }
    
    // Fetch from source
    value = await fetcher();
    await this.setAllCaches(key, value);
    return value;
  }
}
```

### Database Query Optimization Pattern

Optimize database access patterns.

```javascript
class OptimizedRepository {
  // N+1 query prevention
  async getUsersWithPosts(userIds) {
    // Bad: N+1 queries
    // const users = await db.users.findMany({ id: { in: userIds } });
    // for (const user of users) {
    //   user.posts = await db.posts.findMany({ userId: user.id });
    // }
    
    // Good: Single query with join
    const users = await db.users.findMany({
      where: { id: { in: userIds } },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    
    return users;
  }
  
  // Batch loading pattern
  async batchLoadUsers(userIds) {
    const uniqueIds = [...new Set(userIds)];
    const users = await db.users.findMany({
      where: { id: { in: uniqueIds } }
    });
    
    const userMap = new Map(users.map(u => [u.id, u]));
    return userIds.map(id => userMap.get(id));
  }
}
```

## Security Patterns

### Defense in Depth Pattern

Layer security measures for comprehensive protection.

```javascript
class SecureService {
  async processRequest(request) {
    // Layer 1: Rate limiting
    await this.rateLimiter.check(request.ip);
    
    // Layer 2: Authentication
    const user = await this.authenticator.verify(request.token);
    
    // Layer 3: Authorization
    await this.authorizer.check(user, request.resource, request.action);
    
    // Layer 4: Input validation
    const validated = await this.validator.validate(request.data);
    
    // Layer 5: SQL injection prevention
    const sanitized = this.sanitizer.clean(validated);
    
    // Layer 6: Audit logging
    await this.auditLogger.log(user, request.action, sanitized);
    
    // Process request
    return await this.processor.handle(sanitized);
  }
}
```

### Secure Token Management Pattern

Handle sensitive tokens and secrets safely.

```javascript
class TokenManager {
  constructor() {
    this.encryption = new AES256Encryption(process.env.ENCRYPTION_KEY);
  }
  
  async storeToken(userId, token) {
    // Never store plain text tokens
    const encrypted = await this.encryption.encrypt(token);
    const hash = await this.hash(token);
    
    await db.tokens.create({
      userId,
      tokenHash: hash,
      encryptedToken: encrypted,
      expiresAt: new Date(Date.now() + 3600000)
    });
  }
  
  async validateToken(token) {
    const hash = await this.hash(token);
    const stored = await db.tokens.findFirst({
      where: {
        tokenHash: hash,
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!stored) return false;
    
    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(stored.tokenHash)
    );
  }
}
```

## Deployment Patterns

### Blue-Green Deployment Pattern

Zero-downtime deployments with instant rollback.

```javascript
const blueGreenDeployment = {
  stages: [
    {
      name: 'deploy-green',
      actions: [
        'Build new version',
        'Deploy to green environment',
        'Run smoke tests'
      ]
    },
    {
      name: 'validate-green',
      actions: [
        'Run integration tests',
        'Performance benchmarks',
        'Security scan'
      ],
      rollbackOn: 'any-failure'
    },
    {
      name: 'switch-traffic',
      actions: [
        'Update load balancer',
        'Monitor error rates',
        'Check performance metrics'
      ],
      rollbackDelay: 300 // 5 minutes
    },
    {
      name: 'cleanup',
      actions: [
        'Remove blue environment',
        'Update DNS records',
        'Clear CDN cache'
      ]
    }
  ]
};
```

### Feature Flag Pattern

Control feature rollout and enable A/B testing.

```javascript
class FeatureFlags {
  async isEnabled(feature, context = {}) {
    const flag = await this.getFlag(feature);
    
    if (!flag || !flag.enabled) return false;
    
    // Percentage rollout
    if (flag.percentage < 100) {
      const hash = this.hash(context.userId || context.sessionId);
      return (hash % 100) < flag.percentage;
    }
    
    // User targeting
    if (flag.targetUsers?.includes(context.userId)) {
      return true;
    }
    
    // Group targeting
    if (flag.targetGroups?.some(g => context.groups?.includes(g))) {
      return true;
    }
    
    return flag.default;
  }
}

// Usage in code
if (await featureFlags.isEnabled('new-checkout-flow', { userId })) {
  return renderNewCheckout();
} else {
  return renderLegacyCheckout();
}
```

## Anti-Patterns to Avoid

### 1. Sequential Agent Deployment
❌ **Don't**: Deploy agents one by one
✅ **Do**: Deploy all related agents concurrently

### 2. Stateless Development
❌ **Don't**: Lose context between sessions
✅ **Do**: Use memory system for persistence

### 3. Big Bang Refactoring
❌ **Don't**: Refactor entire system at once
✅ **Do**: Incremental refactoring with tests

### 4. Tight Coupling
❌ **Don't**: Direct dependencies between services
✅ **Do**: Use events and interfaces

### 5. Missing Error Handling
❌ **Don't**: Assume happy path only
✅ **Do**: Handle errors at every level

### 6. Premature Optimization
❌ **Don't**: Optimize without metrics
✅ **Do**: Measure, then optimize bottlenecks

### 7. Security as Afterthought
❌ **Don't**: Add security after development
✅ **Do**: Build security in from the start

## Real-World Examples

### E-Commerce Platform Development

```bash
# Complete e-commerce platform with Claude Flow
npx claude-flow swarm init ecommerce \
  --topology hierarchical \
  --max-agents 15

# Deploy specialized teams
npx claude-flow task orchestrate \
  --task "Build e-commerce platform" \
  --teams "frontend:3,backend:4,database:2,testing:3,devops:2,security:1"

# Implement with patterns
npx claude-flow sparc pipeline \
  --task "Implement checkout flow" \
  --patterns "repository,unit-of-work,event-sourcing,cqrs"
```

### Microservices Migration

```bash
# Migrate monolith to microservices
npx claude-flow agent spawn migration-planner \
  --task "Plan monolith decomposition" \
  --strategy "strangler-fig"

# Execute migration with safety
npx claude-flow workflow execute \
  --template "safe-migration" \
  --checkpoints "after-each-service" \
  --rollback "automatic"
```

### Real-Time Analytics System

```bash
# Build real-time analytics
npx claude-flow swarm init analytics \
  --topology mesh \
  --agents "data-engineer:3,ml-developer:2,backend-dev:3,performance-benchmarker:1"

# Implement with performance patterns
npx claude-flow task orchestrate \
  --task "Build real-time dashboard" \
  --patterns "caching,streaming,event-driven"
```

## Best Practices Summary

1. **Always Think Concurrent**: Deploy agents and operations in parallel
2. **Memory-First**: Store important decisions and context
3. **Test-Driven**: Write tests before implementation
4. **Pattern-Based**: Use established patterns, avoid anti-patterns
5. **Security-Aware**: Build security in from the start
6. **Performance-Conscious**: Measure and optimize based on data
7. **Error-Resilient**: Plan for failures at every level
8. **Documentation-Rich**: Document decisions and patterns

## Next Steps

- Review [SPARC Methodology](./SPARC-Methodology.md) for structured development
- Explore [API Reference](./API-Reference.md) for detailed commands
- Check [Troubleshooting](./Troubleshooting.md) for common issues