# 🔌 CLAUDE.md Template - API Development

## 🚨 CRITICAL: API DEVELOPMENT PARALLEL EXECUTION

**MANDATORY RULE**: For API development projects, ALL operations MUST be concurrent/parallel:

### 🔴 API-SPECIFIC CONCURRENT PATTERNS:

1. **Multi-Endpoint Parallel**: Develop multiple API endpoints simultaneously
2. **Database & API Parallel**: Create database schemas and API routes concurrently
3. **Testing Automation**: Generate unit, integration, and contract tests in parallel
4. **Documentation Generation**: Create OpenAPI specs and docs concurrently
5. **Microservice Development**: Build multiple services in parallel

### ⚡ API DEVELOPMENT GOLDEN RULE: "MICROSERVICE PARALLEL EXECUTION"

**✅ CORRECT API Development Pattern:**

```javascript
// Single Message - Multi-Service Parallel Development
[BatchTool]:
  // RESTful API Endpoints (Parallel)
  - Write("src/routes/auth.ts", authRoutes)
  - Write("src/routes/users.ts", userRoutes)
  - Write("src/routes/products.ts", productRoutes)
  - Write("src/routes/orders.ts", orderRoutes)
  
  // GraphQL Resolvers (Parallel)
  - Write("src/graphql/resolvers/userResolvers.ts", userResolvers)
  - Write("src/graphql/resolvers/productResolvers.ts", productResolvers)
  - Write("src/graphql/resolvers/orderResolvers.ts", orderResolvers)
  - Write("src/graphql/schema.ts", graphqlSchema)
  
  // Database Models (Parallel)
  - Write("src/models/User.ts", userModel)
  - Write("src/models/Product.ts", productModel)
  - Write("src/models/Order.ts", orderModel)
  - Write("src/models/index.ts", modelIndex)
  
  // Services Layer (Parallel)
  - Write("src/services/AuthService.ts", authService)
  - Write("src/services/UserService.ts", userService)
  - Write("src/services/ProductService.ts", productService)
  - Write("src/services/OrderService.ts", orderService)
  
  // Tests (Parallel)
  - Write("tests/routes/auth.test.ts", authRouteTests)
  - Write("tests/routes/users.test.ts", userRouteTests)
  - Write("tests/services/AuthService.test.ts", authServiceTests)
  - Write("tests/integration/api.test.ts", integrationTests)
  
  // API Documentation (Parallel)
  - Write("docs/openapi.yaml", openApiSpec)
  - Write("docs/graphql-schema.graphql", graphqlDocs)
  - Write("README.md", apiDocumentation)
```

## 🎯 API PROJECT CONTEXT

### API Types
- **🔄 RESTful APIs**: HTTP-based with standard verbs (GET, POST, PUT, DELETE)
- **📊 GraphQL APIs**: Query language with flexible data retrieval
- **⚡ gRPC APIs**: High-performance RPC framework
- **🔌 WebSocket APIs**: Real-time bidirectional communication
- **📡 Event-Driven APIs**: Async messaging and event streaming

### Architecture Patterns
- **🏛️ Layered Architecture**: Presentation → Business → Data layers
- **🔄 Clean Architecture**: Dependencies point inward, business rules isolated
- **🎯 Hexagonal Architecture**: Ports and adapters pattern
- **🧩 Microservices**: Distributed services with domain boundaries
- **📨 Event Sourcing**: Append-only event store with projections

## 🔧 API DEVELOPMENT PATTERNS

### RESTful API Development Standards

```javascript
// REST API Project Structure (Create in parallel)
api/
├── src/
│   ├── controllers/           // HTTP request handlers (parallel)
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── ProductController.ts
│   │   └── OrderController.ts
│   ├── routes/               // Route definitions (parallel)
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── services/             // Business logic (parallel)
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   └── EmailService.ts
│   ├── models/               // Data models (parallel)
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Order.ts
│   ├── middleware/           // Request middleware (parallel)
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── rateLimit.ts
│   │   └── logging.ts
│   ├── utils/                // Utilities
│   ├── config/               // Configuration
│   └── types/                // TypeScript definitions
├── tests/                    // Test files (parallel)
├── docs/                     // API documentation
└── migrations/               // Database migrations
```

### GraphQL API Development Standards

```javascript
// GraphQL API Structure (Create in parallel)
graphql-api/
├── src/
│   ├── schema/               // GraphQL schema (parallel)
│   │   ├── typeDefs/
│   │   │   ├── User.graphql
│   │   │   ├── Product.graphql
│   │   │   └── Order.graphql
│   │   └── index.ts
│   ├── resolvers/            // GraphQL resolvers (parallel)
│   │   ├── userResolvers.ts
│   │   ├── productResolvers.ts
│   │   ├── orderResolvers.ts
│   │   └── index.ts
│   ├── dataSources/          // Data layer (parallel)
│   │   ├── UserDataSource.ts
│   │   ├── ProductDataSource.ts
│   │   └── OrderDataSource.ts
│   ├── directives/           // Custom directives (parallel)
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── deprecated.ts
│   ├── scalars/              // Custom scalar types
│   └── utils/
├── tests/                    // GraphQL tests
└── schema.graphql            // Generated schema
```

### Microservices Development Standards

```javascript
// Microservices Architecture (Create in parallel)
microservices/
├── services/
│   ├── auth-service/         // Authentication service (parallel)
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/         // User management service (parallel)
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── product-service/      // Product catalog service (parallel)
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── order-service/        // Order processing service (parallel)
│       ├── src/
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
├── shared/                   // Shared libraries
│   ├── auth/
│   ├── logging/
│   ├── monitoring/
│   └── types/
├── gateway/                  // API Gateway
├── docker-compose.yml        // Local development
└── k8s/                      // Kubernetes manifests
```

### Concurrent API Development Pattern

```javascript
// Always create related API components in parallel
[BatchTool]:
  // Create complete API endpoint with all layers
  - Write("src/routes/products.ts", productRoutes)
  - Write("src/controllers/ProductController.ts", productController)
  - Write("src/services/ProductService.ts", productService)
  - Write("src/models/Product.ts", productModel)
  - Write("src/validators/productValidator.ts", productValidation)
  
  // Create corresponding tests
  - Write("tests/routes/products.test.ts", routeTests)
  - Write("tests/controllers/ProductController.test.ts", controllerTests)
  - Write("tests/services/ProductService.test.ts", serviceTests)
  
  // Create documentation
  - Write("docs/api/products.md", productApiDocs)
  - Edit("docs/openapi.yaml", openApiSpecUpdate)
```

## 🐝 API DEVELOPMENT SWARM ORCHESTRATION

### Specialized Agent Roles

```yaml
api_architect:
  role: API System Designer
  focus: [api-design, data-modeling, service-boundaries]
  concurrent_tasks: [rest-design, graphql-schema, microservice-architecture]
  expertise: [openapi, domain-driven-design, distributed-systems]

backend_developer:
  role: API Implementation
  focus: [endpoint-development, business-logic, data-persistence]
  concurrent_tasks: [multiple-endpoints, service-integration, database-operations]
  expertise: [node-js, typescript, database-design]

api_tester:
  role: API Quality Assurance
  focus: [contract-testing, integration-testing, performance-testing]
  concurrent_tasks: [automated-testing, load-testing, security-testing]
  tools: [jest, supertest, postman, k6]

devops_engineer:
  role: API Infrastructure & Deployment
  focus: [containerization, orchestration, monitoring]
  concurrent_tasks: [docker-setup, k8s-deployment, ci-cd-pipelines]
  expertise: [docker, kubernetes, monitoring, scaling]

api_documenter:
  role: API Documentation & Standards
  focus: [openapi-specs, developer-experience, api-guidelines]
  concurrent_tasks: [documentation-generation, example-creation, sdk-generation]
  tools: [swagger, redoc, postman, insomnia]

security_specialist:
  role: API Security & Compliance
  focus: [authentication, authorization, vulnerability-assessment]
  concurrent_tasks: [security-implementation, penetration-testing, compliance-audit]
  expertise: [oauth, jwt, owasp, security-patterns]
```

### Topology Recommendation

```bash
# For API development projects
claude-flow hive init --topology mesh --agents 6

# Agent distribution:
# - 1 API Architect (system design coordinator)
# - 2 Backend Developers (parallel endpoint development)
# - 1 API Tester (comprehensive testing)
# - 1 DevOps Engineer (infrastructure and deployment)
# - 1 Security Specialist (security and compliance)
```

## 🧠 API DEVELOPMENT MEMORY MANAGEMENT

### Context Storage Patterns

```javascript
// Store API-specific project context
api_memory_patterns: {
  "api/architecture/pattern": "Clean Architecture with Domain-Driven Design",
  "api/data/strategy": "PostgreSQL primary + Redis cache + ElasticSearch",
  "api/auth/strategy": "JWT with refresh tokens + OAuth2 for third-party",
  "api/validation/strategy": "Joi for input validation + OpenAPI schema validation",
  "api/testing/strategy": "Jest + Supertest + Contract testing with Pact",
  "api/documentation/strategy": "OpenAPI 3.0 + automated SDK generation",
  "api/monitoring/strategy": "Prometheus + Grafana + distributed tracing",
  "api/deployment/strategy": "Docker containers + Kubernetes + GitOps",
  "api/security/strategy": "OWASP guidelines + automated security scanning",
  "api/performance/strategy": "Connection pooling + query optimization + caching"
}
```

### API Design Decisions

```javascript
// Track API architectural decisions
api_decisions: {
  "rest_vs_graphql": {
    "decision": "RESTful API with GraphQL for complex queries",
    "rationale": "REST for CRUD operations, GraphQL for dashboard/reporting",
    "alternatives": ["Pure REST", "Pure GraphQL", "gRPC"],
    "date": "2024-01-15"
  },
  
  "authentication": {
    "decision": "JWT with sliding refresh tokens",
    "rationale": "Stateless auth with secure refresh mechanism",
    "alternatives": ["Session-based", "OAuth2 only", "API keys"],
    "date": "2024-01-15"
  },
  
  "database_strategy": {
    "decision": "PostgreSQL with read replicas",
    "rationale": "ACID compliance with horizontal read scaling",
    "alternatives": ["MongoDB", "MySQL", "Multi-database"],
    "date": "2024-01-15"
  },
  
  "api_versioning": {
    "decision": "URL versioning (/v1/, /v2/)",
    "rationale": "Clear version separation for breaking changes",
    "alternatives": ["Header versioning", "Accept header", "No versioning"],
    "date": "2024-01-15"
  }
}
```

## 🚀 API DEPLOYMENT & CI/CD

### Build Process (Parallel Execution)

```yaml
# API-focused build pipeline
api_build_stages:
  code_quality:
    - "npm run lint" # ESLint + Prettier
    - "npm run type-check" # TypeScript validation
    - "npm run security-scan" # npm audit + Snyk
    - "npm run dependency-check" # Check for known vulnerabilities
  
  testing:
    - "npm run test:unit" # Unit tests with coverage
    - "npm run test:integration" # Integration tests
    - "npm run test:contract" # Contract testing with Pact
    - "npm run test:load" # Load testing with k6
  
  documentation:
    - "npm run docs:generate" # Generate OpenAPI docs
    - "npm run docs:validate" # Validate API documentation
    - "npm run sdk:generate" # Generate client SDKs
  
  containerization:
    - "docker build -t api:${BUILD_NUMBER} ." # Build Docker image
    - "docker run --rm api:${BUILD_NUMBER} npm test" # Test in container
    - "trivy image api:${BUILD_NUMBER}" # Container security scan
  
  deployment:
    - "kubectl apply -f k8s/" # Deploy to Kubernetes
    - "kubectl rollout status deployment/api" # Wait for deployment
    - "npm run test:smoke" # Smoke tests against deployed API
```

### Environment Configuration

```bash
# Development environment
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/api_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_jwt_secret_key
LOG_LEVEL=debug
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Staging environment
NODE_ENV=staging
PORT=3000
DATABASE_URL=${STAGING_DATABASE_URL}
REDIS_URL=${STAGING_REDIS_URL}
JWT_SECRET=${STAGING_JWT_SECRET}
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# Production environment
NODE_ENV=production
PORT=3000
DATABASE_URL=${PROD_DATABASE_URL}
REDIS_URL=${PROD_REDIS_URL}
JWT_SECRET=${PROD_JWT_SECRET}
LOG_LEVEL=warn
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

## 📊 API MONITORING & ANALYTICS

### API Performance Monitoring

```javascript
// API-specific monitoring setup
api_monitoring: {
  performance: {
    response_times: "Track P50, P95, P99 response times per endpoint",
    throughput: "Requests per second and concurrent connections",
    error_rates: "4xx/5xx error rates by endpoint and status code",
    database: "Query performance and connection pool metrics"
  },
  
  business_metrics: {
    api_usage: "Track most/least used endpoints",
    user_behavior: "API usage patterns by user segments",
    rate_limiting: "Track rate limit hits and abuse patterns",
    feature_adoption: "Monitor new endpoint adoption rates"
  },
  
  infrastructure: {
    container_metrics: "CPU, memory, disk usage per service",
    network: "Network latency and bandwidth utilization",
    dependencies: "External service availability and response times",
    scaling: "Auto-scaling triggers and capacity planning"
  },
  
  security: {
    authentication: "Failed login attempts and suspicious patterns",
    authorization: "Unauthorized access attempts",
    input_validation: "Malicious input detection and blocking",
    dos_protection: "DDoS attempts and mitigation effectiveness"
  }
}
```

### Distributed Tracing & Logging

```javascript
// Comprehensive API observability
api_observability: {
  distributed_tracing: {
    tools: "Jaeger + OpenTelemetry for request tracing",
    correlation: "Trace requests across microservices",
    performance: "Identify bottlenecks in request flows",
    errors: "Track error propagation across services"
  },
  
  structured_logging: {
    format: "JSON structured logs with correlation IDs",
    levels: "DEBUG, INFO, WARN, ERROR with appropriate context",
    aggregation: "Centralized logging with ELK stack",
    analysis: "Log analysis for error patterns and insights"
  },
  
  metrics_collection: {
    application: "Custom business metrics and KPIs",
    system: "System metrics (CPU, memory, disk, network)",
    database: "Database performance and query analytics",
    external: "Third-party service integration metrics"
  }
}
```

## 🔒 API SECURITY & COMPLIANCE

### Security Patterns

```javascript
// Comprehensive API security implementation
api_security: {
  authentication: {
    jwt_implementation: "HS256/RS256 JWT with proper claims validation",
    refresh_tokens: "Secure refresh token rotation with blacklisting",
    multi_factor: "TOTP-based 2FA for sensitive operations",
    oauth2: "OAuth2/OIDC integration for third-party authentication"
  },
  
  authorization: {
    rbac: "Role-based access control with granular permissions",
    resource_based: "Resource-level authorization checks",
    api_scopes: "OAuth2 scopes for API access control",
    policy_engine: "Attribute-based access control (ABAC)"
  },
  
  input_validation: {
    schema_validation: "OpenAPI schema validation for all inputs",
    sanitization: "Input sanitization to prevent injection attacks",
    rate_limiting: "Per-user and per-endpoint rate limiting",
    size_limits: "Request size limits and payload validation"
  },
  
  data_protection: {
    encryption_at_rest: "Database encryption with key rotation",
    encryption_in_transit: "TLS 1.3 for all API communications",
    sensitive_data: "Field-level encryption for PII/PHI",
    data_masking: "Data masking in logs and non-prod environments"
  },
  
  api_security: {
    cors_policy: "Strict CORS policy with whitelist approach",
    csrf_protection: "CSRF tokens for state-changing operations",
    security_headers: "Comprehensive security headers (HSTS, CSP, etc.)",
    api_gateway: "API gateway with security policies and monitoring"
  }
}
```

### OWASP API Security Implementation

```javascript
// OWASP API Security Top 10 implementation
[BatchTool - API Security]:
  - Write("src/middleware/security.ts", `
    import helmet from 'helmet';
    import rateLimit from 'express-rate-limit';
    import { body, validationResult } from 'express-validator';
    
    // API1: Broken Object Level Authorization
    export const objectLevelAuth = (req: Request, res: Response, next: NextFunction) => {
      // Verify user can access the specific resource
      const userId = req.user.id;
      const resourceUserId = req.params.userId;
      
      if (userId !== resourceUserId && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied to resource' });
      }
      next();
    };
    
    // API2: Broken User Authentication
    export const strongAuth = jwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      issuer: 'api.yourcompany.com',
      audience: 'api-users'
    });
    
    // API3: Excessive Data Exposure
    export const dataMinimization = (allowedFields: string[]) => {
      return (req: Request, res: Response, next: NextFunction) => {
        res.locals.allowedFields = allowedFields;
        next();
      };
    };
    
    // API4: Lack of Resources & Rate Limiting
    export const apiRateLimit = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false
    });
    
    // API7: Security Misconfiguration
    export const securityHeaders = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  `)
  
  - Write("src/middleware/validation.ts", `
    import { body, param, query, validationResult } from 'express-validator';
    import DOMPurify from 'isomorphic-dompurify';
    
    // API8: Injection prevention
    export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
      // Sanitize all string inputs
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = DOMPurify.sanitize(req.body[key]);
        }
      }
      next();
    };
    
    // Comprehensive input validation
    export const validateUser = [
      body('email').isEmail().normalizeEmail(),
      body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
      body('name').isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s]+$/),
      
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
    ];
  `)
```

## 🧪 API TESTING STRATEGY

### Testing Pyramid (Parallel Execution)

```javascript
// Execute all API test types in parallel
[BatchTool - API Testing]:
  // Unit Tests (Parallel)
  - Bash("npm run test:unit") // Service layer unit tests
  - Bash("npm run test:models") // Model validation tests
  - Bash("npm run test:utils") // Utility function tests
  
  // Integration Tests (Parallel)
  - Bash("npm run test:integration") // Database integration tests
  - Bash("npm run test:api") // API endpoint integration tests
  - Bash("npm run test:external") // External service integration tests
  
  // Contract Tests (Parallel)
  - Bash("npm run test:contract:provider") // Provider contract tests
  - Bash("npm run test:contract:consumer") // Consumer contract tests
  - Bash("pact-broker publish") // Publish contracts to Pact Broker
  
  // End-to-End Tests (Parallel)
  - Bash("npm run test:e2e") // Full API workflow tests
  - Bash("npm run test:smoke") // Smoke tests for critical paths
  
  // Performance Tests
  - Bash("npm run test:load") // Load testing with k6
  - Bash("npm run test:stress") // Stress testing
  
  // Security Tests
  - Bash("npm run test:security") // OWASP ZAP security tests
  - Bash("npm run test:penetration") // Automated penetration testing
```

### Test Organization

```javascript
// API test file structure (create in parallel)
tests/
├── unit/
│   ├── controllers/       // Controller unit tests (parallel)
│   ├── services/          // Service unit tests (parallel)
│   ├── models/            // Model unit tests (parallel)
│   ├── middleware/        // Middleware unit tests (parallel)
│   └── utils/             // Utility unit tests (parallel)
├── integration/
│   ├── database/          // Database integration tests
│   ├── api/               // API endpoint integration tests
│   ├── external/          // External service integration tests
│   └── cache/             // Cache integration tests
├── contract/
│   ├── provider/          // Provider contract tests
│   ├── consumer/          // Consumer contract tests
│   └── pacts/             // Generated contract files
├── e2e/
│   ├── workflows/         // Complete user workflow tests
│   ├── smoke/             // Critical path smoke tests
│   └── scenarios/         // Business scenario tests
├── performance/
│   ├── load/              // Load test scenarios
│   ├── stress/            // Stress test scenarios
│   └── spike/             // Spike test scenarios
├── security/
│   ├── authentication/    // Auth security tests
│   ├── authorization/     // Access control tests
│   ├── injection/         // Injection attack tests
│   └── owasp/             // OWASP Top 10 tests
└── fixtures/              // Test data and fixtures
```

## 🎨 API DESIGN PATTERNS

### RESTful API Design (Always Parallel)

```javascript
// Create RESTful API ecosystem in parallel
[BatchTool - REST API Creation]:
  // Resource endpoints with full CRUD
  - Write("src/routes/users.ts", `
    import express from 'express';
    import { UserController } from '../controllers/UserController';
    import { auth, validate } from '../middleware';
    
    const router = express.Router();
    const userController = new UserController();
    
    // GET /users - List users with pagination
    router.get('/', auth, userController.list);
    
    // GET /users/:id - Get specific user
    router.get('/:id', auth, userController.get);
    
    // POST /users - Create new user
    router.post('/', validate.createUser, userController.create);
    
    // PUT /users/:id - Update user
    router.put('/:id', auth, validate.updateUser, userController.update);
    
    // DELETE /users/:id - Delete user
    router.delete('/:id', auth, userController.delete);
    
    export default router;
  `)
  
  // OpenAPI specification
  - Write("docs/openapi.yaml", `
    openapi: 3.0.3
    info:
      title: API Service
      version: 1.0.0
      description: Comprehensive API with authentication and CRUD operations
    
    servers:
      - url: https://api.example.com/v1
        description: Production server
      - url: https://staging-api.example.com/v1
        description: Staging server
    
    paths:
      /users:
        get:
          summary: List users
          parameters:
            - name: page
              in: query
              schema:
                type: integer
                default: 1
            - name: limit
              in: query
              schema:
                type: integer
                default: 20
          responses:
            '200':
              description: Successful response
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/User'
                      meta:
                        $ref: '#/components/schemas/PaginationMeta'
    
    components:
      schemas:
        User:
          type: object
          properties:
            id:
              type: string
              format: uuid
            email:
              type: string
              format: email
            name:
              type: string
            createdAt:
              type: string
              format: date-time
  `)
```

### GraphQL API Design (Always Parallel)

```javascript
// Create GraphQL API ecosystem in parallel
[BatchTool - GraphQL API Creation]:
  // Type definitions
  - Write("src/graphql/typeDefs/User.graphql", `
    type User {
      id: ID!
      email: String!
      name: String!
      posts: [Post!]!
      createdAt: DateTime!
      updatedAt: DateTime!
    }
    
    input CreateUserInput {
      email: String!
      name: String!
      password: String!
    }
    
    input UpdateUserInput {
      name: String
      email: String
    }
    
    extend type Query {
      user(id: ID!): User
      users(first: Int, after: String): UserConnection!
    }
    
    extend type Mutation {
      createUser(input: CreateUserInput!): User!
      updateUser(id: ID!, input: UpdateUserInput!): User!
      deleteUser(id: ID!): Boolean!
    }
  `)
  
  // Resolvers
  - Write("src/graphql/resolvers/userResolvers.ts", `
    import { UserService } from '../../services/UserService';
    import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
    
    export const userResolvers = {
      Query: {
        user: async (_, { id }, { user, dataSources }) => {
          if (!user) throw new AuthenticationError('Authentication required');
          
          const userData = await dataSources.userAPI.getUserById(id);
          
          // Check if user can access this resource
          if (userData.id !== user.id && !user.isAdmin) {
            throw new ForbiddenError('Access denied');
          }
          
          return userData;
        },
        
        users: async (_, { first = 20, after }, { user, dataSources }) => {
          if (!user?.isAdmin) throw new ForbiddenError('Admin access required');
          
          return dataSources.userAPI.getUsers({ first, after });
        }
      },
      
      Mutation: {
        createUser: async (_, { input }, { dataSources }) => {
          return dataSources.userAPI.createUser(input);
        },
        
        updateUser: async (_, { id, input }, { user, dataSources }) => {
          if (!user) throw new AuthenticationError('Authentication required');
          
          if (id !== user.id && !user.isAdmin) {
            throw new ForbiddenError('Access denied');
          }
          
          return dataSources.userAPI.updateUser(id, input);
        }
      },
      
      User: {
        posts: async (user, _, { dataSources }) => {
          return dataSources.postAPI.getPostsByUserId(user.id);
        }
      }
    };
  `)
```

### Microservices Communication Patterns

```javascript
// Microservices communication setup (parallel)
[BatchTool - Microservices Communication]:
  // Event-driven communication
  - Write("src/events/UserEvents.ts", `
    import { EventEmitter } from 'events';
    import { publishEvent } from '../messaging/eventPublisher';
    
    export interface UserCreatedEvent {
      type: 'USER_CREATED';
      payload: {
        userId: string;
        email: string;
        name: string;
        timestamp: Date;
      };
    }
    
    export interface UserUpdatedEvent {
      type: 'USER_UPDATED';
      payload: {
        userId: string;
        changes: Record<string, any>;
        timestamp: Date;
      };
    }
    
    export class UserEventPublisher extends EventEmitter {
      async publishUserCreated(user: any) {
        const event: UserCreatedEvent = {
          type: 'USER_CREATED',
          payload: {
            userId: user.id,
            email: user.email,
            name: user.name,
            timestamp: new Date()
          }
        };
        
        await publishEvent('user-service', event);
        this.emit('user-created', event);
      }
      
      async publishUserUpdated(userId: string, changes: Record<string, any>) {
        const event: UserUpdatedEvent = {
          type: 'USER_UPDATED',
          payload: {
            userId,
            changes,
            timestamp: new Date()
          }
        };
        
        await publishEvent('user-service', event);
        this.emit('user-updated', event);
      }
    }
  `)
  
  // Service-to-service HTTP communication
  - Write("src/clients/OrderServiceClient.ts", `
    import axios, { AxiosInstance } from 'axios';
    import { CircuitBreaker } from '../utils/CircuitBreaker';
    
    export class OrderServiceClient {
      private client: AxiosInstance;
      private circuitBreaker: CircuitBreaker;
      
      constructor() {
        this.client = axios.create({
          baseURL: process.env.ORDER_SERVICE_URL,
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        this.circuitBreaker = new CircuitBreaker({
          failureThreshold: 5,
          recoveryTimeout: 30000
        });
      }
      
      async getUserOrders(userId: string) {
        return this.circuitBreaker.execute(async () => {
          const response = await this.client.get(\`/users/\${userId}/orders\`);
          return response.data;
        });
      }
      
      async createOrder(orderData: any) {
        return this.circuitBreaker.execute(async () => {
          const response = await this.client.post('/orders', orderData);
          return response.data;
        });
      }
    }
  `)
```

## 🚀 PERFORMANCE OPTIMIZATION

### API Performance Patterns

```javascript
// API-specific performance optimization
api_performance: {
  database_optimization: {
    connection_pooling: "PostgreSQL connection pool with min/max connections",
    query_optimization: "Query analysis and index optimization",
    read_replicas: "Read operations distributed across replicas",
    query_caching: "Redis-based query result caching"
  },
  
  caching_strategy: {
    redis_cache: "Multi-layer caching with TTL and invalidation",
    cdn_caching: "Static content delivery via CDN",
    application_cache: "In-memory caching for frequently accessed data",
    http_caching: "Proper HTTP cache headers and ETags"
  },
  
  request_optimization: {
    compression: "Gzip/Brotli compression for API responses",
    payload_optimization: "Minimize JSON payload size",
    batch_operations: "Batch multiple operations in single request",
    pagination: "Efficient pagination with cursor-based approach"
  },
  
  scalability: {
    horizontal_scaling: "Stateless API design for horizontal scaling",
    load_balancing: "Round-robin and health-check based load balancing",
    auto_scaling: "Kubernetes HPA based on CPU/memory/custom metrics",
    database_sharding: "Database sharding for high-traffic scenarios"
  }
}
```

### Advanced Performance Techniques

```javascript
// Advanced API performance implementation
[BatchTool - Performance Optimization]:
  - Write("src/middleware/caching.ts", `
    import Redis from 'ioredis';
    import { Request, Response, NextFunction } from 'express';
    
    const redis = new Redis(process.env.REDIS_URL);
    
    export const cacheMiddleware = (ttl: number = 300) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        const cacheKey = \`cache:\${req.method}:\${req.originalUrl}\`;
        
        try {
          const cachedResult = await redis.get(cacheKey);
          
          if (cachedResult) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(JSON.parse(cachedResult));
          }
          
          // Store original json method
          const originalJson = res.json;
          
          res.json = function(data) {
            // Cache the response
            redis.setex(cacheKey, ttl, JSON.stringify(data));
            res.setHeader('X-Cache', 'MISS');
            
            // Call original json method
            return originalJson.call(this, data);
          };
          
          next();
        } catch (error) {
          // If cache fails, continue without caching
          next();
        }
      };
    };
    
    export const invalidateCache = async (pattern: string) => {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    };
  `)
  
  - Write("src/utils/DatabasePool.ts", `
    import { Pool } from 'pg';
    
    export class DatabasePool {
      private static instance: DatabasePool;
      private pool: Pool;
      
      private constructor() {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          min: 5, // Minimum connections
          max: 20, // Maximum connections
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
          keepAlive: true,
          statement_timeout: 30000
        });
        
        // Handle pool errors
        this.pool.on('error', (err) => {
          console.error('Unexpected error on idle client', err);
        });
      }
      
      public static getInstance(): DatabasePool {
        if (!DatabasePool.instance) {
          DatabasePool.instance = new DatabasePool();
        }
        return DatabasePool.instance;
      }
      
      public async query(text: string, params?: any[]) {
        const start = Date.now();
        
        try {
          const result = await this.pool.query(text, params);
          const duration = Date.now() - start;
          
          // Log slow queries
          if (duration > 1000) {
            console.warn(\`Slow query detected: \${duration}ms\`, { text, params });
          }
          
          return result;
        } catch (error) {
          console.error('Database query error:', error);
          throw error;
        }
      }
      
      public async getPoolStatus() {
        return {
          totalCount: this.pool.totalCount,
          idleCount: this.pool.idleCount,
          waitingCount: this.pool.waitingCount
        };
      }
    }
  `)
```

---

## 📚 Related API Development Resources

- **[Microservices Architecture](CLAUDE-MD-Microservices)** - Distributed service patterns
- **[Web Development](CLAUDE-MD-Web-Development)** - Full-stack integration
- **[Database Design](CLAUDE-MD-Database)** - Data layer optimization
- **[Security Patterns](CLAUDE-MD-Security)** - API security implementation

---

**🔌 API Development Success**: This template ensures parallel multi-service development with comprehensive testing, security-first design, performance optimization, and production-ready deployment strategies for RESTful, GraphQL, and microservice architectures.