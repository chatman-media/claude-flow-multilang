# 🧪 CLAUDE.md Template - Test-Driven Development (TDD)

## 🚨 CRITICAL: TDD PARALLEL EXECUTION

**MANDATORY RULE**: In TDD workflows, ALL test and implementation cycles MUST be parallel where possible:

### 🔴 TDD-SPECIFIC CONCURRENT PATTERNS:

1. **Parallel Test Writing**: Create multiple failing tests simultaneously
2. **Concurrent Implementation**: Implement multiple features to pass tests in parallel
3. **Batch Refactoring**: Refactor multiple components simultaneously after green phase
4. **Parallel Test Suites**: Run unit, integration, and e2e tests concurrently
5. **Simultaneous Documentation**: Update docs and tests in parallel

### ⚡ TDD GOLDEN RULE: "RED-GREEN-REFACTOR IN PARALLEL BATCHES"

**✅ CORRECT TDD Pattern:**

```javascript
// RED PHASE - Write failing tests in parallel
[BatchTool - RED Phase]:
  - Write("tests/unit/auth.test.js", failingAuthTests)
  - Write("tests/unit/user.test.js", failingUserTests)
  - Write("tests/unit/payment.test.js", failingPaymentTests)
  - Write("tests/integration/api.test.js", failingIntegrationTests)
  - Bash("npm test -- --watch-all=false") // Verify all tests fail

// GREEN PHASE - Implement in parallel
[BatchTool - GREEN Phase]:  
  - Write("src/auth/authService.js", minimalAuthImplementation)
  - Write("src/users/userService.js", minimalUserImplementation)
  - Write("src/payments/paymentService.js", minimalPaymentImplementation)
  - Write("src/api/routes.js", minimalApiRoutes)
  - Bash("npm test -- --watch-all=false") // Verify all tests pass

// REFACTOR PHASE - Improve in parallel
[BatchTool - REFACTOR Phase]:
  - Edit("src/auth/authService.js", refactoredAuthCode)
  - Edit("src/users/userService.js", refactoredUserCode)
  - Edit("src/payments/paymentService.js", refactoredPaymentCode)
  - Edit("src/api/routes.js", refactoredApiCode)
  - Bash("npm test -- --watch-all=false") // Verify tests still pass
```

## 🎯 TDD PROJECT CONTEXT

### Development Philosophy
- **🔴 Red**: Write failing tests first (define behavior)
- **🟢 Green**: Write minimal code to pass tests (make it work)
- **🔄 Refactor**: Improve code while keeping tests green (make it clean)
- **📊 Coverage**: Maintain 95%+ test coverage
- **🧪 Testing Pyramid**: Unit > Integration > E2E tests

### Testing Stack
- **Unit Testing**: Jest/Vitest + Testing Library
- **Integration Testing**: Supertest + Test Containers
- **E2E Testing**: Playwright/Cypress
- **Mocking**: MSW (Mock Service Worker)
- **Coverage**: Istanbul/c8

## 🔧 TDD DEVELOPMENT PATTERNS

### Test-First File Structure

```javascript
// Always create test files before implementation
project/
├── src/
│   ├── components/          // Implementation files
│   ├── services/           // Business logic
│   ├── utils/              // Utility functions  
│   └── types/              // Type definitions
├── tests/
│   ├── unit/               // Unit tests (create first)
│   │   ├── components/     // Component tests
│   │   ├── services/       // Service tests
│   │   └── utils/          // Utility tests
│   ├── integration/        // Integration tests
│   ├── e2e/               // End-to-end tests
│   └── fixtures/          // Test data
├── __mocks__/             // Manual mocks
└── jest.config.js         // Test configuration
```

### TDD Cycle Implementation

```javascript
// Parallel TDD cycle execution
[BatchTool - Complete TDD Cycle]:
  // 1. RED: Write failing tests
  - Write("tests/unit/userAuth.test.js", `
    describe('User Authentication', () => {
      test('should authenticate valid user', async () => {
        const result = await authenticateUser('valid@email.com', 'password');
        expect(result.success).toBe(true);
        expect(result.token).toBeDefined();
      });
      
      test('should reject invalid credentials', async () => {
        const result = await authenticateUser('invalid@email.com', 'wrong');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid credentials');
      });
    });
  `)
  
  // 2. GREEN: Minimal implementation
  - Write("src/auth/authenticateUser.js", `
    export async function authenticateUser(email, password) {
      // Minimal implementation to pass tests
      if (email === 'valid@email.com' && password === 'password') {
        return { success: true, token: 'fake-jwt-token' };
      }
      return { success: false, error: 'Invalid credentials' };
    }
  `)
  
  // 3. REFACTOR: Improve implementation
  - Edit("src/auth/authenticateUser.js", `
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import { findUserByEmail } from '../users/userRepository.js';
    
    export async function authenticateUser(email, password) {
      const user = await findUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { success: true, token };
    }
  `)
  
  // 4. Run tests to ensure refactor didn't break anything
  - Bash("npm test -- --coverage")
```

## 🐝 TDD SWARM ORCHESTRATION

### TDD-Specialized Agent Roles

```yaml
test_designer:
  role: Test Specification Designer
  focus: [test-cases, edge-cases, behavior-specification]
  responsibilities:
    - Design comprehensive test suites
    - Identify edge cases and boundary conditions
    - Create test data and fixtures
  concurrent_tasks: [multiple-test-suites, edge-case-analysis]

red_phase_agent:
  role: Failing Test Creator
  focus: [failing-tests, test-first-development]
  responsibilities:
    - Write failing tests that define expected behavior
    - Ensure tests fail for the right reasons
    - Create test doubles and mocks
  concurrent_tasks: [multiple-failing-tests, mock-setup]

green_phase_agent:
  role: Minimal Implementation Creator
  focus: [minimal-code, pass-tests, quick-implementation]
  responsibilities:
    - Write minimal code to pass tests
    - Avoid over-engineering in green phase
    - Focus on making tests pass quickly
  concurrent_tasks: [multiple-implementations, simple-solutions]

refactor_agent:
  role: Code Quality Improver
  focus: [clean-code, design-patterns, optimization]
  responsibilities:
    - Improve code quality while keeping tests green
    - Apply design patterns and best practices
    - Optimize performance and maintainability
  concurrent_tasks: [multiple-refactors, pattern-application]

coverage_analyst:
  role: Test Coverage Monitor
  focus: [coverage-analysis, gap-identification, quality-metrics]
  responsibilities:
    - Monitor test coverage metrics
    - Identify untested code paths
    - Ensure comprehensive test suites
  concurrent_tasks: [coverage-analysis, gap-reporting]
```

### TDD Topology Recommendation

```bash
# For TDD projects - use mesh topology for collaborative testing
claude-flow hive init --topology mesh --agents 5

# Agent distribution:
# - 1 Test Designer (test specification)
# - 1 Red Phase Agent (failing tests)
# - 1 Green Phase Agent (minimal implementation)
# - 1 Refactor Agent (code improvement)
# - 1 Coverage Analyst (quality assurance)
```

## 🧠 TDD MEMORY MANAGEMENT

### Test-Driven Context Storage

```javascript
// Store TDD-specific project context
tdd_memory_patterns: {
  "tdd/testing-strategy": "Unit-first with 95% coverage target",
  "tdd/test-framework": "Jest with Testing Library for React components",
  "tdd/mocking-strategy": "MSW for API mocking, jest.fn() for unit mocks",
  "tdd/coverage-threshold": "95% lines, 90% branches, 95% functions",
  "tdd/test-data-strategy": "Factory functions with realistic test data",
  "tdd/ci-integration": "Tests run on every commit, coverage gate at 95%"
}
```

### TDD Cycle Tracking

```javascript
// Track TDD cycles and decisions
tdd_cycles: {
  "cycle_001_user_auth": {
    "red_phase": {
      "tests_written": ["auth_valid_user", "auth_invalid_user", "auth_missing_fields"],
      "expected_failures": 3,
      "actual_failures": 3,
      "status": "completed"
    },
    "green_phase": {
      "implementation_approach": "minimal hardcoded responses",
      "tests_passing": 3,
      "time_to_green": "15 minutes",
      "status": "completed"
    },
    "refactor_phase": {
      "improvements": ["added bcrypt", "added jwt", "added user lookup"],
      "patterns_applied": ["repository pattern", "error handling"],
      "final_test_status": "all passing",
      "status": "completed"
    }
  }
}
```

## 🚀 TDD CI/CD PIPELINE

### Test-First Pipeline (Parallel Execution)

```yaml
# TDD-focused CI/CD pipeline
tdd_pipeline:
  quality_gates:
    - name: "Test Coverage Gate"
      threshold: "95%"
      action: "fail_build_if_below"
    
    - name: "Test Pass Rate"
      threshold: "100%"
      action: "fail_build_if_below"
    
    - name: "No Skipped Tests"
      threshold: "0"
      action: "fail_build_if_above"

  parallel_stages:
    unit_tests:
      - "npm run test:unit -- --coverage"
      - "npm run test:unit:watch -- --watchAll=false"
    
    integration_tests:
      - "npm run test:integration"
      - "docker-compose up -d test-db"
    
    e2e_tests:
      - "npm run test:e2e"
      - "npm run test:e2e:mobile"
    
    static_analysis:
      - "npm run lint"
      - "npm run type-check"
      - "npm run test:mutation" # Mutation testing
```

### TDD Environment Setup

```bash
# Development environment for TDD
NODE_ENV=test
TEST_DATABASE_URL=postgresql://localhost:5432/app_test
TEST_REDIS_URL=redis://localhost:6379/1
ENABLE_TEST_COVERAGE=true
MUTATION_TESTING=false # Enable for deeper quality checks

# CI environment
NODE_ENV=test
COVERAGE_THRESHOLD=95
PARALLEL_TESTS=true
TEST_TIMEOUT=30000
```

## 📊 TDD MONITORING & METRICS

### Test Quality Metrics

```javascript
// TDD quality tracking
test_metrics: {
  coverage: {
    lines: ">=95%",
    branches: ">=90%", 
    functions: ">=95%",
    statements: ">=95%"
  },
  
  test_quality: {
    mutation_score: ">=80%", // Mutation testing score
    test_to_code_ratio: "1:1 to 2:1", // Lines of test vs implementation
    assertion_density: ">=3 per test", // Assertions per test
    test_execution_time: "<30s for unit tests"
  },
  
  tdd_adherence: {
    red_green_cycles: "tracked per feature",
    test_first_percentage: ">=95%",
    refactor_frequency: "every green phase",
    coverage_trend: "always increasing"
  }
}
```

### Test Reporting

```javascript
// Comprehensive test reporting
test_reporting: {
  coverage_report: "HTML + JSON for CI integration",
  test_results: "JUnit XML for CI systems",
  mutation_testing: "Stryker reports for test quality",
  performance: "Test execution time tracking",
  flaky_tests: "Automatic detection and reporting"
}
```

## 🔒 TDD SECURITY & TESTING

### Security-First Testing

```javascript
// Security testing in TDD cycles
security_tdd_patterns: {
  input_validation: "Test invalid inputs before implementing validation",
  authentication: "Test auth failures before implementing auth logic",
  authorization: "Test permission denials before implementing permissions",
  sql_injection: "Test malicious inputs before implementing queries",
  xss_prevention: "Test script injection before implementing output encoding",
  rate_limiting: "Test excessive requests before implementing rate limits"
}
```

### Security Test Examples

```javascript
// Example security-focused TDD
[BatchTool - Security TDD]:
  - Write("tests/security/auth.test.js", `
    describe('Authentication Security', () => {
      test('should prevent SQL injection in login', async () => {
        const maliciousInput = "'; DROP TABLE users; --";
        const result = await authenticateUser(maliciousInput, 'password');
        expect(result.success).toBe(false);
        // Verify database integrity
        const userCount = await countUsers();
        expect(userCount).toBeGreaterThan(0);
      });
      
      test('should rate limit login attempts', async () => {
        // Attempt 100 logins rapidly
        const attempts = Array(100).fill().map(() => 
          authenticateUser('test@example.com', 'wrong-password')
        );
        const results = await Promise.all(attempts);
        
        // Should start getting rate limited
        const rateLimitedAttempts = results.filter(r => r.error === 'Rate limited');
        expect(rateLimitedAttempts.length).toBeGreaterThan(0);
      });
    });
  `)
  
  // Implement security measures to pass tests
  - Write("src/auth/rateLimiter.js", rateLimiterImplementation)
  - Write("src/auth/inputValidator.js", inputValidatorImplementation)
```

## 🧪 ADVANCED TDD TECHNIQUES

### Property-Based Testing

```javascript
// Property-based testing integration
[BatchTool - Property Testing]:
  - Write("tests/property/validation.test.js", `
    import fc from 'fast-check';
    import { validateEmail } from '../src/utils/validation.js';
    
    describe('Email Validation Properties', () => {
      test('should never crash on any string input', () => {
        fc.assert(fc.property(fc.string(), (input) => {
          expect(() => validateEmail(input)).not.toThrow();
        }));
      });
      
      test('valid emails should always return true', () => {
        fc.assert(fc.property(fc.emailAddress(), (email) => {
          expect(validateEmail(email)).toBe(true);
        }));
      });
    });
  `)
```

### Mutation Testing Integration

```javascript
// Mutation testing for test quality
mutation_testing: {
  framework: "Stryker",
  threshold: "80%", // Minimum mutation score
  mutators: [
    "ArithmeticOperator",
    "BlockStatement", 
    "BooleanLiteral",
    "ConditionalExpression",
    "EqualityOperator",
    "LogicalOperator",
    "UnaryOperator"
  ],
  exclude_patterns: [
    "**/*.test.js",
    "**/node_modules/**",
    "**/coverage/**"
  ]
}
```

### Snapshot Testing Strategy

```javascript
// Strategic snapshot testing
snapshot_strategy: {
  components: "Only for stable UI components",
  apis: "For consistent API response structures", 
  configurations: "For complex config objects",
  update_policy: "Review all snapshot changes in PR",
  avoid: "Don't snapshot frequently changing data"
}
```

## 🎯 TDD BEST PRACTICES

### Test Design Principles

```javascript
// FIRST principles for TDD tests
test_principles: {
  Fast: "Unit tests run in milliseconds",
  Independent: "Tests don't depend on each other",
  Repeatable: "Same results in any environment", 
  Self_Validating: "Tests have boolean outcome",
  Timely: "Tests written before production code"
}

// Given-When-Then structure
test_structure: {
  Given: "Set up test conditions and data",
  When: "Execute the behavior being tested",
  Then: "Assert the expected outcome"
}
```

### Common TDD Anti-Patterns to Avoid

```javascript
// Avoid these TDD mistakes
tdd_antipatterns: {
  "Testing Implementation Details": "Test behavior, not internal structure",
  "Overly Complex Tests": "Keep tests simple and focused",
  "Skipping Red Phase": "Always see tests fail first",
  "Testing Everything": "Focus on behavior, not coverage percentage",
  "Slow Tests": "Keep unit tests fast (<1s total)",
  "Brittle Tests": "Avoid over-mocking and tight coupling"
}
```

---

## 📚 Related TDD Resources

- **[SPARC Methodology](SPARC-Methodology)** - TDD within SPARC development
- **[JavaScript Testing](CLAUDE-MD-JavaScript)** - JS-specific TDD patterns
- **[API Testing](CLAUDE-MD-API-Development)** - API-focused TDD
- **[High Performance](CLAUDE-MD-High-Performance)** - Performance testing in TDD

---

**🧪 TDD Success**: This template ensures rigorous test-driven development with parallel execution, comprehensive coverage, and maintainable test suites that drive high-quality code design.