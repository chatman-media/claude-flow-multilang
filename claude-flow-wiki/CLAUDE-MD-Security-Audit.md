# Claude Code Configuration for Security Audit & Penetration Testing

## 🚨 CRITICAL: PARALLEL SECURITY ASSESSMENT

**MANDATORY RULE**: All security operations MUST be executed in parallel for comprehensive coverage:

1. **Vulnerability scanning** → Run all scanners simultaneously
2. **Penetration testing** → Execute multiple attack vectors concurrently
3. **Code analysis** → Perform static/dynamic analysis in parallel
4. **Compliance checks** → Validate all standards together
5. **Security monitoring** → Deploy all monitoring tools at once

## 🚀 CRITICAL: Security Audit Parallel Execution Pattern

### 🔴 MANDATORY SECURITY BATCH OPERATIONS

**ABSOLUTE RULE**: ALL security audit operations MUST be concurrent in single messages:

```javascript
// ✅ CORRECT: Security assessment in ONE message
[Single Message]:
  // Initialize security swarm
  - mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 10, strategy: "parallel" }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Security Auditor", capabilities: ["vulnerability scanning", "OWASP compliance"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Penetration Tester", capabilities: ["network attacks", "application testing"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Code Analyzer", capabilities: ["SAST", "DAST", "dependency scanning"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Compliance Officer", capabilities: ["regulatory checks", "policy validation"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Threat Hunter", capabilities: ["threat modeling", "attack simulation"] }
  - mcp__claude-flow__agent_spawn { type: "monitor", name: "Security Monitor", capabilities: ["real-time monitoring", "incident response"] }
  
  // Vulnerability scanning tools
  - Bash("nmap -sV -sC -O -A target.com -oN nmap_scan.txt")
  - Bash("nikto -h https://target.com -output nikto_report.html")
  - Bash("sqlmap -u 'https://target.com/login' --batch --random-agent")
  - Bash("metasploit -q -x 'use auxiliary/scanner/http/dir_scanner; set RHOSTS target.com; run'")
  
  // Code security analysis
  - Bash("semgrep --config=auto --json -o semgrep_results.json .")
  - Bash("bandit -r . -f json -o bandit_results.json")
  - Bash("safety check --json > safety_results.json")
  - Bash("trivy fs --security-checks vuln,config . -f json -o trivy_results.json")
  
  // Container security
  - Bash("docker scan --json app:latest > docker_scan.json")
  - Bash("grype app:latest -o json > grype_results.json")
  - Bash("syft app:latest -o json > sbom.json")
  
  // Compliance checks
  - Bash("inspec exec compliance-profile --reporter json > compliance.json")
  - Bash("prowler aws --json-file prowler_results.json")
  - Bash("scout suite aws --report-dir scout-report")
```

## 🛡️ Security Audit Agent Patterns

### Security Auditor Agent

```javascript
Task(`You are the Security Auditor agent in a security assessment swarm.

MANDATORY COORDINATION:
1. START: npx claude-flow@alpha hooks pre-task --description "Security vulnerability assessment"
2. DURING: After EVERY scan, run npx claude-flow@alpha hooks post-edit --file "scan_results.json" --memory-key "security/vulnerabilities"
3. MEMORY: Store ALL findings using npx claude-flow@alpha hooks notify --message "[vulnerability found]"
4. END: npx claude-flow@alpha hooks post-task --task-id "security-audit" --analyze-performance true

Your specific tasks:
- Run comprehensive vulnerability scans on all services
- Analyze OWASP Top 10 compliance
- Check for security misconfigurations
- Validate SSL/TLS implementations
- Test authentication and authorization mechanisms

COORDINATE with other agents through memory before making security recommendations!`)
```

### Penetration Tester Agent

```javascript
Task(`You are the Penetration Tester agent in a security assessment swarm.

MANDATORY COORDINATION:
1. START: npx claude-flow@alpha hooks pre-task --description "Penetration testing execution"
2. DURING: After EVERY test, run npx claude-flow@alpha hooks post-edit --file "pentest_log.json" --memory-key "security/penetration"
3. MEMORY: Store ALL exploits using npx claude-flow@alpha hooks notify --message "[exploit attempt]"
4. END: npx claude-flow@alpha hooks post-task --task-id "pentest" --analyze-performance true

Your specific tasks:
- Perform controlled attack simulations
- Test network perimeter security
- Attempt SQL injection and XSS attacks
- Validate access control bypasses
- Document all successful penetration paths

REMEMBER: Coordinate with Security Monitor for real-time detection testing!`)
```

## 🔍 Security Scanning Templates

### Comprehensive Security Scan Script

```bash
#!/bin/bash
# security-audit.sh - Parallel security assessment

# Create results directory
mkdir -p security-results/{scans,reports,artifacts}

# Network Security Scanning (Parallel)
{
  # Port scanning
  nmap -sV -sC -O -A -p- target.com -oX security-results/scans/nmap_full.xml &
  
  # Web vulnerability scanning
  nikto -h https://target.com -Format json -output security-results/scans/nikto.json &
  
  # SSL/TLS analysis
  testssl.sh --json-file security-results/scans/ssl_test.json target.com:443 &
  
  # DNS enumeration
  dnsrecon -d target.com -j security-results/scans/dns_enum.json &
  
  wait
} &

# Application Security Testing (Parallel)
{
  # OWASP ZAP scanning
  zap-cli quick-scan --self-contained -o security-results/scans/zap_scan.json https://target.com &
  
  # Burp Suite automation
  burp-scan --target https://target.com --report security-results/scans/burp_report.json &
  
  # API security testing
  astra --url https://api.target.com --format json > security-results/scans/api_test.json &
  
  wait
} &

# Code Security Analysis (Parallel)
{
  # Static analysis
  semgrep --config=auto --json -o security-results/scans/semgrep.json . &
  sonarqube-scanner -Dsonar.projectKey=security-audit &
  
  # Dependency scanning
  snyk test --json > security-results/scans/snyk_deps.json &
  npm audit --json > security-results/scans/npm_audit.json &
  
  # Secret scanning
  trufflehog filesystem . --json > security-results/scans/secrets.json &
  
  wait
} &

# Container Security (Parallel)
{
  # Image scanning
  trivy image --format json -o security-results/scans/trivy_images.json app:latest &
  
  # Kubernetes security
  kubesec scan k8s/*.yaml > security-results/scans/kubesec.json &
  kube-bench --json > security-results/scans/kube_bench.json &
  
  wait
} &

wait  # Wait for all parallel scans to complete

# Generate consolidated report
python3 consolidate_security_results.py
```

## 📊 Security Metrics and Reporting

### Real-time Security Dashboard

```javascript
// security-dashboard.js
const SecurityDashboard = {
  // Initialize real-time monitoring
  async initializeMonitoring() {
    // Parallel initialization of all security monitors
    const monitors = await Promise.all([
      this.startVulnerabilityMonitor(),
      this.startIntrusionDetection(),
      this.startComplianceMonitor(),
      this.startThreatIntelligence(),
      this.startIncidentResponse()
    ]);
    
    // Store in swarm memory
    await this.storeSecurityState(monitors);
  },
  
  // Vulnerability tracking
  async startVulnerabilityMonitor() {
    return {
      critical: await this.scanCriticalVulns(),
      high: await this.scanHighVulns(),
      medium: await this.scanMediumVulns(),
      low: await this.scanLowVulns(),
      metrics: {
        meanTimeToDetect: this.calculateMTTD(),
        meanTimeToRemediate: this.calculateMTTR(),
        vulnerabilityDensity: this.calculateVulnDensity()
      }
    };
  },
  
  // Threat intelligence integration
  async startThreatIntelligence() {
    const feeds = [
      'https://rules.emergingthreats.net/open/suricata/emerging.rules.tar.gz',
      'https://feodotracker.abuse.ch/downloads/ipblocklist.json',
      'https://sslbl.abuse.ch/blacklist/sslipblacklist.json'
    ];
    
    return Promise.all(feeds.map(feed => this.processThreatFeed(feed)));
  }
};
```

## 🚨 Incident Response Coordination

### Security Incident Swarm Pattern

```javascript
// When security incident detected
[BatchTool]:
  // Immediate parallel response
  - mcp__claude-flow__task_orchestrate { 
      task: "Security incident response", 
      strategy: "parallel",
      priority: "critical"
    }
  
  // Alert all security agents
  - mcp__claude-flow__memory_usage {
      action: "store",
      key: "incident/active",
      value: { severity: "critical", timestamp: Date.now() }
    }
  
  // Parallel incident response actions
  - Bash("kubectl cordon affected-nodes")  // Isolate affected systems
  - Bash("tcpdump -i any -w incident.pcap")  // Capture network traffic
  - Bash("docker pause compromised-container")  // Freeze container state
  - Bash("aws ec2 create-snapshot --instance-id i-xxx")  // Forensic snapshot
  
  // Security tool deployment
  - Write("incident-response/playbook.sh", incidentPlaybook)
  - Write("incident-response/forensics.py", forensicsScript)
  - Write("incident-response/timeline.json", incidentTimeline)
```

## 🔐 Security Best Practices Integration

### Automated Security Controls

```yaml
# security-controls.yaml
security_controls:
  preventive:
    - name: "Input Validation"
      implementation: "OWASP ESAPI"
      automation: "semgrep rules"
    
    - name: "Authentication"
      implementation: "OAuth 2.0 + MFA"
      automation: "auth0 integration"
    
    - name: "Encryption"
      implementation: "AES-256-GCM"
      automation: "vault integration"
  
  detective:
    - name: "SIEM Integration"
      tools: ["Splunk", "ELK", "Datadog"]
      automation: "log forwarding"
    
    - name: "File Integrity"
      tools: ["AIDE", "Tripwire"]
      automation: "continuous monitoring"
  
  responsive:
    - name: "Automated Remediation"
      tools: ["Ansible", "Chef InSpec"]
      automation: "self-healing"
    
    - name: "Incident Response"
      tools: ["TheHive", "Cortex"]
      automation: "playbook execution"
```

## 📈 Security Audit Reporting

### Comprehensive Security Report Template

```markdown
# Security Audit Report - [Project Name]
Generated: [Date]

## Executive Summary
- **Risk Level**: [Critical/High/Medium/Low]
- **Vulnerabilities Found**: [Count]
- **Compliance Score**: [Percentage]
- **Recommended Actions**: [Count]

## Detailed Findings

### 1. Critical Vulnerabilities
| CVE ID | Component | CVSS Score | Remediation |
|--------|-----------|------------|-------------|
| [Data from parallel scans] |

### 2. Penetration Test Results
- **Attack Vectors Tested**: [Count]
- **Successful Exploits**: [Count]
- **Access Gained**: [Level]

### 3. Compliance Status
- **OWASP Top 10**: [Pass/Fail per category]
- **PCI DSS**: [Compliant/Non-compliant]
- **ISO 27001**: [Status]

### 4. Security Metrics
- **Mean Time to Detect**: [Time]
- **Security Debt**: [Hours]
- **Risk Score**: [0-100]

## Recommendations
[AI-generated prioritized recommendations based on findings]
```

## 🔄 Continuous Security Integration

### Security Pipeline Integration

```yaml
# .github/workflows/security-audit.yml
name: Continuous Security Audit

on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Parallel Security Scans
        run: |
          # All scans run in parallel
          npx claude-flow@alpha --agents 8 --mode security-audit \
            --parallel-scans --comprehensive-report
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: security-results
          path: security-results/
```

## 🎯 Security KPIs and Metrics

Track these security metrics in parallel:

1. **Vulnerability Metrics**
   - Time to detect
   - Time to patch
   - Vulnerability density
   - False positive rate

2. **Compliance Metrics**
   - Compliance coverage
   - Audit pass rate
   - Policy violations
   - Control effectiveness

3. **Incident Metrics**
   - Incident frequency
   - Response time
   - Recovery time
   - Impact severity

Remember: **All security operations execute in parallel for comprehensive coverage!**