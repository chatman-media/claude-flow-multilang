# ⚡ Quick Start Guide

Get up and running with Claude-Flow in under 5 minutes!

## 🚀 **Installation** 

If you haven't installed Claude-Flow yet, follow these quick steps:

```bash
# Install Claude Code (required)
npm install -g @anthropic-ai/claude-code
claude --dangerously-skip-permissions

# Install Claude-Flow Alpha
npm install -g claude-flow@alpha

# Verify installation
claude-flow --version
```

## 🐝 **Your First Hive-Mind Swarm**

### 1. Initialize a Simple Swarm

```bash
# Create a mesh topology with 3 agents
claude-flow hive init --topology mesh --agents 3

# Check swarm status
claude-flow hive status
```

**Expected Output:**
```
🐝 Hive-Mind Initialized
├── Topology: mesh
├── Agents: 3/3 active
├── Memory: SQLite initialized
└── Status: Ready for orchestration
```

### 2. Your First Orchestrated Task

```bash
# Create a simple hello world project
claude-flow orchestrate "create a hello world API with tests" --agents 3 --parallel
```

This command will:
- ✅ Spawn 3 specialized agents (architect, coder, tester)
- ✅ Create project structure automatically
- ✅ Generate API code with Express.js
- ✅ Write comprehensive tests
- ✅ Set up package.json with dependencies

### 3. Monitor Real-Time Progress

```bash
# Watch swarm coordination in real-time
claude-flow hive monitor --live
```

## 🧪 **SPARC Development Mode**

### Test-Driven Development with AI

```bash
# Run SPARC TDD workflow
claude-flow sparc run tdd "user authentication system"
```

This will execute the complete SPARC methodology:
1. **Specification**: Analyze requirements
2. **Pseudocode**: Design algorithms
3. **Architecture**: Structure components
4. **Refinement**: Implement with TDD
5. **Completion**: Integration and testing

### Available SPARC Modes

```bash
# List all SPARC modes
claude-flow sparc modes

# Run specific development patterns
claude-flow sparc run dev "build REST API"        # Development mode
claude-flow sparc run api "user management API"   # API-focused mode
claude-flow sparc run ui "dashboard component"    # UI development mode
claude-flow sparc run test "integration tests"    # Testing mode
claude-flow sparc run refactor "optimize database queries"  # Refactoring mode
```

## 🔧 **MCP Tools in Action**

### Explore Available Tools

```bash
# List all 87 MCP tools
claude-flow mcp tools list

# Get detailed tool information
claude-flow mcp tools info swarm_init
claude-flow mcp tools info neural_train
```

### Execute Tools Directly

```bash
# Initialize neural patterns
claude-flow mcp execute neural_train --pattern_type coordination --training_data "development patterns"

# Store project context in memory
claude-flow mcp execute memory_usage --action store --key "project/config" --value "API project settings"

# Generate performance report
claude-flow mcp execute performance_report --format detailed --timeframe 24h
```

## 🧠 **Memory System Usage**

### Store and Retrieve Context

```bash
# Store project decisions
claude-flow memory store "architecture/decisions" "Using microservices with Redis cache"

# Recall previous decisions
claude-flow memory recall "architecture/*"

# Search memory
claude-flow memory search "authentication" --limit 5
```

### Cross-Session Persistence

```bash
# Export current session
claude-flow memory export --session current --format json

# Restore previous session
claude-flow memory restore --session "project-alpha-v1"
```

## 📊 **GitHub Integration**

### Repository Analysis

```bash
# Analyze repository with AI
claude-flow github analyze --repo owner/repository --deep

# Enhance pull requests automatically
claude-flow github pr enhance --pr 123 --add-tests --improve-docs

# Automated code review
claude-flow github review --pr 123 --style comprehensive
```

### Workflow Automation

```bash
# Create GitHub workflow
claude-flow github workflow create --name "AI Code Review" \
  --trigger pr --actions "review,test,format"
```

## 🎯 **Real-World Examples**

### Example 1: Full-Stack Application

```bash
# Create complete full-stack app
claude-flow orchestrate \
  "build a task management app with React frontend, Node.js API, and PostgreSQL database" \
  --agents 8 --topology hierarchical --parallel
```

### Example 2: API with Documentation

```bash
# Generate REST API with docs
claude-flow sparc run api "user management system with OpenAPI docs and Swagger UI"
```

### Example 3: Testing Suite

```bash
# Create comprehensive test suite
claude-flow sparc run test "integration tests for authentication API with mocking"
```

## 📈 **Performance Monitoring**

### Real-Time Metrics

```bash
# Monitor swarm performance
claude-flow metrics --live --interval 5s

# Generate performance report
claude-flow performance report --format summary
```

### Optimization

```bash
# Analyze bottlenecks
claude-flow analyze bottlenecks --component swarm

# Optimize coordination
claude-flow optimize --target speed --metric response-time
```

## 🛠️ **Configuration**

### Customize Behavior

```bash
# Set default topology
claude-flow config set hive.defaultTopology hierarchical

# Configure memory retention
claude-flow config set memory.retention 30d

# Enable advanced hooks
claude-flow hooks enable --post-edit --pre-task
```

### Environment Variables

```bash
# Set environment variables
export CLAUDE_FLOW_MAX_AGENTS=12
export CLAUDE_FLOW_MEMORY_SIZE=2GB
export CLAUDE_FLOW_ENABLE_NEURAL=true
```

## 🚨 **Common Quick Fixes**

### Reset Everything

```bash
# Reset Claude-Flow to clean state
claude-flow reset --hard

# Reinitialize
claude-flow init
```

### Check System Health

```bash
# Comprehensive health check
claude-flow health check --verbose

# Test all integrations
claude-flow test integrations
```

## 📚 **What's Next?**

Now that you have Claude-Flow running, explore these advanced topics:

- **[Hive-Mind Intelligence](Hive-Mind-Intelligence)** - Deep dive into AI coordination
- **[Neural Networks](Neural-Networks)** - Understanding AI pattern recognition
- **[MCP Tools](MCP-Tools)** - Complete reference for all 87 tools
- **[SPARC Methodology](SPARC-Methodology)** - Master test-driven development
- **[Development Patterns](Development-Patterns)** - Best practices and patterns

## 🤝 **Getting Help**

- **Documentation**: Browse the full [wiki](Home)
- **Examples**: Check out [real-world examples](Examples)
- **Issues**: [Report bugs](https://github.com/chatman-media/claude-flow-multilang/issues)
- **Community**: Join [Discord](https://discord.agentics.org)

---

> 🎉 **Congratulations!** You're now ready to build with AI-powered orchestration. Start with simple tasks and gradually explore more complex workflows as you become familiar with Claude-Flow's capabilities.