# GitHub Integration - Repository Management Automation

Claude Flow provides comprehensive GitHub integration through 13 specialized agents that automate repository management, code review, release coordination, and workflow orchestration.

## Overview

The GitHub integration suite transforms repository management from manual processes to automated workflows, enabling teams to focus on code quality while the swarm handles operational tasks.

## 🎉 NEW: GitHub-Enhanced Hooks

Claude Flow v2.0.0 introduces **automatic GitHub releases** for every checkpoint in your development workflow:

### Quick Start
```bash
# Standard init (local checkpoints only)
npx claude-flow@alpha init

# GitHub-enhanced init (automatic releases)
npx claude-flow@alpha github init
```

### Key Features
- 📝 **Automatic Releases**: Every file edit creates a GitHub release
- 🎯 **Task Checkpoints**: Releases with full task context
- 📊 **Session Summaries**: Comprehensive end-of-session releases
- 🤝 **Team Sharing**: Share checkpoints via GitHub releases

### Benefits
- Never lose work with automatic checkpointing
- Easy rollback to any previous state
- Team collaboration through shared checkpoints
- Complete audit trail of all changes

> 📚 **Full Documentation**: See [GitHub Hooks](GitHub-Hooks) for complete setup and usage guide

## GitHub Agents

### Core Management Agents

#### 1. `github-modes` - Comprehensive GitHub Integration
The master coordinator for all GitHub operations, providing unified access to repository management features.

```bash
npx claude-flow agent spawn github-modes \
  --task "Analyze repository health and suggest improvements" \
  --repo "owner/repo"
```

#### 2. `pr-manager` - Pull Request Management
Automates PR lifecycle management including review assignment, status tracking, and merge coordination.

```bash
npx claude-flow agent spawn pr-manager \
  --task "Review and merge ready PRs" \
  --criteria "approved, passing-tests, no-conflicts"
```

#### 3. `code-review-swarm` - Multi-Agent Code Review
Deploys multiple specialized reviewers for comprehensive code analysis.

```bash
npx claude-flow agent spawn code-review-swarm \
  --task "Perform security, performance, and style review" \
  --pr-number 123
```

### Workflow Automation Agents

#### 4. `workflow-automation` - CI/CD Automation
Creates and manages GitHub Actions workflows dynamically.

```bash
npx claude-flow agent spawn workflow-automation \
  --task "Create deployment workflow for staging environment" \
  --trigger "push to staging branch"
```

#### 5. `release-manager` - Release Coordination
Orchestrates the entire release process from changelog generation to deployment.

```bash
npx claude-flow agent spawn release-manager \
  --task "Prepare v2.0.0 release" \
  --include-changelog \
  --auto-tag
```

#### 6. `issue-tracker` - Issue Management
Intelligent issue triage, labeling, and assignment based on content analysis.

```bash
npx claude-flow agent spawn issue-tracker \
  --task "Triage and label new issues" \
  --assign-by-expertise
```

### Repository Architecture Agents

#### 7. `repo-architect` - Repository Optimization
Analyzes and optimizes repository structure, dependencies, and configuration.

```bash
npx claude-flow agent spawn repo-architect \
  --task "Optimize monorepo structure" \
  --analyze-dependencies
```

#### 8. `multi-repo-swarm` - Cross-Repository Coordination
Manages operations across multiple repositories simultaneously.

```bash
npx claude-flow agent spawn multi-repo-swarm \
  --task "Synchronize API changes across microservices" \
  --repos "api-gateway,user-service,auth-service"
```

#### 9. `project-board-sync` - Project Tracking
Synchronizes GitHub Projects with repository activity.

```bash
npx claude-flow agent spawn project-board-sync \
  --task "Update sprint board with PR status" \
  --board "Sprint-23"
```

### Analysis and Metrics Agents

#### 10. `github-metrics` - Repository Analytics
Provides detailed metrics and insights about repository health.

```bash
npx claude-flow agent spawn github-metrics \
  --task "Generate monthly activity report" \
  --include "commits,prs,issues,contributors"
```

#### 11. `security-scanner` - Security Analysis
Performs security scans and vulnerability assessments.

```bash
npx claude-flow agent spawn security-scanner \
  --task "Scan for security vulnerabilities" \
  --fix-critical
```

### Specialized Agents

#### 12. `dependency-manager` - Dependency Updates
Manages and updates project dependencies safely.

```bash
npx claude-flow agent spawn dependency-manager \
  --task "Update dependencies with breaking change analysis" \
  --strategy "conservative"
```

#### 13. `documentation-sync` - Docs Automation
Keeps documentation synchronized with code changes.

```bash
npx claude-flow agent spawn documentation-sync \
  --task "Update API docs from code comments" \
  --format "openapi"
```

## Workflow Examples

### Automated PR Review Workflow

Deploy a complete PR review pipeline:

```bash
# Spawn review swarm
npx claude-flow swarm init github-review \
  --topology mesh \
  --agents "pr-manager,code-review-swarm,security-scanner"

# Configure review criteria
npx claude-flow task orchestrate \
  --task "Review PR #456 with security focus" \
  --parallel \
  --memory-sync
```

### Release Automation Workflow

Coordinate a full release cycle:

```bash
# Initialize release swarm
npx claude-flow agent spawn release-manager \
  --task "Prepare release v1.5.0"

npx claude-flow agent spawn github-metrics \
  --task "Generate release metrics"

npx claude-flow agent spawn documentation-sync \
  --task "Update release documentation"

# Execute release
npx claude-flow task orchestrate \
  --task "Execute release pipeline" \
  --strategy sequential
```

### Multi-Repository Synchronization

Manage changes across multiple repositories:

```bash
# Deploy multi-repo coordinator
npx claude-flow agent spawn multi-repo-swarm \
  --task "Update shared dependencies across all services" \
  --repos "service-a,service-b,service-c" \
  --create-prs \
  --branch "dependency-update-2024"
```

## Best Practices

### 1. Automated Review Pipelines
```yaml
review_pipeline:
  stages:
    - security_scan:
        agent: security-scanner
        blocking: true
    - code_review:
        agent: code-review-swarm
        parallel: true
    - performance_check:
        agent: performance-analyzer
        threshold: 95
```

### 2. Release Coordination
```javascript
const releaseConfig = {
  preRelease: ['test', 'build', 'security-scan'],
  release: ['tag', 'changelog', 'publish'],
  postRelease: ['announce', 'update-docs', 'notify-teams']
};
```

### 3. Issue Management
```javascript
const triageRules = {
  bug: { 
    assignTo: 'bug-fix-team',
    priority: 'high',
    labels: ['bug', 'needs-triage']
  },
  feature: {
    assignTo: 'product-team',
    milestone: 'next-release',
    labels: ['enhancement']
  }
};
```

## Integration Patterns

### Continuous Integration
```bash
# Setup CI workflow automation
npx claude-flow agent spawn workflow-automation \
  --task "Create matrix testing workflow" \
  --matrix "os:[ubuntu,macos,windows],node:[18,20,22]"
```

### Security-First Development
```bash
# Deploy security enforcement
npx claude-flow swarm init security-enforcement \
  --agents "security-scanner,code-review-swarm,dependency-manager" \
  --policy "block-on-critical"
```

### Documentation as Code
```bash
# Automated documentation updates
npx claude-flow agent spawn documentation-sync \
  --task "Generate docs from TypeScript interfaces" \
  --watch \
  --auto-commit
```

## Advanced Features

### Custom GitHub Actions
```yaml
- name: Claude Flow Analysis
  uses: claude-flow/github-action@v1
  with:
    agents: 'code-review-swarm,security-scanner'
    task: 'Comprehensive PR analysis'
    token: ${{ secrets.GITHUB_TOKEN }}
```

### Webhook Integration
```javascript
// Webhook handler for automatic agent deployment
app.post('/github-webhook', async (req, res) => {
  const { action, pull_request } = req.body;
  
  if (action === 'opened') {
    await claudeFlow.agent.spawn('pr-manager', {
      task: `Review PR #${pull_request.number}`,
      autoAssign: true
    });
  }
});
```

### Performance Optimization
```bash
# Parallel PR processing
npx claude-flow task orchestrate \
  --task "Process 50 pending PRs" \
  --strategy parallel \
  --max-concurrent 10 \
  --memory-pool shared
```

## Configuration

### GitHub Token Setup
```bash
# Set GitHub token for API access
export GITHUB_TOKEN=your_github_token

# Or use Claude Flow config
npx claude-flow config set github.token your_github_token
```

### Repository Settings
```json
{
  "github": {
    "defaultBranch": "main",
    "protectedBranches": ["main", "production"],
    "requiredReviews": 2,
    "autoMerge": {
      "enabled": true,
      "strategy": "squash"
    }
  }
}
```

## Monitoring and Metrics

### Repository Health Dashboard
```bash
# Generate comprehensive metrics
npx claude-flow agent spawn github-metrics \
  --task "Create monthly dashboard" \
  --export-format "html" \
  --include-visualizations
```

### Activity Tracking
```javascript
const metrics = await claudeFlow.github.getMetrics({
  repo: 'owner/repo',
  period: '30d',
  metrics: ['commits', 'prs', 'issues', 'contributors']
});
```

## Error Handling

### Common Issues
1. **Rate Limiting**: Implement exponential backoff
2. **Token Permissions**: Ensure proper scopes
3. **Webhook Failures**: Use retry logic
4. **Merge Conflicts**: Automated resolution strategies

### Recovery Patterns
```javascript
const retryConfig = {
  maxRetries: 3,
  backoff: 'exponential',
  onError: (error) => {
    if (error.status === 403) {
      // Rate limit - wait longer
      return { wait: 60000 };
    }
  }
};
```

## Next Steps

- Explore [Workflow Orchestration](./Workflow-Orchestration.md) for complex task coordination
- Learn about [Development Patterns](./Development-Patterns.md) for best practices
- Review [API Reference](./API-Reference.md) for detailed command documentation