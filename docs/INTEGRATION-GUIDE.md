# 🔄 Integration Guide - Using Claude Flow with Existing Projects

## Overview

This guide explains how to integrate Claude Flow Multilang into your existing applications, whether it's a Tauri desktop app, web application, or any other project.

## 🎯 Integration Strategies

### 1. Gradual Integration (Recommended)

Start small and expand gradually:

```bash
# Step 1: Install as development dependency
npm install --save-dev claude-flow-multilang@latest

# Step 2: Initialize in your project
npx claude-flow init --existing-project

# Step 3: Start with specific features
npx claude-flow analyze src/  # Analyze existing code
npx claude-flow suggest improvements  # Get suggestions
```

### 2. Specific Feature Integration

Use only what you need:

```javascript
// package.json - Add specific scripts
{
  "scripts": {
    "ai:analyze": "claude-flow analyze",
    "ai:refactor": "claude-flow refactor",
    "ai:test": "claude-flow generate tests",
    "ai:docs": "claude-flow generate docs"
  }
}
```

### 3. Architecture Analysis

For existing projects, start with analysis:

```bash
# Analyze your current architecture
npx claude-flow analyze --architecture

# Get recommendations
npx claude-flow recommend --for tauri-app
```

## 📦 Integration by Project Type

### Tauri Desktop Application

```bash
# For Tauri apps - NO DDD needed!
cd your-tauri-app/

# Initialize Claude Flow for Tauri
npx claude-flow init --type tauri --no-ddd

# Use Tauri-specific agents
npx claude-flow agent spawn tauri-specialist
npx claude-flow agent spawn rust-developer
npx claude-flow agent spawn frontend-dev

# Generate Tauri commands
npx claude-flow generate tauri-command --name save_settings

# Add IPC handlers
npx claude-flow generate ipc-handler --for file-operations
```

**Configuration for Tauri (.claude/config.json):**
```json
{
  "project": {
    "type": "tauri",
    "frontend": "react",  // or vue, svelte
    "backend": "rust",
    "architecture": "component-based"  // NOT ddd
  },
  "features": {
    "ddd": false,  // Disable DDD for Tauri
    "multilingual": true,  // Keep if needed
    "sparc": true,
    "testing": true
  },
  "agents": [
    "tauri-specialist",
    "rust-developer",
    "frontend-dev",
    "ui-designer"
  ]
}
```

### React/Next.js Web Application

```bash
cd your-react-app/

# Initialize for React
npx claude-flow init --type react --architecture mvc

# Analyze components
npx claude-flow analyze src/components

# Generate new components
npx claude-flow generate component --name UserProfile

# Add tests for existing components
npx claude-flow generate tests --for src/components/Header.jsx

# Optimize performance
npx claude-flow optimize --performance
```

### Node.js Backend API

```bash
cd your-api/

# Initialize for API
npx claude-flow init --type api --architecture service-layer

# Analyze existing endpoints
npx claude-flow analyze src/routes

# Generate new endpoints
npx claude-flow generate endpoint --method POST --path /api/users

# Add validation
npx claude-flow add validation --for user-registration

# Generate OpenAPI docs
npx claude-flow generate openapi
```

### Microservices (with DDD)

```bash
# Only for complex business logic - use DDD
cd your-microservices/

# Initialize with DDD
npx claude-flow init --type microservices --with-ddd

# Create bounded context for existing service
npx claude-flow ddd context --from-existing src/services/payment

# Generate aggregates from existing models
npx claude-flow ddd aggregate --from-model src/models/Order.js

# Add event sourcing
npx claude-flow ddd add-events --for OrderAggregate
```

## 🛠️ Common Integration Tasks

### 1. Analyzing Existing Code

```bash
# Full analysis
npx claude-flow analyze --full

# Specific analysis
npx claude-flow analyze src/ --focus architecture
npx claude-flow analyze src/ --focus performance
npx claude-flow analyze src/ --focus security
```

### 2. Generating Missing Parts

```bash
# Generate tests for existing code
npx claude-flow generate tests --coverage 80

# Generate documentation
npx claude-flow generate docs --format markdown

# Generate TypeScript types
npx claude-flow generate types --from-js src/
```

### 3. Refactoring Assistance

```bash
# Suggest refactoring
npx claude-flow refactor suggest --file src/utils/api.js

# Apply refactoring
npx claude-flow refactor apply --pattern repository

# Convert to TypeScript
npx claude-flow convert --to typescript
```

### 4. Adding Multilingual Support

```bash
# Add i18n to existing project
npx claude-flow i18n init --languages en,ru,ja

# Extract strings for translation
npx claude-flow i18n extract --from src/

# Generate translation files
npx claude-flow i18n generate --format json
```

## 📋 Step-by-Step Integration Example

### Example: Adding to Existing Tauri App

```bash
# 1. Navigate to your Tauri project
cd my-tauri-app/

# 2. Install Claude Flow
npm install --save-dev claude-flow-multilang@latest

# 3. Create configuration
cat > .claude/config.json << EOF
{
  "project": {
    "type": "tauri",
    "existing": true,
    "structure": "preserve"
  },
  "features": {
    "ddd": false,
    "analysis": true,
    "generation": true,
    "refactoring": true
  }
}
EOF

# 4. Analyze current structure
npx claude-flow analyze --preserve-structure

# 5. Get improvement suggestions
npx claude-flow suggest --for desktop-app

# 6. Generate specific components
npx claude-flow generate tauri-command --name app_settings
npx claude-flow generate rust-handler --for file-operations
npx claude-flow generate react-component --name SettingsPanel

# 7. Add tests
npx claude-flow generate tests --for src-tauri/src/commands.rs
npx claude-flow generate tests --for src/components/

# 8. Optimize
npx claude-flow optimize --target desktop
```

## 🔧 Configuration Options

### Minimal Config (No DDD)

```json
{
  "features": {
    "ddd": false,
    "sparc": true,
    "testing": true
  }
}
```

### Component-Based Architecture

```json
{
  "architecture": "component-based",
  "structure": {
    "components": "src/components",
    "services": "src/services",
    "utils": "src/utils"
  }
}
```

### Service Layer Architecture

```json
{
  "architecture": "service-layer",
  "layers": {
    "controllers": "src/controllers",
    "services": "src/services",
    "repositories": "src/repositories",
    "models": "src/models"
  }
}
```

## 🚫 When NOT to Use DDD

DDD is overkill for:
- ✅ Tauri desktop applications
- ✅ Simple CRUD apps
- ✅ Static websites
- ✅ CLI tools
- ✅ Browser extensions
- ✅ Simple APIs
- ✅ Prototypes/MVPs

Use DDD only for:
- ❌ Complex business domains
- ❌ Enterprise applications
- ❌ Financial systems
- ❌ E-commerce platforms
- ❌ Healthcare systems

## 🎯 Best Practices for Integration

### 1. Start Small
```bash
# Don't do everything at once
npx claude-flow analyze src/components/Button.jsx
# Then gradually expand
```

### 2. Preserve Existing Structure
```bash
npx claude-flow init --preserve-structure
```

### 3. Use Specific Agents
```bash
# For Tauri
npx claude-flow agent spawn tauri-specialist

# For React
npx claude-flow agent spawn react-developer

# For API
npx claude-flow agent spawn backend-dev
```

### 4. Incremental Improvements
```bash
# Week 1: Add tests
npx claude-flow generate tests

# Week 2: Improve documentation
npx claude-flow generate docs

# Week 3: Optimize performance
npx claude-flow optimize
```

## 🔍 Verification Commands

After integration, verify everything works:

```bash
# Run framework tests
npm run test:framework

# Check configuration
npx claude-flow config verify

# List available commands
npx claude-flow help

# Check agent availability
npx claude-flow agent list
```

## 📊 Monitoring Integration Success

Track these metrics:
- Code coverage increase
- Documentation completeness
- Performance improvements
- Bug reduction
- Development velocity

## 🆘 Troubleshooting

### Common Issues

**1. "DDD is too complex for my app"**
```bash
# Disable DDD completely
npx claude-flow config set features.ddd false
```

**2. "I don't need all features"**
```bash
# Use only what you need
npx claude-flow config set features.minimal true
```

**3. "Conflicts with existing tooling"**
```bash
# Run in isolated mode
npx claude-flow --isolated
```

## 📚 Examples for Different Projects

### Tauri Example
```bash
npx claude-flow examples tauri-integration
```

### React Example
```bash
npx claude-flow examples react-integration
```

### API Example
```bash
npx claude-flow examples api-integration
```

## 🎯 Summary

Integration approach depends on your project:

1. **Simple Apps** → Use basic features, no DDD
2. **Existing Projects** → Gradual integration, preserve structure
3. **Complex Systems** → Consider DDD only if needed
4. **Desktop Apps** → Focus on UI/UX agents, not domain modeling

Remember: **You don't need to use everything!** Pick what helps your specific project.