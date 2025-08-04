# SPARC Methodology - Test-Driven Development Patterns

SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) is a systematic methodology for AI-assisted development that ensures high-quality, well-tested code through structured phases.

## Overview

SPARC transforms the development process from ad-hoc coding to a disciplined, test-driven approach where each phase builds upon the previous, ensuring comprehensive coverage and maintainability.

## The Five Phases

### 1. Specification Phase
Define clear, testable requirements before any implementation.

#### Purpose
- Capture all functional and non-functional requirements
- Define acceptance criteria
- Identify edge cases and constraints
- Create user stories and scenarios

#### Process
```bash
# Generate comprehensive specifications
npx claude-flow sparc run specification \
  "Create user authentication system with OAuth2 support"
```

#### Example Output
```markdown
## User Authentication System Specification

### Functional Requirements
1. User Registration
   - Email/password registration
   - OAuth2 provider support (Google, GitHub)
   - Email verification required
   - Password strength validation

2. Authentication
   - JWT-based authentication
   - Refresh token support
   - Session management
   - Multi-device support

3. Security Requirements
   - bcrypt password hashing
   - Rate limiting on auth endpoints
   - Account lockout after failed attempts
   - CSRF protection

### Test Scenarios
- Valid registration flow
- Duplicate email handling
- Invalid password formats
- OAuth2 callback handling
- Token expiration and refresh
- Concurrent session management
```

### 2. Pseudocode Phase
Design algorithms and logic flow before coding.

#### Purpose
- Plan implementation logic
- Identify data structures
- Design algorithms
- Validate approach feasibility

#### Process
```bash
# Create algorithmic design
npx claude-flow sparc run pseudocode \
  "Design JWT token refresh algorithm with race condition handling"
```

#### Example Output
```
ALGORITHM: Secure Token Refresh with Race Condition Prevention

FUNCTION refreshToken(refreshToken):
    START TRANSACTION
    
    // Validate refresh token
    IF NOT validateTokenSignature(refreshToken):
        RETURN error("Invalid token")
    
    // Check token in database with row lock
    token = SELECT * FROM refresh_tokens 
            WHERE token = refreshToken 
            FOR UPDATE
    
    IF NOT token OR token.used:
        ROLLBACK
        RETURN error("Token already used or invalid")
    
    // Check expiration
    IF token.expiresAt < NOW():
        ROLLBACK
        RETURN error("Token expired")
    
    // Mark token as used
    UPDATE refresh_tokens 
    SET used = TRUE 
    WHERE id = token.id
    
    // Generate new tokens
    newAccessToken = generateJWT(userId, "15m")
    newRefreshToken = generateRefreshToken()
    
    // Store new refresh token
    INSERT INTO refresh_tokens (
        token: newRefreshToken,
        userId: token.userId,
        expiresAt: NOW() + 7 days
    )
    
    COMMIT TRANSACTION
    
    RETURN {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
END FUNCTION
```

### 3. Architecture Phase
Design system structure and component interactions.

#### Purpose
- Define system components
- Design interfaces and contracts
- Plan data flow
- Establish patterns and practices

#### Process
```bash
# Design system architecture
npx claude-flow sparc run architecture \
  "Design microservices architecture for e-commerce platform"
```

#### Example Output
```yaml
architecture:
  name: E-Commerce Microservices
  
  services:
    - name: api-gateway
      type: edge
      responsibilities:
        - Request routing
        - Authentication
        - Rate limiting
      technology:
        - Node.js/Express
        - Redis for caching
      
    - name: auth-service
      type: core
      responsibilities:
        - User authentication
        - Token management
        - Session handling
      interfaces:
        - POST /auth/login
        - POST /auth/refresh
        - POST /auth/logout
      database: PostgreSQL
      
    - name: product-service
      type: core
      responsibilities:
        - Product catalog
        - Inventory management
        - Search functionality
      interfaces:
        - GET /products
        - GET /products/:id
        - PUT /products/:id/inventory
      database: PostgreSQL + Elasticsearch
      
    - name: order-service
      type: core
      responsibilities:
        - Order processing
        - Payment integration
        - Order tracking
      patterns:
        - Event sourcing
        - SAGA for distributed transactions
      
  communication:
    sync: REST over HTTP/2
    async: RabbitMQ
    
  cross-cutting:
    logging: ELK stack
    monitoring: Prometheus + Grafana
    tracing: Jaeger
```

### 4. Refinement Phase
Implement with TDD, iterating until all tests pass.

#### Purpose
- Write tests first (Red phase)
- Implement minimal code (Green phase)
- Refactor for quality (Refactor phase)
- Iterate until complete

#### Process
```bash
# Execute TDD implementation
npx claude-flow sparc tdd \
  "Implement user authentication with JWT"
```

#### TDD Cycle Example

##### Red Phase - Write Failing Tests
```javascript
// auth.test.js
describe('Authentication Service', () => {
  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      const result = await authService.login('user@example.com', 'password123');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(jwt.verify(result.accessToken, process.env.JWT_SECRET)).toBeTruthy();
    });
    
    it('should reject invalid credentials', async () => {
      await expect(authService.login('user@example.com', 'wrong'))
        .rejects.toThrow('Invalid credentials');
    });
    
    it('should implement rate limiting', async () => {
      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await authService.login('user@example.com', 'wrong').catch(() => {});
      }
      
      // 6th attempt should be rate limited
      await expect(authService.login('user@example.com', 'password123'))
        .rejects.toThrow('Too many attempts');
    });
  });
});
```

##### Green Phase - Minimal Implementation
```javascript
// auth.service.js
class AuthService {
  constructor(userRepo, tokenService, rateLimiter) {
    this.userRepo = userRepo;
    this.tokenService = tokenService;
    this.rateLimiter = rateLimiter;
  }
  
  async login(email, password) {
    // Check rate limit
    if (!await this.rateLimiter.check(email)) {
      throw new Error('Too many attempts');
    }
    
    // Verify credentials
    const user = await this.userRepo.findByEmail(email);
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      await this.rateLimiter.increment(email);
      throw new Error('Invalid credentials');
    }
    
    // Generate tokens
    const accessToken = this.tokenService.generateAccess(user.id);
    const refreshToken = await this.tokenService.generateRefresh(user.id);
    
    await this.rateLimiter.reset(email);
    
    return { accessToken, refreshToken };
  }
}
```

##### Refactor Phase - Improve Quality
```javascript
// Refactored with better separation of concerns
class AuthService {
  async login(email, password) {
    await this._enforceRateLimit(email);
    
    const user = await this._validateCredentials(email, password);
    const tokens = await this._generateTokenPair(user);
    
    await this._onSuccessfulLogin(email, user);
    
    return tokens;
  }
  
  async _enforceRateLimit(identifier) {
    const limit = await this.rateLimiter.checkLimit(identifier, {
      max: 5,
      window: '15m'
    });
    
    if (!limit.allowed) {
      throw new AuthError('RATE_LIMIT_EXCEEDED', {
        retryAfter: limit.retryAfter
      });
    }
  }
  
  async _validateCredentials(email, password) {
    const user = await this.userRepo.findByEmail(email);
    
    if (!user || !await this._verifyPassword(password, user.passwordHash)) {
      await this.rateLimiter.increment(email);
      throw new AuthError('INVALID_CREDENTIALS');
    }
    
    return user;
  }
  
  // ... more refactored methods
}
```

### 5. Completion Phase
Finalize with integration, documentation, and deployment readiness.

#### Purpose
- Integration testing
- Performance optimization
- Documentation generation
- Deployment preparation

#### Process
```bash
# Complete integration and deployment prep
npx claude-flow sparc run completion \
  "Finalize authentication service for production"
```

#### Completion Checklist
```markdown
## Authentication Service Completion Checklist

### ✅ Integration Testing
- [ ] End-to-end authentication flow
- [ ] OAuth2 provider integration
- [ ] Database transaction handling
- [ ] Message queue integration
- [ ] Cache layer functionality

### ✅ Performance Optimization
- [ ] Database query optimization
- [ ] Redis caching implementation
- [ ] Connection pooling configured
- [ ] Load testing completed (1000 req/s target)

### ✅ Security Hardening
- [ ] Security headers configured
- [ ] OWASP Top 10 compliance
- [ ] Penetration testing passed
- [ ] SSL/TLS properly configured

### ✅ Documentation
- [ ] API documentation (OpenAPI)
- [ ] Integration guide
- [ ] Deployment runbook
- [ ] Troubleshooting guide

### ✅ Deployment Readiness
- [ ] Docker images built and tested
- [ ] Kubernetes manifests ready
- [ ] CI/CD pipeline configured
- [ ] Monitoring dashboards created
- [ ] Alerting rules defined
```

## SPARC + TDD Integration

### London School TDD
Focus on interaction testing with mocks.

```bash
# Deploy London School TDD approach
npx claude-flow agent spawn tdd-london-swarm \
  --task "Implement payment service with mock interactions"
```

Example:
```javascript
// London School - Mock all dependencies
describe('PaymentService', () => {
  let paymentService;
  let mockGateway;
  let mockOrderRepo;
  let mockEventBus;
  
  beforeEach(() => {
    mockGateway = mock(PaymentGateway);
    mockOrderRepo = mock(OrderRepository);
    mockEventBus = mock(EventBus);
    
    paymentService = new PaymentService(
      mockGateway,
      mockOrderRepo,
      mockEventBus
    );
  });
  
  it('should process payment and emit event', async () => {
    // Given
    when(mockGateway.charge(any())).thenResolve({ id: 'pay_123' });
    when(mockOrderRepo.updateStatus(any(), any())).thenResolve();
    
    // When
    await paymentService.processPayment('order_123', 99.99);
    
    // Then
    verify(mockGateway.charge({ amount: 99.99, currency: 'USD' })).once();
    verify(mockOrderRepo.updateStatus('order_123', 'paid')).once();
    verify(mockEventBus.emit('payment.completed', any())).once();
  });
});
```

### Chicago School TDD
Focus on state testing with real implementations.

```javascript
// Chicago School - Use real implementations where possible
describe('ShoppingCart', () => {
  let cart;
  
  beforeEach(() => {
    cart = new ShoppingCart();
  });
  
  it('should calculate total with tax', () => {
    // Given
    cart.addItem({ id: 1, price: 10.00, quantity: 2 });
    cart.addItem({ id: 2, price: 5.00, quantity: 1 });
    
    // When
    const total = cart.calculateTotal({ taxRate: 0.08 });
    
    // Then
    expect(total).toBe(27.00); // (20 + 5) * 1.08
    expect(cart.getItemCount()).toBe(3);
  });
});
```

## SPARC Workflow Examples

### Feature Development Workflow

```bash
# 1. Specification
npx claude-flow sparc run specification \
  "Add real-time notifications to chat application"

# 2. Pseudocode
npx claude-flow sparc run pseudocode \
  "Design WebSocket message routing algorithm"

# 3. Architecture
npx claude-flow sparc run architecture \
  "Design scalable WebSocket architecture with Redis"

# 4. TDD Implementation
npx claude-flow sparc tdd \
  "Implement WebSocket notification service"

# 5. Completion
npx claude-flow sparc run completion \
  "Prepare notification service for deployment"
```

### Bug Fix Workflow

```bash
# Rapid SPARC cycle for bug fixes
npx claude-flow sparc run refinement \
  "Fix race condition in payment processing" \
  --fast-track \
  --focus testing
```

### Refactoring Workflow

```bash
# Architecture-focused SPARC for refactoring
npx claude-flow sparc run architecture \
  "Refactor monolith user service to microservices" \
  --include-migration-plan
```

## Best Practices

### 1. Start with Clear Specifications
- Define acceptance criteria upfront
- Include edge cases in specifications
- Get stakeholder approval before proceeding

### 2. Maintain Test Coverage
- Aim for >80% code coverage
- Include unit, integration, and e2e tests
- Test error scenarios thoroughly

### 3. Iterate in Small Cycles
- Keep TDD cycles short (< 15 minutes)
- Commit after each green test
- Refactor continuously

### 4. Document Decisions
- Record architectural decisions
- Document trade-offs
- Maintain up-to-date API docs

### 5. Leverage AI Assistance
- Use agents for boilerplate generation
- Automate test case creation
- Generate documentation from code

## Integration with Claude Flow

### Memory System Integration
```bash
# Store SPARC artifacts in memory
npx claude-flow memory usage \
  --action store \
  --namespace "sparc/auth-service" \
  --key "specifications" \
  --value "$(cat auth-spec.md)"
```

### Swarm Coordination
```bash
# Deploy SPARC-specialized swarm
npx claude-flow swarm init sparc-team \
  --agents "specification,pseudocode,architecture,sparc-coder,tester" \
  --topology hierarchical
```

### Workflow Automation
```bash
# Automate SPARC pipeline
npx claude-flow workflow create \
  --name "sparc-pipeline" \
  --template "sparc-tdd" \
  --auto-advance \
  --memory-persist
```

## Metrics and Monitoring

### SPARC Phase Metrics
```javascript
const metrics = {
  specification: {
    duration: '2h',
    completeness: 95,
    stakeholderApproval: true
  },
  pseudocode: {
    duration: '1h',
    algorithmComplexity: 'O(n log n)',
    validated: true
  },
  architecture: {
    duration: '3h',
    components: 12,
    interfaces: 8
  },
  refinement: {
    duration: '8h',
    testsPassed: 45,
    coverage: 87
  },
  completion: {
    duration: '2h',
    deploymentReady: true,
    documentationComplete: true
  }
};
```

## Common Patterns

### API Development Pattern
```bash
# Full API development cycle
npx claude-flow sparc pipeline \
  "Create RESTful API for inventory management" \
  --include "openapi-spec,postman-collection,sdk-generation"
```

### Microservice Pattern
```bash
# Microservice development with SPARC
npx claude-flow sparc run architecture \
  "Design order processing microservice" \
  --patterns "event-sourcing,cqrs,saga"
```

### Frontend Component Pattern
```bash
# Component development with TDD
npx claude-flow sparc tdd \
  "Create reusable data table component" \
  --framework react \
  --include "storybook,accessibility-tests"
```

## Next Steps

- Review [Development Patterns](./Development-Patterns.md) for common patterns
- Explore [Workflow Orchestration](./Workflow-Orchestration.md) for complex workflows
- Check [API Reference](./API-Reference.md) for all SPARC commands