# Claude Code Configuration for TypeScript Projects

## 🚨 CRITICAL: TYPESCRIPT PARALLEL EXECUTION PATTERNS

**MANDATORY RULE**: TypeScript projects require strict type checking coordination with tsc/build parallel operations.

## 🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL TYPESCRIPT OPERATIONS

**ABSOLUTE RULE**: ALL TypeScript operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS FOR TYPESCRIPT:

1. **Type Compilation**: ALWAYS batch ALL tsc compilation in ONE message
2. **Package Management**: ALWAYS batch ALL npm/yarn operations with TypeScript
3. **Testing**: ALWAYS run ALL Jest/Vitest suites with type checking
4. **Linting**: ALWAYS batch ALL ESLint/Prettier operations
5. **Build Operations**: ALWAYS batch ALL bundling/transpilation

### ⚡ TYPESCRIPT GOLDEN RULE: "1 MESSAGE = ALL TYPE-SAFE OPERATIONS"

**Examples of CORRECT TypeScript concurrent execution:**

```typescript
// ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all TypeScript tasks] }
  - Task("You are TypeScript architect. Coordinate via hooks for type design...")
  - Task("You are Frontend developer. Coordinate via hooks for React+TS...")
  - Task("You are Backend developer. Coordinate via hooks for Node.js+TS...")
  - Bash("npm init -y && npm install typescript @types/node")
  - Bash("npm install --save-dev jest @types/jest ts-jest eslint @typescript-eslint/parser")
  - Bash("tsc --init")
  - Write("tsconfig.json", typescriptConfig)
  - Write("src/index.ts", mainApplication)
  - Write("src/types/api.ts", typeDefinitions)
  - Write("src/utils/helpers.ts", utilityFunctions)
  - Write("src/services/userService.ts", serviceLayer)
  - Write("tests/unit/userService.test.ts", unitTests)
  - Write("jest.config.js", jestConfiguration)
  - Bash("tsc --noEmit && npm test && npm run lint")
```

## 🎯 TYPESCRIPT-SPECIFIC SWARM PATTERNS

### 📘 TypeScript Configuration Coordination

**TypeScript Setup Strategy:**
```bash
# Always batch TypeScript setup
npm install typescript @types/node
tsc --init
tsc --noEmit  # Type checking only
tsc --build   # Project references
npm run type-check
```

**Parallel Development Setup:**
```typescript
// ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("npm init -y")
  - Bash("npm install typescript @types/node @types/express")
  - Bash("npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser")
  - Bash("tsc --init")
  - Write("tsconfig.json", strictTypescriptConfig)
  - Write("tsconfig.build.json", buildConfig)
  - Write("src/index.ts", applicationEntry)
  - Write("src/types/index.ts", typeExports)
  - Write("src/config/database.ts", configTypes)
  - Write("package.json", updatedPackageJson)
  - Bash("tsc --noEmit && npm run build")
```

### 🏗️ TypeScript Agent Specialization

**Agent Types for TypeScript Projects:**

1. **Type Designer Agent** - Interface design, generic types, advanced patterns
2. **Frontend TS Agent** - React, Vue, Angular with TypeScript
3. **Backend TS Agent** - Node.js, Express, NestJS with strict typing
4. **Testing Agent** - Jest, Vitest, Cypress with TypeScript
5. **Build Agent** - Webpack, Vite, esbuild configuration
6. **Quality Agent** - ESLint, Prettier, strict type checking

### 🔧 Advanced TypeScript Configuration

**Strict TypeScript Setup:**
```typescript
// TypeScript strict configuration
[BatchTool]:
  - Write("tsconfig.json", strictTsConfig)
  - Write("tsconfig.eslint.json", eslintTsConfig)
  - Write("src/types/global.d.ts", globalTypeDefinitions)
  - Write("src/types/api.ts", apiTypeDefinitions)
  - Write("src/types/models.ts", dataModelTypes)
  - Write("src/utils/typeGuards.ts", typeGuardFunctions)
  - Bash("tsc --strict --noEmit")
  - Bash("eslint src/**/*.ts --fix")
```

### 🎨 Frontend TypeScript Coordination

**React + TypeScript Setup:**
```typescript
// React TypeScript swarm
[BatchTool]:
  - Write("src/components/UserCard.tsx", typedReactComponent)
  - Write("src/hooks/useApi.ts", customHookWithTypes)
  - Write("src/types/props.ts", componentPropTypes)
  - Write("src/context/AppContext.tsx", typedContext)
  - Write("src/utils/api.ts", typedApiClient)
  - Bash("npm install @types/react @types/react-dom")
  - Bash("tsc --jsx preserve --noEmit")
```

## 🧪 TYPESCRIPT TESTING COORDINATION

### ⚡ Jest with TypeScript

**TypeScript Testing Setup:**
```typescript
// Test coordination pattern
[BatchTool]:
  - Write("jest.config.js", jestTypescriptConfig)
  - Write("tests/setup.ts", testSetup)
  - Write("tests/unit/userService.test.ts", serviceMockTests)
  - Write("tests/integration/api.test.ts", integrationTests)
  - Write("tests/types/typeTests.ts", typeValidationTests)
  - Write("tests/__mocks__/axios.ts", typedMocks)
  - Bash("npm test -- --coverage --watchAll=false")
  - Bash("npm run test:types")
```

### 🔬 Advanced Testing Patterns

**Type-Safe Testing Coordination:**
```typescript
[BatchTool]:
  - Write("tests/utils/testHelpers.ts", typedTestUtils)
  - Write("tests/fixtures/mockData.ts", typedMockData)
  - Write("tests/matchers/customMatchers.ts", customTypeMatchers)
  - Bash("npm run test:unit && npm run test:integration")
  - Bash("tsc --project tests/tsconfig.json --noEmit")
```

## 🏗️ TYPESCRIPT BUILD COORDINATION

### 📦 Webpack + TypeScript

**Webpack TypeScript Configuration:**
```typescript
// Webpack build coordination
[BatchTool]:
  - Write("webpack.config.js", webpackTypescriptConfig)
  - Write("webpack.dev.js", devConfiguration)
  - Write("webpack.prod.js", prodConfiguration)
  - Write("src/index.ts", webpackEntry)
  - Bash("npm install --save-dev webpack webpack-cli ts-loader")
  - Bash("npm run build:dev && npm run build:prod")
```

### ⚡ Vite + TypeScript

**Vite TypeScript Setup:**
```typescript
// Vite modern build system
[BatchTool]:
  - Write("vite.config.ts", viteTypescriptConfig)
  - Write("src/vite-env.d.ts", viteTypeDefinitions)
  - Write("src/main.ts", viteEntryPoint)
  - Bash("npm install --save-dev vite @vitejs/plugin-react")
  - Bash("npm run build && npm run preview")
```

## 🔧 TYPESCRIPT MONOREPO COORDINATION

### 📂 Project References

**TypeScript Monorepo Setup:**
```typescript
// Monorepo coordination pattern
[BatchTool]:
  - Write("tsconfig.json", rootTsConfig)
  - Write("packages/core/tsconfig.json", coreTsConfig)
  - Write("packages/ui/tsconfig.json", uiTsConfig)
  - Write("packages/api/tsconfig.json", apiTsConfig)
  - Write("packages/shared/tsconfig.json", sharedTsConfig)
  - Bash("tsc --build packages/core packages/shared packages/api packages/ui")
  - Bash("npm run build:all")
```

### 🔄 Lerna + TypeScript

**Lerna Monorepo Coordination:**
```typescript
[BatchTool]:
  - Write("lerna.json", lernaConfig)
  - Write("package.json", rootPackageJson)
  - Write("packages/*/package.json", packageConfigs)
  - Bash("lerna bootstrap")
  - Bash("lerna run build")
  - Bash("lerna run test")
```

## 🔒 TYPESCRIPT SECURITY COORDINATION

### 🛡️ Type-Safe Security Patterns

**Security Implementation Batch:**
```typescript
[BatchTool]:
  - Write("src/types/auth.ts", authenticationTypes)
  - Write("src/guards/authGuard.ts", typeGuardSecurity)
  - Write("src/validation/schemas.ts", inputValidationTypes)
  - Write("src/utils/sanitizer.ts", dataSanitizationTypes)
  - Write("src/middleware/validation.ts", validationMiddleware)
  - Bash("npm install zod joi @types/bcryptjs @types/jsonwebtoken")
  - Bash("tsc --strict --noEmit && npm run security-audit")
```

**TypeScript Security Checklist:**
- Strict type checking enabled
- Input validation with types
- Type-safe authentication
- Secure type definitions
- Runtime type validation
- Type-safe API contracts
- Secure environment variables typing
- Type-safe error handling

## ⚡ TYPESCRIPT PERFORMANCE OPTIMIZATION

### 🚀 Performance Coordination

**Performance Optimization Batch:**
```typescript
[BatchTool]:
  - Write("src/utils/performance.ts", performanceTypes)
  - Write("src/types/optimization.ts", optimizationTypes)
  - Write("tsconfig.performance.json", performanceTsConfig)
  - Write("src/workers/typedWorker.ts", webWorkerTypes)
  - Bash("tsc --incremental --tsBuildInfoFile .tsbuildinfo")
  - Bash("npm run build:performance")
```

### 🔄 Async/Await TypeScript Patterns

**Async Coordination:**
```typescript
[BatchTool]:
  - Write("src/types/async.ts", asyncTypeDefinitions)
  - Write("src/utils/promiseUtils.ts", typedPromiseUtilities)
  - Write("src/services/asyncService.ts", asyncServiceTypes)
  - Bash("tsc --lib es2020 --target es2020 --noEmit")
```

## 🌐 FULL-STACK TYPESCRIPT COORDINATION

### 🏗️ Node.js + TypeScript Backend

**Backend TypeScript Setup:**
```typescript
// Backend TypeScript coordination
[BatchTool]:
  - Write("src/server.ts", expressTypescriptServer)
  - Write("src/types/express.d.ts", expressTypeExtensions)
  - Write("src/middleware/errorHandler.ts", typedErrorHandling)
  - Write("src/controllers/userController.ts", typedControllers)
  - Write("src/services/databaseService.ts", typedDatabaseService)
  - Write("src/models/User.ts", typedDataModels)
  - Bash("npm install express @types/express")
  - Bash("tsc && node dist/server.js")
```

### ⚛️ React + TypeScript Frontend

**Frontend TypeScript Coordination:**
```typescript
// Frontend TypeScript batch
[BatchTool]:
  - Write("src/App.tsx", typedReactApp)
  - Write("src/components/UserList.tsx", typedComponent)
  - Write("src/hooks/useUsers.ts", typedCustomHook)
  - Write("src/types/user.ts", userTypeDefinitions)
  - Write("src/api/userApi.ts", typedApiLayer)
  - Write("src/store/userStore.ts", typedStateManagement)
  - Bash("npm install react @types/react react-dom @types/react-dom")
  - Bash("tsc --jsx react-jsx --noEmit")
```

## 📊 TYPESCRIPT CODE QUALITY COORDINATION

### 🎨 ESLint + Prettier Configuration

**Quality Tools Batch:**
```typescript
[BatchTool]:
  - Write(".eslintrc.js", typescriptEslintConfig)
  - Write("prettier.config.js", prettierTypescriptConfig)
  - Write(".editorconfig", editorConfig)
  - Write("husky.config.js", huskyHooks)
  - Write("lint-staged.config.js", lintStagedConfig)
  - Bash("npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin")
  - Bash("npm run lint:fix && npm run format")
```

### 📝 Documentation + Types

**Documentation Coordination:**
```typescript
[BatchTool]:
  - Write("docs/api.md", apiDocumentation)
  - Write("docs/types.md", typeDocumentation)
  - Write("src/types/documentation.ts", documentationTypes)
  - Bash("typedoc src --out docs/generated")
  - Bash("npm run docs:build")
```

## 🚀 TYPESCRIPT DEPLOYMENT PATTERNS

### ⚙️ Production Build Coordination

**Production Deployment:**
```typescript
[BatchTool]:
  - Write("Dockerfile", typescriptDockerfile)
  - Write("docker-compose.yml", dockerComposeTypescript)
  - Write("tsconfig.prod.json", productionTsConfig)
  - Write("scripts/build.sh", buildScript)
  - Write("scripts/deploy.sh", deployScript)
  - Bash("tsc --project tsconfig.prod.json")
  - Bash("npm run build:prod && npm run test:prod")
  - Bash("docker build -t typescript-app:latest .")
```

## 🔄 TYPESCRIPT CI/CD COORDINATION

### 🏗️ GitHub Actions for TypeScript

**CI/CD Pipeline Batch:**
```typescript
[BatchTool]:
  - Write(".github/workflows/typescript.yml", typescriptCI)
  - Write(".github/workflows/deploy.yml", deploymentWorkflow)
  - Write("scripts/ci-test.sh", ciTestScript)
  - Write("scripts/type-check.sh", typeCheckScript)
  - Bash("tsc --noEmit && npm run lint && npm test")
  - Bash("npm run build:prod")
```

## 💡 TYPESCRIPT BEST PRACTICES

### 📝 Type Safety Standards

1. **Strict Mode**: Enable all strict TypeScript options
2. **Interface Design**: Prefer interfaces over type aliases
3. **Generic Types**: Use generics for reusable components
4. **Type Guards**: Runtime type validation
5. **Utility Types**: Leverage built-in utility types
6. **Declaration Files**: Proper ambient declarations

### 🎯 Advanced TypeScript Patterns

1. **Conditional Types**: Complex type logic
2. **Mapped Types**: Transform existing types
3. **Template Literal Types**: String manipulation at type level
4. **Discriminated Unions**: Type-safe state management
5. **Module Augmentation**: Extend third-party types
6. **Brand Types**: Nominal typing patterns

## 📚 TYPESCRIPT LEARNING RESOURCES

### 🎓 Recommended Topics

1. **Core TypeScript**: Types, interfaces, generics
2. **Advanced Types**: Conditional, mapped, utility types
3. **React + TypeScript**: Component typing, hooks
4. **Node.js + TypeScript**: Server-side development
5. **Testing**: Jest, Vitest with TypeScript
6. **Build Tools**: Webpack, Vite, esbuild

### 🔧 Essential Tools

1. **Compilers**: tsc, Babel, SWC, esbuild
2. **Bundlers**: Webpack, Vite, Rollup, Parcel
3. **Testing**: Jest, Vitest, Cypress, Playwright
4. **Quality**: ESLint, Prettier, TypeDoc
5. **IDEs**: VS Code, WebStorm, Vim with CoC
6. **Type Checking**: tsc, ts-node, tsx

### 🌟 Advanced Features

1. **Project References**: Monorepo type checking
2. **Incremental Compilation**: Faster builds
3. **Composite Projects**: Build dependencies
4. **Path Mapping**: Clean import statements
5. **Declaration Maps**: Better debugging
6. **Type-Only Imports**: Optimize bundle size

---

**Remember**: TypeScript swarms excel with strict type checking, parallel compilation, and type-safe coordination. Always batch tsc operations and leverage TypeScript's powerful type system for robust, maintainable applications.