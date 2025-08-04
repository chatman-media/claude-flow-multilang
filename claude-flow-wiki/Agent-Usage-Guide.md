# 🚀 Agent Usage Guide

## 🎯 **Quick Start**

This guide provides practical examples and usage patterns for Claude-Flow's agent system.

## 📋 **Basic Agent Commands**

### **Core Agent Management Commands**
```bash
# Spawn a new agent
claude-flow agent spawn --type <agent-type> --name "<agent-name>"

# List all active agents
claude-flow agent list

# Get detailed information about an agent
claude-flow agent info <agent-id>

# Terminate an agent
claude-flow agent terminate <agent-id>

# View agent hierarchy
claude-flow agent hierarchy

# View the agent ecosystem
claude-flow agent ecosystem
```

### **Valid Agent Types**
- `coordinator` - Coordination and orchestration
- `researcher` - Information gathering and analysis
- `coder` - Code implementation
- `analyst` - Data analysis and insights
- `architect` - System design and architecture
- `tester` - Testing and quality assurance
- `reviewer` - Code review and validation
- `optimizer` - Performance optimization

### **Command Options**
- `--type <type>` - Specify agent type (required for spawn)
- `--name <name>` - Custom agent name
- `--verbose` - Show detailed output
- `--json` - Output in JSON format
- `--help` - Show help for any command

### **Example Usage**
```bash
# Spawn a research agent
claude-flow agent spawn --type researcher --name "Market Research Bot"

# Spawn a coding agent
claude-flow agent spawn --type coder --name "Feature Developer"

# List all agents in JSON format
claude-flow agent list --json

# Get verbose info about a specific agent
claude-flow agent info agent-123 --verbose

# Terminate an agent
claude-flow agent terminate agent-456

# View the agent hierarchy
claude-flow agent hierarchy

# View the complete ecosystem
claude-flow agent ecosystem
```

## 🏗️ **Agent Types & Their Roles**

### **1. Coordinator**
**Role**: Orchestrates work between multiple agents and manages workflows
```bash
claude-flow agent spawn --type coordinator --name "Project Orchestrator"
```
**Best for**: 
- Managing multi-agent workflows
- Coordinating complex projects
- Task distribution and monitoring

### **2. Researcher**
**Role**: Gathers information, analyzes requirements, and provides insights
```bash
claude-flow agent spawn --type researcher --name "Requirements Analyst"
```
**Best for**:
- Market research and analysis
- Technical documentation review
- Best practices identification

### **3. Coder**
**Role**: Implements features and writes production code
```bash
claude-flow agent spawn --type coder --name "Backend Developer"
```
**Best for**:
- Feature implementation
- Bug fixes
- Code refactoring

### **4. Analyst**
**Role**: Analyzes data, patterns, and provides insights
```bash
claude-flow agent spawn --type analyst --name "Data Analyzer"
```
**Best for**:
- Performance analysis
- Data pattern recognition
- Metrics evaluation

### **5. Architect**
**Role**: Designs system architecture and technical solutions
```bash
claude-flow agent spawn --type architect --name "System Designer"
```
**Best for**:
- System design
- Architecture planning
- Technical decision making

### **6. Tester**
**Role**: Creates and executes tests to ensure quality
```bash
claude-flow agent spawn --type tester --name "QA Engineer"
```
**Best for**:
- Unit test creation
- Integration testing
- Test automation

### **7. Reviewer**
**Role**: Reviews code for quality, security, and best practices
```bash
claude-flow agent spawn --type reviewer --name "Code Reviewer"
```
**Best for**:
- Code quality assessment
- Security reviews
- Best practices enforcement

### **8. Optimizer**
**Role**: Optimizes performance and efficiency
```bash
claude-flow agent spawn --type optimizer --name "Performance Optimizer"
```
**Best for**:
- Performance tuning
- Resource optimization
- Efficiency improvements

## 🎯 **Common Usage Patterns**

### **1. Development Team Setup**
```bash
# Create a complete development team
claude-flow agent spawn --type architect --name "Lead Architect"
claude-flow agent spawn --type coder --name "Senior Developer"
claude-flow agent spawn --type tester --name "QA Lead"
claude-flow agent spawn --type reviewer --name "Code Quality Expert"
```

### **2. Research and Analysis Team**
```bash
# Create analysis team
claude-flow agent spawn --type researcher --name "Market Researcher"
claude-flow agent spawn --type analyst --name "Data Analyst"
claude-flow agent spawn --type architect --name "Solution Architect"
```

### **3. Optimization Squad**
```bash
# Performance optimization team
claude-flow agent spawn --type analyst --name "Performance Analyst"
claude-flow agent spawn --type optimizer --name "Code Optimizer"
claude-flow agent spawn --type reviewer --name "Optimization Reviewer"
```

## ⚡ **Advanced Usage**

### **Working with Agent Hierarchies**
```bash
# View the current hierarchy
claude-flow agent hierarchy

# Agents can be organized in hierarchical structures where:
# - Coordinators manage other agents
# - Agents report to coordinators
# - Work flows through the hierarchy
```

### **Agent Ecosystem Management**
```bash
# View the complete ecosystem
claude-flow agent ecosystem

# The ecosystem shows:
# - All active agents
# - Their relationships
# - Current workloads
# - Performance metrics
```

### **Batch Operations**
```bash
# List all agents and filter by type
claude-flow agent list --json | jq '.[] | select(.type == "coder")'

# Get info for multiple agents
for agent in $(claude-flow agent list --json | jq -r '.[].id'); do
  claude-flow agent info $agent
done
```

## 📊 **Best Practices**

### **Agent Naming Conventions**
- Use descriptive names that indicate the agent's purpose
- Include the project or feature name when relevant
- Examples: "Auth-Feature-Developer", "API-Performance-Optimizer"

### **Agent Lifecycle Management**
1. **Spawn** agents at the start of a project or feature
2. **Monitor** their work using `info` and `list` commands
3. **Coordinate** work through coordinators for complex tasks
4. **Terminate** agents when their work is complete

### **Optimal Team Composition**
- **Small Features**: 1 coder, 1 tester, 1 reviewer
- **Medium Projects**: 1 coordinator, 2-3 coders, 1 architect, 1-2 testers, 1 reviewer
- **Large Projects**: Multiple coordinators, 5+ coders, 2+ architects, 3+ testers, 2+ reviewers

### **Performance Tips**
- Don't spawn too many agents at once (start with 3-5)
- Use coordinators for teams larger than 5 agents
- Terminate idle agents to free resources
- Monitor agent performance with `--verbose` flag

## 🔧 **Troubleshooting**

### **Common Issues**
```bash
# Agent not responding
claude-flow agent info <agent-id> --verbose

# Too many agents active
claude-flow agent list
# Then terminate unnecessary agents

# Need to restart an agent
claude-flow agent terminate <agent-id>
claude-flow agent spawn --type <type> --name "<name>"
```

### **Debug Commands**
```bash
# Get detailed agent status
claude-flow agent info <agent-id> --verbose --json

# View system-wide agent metrics
claude-flow agent ecosystem --verbose

# Check agent hierarchy for bottlenecks
claude-flow agent hierarchy --verbose
```

## 🔗 **Integration with Other Claude-Flow Features**

### **With Swarm Mode**
```bash
# Agents can be part of swarms
claude-flow swarm init --topology hierarchical
# Then spawn agents that work within the swarm
```

### **With SPARC Methodology**
```bash
# Use specific agents for SPARC phases
claude-flow agent spawn --type architect --name "SPARC Architect"
claude-flow agent spawn --type coder --name "SPARC TDD Developer"
```

### **With Task Orchestration**
```bash
# Spawn agents for specific tasks
claude-flow agent spawn --type coordinator --name "Task Orchestrator"
claude-flow task create "Build feature X" --assign "Task Orchestrator"
```

## 📚 **Related Documentation**

- **[Agent System Overview](Agent-System-Overview)** - Detailed agent architecture
- **[Swarm Coordination](Swarm-Coordination)** - Multi-agent coordination
- **[SPARC Methodology](SPARC-Methodology)** - Test-driven development with agents
- **[Performance Optimization](Performance-Optimization)** - Optimizing agent performance

---

> 🚀 **Pro Tip**: Start simple with 2-3 agents and scale up as needed. Use coordinators for teams larger than 5 agents to maintain efficiency.