# Claude Code Configuration for JavaScript Projects

## 🚨 CRITICAL: JAVASCRIPT PARALLEL EXECUTION PATTERNS

**MANDATORY RULE**: JavaScript projects require Node.js ecosystem coordination with npm/yarn parallel operations.

## 🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL JAVASCRIPT OPERATIONS

**ABSOLUTE RULE**: ALL JavaScript operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS FOR JAVASCRIPT:

1. **Package Management**: ALWAYS batch ALL npm/yarn commands in ONE message
2. **File Operations**: ALWAYS batch ALL JS/JSON file operations together
3. **Testing**: ALWAYS run ALL test suites in parallel
4. **Build Operations**: ALWAYS batch ALL build/bundle/deploy operations
5. **Development Server**: ALWAYS start dev server WITH other operations

### ⚡ JAVASCRIPT GOLDEN RULE: "1 MESSAGE = ALL NODE.JS OPERATIONS"

**Examples of CORRECT JavaScript concurrent execution:**

```javascript
// ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all Node.js tasks] }
  - Task("You are Node.js architect. Coordinate via hooks for API design...")
  - Task("You are Frontend developer. Coordinate via hooks for UI components...")
  - Task("You are DevOps engineer. Coordinate via hooks for deployment...")
  - Bash("npm init -y")
  - Bash("npm install express mongoose cors helmet")
  - Bash("npm install --save-dev jest supertest nodemon eslint")
  - Write("package.json", packageContent)
  - Write("server.js", serverContent)
  - Write("routes/api.js", routesContent)
  - Write("middleware/auth.js", authContent)
  - Write("tests/api.test.js", testContent)
  - Write(".eslintrc.js", eslintConfig)
  - Write(".gitignore", gitignoreContent)
```

## 🎯 JAVASCRIPT-SPECIFIC SWARM PATTERNS

### 📦 Node.js Package Management Coordination

**Package Installation Strategy:**
```bash
# Always batch dependency installations
npm install express mongoose cors helmet jsonwebtoken bcryptjs
npm install --save-dev jest supertest nodemon eslint prettier husky
npm install --global pm2 # for production
```

**Parallel Development Setup:**
```javascript
// ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("npm init -y")
  - Bash("npm install express mongoose cors helmet dotenv")
  - Bash("npm install --save-dev jest nodemon eslint prettier")
  - Write("package.json", updatedPackageJson)
  - Write("server.js", expressServer)
  - Write(".env.example", envTemplate)
  - Write("nodemon.json", nodemonConfig)
  - Write(".eslintrc.js", eslintConfig)
  - Bash("npm run dev & npm run test")
```

### 🏗️ JavaScript Agent Specialization

**Agent Types for JavaScript Projects:**

1. **Backend API Agent** - Express.js, FastAPI, database integration
2. **Frontend Logic Agent** - Vanilla JS, DOM manipulation, async patterns
3. **Testing Agent** - Jest, Mocha, integration testing
4. **Build Agent** - Webpack, Rollup, Vite configuration
5. **DevOps Agent** - PM2, Docker, deployment automation

### 🧪 JavaScript Testing Coordination

**Parallel Testing Strategy:**
```javascript
// Test coordination pattern
[BatchTool]:
  - Write("tests/unit/auth.test.js", unitTests)
  - Write("tests/integration/api.test.js", integrationTests)
  - Write("tests/e2e/user-flow.test.js", e2eTests)
  - Write("jest.config.js", jestConfig)
  - Bash("npm test -- --coverage --watchAll=false")
  - Bash("npm run test:integration")
  - Bash("npm run test:e2e")
```

### ⚡ Performance Optimization Patterns

**JavaScript Performance Coordination:**
```javascript
// Performance optimization batch
[BatchTool]:
  - Write("middleware/compression.js", compressionMiddleware)
  - Write("utils/cache.js", cacheUtilities)
  - Write("config/database.js", dbOptimization)
  - Bash("npm install compression redis cluster")
  - Bash("npm run build:production")
  - Bash("npm run analyze:bundle")
```

## 📋 JAVASCRIPT PROJECT TEMPLATES

### 🌐 Express.js API Template

**Swarm Initialization for Express API:**
```javascript
// Initialize Express API swarm
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 6,
  strategy: "parallel"
})

// Spawn specialized agents
mcp__claude-flow__agent_spawn({ type: "architect", name: "API Designer" })
mcp__claude-flow__agent_spawn({ type: "coder", name: "Express Developer" })
mcp__claude-flow__agent_spawn({ type: "coder", name: "Database Expert" })
mcp__claude-flow__agent_spawn({ type: "tester", name: "API Tester" })
mcp__claude-flow__agent_spawn({ type: "reviewer", name: "Security Auditor" })
mcp__claude-flow__agent_spawn({ type: "coordinator", name: "DevOps Lead" })
```

**Express.js Project Structure:**
```
project/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── config/
├── docs/
└── scripts/
```

### 🎨 Frontend JavaScript Template

**Frontend Development Coordination:**
```javascript
// Frontend-focused swarm
[BatchTool]:
  - Write("src/js/main.js", mainAppLogic)
  - Write("src/js/components/header.js", headerComponent)
  - Write("src/js/services/api.js", apiService)
  - Write("src/js/utils/helpers.js", utilityFunctions)
  - Write("src/css/styles.css", mainStyles)
  - Write("index.html", htmlTemplate)
  - Bash("npm install webpack webpack-cli webpack-dev-server")
  - Bash("npm run build && npm run dev")
```

## 🔧 JAVASCRIPT BUILD TOOLS COORDINATION

### 📦 Webpack Configuration

**Webpack Swarm Pattern:**
```javascript
// Webpack build optimization
[BatchTool]:
  - Write("webpack.config.js", webpackConfig)
  - Write("webpack.prod.js", productionConfig)
  - Write("webpack.dev.js", developmentConfig)
  - Bash("npm install webpack-bundle-analyzer terser-webpack-plugin")
  - Bash("npm run build:analyze")
  - Bash("npm run build:production")
```

### 🎯 Modern JavaScript (ES6+) Patterns

**ES6+ Development Coordination:**
```javascript
// Modern JavaScript features batch
[BatchTool]:
  - Write("src/modules/async-operations.js", asyncAwaitPatterns)
  - Write("src/modules/destructuring.js", destructuringExamples)
  - Write("src/modules/classes.js", classDefinitions)
  - Write("src/modules/modules.js", esModulePatterns)
  - Write("babel.config.js", babelConfiguration)
  - Bash("npm install @babel/core @babel/preset-env")
```

## 🔒 JAVASCRIPT SECURITY BEST PRACTICES

### 🛡️ Security Coordination Patterns

**Security Implementation Batch:**
```javascript
[BatchTool]:
  - Write("middleware/security.js", securityMiddleware)
  - Write("utils/validation.js", inputValidation)
  - Write("utils/sanitization.js", dataSanitization)
  - Bash("npm install helmet joi bcryptjs jsonwebtoken")
  - Bash("npm install --save-dev eslint-plugin-security")
  - Bash("npm audit fix")
```

**Security Checklist for JavaScript:**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- Secure headers (Helmet.js)
- Environment variable protection
- Dependency vulnerability scanning

## 📊 JAVASCRIPT MONITORING AND LOGGING

### 📈 Performance Monitoring

**Monitoring Setup Coordination:**
```javascript
[BatchTool]:
  - Write("utils/logger.js", winstonLogger)
  - Write("middleware/metrics.js", performanceMetrics)
  - Write("config/monitoring.js", monitoringConfig)
  - Bash("npm install winston pino express-rate-limit")
  - Bash("npm install --save-dev clinic autocannon")
```

## 🚀 JAVASCRIPT DEPLOYMENT PATTERNS

### ⚙️ Production Deployment

**Deployment Coordination:**
```javascript
[BatchTool]:
  - Write("Dockerfile", dockerConfiguration)
  - Write("docker-compose.yml", dockerCompose)
  - Write("ecosystem.config.js", pm2Config)
  - Write("scripts/deploy.sh", deploymentScript)
  - Bash("npm run build:production")
  - Bash("docker build -t app:latest .")
  - Bash("npm run test:production")
```

## 🔄 JAVASCRIPT CI/CD COORDINATION

### 🏗️ GitHub Actions for JavaScript

**CI/CD Pipeline Batch:**
```javascript
[BatchTool]:
  - Write(".github/workflows/ci.yml", githubActions)
  - Write(".github/workflows/deploy.yml", deploymentWorkflow)
  - Write("scripts/test.sh", testScript)
  - Write("scripts/build.sh", buildScript)
  - Bash("npm run lint && npm run test && npm run build")
```

## 💡 JAVASCRIPT BEST PRACTICES

### 📝 Code Quality Standards

1. **ESLint Configuration**: Enforce consistent code style
2. **Prettier Integration**: Automatic code formatting
3. **Husky Hooks**: Pre-commit quality checks
4. **Jest Testing**: Comprehensive test coverage
5. **JSDoc Comments**: Proper code documentation
6. **Error Handling**: Robust error management patterns

### 🎯 Performance Optimization

1. **Async/Await**: Proper asynchronous programming
2. **Lazy Loading**: Dynamic imports and code splitting
3. **Caching Strategies**: Redis, memory caching
4. **Database Optimization**: Connection pooling, indexing
5. **Bundle Optimization**: Tree shaking, minification
6. **Memory Management**: Avoiding memory leaks

## 📚 JAVASCRIPT LEARNING RESOURCES

### 🎓 Recommended Topics

1. **Modern JavaScript**: ES6+, async programming, modules
2. **Node.js**: Server-side development, npm ecosystem
3. **Express.js**: Web framework, middleware, routing
4. **Database Integration**: MongoDB, PostgreSQL, Redis
5. **Testing**: Jest, Mocha, integration testing
6. **DevOps**: Docker, PM2, deployment strategies

---

**Remember**: JavaScript swarms excel with parallel npm operations, concurrent testing, and coordinated build processes. Always batch package management and leverage Node.js ecosystem tools for optimal performance.