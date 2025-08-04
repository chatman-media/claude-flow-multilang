# Claude Code Configuration for CI/CD and DevOps Teams

## 🚀 CRITICAL: Pipeline-First Parallel Execution

**MANDATORY RULE**: In CI/CD environments, ALL development activities MUST be pipeline-aligned and deployment-ready:

1. **Build Pipeline** → Initialize swarm with deployment scope in ONE call
2. **Test Automation** → Batch ALL testing stages together
3. **Deployment Strategy** → Parallel execution across environments
4. **Monitoring Setup** → Batch ALL observability components together

## 🔧 CI/CD SWARM ORCHESTRATION PATTERN

### Pipeline Initialization (Single Message)

```javascript
[BatchTool - CI/CD Pipeline Setup]:
  // Initialize deployment-focused swarm
  - mcp__claude-flow__swarm_init { 
      topology: "hierarchical", 
      maxAgents: 10, 
      strategy: "cicd_pipeline" 
    }
  
  // Spawn DevOps-specific agents
  - mcp__claude-flow__agent_spawn { type: "coordinator", name: "DevOps Engineer" }
  - mcp__claude-flow__agent_spawn { type: "architect", name: "Platform Architect" }
  - mcp__claude-flow__agent_spawn { type: "coder", name: "Pipeline Developer" }
  - mcp__claude-flow__agent_spawn { type: "tester", name: "QA Automation Engineer" }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Security Engineer" }
  - mcp__claude-flow__agent_spawn { type: "monitor", name: "SRE Engineer" }
  - mcp__claude-flow__agent_spawn { type: "optimizer", name: "Performance Engineer" }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Infrastructure Engineer" }

  // CI/CD pipeline todos - ALL stages at once
  - TodoWrite { todos: [
      { id: "pipeline-design", content: "Design CI/CD pipeline architecture", status: "completed", priority: "high" },
      { id: "source-control", content: "Set up version control and branching strategy", status: "in_progress", priority: "high" },
      { id: "build-automation", content: "Configure automated build processes", status: "pending", priority: "high" },
      { id: "test-automation", content: "Implement comprehensive test automation", status: "pending", priority: "high" },
      { id: "security-scanning", content: "Integrate security scanning tools", status: "pending", priority: "high" },
      { id: "deployment-automation", content: "Set up automated deployment pipelines", status: "pending", priority: "high" },
      { id: "environment-management", content: "Configure staging and production environments", status: "pending", priority: "medium" },
      { id: "monitoring-setup", content: "Implement comprehensive monitoring and alerting", status: "pending", priority: "medium" },
      { id: "rollback-strategy", content: "Design rollback and disaster recovery procedures", status: "pending", priority: "medium" },
      { id: "performance-testing", content: "Set up performance and load testing", status: "pending", priority: "low" }
    ]}

  // Initialize CI/CD memory context
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "cicd/pipeline_context", 
      value: { 
        platform: "kubernetes",
        ci_tool: "github_actions",
        deployment_strategy: "blue_green",
        environments: ["dev", "staging", "prod"],
        testing_levels: ["unit", "integration", "e2e", "performance"]
      } 
    }
```

## 🏗️ BUILD AUTOMATION COORDINATION

### Multi-Stage Build Pipeline

**MANDATORY**: Every build stage MUST use coordination hooks:

```bash
# Build stage coordination (automated in CI)
npx claude-flow@alpha hooks pre-task --description "Build stage execution" --auto-spawn-agents false
npx claude-flow@alpha hooks post-edit --file "build-artifacts" --memory-key "cicd/build/stage_${STAGE}"
npx claude-flow@alpha hooks notify --message "Build status: [success/failure], Artifacts: [list]" --telemetry true
```

### CI/CD Agent Template

```
You are the [CI/CD Role] in a DevOps team.

MANDATORY CI/CD COORDINATION:
1. AUTOMATION FIRST: Every process must be automated and repeatable
2. QUALITY GATES: Implement quality checks at every stage
3. SECURITY INTEGRATION: Security scanning at every pipeline stage
4. MONITORING: Comprehensive observability and alerting

Your pipeline responsibility: [specific stage/component]
Quality gates: [criteria for stage success]
Security requirements: [security policies to enforce]

REMEMBER: Fail fast, recover quickly, and always be deployment-ready!
```

## 🔄 GITHUB ACTIONS PIPELINE

### Comprehensive Workflow Implementation

```javascript
// ✅ CORRECT: Complete CI/CD pipeline setup
[BatchTool - GitHub Actions Setup]:
  // All pipeline files created together
  - Write(".github/workflows/ci.yml", ciWorkflowCode)
  - Write(".github/workflows/cd.yml", cdWorkflowCode)
  - Write(".github/workflows/security.yml", securityWorkflowCode)
  - Write(".github/workflows/performance.yml", performanceWorkflowCode)

  // Pipeline configuration files
  - Write(".github/workflows/build-matrix.yml", buildMatrixConfig)
  - Write(".github/workflows/deploy-staging.yml", stagingDeployConfig)
  - Write(".github/workflows/deploy-production.yml", productionDeployConfig)
  - Write(".github/workflows/rollback.yml", rollbackConfig)

  // Docker and container configuration
  - Write("Dockerfile", dockerfileCode)
  - Write("docker-compose.yml", dockerComposeCode)
  - Write("docker-compose.prod.yml", dockerComposeProdCode)
  - Write(".dockerignore", dockerignoreCode)

  // Kubernetes deployment manifests
  - Write("k8s/namespace.yaml", namespaceConfig)
  - Write("k8s/deployment.yaml", deploymentConfig)
  - Write("k8s/service.yaml", serviceConfig)
  - Write("k8s/ingress.yaml", ingressConfig)
  - Write("k8s/configmap.yaml", configmapConfig)
  - Write("k8s/secret.yaml", secretConfig)

  // Store pipeline configuration
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "cicd/github_actions", 
      value: { 
        workflows: ["ci", "cd", "security", "performance"],
        environments: { staging: "auto", production: "manual" },
        deployment_strategy: "blue_green",
        rollback_enabled: true
      } 
    }
```

### Advanced GitHub Actions Configuration

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Build Docker image
      run: |
        docker build -t ${{ github.repository }}:${{ github.sha }} .
        docker tag ${{ github.repository }}:${{ github.sha }} ${{ github.repository }}:latest
    
    - name: Push to registry
      if: github.ref == 'refs/heads/main'
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push ${{ github.repository }}:${{ github.sha }}
        docker push ${{ github.repository }}:latest
```

## 🧪 TEST AUTOMATION STRATEGY

### Multi-Level Testing Pipeline

```javascript
[BatchTool - Test Automation Setup]:
  // Test infrastructure
  - Write("jest.config.js", jestConfigCode)
  - Write("cypress.config.js", cypressConfigCode)
  - Write("playwright.config.ts", playwrightConfigCode)
  - Write("k6-performance.js", k6PerformanceTestCode)

  // Unit test setup
  - Write("tests/unit/user.test.js", unitTestCode)
  - Write("tests/unit/order.test.js", orderUnitTestCode)
  - Write("tests/unit/payment.test.js", paymentUnitTestCode)

  // Integration test setup
  - Write("tests/integration/api.test.js", apiIntegrationTestCode)
  - Write("tests/integration/database.test.js", databaseIntegrationTestCode)
  - Write("tests/integration/auth.test.js", authIntegrationTestCode)

  // End-to-end test setup
  - Write("tests/e2e/user-journey.spec.js", e2eUserJourneyCode)
  - Write("tests/e2e/checkout-flow.spec.js", e2eCheckoutFlowCode)
  - Write("tests/e2e/admin-panel.spec.js", e2eAdminPanelCode)

  // Performance test setup
  - Write("tests/performance/load-test.js", loadTestCode)
  - Write("tests/performance/stress-test.js", stressTestCode)
  - Write("tests/performance/spike-test.js", spikeTestCode)

  // Test data and fixtures
  - Write("tests/fixtures/users.json", userTestDataCode)
  - Write("tests/fixtures/orders.json", orderTestDataCode)
  - Write("tests/helpers/test-utils.js", testUtilsCode)
```

### Test Quality Gates

```bash
# Test execution with quality gates
npx claude-flow@alpha hooks pre-task --description "Test execution with quality gates"
npx claude-flow@alpha hooks notify --message "Test results: Unit: 95% coverage, Integration: All passed, E2E: 98% success rate" --telemetry true
```

## 🛡️ SECURITY INTEGRATION

### Security-First Pipeline

```javascript
[BatchTool - Security Pipeline]:
  // Security scanning configuration
  - Write(".snyk", snykConfigCode)
  - Write("sonar-project.properties", sonarQubeConfigCode)
  - Write("trivy.yaml", trivyConfigCode)
  - Write("bandit.yaml", banditConfigCode)

  // Security policies
  - Write("security/SECURITY.md", securityPolicy)
  - Write("security/vulnerability-response.md", vulnerabilityResponsePlan)
  - Write("security/access-control.md", accessControlPolicy)

  // SAST/DAST integration
  - Write(".github/workflows/security-scan.yml", securityScanWorkflow)
  - Write("scripts/security-check.sh", securityCheckScript)
  - Write("scripts/dependency-audit.sh", dependencyAuditScript)

  // Container security
  - Write("docker/security.dockerfile", secureDockerfile)
  - Write("k8s/network-policy.yaml", networkPolicyConfig)
  - Write("k8s/pod-security-policy.yaml", podSecurityPolicyConfig)

  // Store security configuration
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "cicd/security_config", 
      value: { 
        sast_tools: ["snyk", "sonarqube", "bandit"],
        dast_tools: ["owasp-zap", "burp-suite"],
        container_scanning: ["trivy", "clair"],
        compliance: ["pci-dss", "gdpr", "sox"]
      } 
    }
```

### Infrastructure as Code Security

```javascript
[BatchTool - IaC Security]:
  // Terraform security scanning
  - Write("terraform/main.tf", terraformMainCode)
  - Write("terraform/security.tf", terraformSecurityCode)
  - Write("terraform/variables.tf", terraformVariablesCode)
  - Write(".tflint.hcl", tflintConfigCode)

  // Kubernetes security policies
  - Write("k8s/rbac.yaml", rbacConfigCode)
  - Write("k8s/service-account.yaml", serviceAccountCode)
  - Write("k8s/security-context.yaml", securityContextCode)

  // Secrets management
  - Write("scripts/setup-secrets.sh", secretsSetupScript)
  - Write("k8s/sealed-secrets.yaml", sealedSecretsConfig)
```

## 🌐 DEPLOYMENT STRATEGIES

### Blue-Green Deployment

```javascript
[BatchTool - Blue-Green Deployment]:
  // Blue-green deployment scripts
  - Write("scripts/deploy-blue-green.sh", blueGreenDeployScript)
  - Write("scripts/switch-traffic.sh", trafficSwitchScript)
  - Write("scripts/rollback.sh", rollbackScript)

  // Kubernetes blue-green configuration
  - Write("k8s/blue-green/blue-deployment.yaml", blueDeploymentConfig)
  - Write("k8s/blue-green/green-deployment.yaml", greenDeploymentConfig)
  - Write("k8s/blue-green/service-blue.yaml", blueServiceConfig)
  - Write("k8s/blue-green/service-green.yaml", greenServiceConfig)

  // Traffic management
  - Write("k8s/blue-green/ingress-controller.yaml", ingressControllerConfig)
  - Write("scripts/health-check.sh", healthCheckScript)
  - Write("scripts/smoke-test.sh", smokeTestScript)
```

### Canary Deployment with Istio

```javascript
[BatchTool - Canary Deployment]:
  // Istio service mesh configuration
  - Write("istio/virtual-service.yaml", virtualServiceConfig)
  - Write("istio/destination-rule.yaml", destinationRuleConfig)
  - Write("istio/gateway.yaml", gatewayConfig)

  // Canary deployment pipeline
  - Write("scripts/canary-deploy.sh", canaryDeployScript)
  - Write("scripts/canary-analyze.sh", canaryAnalysisScript)
  - Write("scripts/canary-promote.sh", canaryPromoteScript)

  // Monitoring for canary
  - Write("monitoring/canary-metrics.yaml", canaryMetricsConfig)
  - Write("monitoring/canary-alerts.yaml", canaryAlertsConfig)
```

## 📊 MONITORING AND OBSERVABILITY

### Comprehensive Monitoring Setup

```javascript
[BatchTool - Monitoring Stack]:
  // Prometheus configuration
  - Write("monitoring/prometheus.yml", prometheusConfig)
  - Write("monitoring/alertmanager.yml", alertmanagerConfig)
  - Write("monitoring/rules.yml", prometheusRules)

  // Grafana dashboards
  - Write("monitoring/grafana/dashboards/application.json", appDashboardConfig)
  - Write("monitoring/grafana/dashboards/infrastructure.json", infraDashboardConfig)
  - Write("monitoring/grafana/dashboards/business.json", businessDashboardConfig)

  // Logging configuration
  - Write("logging/fluentd.conf", fluentdConfig)
  - Write("logging/elasticsearch.yml", elasticsearchConfig)
  - Write("logging/kibana.yml", kibanaConfig)

  // Application metrics
  - Write("src/metrics/application-metrics.js", appMetricsCode)
  - Write("src/metrics/business-metrics.js", businessMetricsCode)
  - Write("src/metrics/performance-metrics.js", performanceMetricsCode)

  // Health checks
  - Write("src/health/health-check.js", healthCheckCode)
  - Write("src/health/readiness-probe.js", readinessProbeCode)
  - Write("src/health/liveness-probe.js", livenessProbeCode)

  // Store monitoring configuration
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "cicd/monitoring_stack", 
      value: { 
        metrics: ["prometheus", "grafana"],
        logging: ["elk_stack", "fluentd"],
        tracing: ["jaeger", "zipkin"],
        alerting: ["pagerduty", "slack"],
        sla_targets: { availability: "99.9%", response_time: "200ms" }
      } 
    }
```

### Application Performance Monitoring

```javascript
[BatchTool - APM Setup]:
  // APM agent configuration
  - Write("apm/newrelic.js", newrelicConfigCode)
  - Write("apm/datadog.js", datadogConfigCode)
  - Write("apm/elastic-apm.js", elasticAPMConfigCode)

  // Custom metrics collection
  - Write("src/telemetry/custom-metrics.js", customMetricsCode)
  - Write("src/telemetry/user-analytics.js", userAnalyticsCode)
  - Write("src/telemetry/business-kpis.js", businessKPIsCode)

  // Performance budgets
  - Write("performance/lighthouse-budget.json", lighthouseBudgetCode)
  - Write("performance/web-vitals-budget.json", webVitalsBudgetCode)
```

## 🚀 CI/CD BEST PRACTICES FOR CLAUDE CODE

### ✅ DO:

- **Pipeline as Code**: Version control all CI/CD configurations
- **Fail Fast**: Implement early quality gates and comprehensive testing
- **Security First**: Integrate security scanning at every pipeline stage
- **Immutable Infrastructure**: Use containerization and Infrastructure as Code
- **Monitoring Everything**: Implement comprehensive observability and alerting
- **Rollback Ready**: Always have automated rollback procedures
- **Environment Parity**: Maintain consistency across all environments

### ❌ DON'T:

- Never deploy without comprehensive testing and security scanning
- Don't skip quality gates even for urgent releases
- Avoid manual deployment processes - automate everything
- Don't ignore security vulnerabilities or technical debt
- Never deploy without proper monitoring and alerting
- Don't skip documentation for deployment and rollback procedures

## 🔧 DEVOPS TOOL INTEGRATION

### GitOps with ArgoCD

```javascript
[BatchTool - GitOps Setup]:
  // ArgoCD application configuration
  - Write("argocd/application.yaml", argoCDApplicationConfig)
  - Write("argocd/project.yaml", argoCDProjectConfig)
  - Write("argocd/repository.yaml", argoCDRepositoryConfig)

  // GitOps workflow
  - Write("gitops/sync-policy.yaml", syncPolicyConfig)
  - Write("gitops/health-check.yaml", gitOpsHealthCheckConfig)
  - Write("scripts/gitops-deploy.sh", gitOpsDeployScript)
```

### Terraform Infrastructure Management

```javascript
[BatchTool - Terraform IaC]:
  // Terraform configuration
  - Write("terraform/main.tf", terraformMainConfig)
  - Write("terraform/variables.tf", terraformVariablesConfig)
  - Write("terraform/outputs.tf", terraformOutputsConfig)
  - Write("terraform/providers.tf", terraformProvidersConfig)

  // Environment-specific configurations
  - Write("terraform/environments/dev.tfvars", devTerraformVars)
  - Write("terraform/environments/staging.tfvars", stagingTerraformVars)
  - Write("terraform/environments/prod.tfvars", prodTerraformVars)

  // Terraform CI/CD integration
  - Write(".github/workflows/terraform.yml", terraformWorkflowCode)
  - Write("scripts/terraform-plan.sh", terraformPlanScript)
  - Write("scripts/terraform-apply.sh", terraformApplyScript)
```

## 📈 PERFORMANCE AND SCALABILITY

### Load Testing Integration

```javascript
[BatchTool - Performance Testing]:
  // K6 performance tests
  - Write("tests/performance/load-test.js", k6LoadTestCode)
  - Write("tests/performance/stress-test.js", k6StressTestCode)
  - Write("tests/performance/spike-test.js", k6SpikeTestCode)

  // JMeter test plans
  - Write("tests/performance/jmeter/load-test.jmx", jmeterLoadTestPlan)
  - Write("tests/performance/jmeter/endurance-test.jmx", jmeterEnduranceTestPlan)

  // Performance CI integration
  - Write(".github/workflows/performance.yml", performanceWorkflowCode)
  - Write("scripts/performance-gate.sh", performanceGateScript)
```

### Auto-Scaling Configuration

```javascript
[BatchTool - Auto-Scaling Setup]:
  // Kubernetes HPA configuration
  - Write("k8s/hpa.yaml", hpaConfig)
  - Write("k8s/vpa.yaml", vpaConfig)
  - Write("k8s/cluster-autoscaler.yaml", clusterAutoscalerConfig)

  // Cloud provider auto-scaling
  - Write("terraform/autoscaling.tf", autoscalingTerraformConfig)
  - Write("scripts/scaling-policy.sh", scalingPolicyScript)
```

## 💡 ADVANCED CI/CD PATTERNS

### Multi-Cloud Deployment

```javascript
[BatchTool - Multi-Cloud Setup]:
  // AWS deployment
  - Write("aws/cloudformation.yaml", cloudFormationTemplate)
  - Write("aws/deploy.sh", awsDeployScript)

  // Azure deployment
  - Write("azure/arm-template.json", armTemplate)
  - Write("azure/deploy.sh", azureDeployScript)

  // GCP deployment
  - Write("gcp/deployment-manager.yaml", deploymentManagerTemplate)
  - Write("gcp/deploy.sh", gcpDeployScript)

  // Multi-cloud coordination
  - Write("scripts/multi-cloud-deploy.sh", multiCloudDeployScript)
  - Write("monitoring/multi-cloud-health.sh", multiCloudHealthScript)
```

---

**Remember**: CI/CD is about delivering value quickly and safely. Claude Flow enhances DevOps practices by providing intelligent coordination for complex deployment pipelines and maintaining consistency across all environments!