# Claude Code Configuration for Rust Projects

## 🚨 CRITICAL: RUST PARALLEL EXECUTION PATTERNS

**MANDATORY RULE**: Rust projects require memory-safe coordination with Cargo parallel compilation and ownership management.

## 🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL RUST OPERATIONS

**ABSOLUTE RULE**: ALL Rust operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS FOR RUST:

1. **Cargo Operations**: ALWAYS batch ALL cargo build/test/run commands
2. **Crate Management**: ALWAYS batch ALL dependency installations
3. **Testing**: ALWAYS run ALL test suites in parallel with cargo test
4. **Memory Safety**: ALWAYS batch ALL borrowing/ownership patterns
5. **Concurrency**: ALWAYS batch ALL async/threading implementations

### ⚡ RUST GOLDEN RULE: "1 MESSAGE = ALL MEMORY-SAFE OPERATIONS"

**Examples of CORRECT Rust concurrent execution:**

```rust
// ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all Rust tasks] }
  - Task("You are Rust architect. Coordinate via hooks for ownership design...")
  - Task("You are Systems programmer. Coordinate via hooks for performance...")
  - Task("You are Safety engineer. Coordinate via hooks for memory safety...")
  - Bash("cargo new my-rust-app --bin")
  - Bash("cd my-rust-app && cargo add serde tokio reqwest")
  - Bash("cd my-rust-app && cargo add --dev proptest criterion")
  - Write("Cargo.toml", cargoConfiguration)
  - Write("src/main.rs", mainApplication)
  - Write("src/lib.rs", libraryModule)
  - Write("src/models/user.rs", userStruct)
  - Write("src/services/api.rs", apiService)
  - Write("src/utils/helpers.rs", utilityFunctions)
  - Write("tests/integration_test.rs", integrationTests)
  - Bash("cd my-rust-app && cargo build && cargo test && cargo run")
```

## 🎯 RUST-SPECIFIC SWARM PATTERNS

### 🦀 Cargo Project Coordination

**Rust Project Setup Strategy:**
```bash
# Always batch Cargo operations
cargo new my-app --bin
cargo add serde serde_json tokio
cargo add --dev proptest criterion
cargo build --release
cargo test
```

**Parallel Development Setup:**
```rust
// ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("cargo new rust-project --bin")
  - Bash("cd rust-project && cargo add serde serde_json tokio reqwest")
  - Bash("cd rust-project && cargo add --dev proptest criterion mockall")
  - Write("Cargo.toml", optimizedCargoToml)
  - Write("src/main.rs", asyncMainFunction)
  - Write("src/lib.rs", libraryRoot)
  - Write("src/config.rs", configurationModule)
  - Write("src/error.rs", errorHandlingTypes)
  - Write("src/models/mod.rs", modelsModule)
  - Write("tests/common/mod.rs", testUtilities)
  - Bash("cd rust-project && cargo build && cargo clippy && cargo test")
```

### 🏗️ Rust Agent Specialization

**Agent Types for Rust Projects:**

1. **Systems Architect Agent** - Memory management, ownership patterns
2. **Performance Engineer Agent** - Zero-cost abstractions, optimization
3. **Safety Specialist Agent** - Borrow checker, lifetime management
4. **Concurrency Expert Agent** - Async/await, threading, channels
5. **Testing Agent** - Unit tests, integration tests, property testing
6. **Ecosystem Agent** - Crate selection, FFI, WebAssembly

### 🔧 Memory Safety Coordination

**Ownership and Borrowing Patterns:**
```rust
// Memory safety coordination
[BatchTool]:
  - Write("src/ownership/smart_pointers.rs", smartPointerExamples)
  - Write("src/ownership/lifetimes.rs", lifetimePatterns)
  - Write("src/ownership/borrowing.rs", borrowingExamples)
  - Write("src/memory/allocator.rs", customAllocatorUsage)
  - Write("src/safety/invariants.rs", safetyInvariants)
  - Write("tests/memory_safety.rs", memorySafetyTests)
  - Bash("cargo build && cargo miri test")
```

### ⚡ Async/Concurrency Coordination

**Tokio Async Runtime Setup:**
```rust
// Async coordination pattern
[BatchTool]:
  - Write("src/async/runtime.rs", tokioRuntimeConfig)
  - Write("src/async/tasks.rs", asyncTaskHandling)
  - Write("src/async/channels.rs", channelCommunication)
  - Write("src/async/streams.rs", asyncStreamProcessing)
  - Write("src/network/client.rs", asyncHttpClient)
  - Write("src/network/server.rs", asyncWebServer)
  - Write("tests/async_tests.rs", asyncTestCases)
  - Bash("cargo test --features async")
```

## 🧪 RUST TESTING COORDINATION

### ⚡ Comprehensive Testing Strategy

**Testing Setup:**
```rust
// Test coordination pattern
[BatchTool]:
  - Write("tests/integration_test.rs", integrationTests)
  - Write("tests/common/mod.rs", testUtilities)
  - Write("src/lib.rs", unitTestsInline)
  - Write("benches/benchmark.rs", criterionBenchmarks)
  - Write("proptest-regressions/", propertyTestRegressions)
  - Write("tests/property_tests.rs", proptestCases)
  - Bash("cargo test --all-features")
  - Bash("cargo bench")
  - Bash("cargo test --doc")
```

### 🔬 Property Testing and Fuzzing

**Advanced Testing Coordination:**
```rust
[BatchTool]:
  - Write("fuzz/fuzz_targets/fuzz_parser.rs", fuzzingTargets)
  - Write("tests/quickcheck_tests.rs", quickcheckTests)
  - Write("tests/model_based_tests.rs", modelBasedTesting)
  - Bash("cargo fuzz run fuzz_parser")
  - Bash("cargo test --features property-testing")
```

## 🚀 RUST PERFORMANCE COORDINATION

### ⚡ Performance Optimization

**Performance Enhancement Batch:**
```rust
[BatchTool]:
  - Write("src/performance/simd.rs", simdOptimizations)
  - Write("src/performance/zero_copy.rs", zeroCopyPatterns)
  - Write("src/performance/cache_friendly.rs", cacheOptimization)
  - Write("src/performance/profiling.rs", profilingIntegration)
  - Write("benches/performance_bench.rs", performanceBenchmarks)
  - Write("Cargo.toml", releaseOptimizations)
  - Bash("cargo build --release")
  - Bash("cargo bench --all-features")
  - Bash("perf record cargo run --release")
```

### 🔄 Parallel Processing

**Rayon Parallel Coordination:**
```rust
// Parallel processing batch
[BatchTool]:
  - Write("src/parallel/rayon_examples.rs", rayonParallelization)
  - Write("src/parallel/custom_threadpool.rs", customThreadPool)
  - Write("src/parallel/work_stealing.rs", workStealingQueues)
  - Write("src/data/parallel_processing.rs", parallelDataProcessing)
  - Bash("cargo add rayon crossbeam")
  - Bash("cargo test parallel_")
```

## 🌐 RUST WEB DEVELOPMENT COORDINATION

### 🕸️ Web Framework Integration

**Axum/Warp Web Service Setup:**
```rust
// Web development coordination
[BatchTool]:
  - Write("src/web/server.rs", axumWebServer)
  - Write("src/web/handlers.rs", requestHandlers)
  - Write("src/web/middleware.rs", customMiddleware)
  - Write("src/web/routes.rs", routingConfiguration)
  - Write("src/database/connection.rs", databaseIntegration)
  - Write("src/models/schema.rs", databaseSchema)
  - Write("migrations/001_initial.sql", databaseMigrations)
  - Bash("cargo add axum tokio tower sqlx")
  - Bash("cargo run --bin server")
```

### 🗄️ Database Integration

**SQLx Database Coordination:**
```rust
// Database integration batch
[BatchTool]:
  - Write("src/database/models.rs", databaseModels)
  - Write("src/database/queries.rs", sqlQueries)
  - Write("src/database/migrations.rs", schemaMigrations)
  - Write("src/database/connection_pool.rs", connectionPooling)
  - Write("tests/database_tests.rs", databaseTests)
  - Bash("cargo add sqlx --features runtime-tokio-rustls,postgres")
  - Bash("sqlx migrate run")
```

## 🔒 RUST SECURITY COORDINATION

### 🛡️ Security Best Practices

**Security Implementation Batch:**
```rust
[BatchTool]:
  - Write("src/security/crypto.rs", cryptographicOperations)
  - Write("src/security/validation.rs", inputValidation)
  - Write("src/security/auth.rs", authenticationLogic)
  - Write("src/security/sanitization.rs", dataSanitization)
  - Write("src/security/secrets.rs", secretsManagement)
  - Write("audit.toml", cargoAuditConfig)
  - Bash("cargo add ring argon2 jsonwebtoken")
  - Bash("cargo audit")
  - Bash("cargo deny check")
```

**Rust Security Checklist:**
- Memory safety by design
- Integer overflow protection
- Secure random number generation
- Constant-time cryptographic operations
- Input validation and sanitization
- Dependency vulnerability scanning
- Safe FFI interfaces
- Secure compilation flags

## 🔧 RUST BUILD COORDINATION

### 📦 Cargo Advanced Configuration

**Advanced Cargo Setup:**
```rust
// Advanced build coordination
[BatchTool]:
  - Write("Cargo.toml", advancedCargoConfig)
  - Write(".cargo/config.toml", cargoLocalConfig)
  - Write("build.rs", buildScript)
  - Write("Cross.toml", crossCompilationConfig)
  - Write("Dockerfile", rustDockerfile)
  - Bash("cargo build --target x86_64-unknown-linux-musl")
  - Bash("cross build --target aarch64-unknown-linux-gnu")
```

### 🎯 WebAssembly Coordination

**WASM Integration Setup:**
```rust
// WebAssembly coordination
[BatchTool]:
  - Write("src/wasm/lib.rs", wasmBindings)
  - Write("src/js/wasm_interface.js", jsWasmInterface)
  - Write("pkg/package.json", wasmPackageJson)
  - Write("webpack.config.js", wasmWebpackConfig)
  - Bash("cargo add wasm-bindgen web-sys js-sys")
  - Bash("wasm-pack build --target web")
  - Bash("npm run serve")
```

## 🚀 RUST DEPLOYMENT COORDINATION

### ⚙️ Production Deployment

**Deployment Configuration:**
```rust
[BatchTool]:
  - Write("Dockerfile", optimizedRustDockerfile)
  - Write("docker-compose.yml", dockerComposeRust)
  - Write("k8s/deployment.yaml", kubernetesDeployment)
  - Write("scripts/deploy.sh", deploymentScript)
  - Write("systemd/rust-service.service", systemdService)
  - Bash("cargo build --release --target x86_64-unknown-linux-musl")
  - Bash("docker build -t rust-app:latest .")
  - Bash("kubectl apply -f k8s/")
```

### 📦 Distribution and Packaging

**Crate Publishing Coordination:**
```rust
[BatchTool]:
  - Write("README.md", crateDocumentation)
  - Write("CHANGELOG.md", versionHistory)
  - Write("LICENSE", licenseFile)
  - Write("src/lib.rs", publicApiDocumentation)
  - Write("examples/basic_usage.rs", usageExamples)
  - Bash("cargo doc --open")
  - Bash("cargo package --dry-run")
  - Bash("cargo publish --dry-run")
```

## 📊 RUST CODE QUALITY COORDINATION

### 🎨 Code Quality Tools

**Quality Toolchain Batch:**
```rust
[BatchTool]:
  - Write("rustfmt.toml", rustfmtConfiguration)
  - Write("clippy.toml", clippyConfiguration)
  - Write(".gitignore", rustGitignore)
  - Write("deny.toml", cargoServerDenyConfig)
  - Write("rust-toolchain.toml", toolchainConfiguration)
  - Bash("cargo fmt --all")
  - Bash("cargo clippy --all-targets --all-features -- -D warnings")
  - Bash("cargo deny check")
```

### 📝 Documentation Coordination

**Documentation Generation:**
```rust
[BatchTool]:
  - Write("src/lib.rs", comprehensiveDocComments)
  - Write("docs/architecture.md", architecturalDocs)
  - Write("docs/api.md", apiDocumentation)
  - Write("examples/", codeExamples)
  - Bash("cargo doc --no-deps --open")
  - Bash("cargo test --doc")
```

## 🔄 RUST CI/CD COORDINATION

### 🏗️ GitHub Actions for Rust

**CI/CD Pipeline Batch:**
```rust
[BatchTool]:
  - Write(".github/workflows/ci.yml", rustCI)
  - Write(".github/workflows/security.yml", securityWorkflow)
  - Write(".github/workflows/release.yml", releaseWorkflow)
  - Write("scripts/ci-test.sh", ciTestScript)
  - Write("scripts/security-audit.sh", securityAuditScript)
  - Bash("cargo test --all-features")
  - Bash("cargo clippy --all-targets -- -D warnings")
  - Bash("cargo audit")
```

## 💡 RUST BEST PRACTICES

### 📝 Code Design Principles

1. **Ownership Model**: Understand borrowing and lifetimes
2. **Zero-Cost Abstractions**: Write high-level code with low-level performance
3. **Error Handling**: Use Result and Option types effectively
4. **Memory Safety**: Eliminate data races and memory bugs
5. **Performance**: Leverage compiler optimizations
6. **Concurrency**: Safe parallel programming patterns

### 🎯 Advanced Patterns

1. **Type System**: Leverage advanced type features
2. **Macros**: Write declarative and procedural macros
3. **Unsafe Code**: When and how to use unsafe blocks
4. **FFI**: Foreign function interface patterns
5. **Embedded**: Bare metal and embedded development
6. **WebAssembly**: Compile to WASM targets

## 📚 RUST LEARNING RESOURCES

### 🎓 Recommended Topics

1. **Core Rust**: Ownership, borrowing, lifetimes
2. **Advanced Features**: Traits, generics, macros
3. **Async Programming**: Tokio, async/await patterns
4. **Systems Programming**: Low-level development
5. **Web Development**: Axum, Warp, Rocket frameworks
6. **Performance**: Profiling, optimization techniques

### 🔧 Essential Tools

1. **Toolchain**: rustc, cargo, rustup, clippy
2. **IDEs**: VS Code with rust-analyzer, IntelliJ Rust
3. **Testing**: Built-in test framework, proptest, criterion
4. **Debugging**: gdb, lldb, rr (record and replay)
5. **Profiling**: perf, valgrind, cargo-flamegraph
6. **Cross-compilation**: cross, cargo-zigbuild

### 🌟 Ecosystem Highlights

1. **Web Frameworks**: Axum, Actix-web, Warp, Rocket
2. **Async Runtime**: Tokio, async-std, smol
3. **Serialization**: Serde, bincode, postcard
4. **Databases**: SQLx, Diesel, sea-orm
5. **CLI Tools**: Clap, structopt, colored
6. **Graphics**: wgpu, bevy, ggez, nannou

---

**Remember**: Rust swarms excel with memory-safe coordination, parallel compilation, and zero-cost abstractions. Always batch cargo operations and leverage Rust's ownership system for safe, fast, concurrent applications.