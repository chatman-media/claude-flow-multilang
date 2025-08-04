# 🌐 CLAUDE.md Template - Web Development

## 🚨 CRITICAL: WEB DEVELOPMENT PARALLEL EXECUTION

**MANDATORY RULE**: For web development projects, ALL operations MUST be concurrent/parallel:

### 🔴 WEB-SPECIFIC CONCURRENT PATTERNS:

1. **Frontend/Backend Parallel**: Always develop frontend and backend components simultaneously
2. **Component Development**: Create multiple UI components in parallel
3. **API Endpoints**: Build multiple API routes concurrently
4. **Testing Suites**: Generate frontend and backend tests in parallel
5. **Asset Processing**: Handle CSS, images, and static assets concurrently

### ⚡ WEB DEVELOPMENT GOLDEN RULE: "FULL-STACK PARALLEL EXECUTION"

**✅ CORRECT Web Development Pattern:**

```javascript
// Single Message - Full-Stack Parallel Development
[BatchTool]:
  // Frontend Components (Parallel)
  - Write("src/components/Header.tsx", headerContent)
  - Write("src/components/Navigation.tsx", navContent)
  - Write("src/components/Dashboard.tsx", dashboardContent)
  - Write("src/components/UserProfile.tsx", profileContent)
  
  // Backend API Routes (Parallel)
  - Write("server/routes/auth.js", authRoutes)
  - Write("server/routes/users.js", userRoutes)
  - Write("server/routes/dashboard.js", dashboardRoutes)
  
  // Database Models (Parallel)
  - Write("server/models/User.js", userModel)
  - Write("server/models/Session.js", sessionModel)
  
  // Tests (Parallel)
  - Write("tests/frontend/components.test.js", frontendTests)
  - Write("tests/backend/api.test.js", backendTests)
  
  // Configuration (Parallel)
  - Write("package.json", packageConfig)
  - Write("webpack.config.js", webpackConfig)
  - Write("server.js", serverSetup)
```

## 🎯 WEB PROJECT CONTEXT

### Project Type
- **🌐 Full Stack Web Application**
- **Frontend**: React/Vue/Angular + TypeScript
- **Backend**: Node.js/Express + RESTful API
- **Database**: PostgreSQL/MongoDB + ORM/ODM
- **Styling**: Tailwind CSS/Styled Components

### Architecture Pattern
- **Frontend**: Component-based architecture with state management
- **Backend**: MVC pattern with middleware layers
- **API**: RESTful design with OpenAPI documentation
- **Database**: Normalized schema with migrations

## 🔧 WEB DEVELOPMENT PATTERNS

### Frontend Development Standards

```javascript
// Component Structure (Always create in parallel)
src/
├── components/          // UI Components (parallel creation)
│   ├── common/         // Shared components
│   ├── forms/          // Form components
│   └── layout/         // Layout components
├── pages/              // Page components (parallel)
├── hooks/              // Custom hooks (parallel)
├── services/           // API services (parallel)
├── store/              // State management
├── utils/              // Utility functions
└── styles/             // Styling files
```

### Backend Development Standards

```javascript
// Server Structure (Always create in parallel)
server/
├── routes/             // API routes (parallel creation)
├── controllers/        // Business logic (parallel)
├── models/             // Database models (parallel)
├── middleware/         // Custom middleware (parallel)
├── services/           // External services
├── utils/              // Server utilities
├── config/             // Configuration files
└── tests/              // Backend tests
```

### Concurrent File Creation Pattern

```javascript
// Always create related files in parallel
[BatchTool]:
  // Create component with its test and styles
  - Write("src/components/UserDashboard.tsx", componentCode)
  - Write("src/components/UserDashboard.test.tsx", componentTests)
  - Write("src/components/UserDashboard.module.css", componentStyles)
  
  // Create API route with controller and tests
  - Write("server/routes/dashboard.js", routeCode)
  - Write("server/controllers/dashboardController.js", controllerCode)
  - Write("server/tests/dashboard.test.js", apiTests)
```

## 🐝 WEB DEVELOPMENT SWARM ORCHESTRATION

### Specialized Agent Roles

```yaml
web_architect:
  role: System Designer
  focus: [frontend-architecture, backend-architecture, database-design]
  concurrent_tasks: [ui-mockups, api-design, database-schema]

frontend_developer:
  role: UI/UX Implementation
  focus: [react-components, responsive-design, user-interactions]
  concurrent_tasks: [multiple-components, styling, state-management]

backend_developer:
  role: API Development
  focus: [rest-apis, database-queries, authentication]
  concurrent_tasks: [multiple-endpoints, middleware, data-validation]

fullstack_tester:
  role: Quality Assurance
  focus: [unit-tests, integration-tests, e2e-tests]
  concurrent_tasks: [frontend-tests, backend-tests, api-tests]

devops_specialist:
  role: Deployment & CI/CD
  focus: [docker-setup, ci-cd-pipelines, monitoring]
  concurrent_tasks: [containerization, deployment, monitoring-setup]
```

### Topology Recommendation

```bash
# For web development projects
claude-flow hive init --topology hierarchical --agents 6

# Agent distribution:
# - 1 Web Architect (coordinator)
# - 2 Frontend Developers (parallel component development)
# - 2 Backend Developers (parallel API development)
# - 1 Full-Stack Tester (comprehensive testing)
```

## 🧠 WEB DEVELOPMENT MEMORY MANAGEMENT

### Context Storage Patterns

```javascript
// Store web-specific project context
memory_patterns: {
  "web/frontend/state": "Redux Toolkit with RTK Query for API calls",
  "web/backend/auth": "JWT tokens with refresh token rotation",
  "web/database/schema": "PostgreSQL with Prisma ORM migrations",
  "web/styling/system": "Tailwind CSS with custom design tokens",
  "web/testing/strategy": "Jest + RTL for frontend, Supertest for backend",
  "web/deployment/strategy": "Docker containers on AWS ECS with RDS"
}
```

### Decision Tracking

```javascript
// Track important architectural decisions
web_decisions: {
  "state_management": {
    "decision": "Redux Toolkit",
    "rationale": "Complex state with API caching needs",
    "alternatives": ["Zustand", "Context API"],
    "date": "2024-01-15"
  },
  "database_choice": {
    "decision": "PostgreSQL",
    "rationale": "ACID compliance and complex queries",
    "alternatives": ["MongoDB", "MySQL"],
    "date": "2024-01-15"
  }
}
```

## 🚀 WEB DEPLOYMENT & CI/CD

### Build Process (Parallel Execution)

```yaml
# Parallel build pipeline
build_stages:
  frontend_build:
    - "npm run build:frontend"
    - "npm run test:frontend"
    - "npm run lint:frontend"
  
  backend_build:
    - "npm run build:backend" 
    - "npm run test:backend"
    - "npm run lint:backend"
  
  integration:
    - "npm run test:integration"
    - "npm run test:e2e"
    
  deployment:
    - "docker build -t web-app ."
    - "docker push registry/web-app"
```

### Environment Configuration

```bash
# Development environment
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
DATABASE_URL=postgresql://localhost:5432/webapp_dev
JWT_SECRET=dev_secret_key
REDIS_URL=redis://localhost:6379

# Production environment  
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_ENVIRONMENT=production
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
REDIS_URL=${REDIS_URL}
```

## 📊 WEB MONITORING & ANALYTICS

### Frontend Monitoring

```javascript
// Client-side monitoring setup
monitoring: {
  performance: "Web Vitals + Lighthouse CI",
  errors: "Sentry for error tracking",
  analytics: "Google Analytics 4 + custom events",
  user_experience: "Hotjar for user sessions"
}
```

### Backend Monitoring

```javascript
// Server-side monitoring setup
backend_monitoring: {
  api_performance: "APM with response time tracking",
  database: "Query performance and connection pooling",
  logs: "Structured logging with ELK stack",
  health_checks: "Endpoint monitoring with alerts"
}
```

## 🔒 WEB SECURITY & COMPLIANCE

### Security Patterns

```javascript
// Web security checklist
security_measures: {
  authentication: "JWT with secure httpOnly cookies",
  authorization: "Role-based access control (RBAC)",
  input_validation: "Joi/Yup validation on frontend and backend",
  sql_injection: "Parameterized queries with ORM",
  xss_protection: "Content Security Policy headers",
  csrf_protection: "CSRF tokens for state-changing operations",
  https_enforcement: "HTTPS redirect and HSTS headers",
  rate_limiting: "API rate limiting per user/IP"
}
```

### Compliance Requirements

```javascript
// Common web compliance patterns
compliance: {
  gdpr: "Cookie consent + data export/deletion APIs",
  accessibility: "WCAG 2.1 AA compliance with axe testing",
  performance: "Core Web Vitals optimization",
  seo: "Server-side rendering + structured data"
}
```

## 🧪 WEB TESTING STRATEGY

### Testing Pyramid (Parallel Execution)

```javascript
// Execute all test types in parallel
[BatchTool - Testing]:
  // Unit Tests (Parallel)
  - Bash("npm run test:unit:frontend")
  - Bash("npm run test:unit:backend")
  
  // Integration Tests (Parallel)
  - Bash("npm run test:integration:api")
  - Bash("npm run test:integration:database")
  
  // E2E Tests (Parallel where possible)
  - Bash("npm run test:e2e:chrome")
  - Bash("npm run test:e2e:firefox")
  
  // Performance Tests
  - Bash("npm run test:lighthouse")
  - Bash("npm run test:load")
```

### Test Organization

```javascript
// Test file structure (create in parallel)
tests/
├── frontend/
│   ├── components/     // Component tests (parallel)
│   ├── hooks/          // Custom hook tests (parallel)
│   └── integration/    // Frontend integration tests
├── backend/
│   ├── routes/         // API route tests (parallel)
│   ├── controllers/    // Controller tests (parallel)
│   └── models/         // Model tests (parallel)
├── e2e/                // End-to-end tests
└── performance/        // Performance tests
```

## 🎨 WEB UI/UX PATTERNS

### Component Development (Always Parallel)

```javascript
// Create component ecosystem in parallel
[BatchTool - Component Creation]:
  // Base component
  - Write("src/components/Button/Button.tsx", buttonComponent)
  - Write("src/components/Button/Button.test.tsx", buttonTests)
  - Write("src/components/Button/Button.stories.tsx", buttonStories)
  - Write("src/components/Button/Button.module.css", buttonStyles)
  
  // Variant components (parallel)
  - Write("src/components/Button/PrimaryButton.tsx", primaryVariant)
  - Write("src/components/Button/SecondaryButton.tsx", secondaryVariant)
  - Write("src/components/Button/IconButton.tsx", iconVariant)
```

### Responsive Design Patterns

```css
/* Mobile-first responsive approach */
.component {
  /* Mobile styles (default) */
  padding: 1rem;
  
  /* Tablet styles */
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  /* Desktop styles */
  @media (min-width: 1024px) {
    padding: 2rem;
  }
}
```

## 🚀 PERFORMANCE OPTIMIZATION

### Frontend Performance

```javascript
// Performance optimization checklist
frontend_optimization: {
  code_splitting: "React.lazy() + Suspense for route-based splitting",
  bundle_optimization: "Webpack bundle analyzer + tree shaking",
  image_optimization: "WebP format + responsive images",
  caching: "Service worker + HTTP caching headers",
  lazy_loading: "Intersection Observer for images/components"
}
```

### Backend Performance

```javascript
// Backend optimization patterns
backend_optimization: {
  database: "Connection pooling + query optimization + indexing",
  caching: "Redis for session storage + API response caching",
  compression: "Gzip/Brotli compression for API responses",
  cdn: "Static asset delivery via CDN",
  monitoring: "APM tools for bottleneck identification"
}
```

---

## 📚 Related Web Development Resources

- **[React Component Patterns](CLAUDE-MD-React)** - React-specific development
- **[API Development](CLAUDE-MD-API-Development)** - Backend API focus
- **[TypeScript Patterns](CLAUDE-MD-TypeScript)** - Type-safe development
- **[Performance Optimization](CLAUDE-MD-High-Performance)** - Speed optimization

---

**🌐 Web Development Success**: This template ensures parallel full-stack development with modern best practices, comprehensive testing, and production-ready deployment patterns.