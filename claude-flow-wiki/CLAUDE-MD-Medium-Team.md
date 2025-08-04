# Claude Code Configuration for Medium Teams (6-20 Developers)

## 🚀 CRITICAL: Structured Team Parallel Execution

**MANDATORY RULE**: In medium team environments, ALL development activities MUST be structured, scalable, and efficiently coordinated:

1. **Multi-Squad Coordination** → Initialize swarm with squad-based topology
2. **Feature Team Allocation** → Batch ALL cross-team dependencies together
3. **Architecture Governance** → Parallel execution with architectural oversight
4. **Cross-Team Communication** → Batch ALL inter-team coordination activities

## 👥 MEDIUM TEAM SWARM ORCHESTRATION PATTERN

### Multi-Squad Project Initialization (Single Message)

```javascript
[BatchTool - Medium Team Setup]:
  // Initialize hierarchical multi-squad swarm
  - mcp__claude-flow__swarm_init { 
      topology: "hierarchical", 
      maxAgents: 12, 
      strategy: "medium_team_structured" 
    }
  
  // Spawn organizational agents
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Engineering Manager" }
  - mcp__claude-flow__agent_spawn { type: "architect", name: "Technical Architect" }
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Frontend Squad Lead" }
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Backend Squad Lead" }
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "Platform Squad Lead" }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "DevOps Engineer" }
  - mcp__claude-flow__agent_spawn { type: "tester", name: "QA Lead" }
  - mcp__claude-flow__agent_spawn { type: "analyst", name: "Product Manager" }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Security Engineer" }
  - mcp__claude-flow__agent_spawn { type: "monitor", name: "SRE Lead" }

  // Medium team todos - ALL organizational aspects at once
  - TodoWrite { todos: [
      { id: "team-structure", content: "Define squad structure and responsibilities", status: "completed", priority: "high" },
      { id: "architecture-governance", content: "Establish architectural decision-making process", status: "in_progress", priority: "high" },
      { id: "cross-team-communication", content: "Set up inter-squad communication protocols", status: "pending", priority: "high" },
      { id: "technical-standards", content: "Define organization-wide technical standards", status: "pending", priority: "high" },
      { id: "feature-planning", content: "Implement cross-squad feature planning process", status: "pending", priority: "high" },
      { id: "code-ownership", content: "Define code ownership and review responsibilities", status: "pending", priority: "medium" },
      { id: "deployment-coordination", content: "Coordinate deployment processes across squads", status: "pending", priority: "medium" },
      { id: "knowledge-management", content: "Implement organization-wide knowledge sharing", status: "pending", priority: "medium" },
      { id: "performance-monitoring", content: "Set up cross-team performance tracking", status: "pending", priority: "low" },
      { id: "team-development", content: "Plan career development and skill advancement", status: "pending", priority: "low" }
    ]}

  // Initialize medium team memory context
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "medium_team/organization_context", 
      value: { 
        team_size: 15,
        squad_structure: {
          frontend_squad: 5,
          backend_squad: 6,
          platform_squad: 4
        },
        communication_style: "structured_with_autonomy",
        meeting_cadence: "daily_squads_weekly_all_hands",
        tech_stack: "microservices_react_node_kubernetes",
        deployment_strategy: "continuous_deployment_with_gates"
      } 
    }
```

## 🏗️ SQUAD-BASED ARCHITECTURE

### Squad Coordination and Autonomy

**MANDATORY**: Each squad MUST maintain autonomy while coordinating with other squads:

```bash
# Cross-squad coordination (squad leads run this)
npx claude-flow@alpha hooks pre-task --description "Cross-squad coordination and dependency management" --auto-spawn-agents false
npx claude-flow@alpha hooks notify --message "Squad: [name], Dependencies: [other squads], Blockers: [cross-squad issues], Deliverables: [squad contributions]" --telemetry true
```

### Medium Team Agent Template

```
You are the [Squad Role] in a medium-sized engineering organization.

MANDATORY MEDIUM TEAM COORDINATION:
1. SQUAD AUTONOMY: Make decisions within your squad's domain
2. CROSS-SQUAD COMMUNICATION: Coordinate dependencies and interfaces
3. ARCHITECTURAL ALIGNMENT: Follow organization-wide technical standards
4. KNOWLEDGE SHARING: Contribute to and consume from organization knowledge base
5. MENTORSHIP: Support junior developers across the organization

Your squad responsibility: [specific squad domain and ownership]
Cross-squad dependencies: [other squads you coordinate with]
Architectural constraints: [organization-wide technical standards]

REMEMBER: Balance squad autonomy with organizational alignment!
```

## 🎯 FEATURE DEVELOPMENT ACROSS SQUADS

### Cross-Squad Feature Implementation

```javascript
// ✅ CORRECT: Cross-squad coordinated feature development
[BatchTool - Cross-Squad Feature Development]:
  // Squad coordination for large features
  - Task("Frontend Squad: Build user interface components and integrate with design system")
  - Task("Backend Squad: Implement API services and business logic with proper contracts")
  - Task("Platform Squad: Provide infrastructure support and deployment automation")
  - Task("QA Lead: Coordinate testing strategy across all squads")
  - Task("Technical Architect: Ensure architectural consistency and review integration points")

  // Frontend Squad deliverables
  - Write("apps/web-app/src/components/feature/UserManagement.tsx", userManagementComponentCode)
  - Write("apps/web-app/src/hooks/useUserManagement.ts", userManagementHookCode)
  - Write("packages/ui-components/src/UserTable/UserTable.tsx", userTableComponentCode)
  - Write("packages/ui-components/src/UserForm/UserForm.tsx", userFormComponentCode)

  // Backend Squad deliverables
  - Write("services/user-service/src/controllers/userController.js", userControllerCode)
  - Write("services/user-service/src/services/userService.js", userServiceCode)
  - Write("services/user-service/src/models/User.js", userModelCode)
  - Write("services/auth-service/src/middleware/userAuthz.js", userAuthorizationCode)

  // Platform Squad deliverables
  - Write("infrastructure/k8s/user-service-deployment.yaml", userServiceDeploymentCode)
  - Write("infrastructure/terraform/user-service-resources.tf", userServiceInfraCode)
  - Write("platform/monitoring/user-service-dashboard.json", userServiceMonitoringCode)
  - Write("platform/ci-cd/user-service-pipeline.yml", userServicePipelineCode)

  // Shared contracts and documentation
  - Write("contracts/user-service-api.yaml", userServiceAPIContract)
  - Write("docs/architecture/user-management-architecture.md", userManagementArchitectureDoc)
  - Write("docs/cross-squad/user-feature-requirements.md", userFeatureRequirementsDoc)

  // Integration testing
  - Write("tests/integration/cross-squad/user-management-integration.test.js", crossSquadIntegrationTestCode)
  - Write("tests/e2e/user-management-flow.spec.js", userManagementE2ETestCode)

  // Store cross-squad feature progress
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "medium_team/features/user_management", 
      value: { 
        status: "completed",
        participating_squads: ["frontend", "backend", "platform"],
        integration_points: 4,
        cross_squad_reviews: 6,
        architectural_decisions: ["event_driven_updates", "microservice_boundaries"],
        coordination_challenges: ["api_versioning", "deployment_sequencing"]
      } 
    }
```

## 🏛️ ARCHITECTURAL GOVERNANCE

### Technical Decision Making Process

```javascript
[BatchTool - Architecture Governance]:
  // Architecture Decision Records (ADRs)
  - Write("docs/architecture/decisions/001-microservices-architecture.md", microservicesADRCode)
  - Write("docs/architecture/decisions/002-database-per-service.md", databasePerServiceADRCode)
  - Write("docs/architecture/decisions/003-event-driven-communication.md", eventDrivenADRCode)
  - Write("docs/architecture/decisions/004-api-versioning-strategy.md", apiVersioningADRCode)

  // Technical standards and guidelines
  - Write("docs/standards/coding-standards.md", organizationCodingStandardsCode)
  - Write("docs/standards/api-design-guidelines.md", apiDesignGuidelinesCode)
  - Write("docs/standards/database-conventions.md", databaseConventionsCode)
  - Write("docs/standards/security-guidelines.md", securityGuidelinesCode)

  // Architecture review process
  - Write("docs/processes/architecture-review-process.md", architectureReviewProcessCode)
  - Write("docs/processes/technical-rfc-template.md", technicalRFCTemplateCode)
  - Write("templates/architecture-proposal.md", architectureProposalTemplateCode)

  // Cross-squad technical coordination
  - Write(".github/CODEOWNERS", codeOwnersCode)
  - Write("docs/ownership/service-ownership-matrix.md", serviceOwnershipMatrixCode)
  - Write("docs/ownership/cross-squad-dependencies.md", crossSquadDependenciesCode)

  // Store architectural governance
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "medium_team/architecture_governance", 
      value: { 
        adr_count: 15,
        active_rfcs: 3,
        architecture_review_frequency: "weekly",
        technical_debt_items: 8,
        cross_squad_integration_patterns: ["event_sourcing", "api_gateway", "shared_libraries"]
      } 
    }
```

### Microservices Coordination

```javascript
[BatchTool - Microservices Management]:
  // Service registry and discovery
  - Write("platform/service-registry/registry.yaml", serviceRegistryCode)
  - Write("platform/api-gateway/gateway-config.yaml", apiGatewayConfigCode)
  - Write("platform/load-balancer/lb-config.yaml", loadBalancerConfigCode)

  // Inter-service communication
  - Write("shared/events/user-events.js", userEventsCode)
  - Write("shared/events/order-events.js", orderEventsCode)
  - Write("shared/contracts/service-contracts.yaml", serviceContractsCode)

  // Service monitoring and observability
  - Write("platform/monitoring/service-metrics.yaml", serviceMetricsCode)
  - Write("platform/logging/service-logging.yaml", serviceLoggingCode)
  - Write("platform/tracing/distributed-tracing.yaml", distributedTracingCode)
```

## 📊 CROSS-TEAM COMMUNICATION AND PROCESSES

### Structured Communication Framework

```javascript
[BatchTool - Communication Framework]:
  // Meeting structures and templates
  - Write("docs/meetings/all-hands-template.md", allHandsTemplateCode)
  - Write("docs/meetings/squad-sync-template.md", squadSyncTemplateCode)
  - Write("docs/meetings/architecture-review-template.md", architectureReviewTemplateCode)
  - Write("docs/meetings/cross-squad-planning-template.md", crossSquadPlanningTemplateCode)

  // Communication protocols
  - Write("docs/communication/async-communication-guidelines.md", asyncCommunicationGuidelinesCode)
  - Write("docs/communication/escalation-procedures.md", escalationProceduresCode)
  - Write("docs/communication/incident-communication.md", incidentCommunicationCode)

  // Knowledge sharing systems
  - Write("wiki/onboarding/new-developer-guide.md", newDeveloperGuideCode)
  - Write("wiki/processes/code-review-guidelines.md", codeReviewGuidelinesCode)
  - Write("wiki/technical/troubleshooting-runbook.md", troubleshootingRunbookCode)

  // Cross-squad coordination tools
  - Write("tools/squad-dashboard/dashboard-config.json", squadDashboardConfigCode)
  - Write("tools/dependency-tracker/dependency-config.yaml", dependencyTrackerConfigCode)

  // Store communication metrics
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "medium_team/communication_metrics", 
      value: { 
        all_hands_frequency: "weekly",
        squad_sync_frequency: "daily",
        cross_squad_meetings: "bi_weekly",
        documentation_coverage: 82,
        knowledge_sharing_sessions: 4,
        communication_satisfaction: 4.1
      } 
    }
```

### Agile at Scale (SAFe/LeSS Integration)

```bash
# Scaled Agile coordination
npx claude-flow@alpha hooks pre-task --description "Program increment planning and cross-squad coordination"
npx claude-flow@alpha hooks notify --message "PI Planning: [objectives], Squad commitments: [deliverables], Dependencies: [cross-squad items]" --telemetry true
```

## 🔧 DEVELOPMENT WORKFLOW AND TOOLING

### Organization-Wide Development Standards

```javascript
[BatchTool - Development Standards]:
  // Monorepo structure and tooling
  - Write("nx.json", nxWorkspaceConfigCode)
  - Write("workspace.json", workspaceConfigCode)
  - Write("package.json", monorepoPackageJsonCode)
  - Write("lerna.json", lernaConfigCode)

  // Shared tooling configuration
  - Write(".eslintrc.js", organizationEslintConfigCode)
  - Write(".prettierrc.js", organizationPrettierConfigCode)
  - Write("jest.config.js", organizationJestConfigCode)
  - Write("tsconfig.base.json", baseTsConfigCode)

  // CI/CD pipeline for multiple squads
  - Write(".github/workflows/ci-cd-matrix.yml", ciCdMatrixWorkflowCode)
  - Write(".github/workflows/cross-squad-integration.yml", crossSquadIntegrationWorkflowCode)
  - Write("scripts/deploy-coordination.sh", deployCoordinationScript)

  // Development environment standardization
  - Write("docker-compose.dev.yml", devEnvironmentComposeCode)
  - Write(".devcontainer/devcontainer.json", organizationDevContainerCode)
  - Write("scripts/setup-dev-environment.sh", devEnvironmentSetupScript)

  // Code quality gates
  - Write("quality-gates/organization-quality-gates.js", organizationQualityGatesCode)
  - Write("sonar-project.properties", sonarQubeOrgConfigCode)
  - Write("scripts/pre-commit-organization.sh", organizationPreCommitScript)
```

## 🚀 MEDIUM TEAM BEST PRACTICES

### ✅ DO:

- **Clear Squad Boundaries**: Define clear ownership and responsibilities for each squad
- **Architectural Alignment**: Maintain consistency across squads through governance
- **Cross-Squad Collaboration**: Foster collaboration while maintaining squad autonomy
- **Standardized Processes**: Implement organization-wide standards for quality and consistency
- **Knowledge Sharing**: Create systems for sharing knowledge across squads
- **Structured Communication**: Use formal communication channels for cross-squad coordination
- **Continuous Improvement**: Regularly assess and improve cross-squad processes

### ❌ DON'T:

- Don't create silos between squads - encourage cross-pollination
- Avoid micromanagement - trust squads to deliver within their domains
- Don't ignore cross-squad dependencies - plan and coordinate actively
- Never skip architectural reviews for significant changes
- Don't let technical debt accumulate without organization-wide visibility
- Avoid inconsistent tooling and processes across squads
- Don't underestimate the complexity of cross-squad coordination

## 📈 PERFORMANCE AND SCALING MANAGEMENT

### Organization-Wide Metrics and KPIs

```javascript
[BatchTool - Organization Metrics]:
  // Performance dashboards
  - Write("dashboards/engineering-metrics.json", engineeringMetricsDashboardCode)
  - Write("dashboards/squad-performance.json", squadPerformanceDashboardCode)
  - Write("dashboards/cross-squad-dependencies.json", crossSquadDependenciesDashboardCode)

  // Metrics collection and analysis
  - Write("metrics/deployment-frequency.js", deploymentFrequencyMetricsCode)
  - Write("metrics/lead-time.js", leadTimeMetricsCode)
  - Write("metrics/mean-time-to-recovery.js", mttrMetricsCode)
  - Write("metrics/squad-velocity.js", squadVelocityMetricsCode)

  // Performance optimization
  - Write("performance/organization-performance-budget.js", organizationPerformanceBudgetCode)
  - Write("performance/cross-squad-performance-review.js", crossSquadPerformanceReviewCode)

  // Store organization metrics
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "medium_team/organization_metrics", 
      value: { 
        deployment_frequency: "daily",
        lead_time: "3_days_average",
        mttr: "45_minutes",
        squad_velocity_variance: 15,
        cross_squad_dependency_resolution_time: "2_days",
        team_satisfaction: 4.2,
        retention_rate: 94
      } 
    }
```

### Capacity Planning and Resource Management

```javascript
[BatchTool - Capacity Planning]:
  // Resource allocation tracking
  - Write("planning/squad-capacity-planning.md", squadCapacityPlanningCode)
  - Write("planning/cross-squad-resource-allocation.md", crossSquadResourceAllocationCode)
  - Write("planning/skill-matrix.md", organizationSkillMatrixCode)

  // Project portfolio management
  - Write("portfolio/project-prioritization.md", projectPrioritizationCode)
  - Write("portfolio/resource-constraints.md", resourceConstraintsCode)
  - Write("portfolio/dependency-mapping.md", dependencyMappingCode)

  // Career development and growth
  - Write("career/career-ladders.md", careerLaddersCode)
  - Write("career/skill-development-plans.md", skillDevelopmentPlansCode)
  - Write("career/mentorship-program.md", mentorshipProgramCode)
```

## 🛡️ SECURITY AND COMPLIANCE AT SCALE

### Organization-Wide Security Framework

```javascript
[BatchTool - Security Framework]:
  // Security policies and procedures
  - Write("security/organization-security-policy.md", organizationSecurityPolicyCode)
  - Write("security/squad-security-responsibilities.md", squadSecurityResponsibilitiesCode)
  - Write("security/incident-response-procedures.md", incidentResponseProceduresCode)

  // Security tooling and automation
  - Write("security/automated-security-scanning.yml", automatedSecurityScanningCode)
  - Write("security/vulnerability-management.js", vulnerabilityManagementCode)
  - Write("security/compliance-monitoring.js", complianceMonitoringCode)

  // Security training and awareness
  - Write("security/security-training-program.md", securityTrainingProgramCode)
  - Write("security/secure-coding-guidelines.md", secureCodingGuidelinesCode)
```

## 💡 MEDIUM TEAM SUCCESS PATTERNS

### Squad Formation and Evolution

```javascript
// Squad evolution tracking
- mcp__claude-flow__memory_usage { 
    action: "store", 
    key: "medium_team/squad_evolution", 
    value: { 
      formation_strategy: "feature_based_squads",
      optimal_squad_size: "5_to_7_developers",
      cross_squad_rotation: "quarterly",
      specialization_balance: "70_specialized_30_generalist",
      autonomy_level: "high_with_alignment"
    } 
  }
```

### Technology Adoption Process

```bash
# Technology adoption coordination
npx claude-flow@alpha hooks pre-task --description "New technology evaluation and adoption across squads"
npx claude-flow@alpha hooks notify --message "Technology evaluation: [technology], Pilot squad: [squad], Success criteria: [metrics], Timeline: [duration]" --telemetry true
```

### Cross-Squad Learning and Development

```javascript
[BatchTool - Learning and Development]:
  // Learning initiatives
  - Write("learning/tech-talks-program.md", techTalksProgramCode)
  - Write("learning/cross-squad-pairing.md", crossSquadPairingCode)
  - Write("learning/innovation-time.md", innovationTimeCode)

  // Knowledge transfer mechanisms
  - Write("knowledge-transfer/onboarding-buddy-system.md", onboardingBuddySystemCode)
  - Write("knowledge-transfer/cross-squad-shadowing.md", crossSquadShadowingCode)
  - Write("knowledge-transfer/technical-guilds.md", technicalGuildsCode)
```

---

**Remember**: Medium teams require structured coordination while maintaining squad autonomy and innovation. Claude Flow enhances medium team dynamics by providing intelligent cross-squad coordination, architectural governance, and scalable communication patterns that keep teams aligned and productive!