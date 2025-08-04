# Claude Code Configuration for Agile Development Teams

## 🚀 CRITICAL: Sprint-Based Parallel Execution

**MANDATORY RULE**: In Agile environments, ALL development activities MUST be sprint-aligned and parallel:

1. **Sprint Planning** → Initialize swarm with sprint scope in ONE call
2. **Daily Standups** → Batch ALL status updates together
3. **Sprint Execution** → Parallel task execution across team members
4. **Sprint Review** → Batch ALL deliverable validations together

## 🏃‍♂️ AGILE SWARM ORCHESTRATION PATTERN

### Sprint Initialization (Single Message)

```javascript
[BatchTool - Sprint Start]:
  // Initialize sprint swarm
  - mcp__claude-flow__swarm_init { 
      topology: "mesh", 
      maxAgents: 6, 
      strategy: "agile_sprint" 
    }
  
  // Spawn Agile-specific agents
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Scrum Master" }
  - mcp__claude-flow__agent_spawn { type: "architect", name: "Technical Lead" }
  - mcp__claude-flow__agent_spawn { type: "coder", name: "Frontend Dev" }
  - mcp__claude-flow__agent_spawn { type: "coder", name: "Backend Dev" }
  - mcp__claude-flow__agent_spawn { type: "tester", name: "QA Engineer" }
  - mcp__claude-flow__agent_spawn { type: "analyst", name: "Product Owner" }

  // Sprint Planning todos - ALL user stories at once
  - TodoWrite { todos: [
      { id: "sprint-planning", content: "Conduct sprint planning session", status: "completed", priority: "high" },
      { id: "story-breakdown", content: "Break down user stories into tasks", status: "in_progress", priority: "high" },
      { id: "definition-of-done", content: "Define acceptance criteria", status: "pending", priority: "high" },
      { id: "velocity-estimation", content: "Estimate story points", status: "pending", priority: "high" },
      { id: "sprint-backlog", content: "Create sprint backlog", status: "pending", priority: "high" },
      { id: "daily-standup-1", content: "Day 1 - Sprint kickoff standup", status: "pending", priority: "medium" },
      { id: "feature-development", content: "Implement core features", status: "pending", priority: "high" },
      { id: "continuous-testing", content: "Run automated tests continuously", status: "pending", priority: "medium" },
      { id: "sprint-review", content: "Conduct sprint review", status: "pending", priority: "medium" },
      { id: "retrospective", content: "Sprint retrospective", status: "pending", priority: "low" }
    ]}

  // Initialize Agile memory context
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "agile/sprint_context", 
      value: { sprint_number: 1, duration: "2_weeks", methodology: "scrum" } 
    }
```

## 📋 SCRUM FRAMEWORK INTEGRATION

### Daily Standup Coordination

**MANDATORY**: Every team member MUST use coordination hooks for standups:

```bash
# Daily standup check-in (each developer runs this)
npx claude-flow@alpha hooks pre-task --description "Daily standup check-in" --auto-spawn-agents false
npx claude-flow@alpha hooks notify --message "Yesterday: [completed work], Today: [planned work], Blockers: [impediments]" --telemetry true
```

### Sprint Execution Pattern

**Agent Prompt Template for Agile Teams:**

```
You are the [Role] in an Agile Scrum team.

MANDATORY AGILE COORDINATION:
1. STANDUP: Run standup hooks daily at 9 AM
2. PROGRESS: Update sprint board after each commit
3. BLOCKERS: Immediately report impediments to Scrum Master
4. DEFINITION OF DONE: Validate all acceptance criteria

Your sprint commitment: [specific user stories/tasks]
Sprint goal: [sprint goal]
Definition of Done: [DoD criteria]

REMEMBER: Focus on sprint goal and collaborate through daily standups!
```

### User Story Development Workflow

```javascript
// ✅ CORRECT: Parallel user story development
[BatchTool - Feature Development]:
  // All user story tasks in parallel
  - Task("Frontend Dev: Implement user login UI with acceptance criteria validation")
  - Task("Backend Dev: Create authentication API endpoints with unit tests")
  - Task("QA Engineer: Write acceptance tests for login feature")
  - Task("Product Owner: Review feature against acceptance criteria")

  // Batch file operations for the feature
  - Write("src/components/LoginForm.tsx", loginFormCode)
  - Write("src/api/auth.ts", authApiCode)
  - Write("tests/login.test.ts", loginTestCode)
  - Write("docs/login-feature.md", featureDocumentation)

  // Sprint board updates
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "agile/sprint_board/login_story", 
      value: { status: "in_progress", assignee: "team", story_points: 8 } 
    }
```

## 🔄 KANBAN WORKFLOW ADAPTATION

### Continuous Flow Pattern

For Kanban teams, use continuous deployment strategy:

```javascript
[BatchTool - Kanban Flow]:
  // Initialize continuous flow swarm
  - mcp__claude-flow__swarm_init { 
      topology: "ring", 
      maxAgents: 4, 
      strategy: "continuous_flow" 
    }

  // Kanban-specific agents
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Flow Master" }
  - mcp__claude-flow__agent_spawn { type: "coder", name: "Developer" }
  - mcp__claude-flow__agent_spawn { type: "tester", name: "QA" }
  - mcp__claude-flow__agent_spawn { type: "analyst", name: "Business Analyst" }

  // WIP-limited todos (Work In Progress limits)
  - TodoWrite { todos: [
      { id: "wip-todo", content: "New feature request", status: "pending", priority: "medium" },
      { id: "wip-doing-1", content: "User profile enhancement", status: "in_progress", priority: "high" },
      { id: "wip-doing-2", content: "API optimization", status: "in_progress", priority: "high" },
      { id: "wip-review", content: "Code review for payment feature", status: "in_progress", priority: "medium" },
      { id: "wip-done", content: "Bug fix for navigation", status: "completed", priority: "high" }
    ]}
```

## 🎯 RETROSPECTIVE AND CONTINUOUS IMPROVEMENT

### Sprint Retrospective Pattern

```bash
# Sprint end retrospective coordination
npx claude-flow@alpha hooks post-task --task-id "sprint_retrospective" --analyze-performance true
npx claude-flow@alpha hooks session-end --export-metrics true --generate-summary true

# Store retrospective insights
npx claude-flow@alpha hooks notify --message "Sprint retrospective: [what went well], [what to improve], [action items]" --telemetry true
```

### Velocity Tracking and Planning

```javascript
// Track sprint velocity and team metrics
- mcp__claude-flow__memory_usage { 
    action: "store", 
    key: "agile/velocity_tracking", 
    value: { 
      sprint_number: 1,
      planned_points: 40,
      completed_points: 35,
      velocity: 35,
      team_capacity: 80,
      burn_down_trend: "on_track"
    } 
  }
```

## 🚀 AGILE BEST PRACTICES FOR CLAUDE CODE

### ✅ DO:

- **Sprint Boundaries**: Always align swarm initialization with sprint boundaries
- **Daily Standups**: Use coordination hooks for daily progress updates
- **Parallel Development**: Execute user stories in parallel within sprint capacity
- **Continuous Integration**: Batch all testing and deployment operations
- **Retrospective Learning**: Store sprint learnings in persistent memory
- **Cross-functional Coordination**: Include all team roles in swarm configuration

### ❌ DON'T:

- Never split user story development across multiple sequential messages
- Don't update sprint board one task at a time - batch all updates
- Avoid creating new agents mid-sprint without team consensus
- Don't break sprint scope without proper backlog refinement
- Never skip retrospective memory storage for continuous improvement

## 📊 AGILE METRICS AND REPORTING

### Sprint Burndown Integration

```bash
# Daily burndown update (automated)
npx claude-flow@alpha hooks post-edit --file "sprint-burndown.json" --memory-key "agile/burndown/day_${DAY}"
```

### Team Performance Dashboard

```javascript
// Sprint performance metrics
- mcp__claude-flow__performance_report { 
    format: "agile_dashboard", 
    timeframe: "sprint",
    metrics: ["velocity", "burndown", "defect_rate", "team_happiness"] 
  }
```

## 🔧 TOOL INTEGRATION FOR AGILE TEAMS

### JIRA/Azure DevOps Integration

```bash
# Sync with external Agile tools
npx claude-flow@alpha hooks notify --message "Sync sprint board with JIRA" --integration "jira"
```

### CI/CD Pipeline for Agile

```javascript
[BatchTool - Agile CI/CD]:
  // Continuous integration setup
  - Bash("npm install && npm test && npm run build")
  - Bash("docker build -t feature-branch .")
  - Bash("kubectl apply -f k8s/staging.yaml")
  
  // Sprint demo preparation
  - Write(".github/workflows/sprint-demo.yml", cicdConfig)
  - Write("docs/sprint-demo-script.md", demoScript)
```

## 🎭 ROLE-SPECIFIC PATTERNS

### Scrum Master Coordination

```
You are the Scrum Master agent in an Agile team.

MANDATORY SCRUM MASTER DUTIES:
1. FACILITATION: Lead daily standups and sprint ceremonies
2. IMPEDIMENT REMOVAL: Track and resolve team blockers
3. PROCESS IMPROVEMENT: Facilitate retrospectives and action items
4. TEAM PROTECTION: Shield team from external interruptions

Your focus: Team velocity, process adherence, continuous improvement
```

### Product Owner Coordination

```
You are the Product Owner agent in an Agile team.

MANDATORY PRODUCT OWNER DUTIES:
1. BACKLOG MANAGEMENT: Prioritize and refine product backlog
2. ACCEPTANCE CRITERIA: Define clear DoD for each story
3. STAKEHOLDER COMMUNICATION: Represent customer needs
4. SPRINT PLANNING: Participate in story point estimation

Your focus: Product value, customer satisfaction, ROI maximization
```

### Development Team Coordination

```
You are a Development Team member in an Agile team.

MANDATORY DEVELOPER DUTIES:
1. SELF-ORGANIZATION: Collaborate on task breakdown and estimation
2. QUALITY ASSURANCE: Write tests and ensure code quality
3. CONTINUOUS INTEGRATION: Commit frequently and integrate early
4. KNOWLEDGE SHARING: Participate in code reviews and pair programming

Your focus: Sprint goal achievement, technical excellence, team collaboration
```

## 📈 SCALING AGILE WITH CLAUDE FLOW

### SAFe (Scaled Agile Framework) Integration

```javascript
// Program Increment (PI) Planning
[BatchTool - SAFe PI Planning]:
  - mcp__claude-flow__swarm_init { 
      topology: "hierarchical", 
      maxAgents: 12, 
      strategy: "safe_pi_planning" 
    }
  
  // ART (Agile Release Train) agents
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Release Train Engineer" }
  - mcp__claude-flow__agent_spawn { type: "architect", name: "System Architect" }
  - mcp__claude-flow__agent_spawn { type: "analyst", name: "Product Manager" }
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Scrum Master Team 1" }
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Scrum Master Team 2" }
```

## 💡 AGILE INNOVATION PATTERNS

### Hackathon/Innovation Sprint

```javascript
[BatchTool - Innovation Sprint]:
  // 24-hour hackathon swarm
  - mcp__claude-flow__swarm_init { 
      topology: "mesh", 
      maxAgents: 8, 
      strategy: "innovation_sprint" 
    }
  
  // Cross-functional innovation team
  - mcp__claude-flow__agent_spawn { type: "researcher", name: "Innovation Lead" }
  - mcp__claude-flow__agent_spawn { type: "coder", name: "Rapid Prototyper" }
  - mcp__claude-flow__agent_spawn { type: "analyst", name: "UX Designer" }
  - mcp__claude-flow__agent_spawn { type: "tester", name: "Validation Engineer" }
```

---

**Remember**: Agile is about individuals and interactions, working software, customer collaboration, and responding to change. Claude Flow enhances these values through intelligent coordination and parallel execution!