# 📦 Installation Guide

## 🚀 **Quick Installation (4 Commands)**

### 📋 **Prerequisites**

- **Node.js 18+** (LTS recommended)
- **npm 9+** or equivalent package manager
- **Windows users**: See [Windows Installation](Windows-Installation) for special instructions

⚠️ **IMPORTANT**: Claude Code must be installed first:

```bash
# 1. Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# 2. Activate Claude Code with permissions
claude --dangerously-skip-permissions
```

### ⚡ **Install Claude-Flow Alpha**

```bash
# 3. Install Claude-Flow Alpha globally
npm install -g claude-flow@alpha

# 4. Verify installation and initialize
claude-flow --version
claude-flow init
```

## 🧠 **Complete Setup Process**

### Step 1: Environment Preparation

```bash
# Check Node.js version (18+ required)
node --version

# Update npm to latest version
npm install -g npm@latest

# Clear npm cache if needed
npm cache clean --force
```

### Step 2: Claude Code Installation

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Verify Claude Code installation
claude --version

# Initialize Claude Code (required for Claude-Flow)
claude --dangerously-skip-permissions
```

### Step 3: Claude-Flow Installation

```bash
# Install Claude-Flow Alpha version
npm install -g claude-flow@alpha

# Verify installation
claude-flow --version
# Expected output: claude-flow v2.0.0-alpha.53

# Initialize Claude-Flow
claude-flow init
```

### Step 4: Verify Installation

```bash
# Test basic functionality
claude-flow hive status

# Test MCP tools availability
claude-flow mcp tools list

# Test SPARC modes
claude-flow sparc modes
```

## 🔧 **Configuration Options**

### MCP Server Setup (Recommended)

```bash
# Add Claude-Flow as MCP server to Claude Code
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Verify MCP integration
claude mcp list
```

### Memory System Initialization

```bash
# Initialize SQLite memory system
claude-flow memory init

# Configure memory retention
claude-flow config set memory.retention 30d
claude-flow config set memory.maxSize 1GB
```

### Hooks System Setup

```bash
# Enable advanced hooks (optional)
claude-flow hooks enable --all

# Configure auto-formatting
claude-flow hooks set post-edit "prettier --write {file}"

# Setup performance monitoring
claude-flow hooks set post-task "claude-flow metrics collect"
```

## 🐳 **Docker Installation**

```bash
# Pull Claude-Flow Docker image
docker pull chatman-media/claude-flow-multilang:v2-alpha

# Run Claude-Flow container
docker run -it --name claude-flow \
  -v $(pwd):/workspace \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  chatman-media/claude-flow-multilang:v2-alpha

# Initialize inside container
claude-flow init --docker
```

## 🏗️ **Development Installation**

For contributors and advanced users:

```bash
# Clone the repository
git clone https://github.com/chatman-media/claude-flow-multilang.git
cd claude-flow

# Install dependencies
npm install

# Build from source
npm run build

# Link globally for development
npm link

# Run tests
npm test
```

## 🔍 **Verification Commands**

```bash
# Check all installations
claude --version          # Claude Code
claude-flow --version     # Claude-Flow
node --version            # Node.js 18+
npm --version             # npm 9+

# Test core functionality
claude-flow hive init --topology mesh --agents 3
claude-flow sparc run dev "test installation"
claude-flow mcp tools list | head -10
```

## 🛠️ **Post-Installation Setup**

### 1. Configure API Keys

```bash
# Set Anthropic API key (if not already set)
export ANTHROPIC_API_KEY="your-api-key-here"

# Add to shell profile for persistence
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### 2. Initialize Project Structure

```bash
# Create a new project with Claude-Flow
mkdir my-ai-project
cd my-ai-project

# Initialize Claude-Flow project
claude-flow project init --template full-stack
```

### 3. Test Full Workflow

```bash
# Test complete hive-mind workflow
claude-flow hive init --topology hierarchical --agents 5
claude-flow orchestrate "create hello world API" --parallel
```

## 🚨 **Troubleshooting**

### Common Issues

1. **Permission Errors**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Claude Code Not Found**
   ```bash
   # Reinstall Claude Code
   npm uninstall -g @anthropic-ai/claude-code
   npm install -g @anthropic-ai/claude-code
   ```

3. **Memory Database Errors**
   ```bash
   # Reset memory system
   claude-flow memory reset --force
   claude-flow memory init
   ```

4. **MCP Server Issues**
   ```bash
   # Restart MCP server
   claude-flow mcp restart
   ```

### Getting Help

- **Documentation**: Visit our [Troubleshooting](Troubleshooting) guide
- **GitHub Issues**: [Report bugs](https://github.com/chatman-media/claude-flow-multilang/issues)
- **Community**: Join [Discord](https://discord.agentics.org)

---

**Next Steps**: 
- Read the [Quick Start](Quick-Start) guide
- Explore [Core Concepts](Hive-Mind-Intelligence)
- Try [SPARC Methodology](SPARC-Methodology)