# 📋 Complete Agent Categories Reference

Claude-Flow Alpha.73 includes **64 specialized AI agents** organized into **16 functional categories**. This comprehensive reference provides detailed information about each category and its agents.

## 🔗 Quick Navigation
- [Agent System Overview](Agent-System-Overview) - Complete agent catalog
- [Agent Usage Guide](Agent-Usage-Guide) - Practical examples and patterns
- [Home](Home) - Back to main wiki

---

## 📊 Categories Overview

| Category | Agent Count | Primary Focus |
|----------|-------------|---------------|
| Core Development | 5 | Essential development tasks |
| Swarm Coordination | 3 | Multi-agent orchestration |
| Hive-Mind Intelligence | 3 | Collective decision making |
| Consensus & Distributed | 7 | Fault-tolerant protocols |
| Performance & Optimization | 6 | System performance |
| GitHub Integration | 13 | Repository management |
| SPARC Methodology | 4 | Development phases |
| Testing & Validation | 2 | Quality assurance |
| Architecture & Analysis | 3 | System design |
| Specialized Development | 6 | Domain-specific |
| Templates & Orchestration | 9 | Workflow automation |
| Data & ML | 1 | Machine learning |
| DevOps & CI/CD | 1 | Pipeline automation |
| Documentation | 1 | API documentation |
| Mobile Development | 1 | Cross-platform apps |
| Base Templates | 1 | Boilerplate generation |

---

## 🔧 1. Core Development (5 agents)

Essential agents for day-to-day development tasks.

### Agents:
- **`coder.md`** - Implementation specialist for clean, efficient code
- **`planner.md`** - Strategic planning and task orchestration  
- **`researcher.md`** - Deep research and information gathering
- **`reviewer.md`** - Code review and quality assurance
- **`tester.md`** - Comprehensive testing and validation

### Usage Example:
```bash
Task("Implement feature", "Build user authentication with JWT", "coder")
Task("Plan architecture", "Design microservices structure", "planner")
Task("Research best practices", "Find OAuth2 implementation patterns", "researcher")
```

---

## 🐝 2. Swarm Coordination (3 agents)

Advanced multi-agent coordination patterns.

### Agents:
- **`hierarchical-coordinator.md`** - Queen-led coordination with tree structure management
- **`mesh-coordinator.md`** - Peer-to-peer networks with fault tolerance
- **`adaptive-coordinator.md`** - Dynamic topology switching with ML optimization

### Usage Example:
```bash
# Hierarchical for large teams
Task("Coordinate team", "Manage 10-agent development swarm", "hierarchical-coordinator")

# Mesh for resilient systems
Task("Build P2P system", "Create distributed coordination", "mesh-coordinator")
```

---

## 🧠 3. Hive-Mind Intelligence (3 agents)

Collective intelligence and shared decision-making.

### Agents:
- **`collective-intelligence-coordinator.md`** - Neural center for group decisions
- **`consensus-builder.md`** - Byzantine fault-tolerant consensus mechanisms
- **`swarm-memory-manager.md`** - Distributed memory coordination

### Usage Example:
```bash
Task("Collective decision", "Analyze architecture options as group", "collective-intelligence-coordinator")
Task("Build consensus", "Agree on API design across agents", "consensus-builder")
```

---

## ⚡ 4. Consensus & Distributed Systems (7 agents)

Enterprise-grade distributed system protocols.

### Agents:
- **`byzantine-coordinator.md`** - Byzantine fault tolerance with malicious actor detection
- **`raft-manager.md`** - Leader election and log replication
- **`gossip-coordinator.md`** - Epidemic dissemination protocols
- **`crdt-synchronizer.md`** - Conflict-free replicated data types
- **`security-manager.md`** - Cryptographic security implementation
- **`quorum-manager.md`** - Dynamic quorum adjustment
- **`performance-benchmarker.md`** - Distributed system performance testing

### Usage Example:
```bash
# Byzantine fault tolerance
Task("Implement BFT", "Create fault-tolerant consensus", "byzantine-coordinator")

# Raft consensus
Task("Leader election", "Implement Raft protocol", "raft-manager")
```

---

## 📊 5. Performance & Optimization (6 agents)

System performance monitoring and optimization.

### Agents:
- **`performance-monitor.md`** - Real-time performance tracking
- **`load-balancer.md`** - Work-stealing load distribution
- **`topology-optimizer.md`** - Auto-topology optimization
- **`resource-allocator.md`** - Intelligent resource management
- **`benchmark-suite.md`** - Comprehensive benchmarking
- **`performance-analyzer.md`** - Bottleneck identification

### Usage Example:
```bash
Task("Monitor system", "Track API response times", "performance-monitor")
Task("Optimize load", "Balance work across services", "load-balancer")
```

---

## 🐙 6. GitHub Integration (13 agents)

Comprehensive GitHub workflow automation.

### Agents:
- **`github-modes.md`** - Workflow orchestration
- **`pr-manager.md`** - Pull request management
- **`code-review-swarm.md`** - Intelligent code reviews
- **`issue-tracker.md`** - Issue management
- **`release-manager.md`** - Release coordination
- **`workflow-automation.md`** - CI/CD automation
- **`project-board-sync.md`** - Project tracking
- **`repo-architect.md`** - Repository optimization
- **`multi-repo-swarm.md`** - Cross-repo coordination
- **`sync-coordinator.md`** - Package synchronization
- **`swarm-issue.md`** - Issue-based coordination
- **`swarm-pr.md`** - PR lifecycle management
- **`release-swarm.md`** - Release orchestration

### Usage Example:
```bash
Task("Manage PRs", "Review and merge pending PRs", "pr-manager")
Task("Coordinate release", "Orchestrate v2.0 release", "release-manager")
```

---

## 🏗️ 7. SPARC Methodology (4 agents)

Test-driven development methodology phases.

### Agents:
- **`specification.md`** - Requirements analysis
- **`pseudocode.md`** - Algorithm design
- **`architecture.md`** - System design
- **`refinement.md`** - Iterative improvement

### Usage Example:
```bash
Task("Analyze requirements", "Define user stories", "specification")
Task("Design system", "Create architecture diagrams", "architecture")
```

---

## 🧪 8. Testing & Validation (2 agents)

Quality assurance and validation.

### Agents:
- **`tdd-london-swarm.md`** - Mock-driven TDD with London School
- **`production-validator.md`** - Real implementation validation

### Usage Example:
```bash
Task("TDD implementation", "Build with mocks first", "tdd-london-swarm")
Task("Validate production", "Ensure no mocks in prod", "production-validator")
```

---

## 📐 9. Architecture & Analysis (3 agents)

System design and code analysis.

### Agents:
- **`system-architect.md`** - High-level technical decisions
- **`code-analyzer.md`** - Advanced code quality analysis
- **`analyze-code-quality.md`** - Comprehensive code reviews

### Usage Example:
```bash
Task("Design system", "Create microservices architecture", "system-architect")
Task("Analyze codebase", "Find quality issues", "code-analyzer")
```

---

## 🎯 10. Specialized Development (6 agents)

Domain-specific development agents.

### Agents:
- **`backend-dev.md`** - API development specialist
- **`mobile-dev.md`** - React Native development
- **`ml-developer.md`** - Machine learning models
- **`cicd-engineer.md`** - CI/CD pipeline optimization
- **`api-docs.md`** - OpenAPI/Swagger documentation
- **`base-template-generator.md`** - Boilerplate creation

### Usage Example:
```bash
Task("Build API", "Create REST endpoints", "backend-dev")
Task("Mobile app", "Build React Native app", "mobile-dev")
```

---

## ⚙️ 11. Templates & Orchestration (9 agents)

Workflow automation and coordination.

### Agents:
- **`task-orchestrator.md`** - Central task coordination
- **`memory-coordinator.md`** - Cross-session memory
- **`smart-agent.md`** - Intelligent coordination
- **`sparc-coordinator.md`** - SPARC orchestration
- **`migration-plan.md`** - System migrations
- **`automation-smart-agent.md`** - Workflow automation
- **`coordinator-swarm-init.md`** - Swarm initialization
- **`github-pr-manager.md`** - PR templates
- **`implementer-sparc-coder.md`** - TDD implementation

---

## 📊 12-16. Additional Specialized Categories

### 12. Data & ML (1 agent)
- **`data-ml-model.md`** - Data science and ML workflows

### 13. DevOps & CI/CD (1 agent)  
- **`ops-cicd-github.md`** - GitHub Actions and deployment

### 14. Documentation (1 agent)
- **`docs-api-openapi.md`** - API documentation generation

### 15. Mobile Development (1 agent)
- **`spec-mobile-react-native.md`** - Cross-platform mobile apps

### 16. Base Templates (1 agent)
- **`base-template-generator.md`** - Foundational code templates

---

## 🚀 Concurrent Usage Patterns

### Full-Stack Development Swarm
```javascript
// Deploy 8 agents concurrently
Task("Architecture", "Design system", "system-architect")
Task("Backend", "Build APIs", "backend-dev")
Task("Frontend", "Create UI", "mobile-dev")
Task("Database", "Design schema", "coder")
Task("Testing", "Write tests", "tester")
Task("DevOps", "Setup CI/CD", "cicd-engineer")
Task("Docs", "API documentation", "api-docs")
Task("Review", "Code quality", "reviewer")
```

### Distributed System Swarm
```javascript
// Byzantine fault-tolerant system
Task("BFT protocol", "...", "byzantine-coordinator")
Task("Raft consensus", "...", "raft-manager")
Task("Gossip protocol", "...", "gossip-coordinator")
Task("CRDT sync", "...", "crdt-synchronizer")
Task("Security", "...", "security-manager")
Task("Performance", "...", "performance-benchmarker")
```

---

## 📚 Additional Resources

- [Agent System Overview](Agent-System-Overview) - Complete agent catalog
- [Agent Usage Guide](Agent-Usage-Guide) - Detailed usage examples
- [Home](Home) - Main wiki page
- [SPARC Methodology](SPARC-Methodology) - Development methodology
- [GitHub Integration](GitHub-Integration) - Repository management

---

*Last updated: Alpha.73*