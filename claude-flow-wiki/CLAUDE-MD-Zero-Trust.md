# Claude Code Configuration for Zero Trust Architecture

## 🚨 CRITICAL: PARALLEL ZERO TRUST IMPLEMENTATION

**MANDATORY RULE**: All Zero Trust operations MUST be executed in parallel for comprehensive security:

1. **Identity verification** → Validate all identities simultaneously
2. **Device trust** → Assess all devices concurrently
3. **Network segmentation** → Deploy all microsegments in parallel
4. **Least privilege** → Apply all access controls together
5. **Continuous verification** → Monitor all trust signals at once

## 🚀 CRITICAL: Zero Trust Parallel Execution Pattern

### 🔴 MANDATORY ZERO TRUST BATCH OPERATIONS

**ABSOLUTE RULE**: ALL Zero Trust operations MUST be concurrent in single messages:

```javascript
// ✅ CORRECT: Zero Trust implementation in ONE message
[Single Message]:
  // Initialize Zero Trust swarm
  - mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 12, strategy: "parallel" }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Identity Verifier", capabilities: ["MFA", "biometrics", "behavioral analysis"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Device Trust Agent", capabilities: ["device health", "compliance check", "EDR integration"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Network Segmenter", capabilities: ["microsegmentation", "ZTNA", "SDP"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Privilege Manager", capabilities: ["PAM", "JIT access", "privilege analytics"] }
  - mcp__claude-flow__agent_spawn { type: "monitor", name: "Trust Monitor", capabilities: ["continuous verification", "risk scoring", "anomaly detection"] }
  - mcp__claude-flow__agent_spawn { type: "specialist", name: "Policy Engine", capabilities: ["dynamic policies", "context-aware access", "ABAC"] }
  
  // Identity verification setup
  - Bash("okta-cli configure --mfa required --biometric enabled")
  - Bash("auth0-deploy --rules zero-trust-rules.js --mfa universal")
  - Bash("azure-ad-config --conditional-access zero-trust-policy.json")
  
  // Device trust implementation
  - Bash("crowdstrike-falcon deploy --zero-trust-mode --all-endpoints")
  - Bash("jamf-pro configure --compliance-check continuous")
  - Bash("microsoft-intune sync --device-trust-policy strict")
  
  // Network microsegmentation
  - Bash("istio install --profile zero-trust --mesh-wide-mtls")
  - Bash("consul connect --enable-intentions --default-deny")
  - Bash("prisma-access configure --ztna-mode --all-apps")
  
  // Privilege management
  - Bash("cyberark-pam deploy --just-in-time --zero-standing-privileges")
  - Bash("hashicorp-vault configure --dynamic-secrets --lease-ttl 1h")
  - Bash("beyondtrust configure --privilege-analytics --continuous-discovery")
  
  // Policy and monitoring
  - Write("zero-trust/policies/identity-verification.yaml", identityPolicy)
  - Write("zero-trust/policies/device-trust.yaml", devicePolicy)
  - Write("zero-trust/policies/network-access.yaml", networkPolicy)
  - Write("zero-trust/policies/data-access.yaml", dataPolicy)
```

## 🔐 Zero Trust Agent Patterns

### Identity Verifier Agent

```javascript
Task(`You are the Identity Verifier agent in a Zero Trust architecture swarm.

MANDATORY COORDINATION:
1. START: npx claude-flow@alpha hooks pre-task --description "Identity verification setup"
2. DURING: After EVERY verification, run npx claude-flow@alpha hooks post-edit --file "identity-trust.json" --memory-key "zero-trust/identity"
3. MEMORY: Store ALL trust decisions using npx claude-flow@alpha hooks notify --message "[identity trust score]"
4. END: npx claude-flow@alpha hooks post-task --task-id "identity-verification" --analyze-performance true

Your specific tasks:
- Implement multi-factor authentication for all users
- Deploy biometric verification where applicable
- Set up behavioral analytics for anomaly detection
- Configure identity federation and SSO
- Implement continuous authentication
- Monitor and score identity trust levels

COORDINATE with Device Trust Agent for device-identity binding!`)
```

### Network Segmenter Agent

```javascript
Task(`You are the Network Segmenter agent in a Zero Trust architecture swarm.

MANDATORY COORDINATION:
1. START: npx claude-flow@alpha hooks pre-task --description "Network microsegmentation"
2. DURING: After EVERY segment, run npx claude-flow@alpha hooks post-edit --file "network-segments.json" --memory-key "zero-trust/network"
3. MEMORY: Store ALL policies using npx claude-flow@alpha hooks notify --message "[segment policy created]"
4. END: npx claude-flow@alpha hooks post-task --task-id "network-segmentation" --analyze-performance true

Your specific tasks:
- Deploy software-defined perimeter (SDP)
- Implement microsegmentation policies
- Configure zero trust network access (ZTNA)
- Set up encrypted tunnels for all communications
- Deploy application-layer segmentation
- Monitor east-west traffic

REMEMBER: Default deny for all network policies!`)
```

## 🏗️ Zero Trust Architecture Components

### Identity and Access Management

```yaml
# zero-trust-iam.yaml
identity_verification:
  authentication:
    factors:
      - factor: "knowledge"
        methods: ["password", "security_questions"]
        strength: "medium"
      
      - factor: "possession"
        methods: ["hardware_token", "mobile_push", "SMS"]
        strength: "high"
      
      - factor: "inherence"
        methods: ["fingerprint", "face_recognition", "voice"]
        strength: "very_high"
    
    policies:
      minimum_factors: 2
      adaptive_authentication: true
      risk_based_step_up: true
      continuous_verification: true
  
  authorization:
    model: "ABAC"  # Attribute-Based Access Control
    attributes:
      user:
        - "role"
        - "department"
        - "clearance_level"
        - "training_status"
      
      resource:
        - "classification"
        - "owner"
        - "sensitivity"
        - "compliance_requirements"
      
      context:
        - "time_of_day"
        - "location"
        - "device_trust_score"
        - "network_zone"
        - "threat_level"
```

### Device Trust Framework

```javascript
// device-trust-framework.js
class DeviceTrustFramework {
  async assessDeviceTrust(deviceId) {
    // Parallel trust assessment
    const [
      healthScore,
      complianceScore,
      patchScore,
      encryptionScore,
      edrScore,
      certificateScore
    ] = await Promise.all([
      this.checkDeviceHealth(deviceId),
      this.checkCompliance(deviceId),
      this.checkPatchLevel(deviceId),
      this.checkEncryption(deviceId),
      this.checkEDRStatus(deviceId),
      this.checkCertificates(deviceId)
    ]);
    
    const trustScore = this.calculateTrustScore({
      health: healthScore,
      compliance: complianceScore,
      patches: patchScore,
      encryption: encryptionScore,
      edr: edrScore,
      certificates: certificateScore
    });
    
    // Store in Zero Trust memory
    await this.storeDeviceTrust(deviceId, trustScore);
    
    return {
      deviceId,
      trustScore,
      accessLevel: this.determineAccessLevel(trustScore),
      restrictions: this.getRestrictions(trustScore),
      nextAssessment: this.scheduleNextCheck(trustScore)
    };
  }
  
  async continuousDeviceMonitoring() {
    // Real-time device trust monitoring
    const monitors = [
      this.monitorProcesses(),
      this.monitorNetworkConnections(),
      this.monitorFileIntegrity(),
      this.monitorSecurityEvents(),
      this.monitorPerformanceAnomalies()
    ];
    
    return Promise.all(monitors);
  }
}
```

## 🛡️ Microsegmentation Implementation

### Software-Defined Perimeter

```python
#!/usr/bin/env python3
# sdp-controller.py - Zero Trust SDP implementation

import asyncio
from typing import Dict, List, Set
import json

class SDPController:
    def __init__(self):
        self.gateways = {}
        self.clients = {}
        self.policies = {}
        self.dark_cloud = set()  # Hidden resources
    
    async def initialize_sdp(self):
        """Initialize SDP with parallel gateway deployment"""
        tasks = [
            self.deploy_gateway("gateway-1", "zone-dmz"),
            self.deploy_gateway("gateway-2", "zone-internal"),
            self.deploy_gateway("gateway-3", "zone-cloud"),
            self.deploy_gateway("gateway-4", "zone-edge")
        ]
        
        await asyncio.gather(*tasks)
        await self.enable_dark_cloud()
    
    async def authenticate_client(self, client_data: Dict) -> Dict:
        """Multi-factor authentication for SDP access"""
        auth_tasks = [
            self.verify_identity(client_data),
            self.verify_device(client_data),
            self.verify_context(client_data),
            self.check_risk_score(client_data)
        ]
        
        results = await asyncio.gather(*auth_tasks)
        
        if all(results):
            return await self.grant_micro_tunnel(client_data)
        else:
            return {"access": "denied", "reason": self.get_denial_reason(results)}
    
    async def grant_micro_tunnel(self, client_data: Dict) -> Dict:
        """Create encrypted micro-tunnel to specific resources"""
        # Never expose the network, only create specific tunnels
        allowed_resources = await self.get_authorized_resources(client_data)
        
        tunnel_configs = []
        for resource in allowed_resources:
            config = {
                "resource": resource,
                "encryption": "AES-256-GCM",
                "protocol": "mTLS",
                "duration": self.calculate_session_duration(client_data),
                "restrictions": self.get_resource_restrictions(resource)
            }
            tunnel_configs.append(config)
        
        return {
            "access": "granted",
            "tunnels": tunnel_configs,
            "session_id": self.create_session_id(),
            "continuous_auth_required": True
        }
```

## 🔒 Least Privilege Implementation

### Just-In-Time Access Management

```javascript
// jit-access-manager.js
class JITAccessManager {
  constructor() {
    this.activePrivileges = new Map();
    this.privilegeRequests = new Map();
    this.approvalWorkflows = new Map();
  }
  
  async requestPrivilege(request) {
    // Validate request against zero trust principles
    const validation = await Promise.all([
      this.validateIdentity(request.userId),
      this.validateBusinessNeed(request.reason),
      this.validateRiskLevel(request.resource),
      this.checkPreviousUsage(request.userId, request.privilege)
    ]);
    
    if (!validation.every(v => v.passed)) {
      return { denied: true, reason: validation };
    }
    
    // Create time-bound privilege
    const privilege = {
      id: crypto.randomUUID(),
      userId: request.userId,
      resource: request.resource,
      actions: request.actions,
      startTime: Date.now(),
      duration: this.calculateDuration(request),
      approvals: await this.getApprovals(request),
      conditions: this.getAccessConditions(request),
      monitoringLevel: 'high'
    };
    
    // Deploy privilege with automatic revocation
    await this.deployPrivilege(privilege);
    this.scheduleRevocation(privilege);
    
    return privilege;
  }
  
  async deployPrivilege(privilege) {
    // Parallel deployment across systems
    await Promise.all([
      this.updateIAM(privilege),
      this.updatePAM(privilege),
      this.updateFirewallRules(privilege),
      this.updateApplicationACLs(privilege),
      this.startAuditLogging(privilege)
    ]);
  }
  
  scheduleRevocation(privilege) {
    setTimeout(async () => {
      await this.revokePrivilege(privilege.id);
    }, privilege.duration);
  }
}
```

## 📊 Continuous Trust Verification

### Real-Time Trust Scoring Engine

```python
# trust-scoring-engine.py
class TrustScoringEngine:
    def __init__(self):
        self.base_weights = {
            'identity_confidence': 0.25,
            'device_health': 0.20,
            'behavior_anomaly': 0.20,
            'network_context': 0.15,
            'resource_sensitivity': 0.10,
            'time_context': 0.10
        }
        
    async def calculate_trust_score(self, session_data):
        """Calculate real-time trust score with parallel signal processing"""
        
        # Gather all trust signals in parallel
        trust_signals = await asyncio.gather(
            self.get_identity_signals(session_data),
            self.get_device_signals(session_data),
            self.get_behavioral_signals(session_data),
            self.get_network_signals(session_data),
            self.get_contextual_signals(session_data),
            self.get_threat_intelligence(session_data)
        )
        
        # Calculate weighted trust score
        trust_score = 0
        for signal, weight in zip(trust_signals, self.base_weights.values()):
            trust_score += signal['score'] * weight
        
        # Apply dynamic adjustments
        trust_score = self.apply_risk_adjustments(trust_score, session_data)
        
        return {
            'score': trust_score,
            'confidence': self.calculate_confidence(trust_signals),
            'signals': trust_signals,
            'action': self.determine_action(trust_score),
            'next_check': self.schedule_next_verification(trust_score)
        }
    
    def determine_action(self, trust_score):
        """Determine action based on trust score"""
        if trust_score >= 0.9:
            return {'allow': True, 'monitoring': 'normal'}
        elif trust_score >= 0.7:
            return {'allow': True, 'monitoring': 'enhanced', 'restrictions': ['no_sensitive_data']}
        elif trust_score >= 0.5:
            return {'allow': True, 'step_up_auth': True, 'monitoring': 'intensive'}
        else:
            return {'allow': False, 'reason': 'insufficient_trust', 'remediation': self.get_remediation_steps()}
```

## 🔄 Zero Trust Policy Engine

### Dynamic Policy Management

```yaml
# zero-trust-policies.yaml
policy_engine:
  default_action: "deny"
  
  policies:
    - name: "identity_verification_policy"
      priority: 1
      conditions:
        all:
          - identity.mfa_completed: true
          - identity.risk_score: "<= 30"
          - identity.last_verification: "< 1 hour"
      actions:
        - allow: true
        - trust_score_modifier: "+10"
    
    - name: "device_trust_policy"
      priority: 2
      conditions:
        all:
          - device.managed: true
          - device.compliant: true
          - device.patch_level: ">= required"
          - device.edr_active: true
      actions:
        - allow: true
        - trust_score_modifier: "+15"
    
    - name: "network_context_policy"
      priority: 3
      conditions:
        any:
          - network.zone: "corporate"
          - network.vpn_connected: true
          - network.sdp_tunnel: true
      not:
        - network.country: ["restricted_list"]
      actions:
        - allow: true
        - trust_score_modifier: "+5"
    
    - name: "privilege_escalation_policy"
      priority: 4
      conditions:
        all:
          - request.privilege_level: "> normal"
          - identity.role: ["admin", "power_user"]
          - approval.received: true
          - context.business_hours: true
      actions:
        - allow: true
        - duration: "2 hours"
        - monitoring: "intensive"
        - audit_log: "detailed"
```

## 📈 Zero Trust Monitoring Dashboard

### Real-Time Zero Trust Metrics

```javascript
// zero-trust-dashboard.js
class ZeroTrustDashboard {
  async renderMetrics() {
    // Collect all metrics in parallel
    const [
      trustScores,
      accessDenials,
      policyViolations,
      anomalies,
      privilegeUsage,
      segmentationStatus
    ] = await Promise.all([
      this.getTrustScoreDistribution(),
      this.getAccessDenialMetrics(),
      this.getPolicyViolations(),
      this.getAnomalyDetections(),
      this.getPrivilegeUsageStats(),
      this.getSegmentationHealth()
    ]);
    
    return {
      overview: {
        avgTrustScore: this.calculateAverage(trustScores),
        denialRate: (accessDenials.denied / accessDenials.total) * 100,
        activeThreats: anomalies.filter(a => a.severity === 'high').length,
        complianceScore: this.calculateCompliance([trustScores, policyViolations])
      },
      
      realTimeAlerts: [
        ...this.getIdentityAlerts(),
        ...this.getDeviceAlerts(),
        ...this.getNetworkAlerts(),
        ...this.getPrivilegeAlerts()
      ],
      
      trends: {
        trustScoreTrend: this.calculateTrend(trustScores, '24h'),
        denialTrend: this.calculateTrend(accessDenials, '7d'),
        anomalyTrend: this.calculateTrend(anomalies, '30d')
      }
    };
  }
}
```

## 🚀 Zero Trust Implementation Automation

### Automated Zero Trust Deployment

```bash
#!/bin/bash
# zero-trust-deploy.sh - Parallel Zero Trust implementation

# Deploy all Zero Trust components in parallel
{
  # Identity providers
  {
    echo "Deploying identity verification..."
    helm install okta-zt ./charts/okta --values zero-trust-values.yaml &
    helm install auth0-zt ./charts/auth0 --values zero-trust-values.yaml &
    kubectl apply -f identity-federation.yaml &
    wait
  } &
  
  # Device trust
  {
    echo "Deploying device trust..."
    ansible-playbook -i inventory device-trust-deploy.yml &
    puppet apply manifests/device-compliance.pp &
    chef-client -r "role[zero_trust_device]" &
    wait
  } &
  
  # Network segmentation
  {
    echo "Deploying microsegmentation..."
    istioctl install --set values.pilot.env.PILOT_ENABLE_WORKLOAD_ENTRY_AUTOREGISTRATION=true &
    consul connect proxy -sidecar-for zero-trust-app &
    kubectl apply -f network-policies/ &
    wait
  } &
  
  # Privilege management
  {
    echo "Deploying PAM..."
    docker-compose -f pam-stack.yml up -d &
    vault operator init -key-shares=5 -key-threshold=3 &
    cyberark-deployer --config zero-trust-pam.conf &
    wait
  } &
  
  wait
}

echo "Zero Trust deployment complete!"

# Start continuous verification
./start-trust-verification.sh &
```

## 🎯 Zero Trust Success Metrics

Track these metrics for Zero Trust maturity:

1. **Identity Metrics**
   - MFA adoption rate: >95%
   - Average authentication time: <3s
   - Identity verification failures: <5%
   - Continuous auth success rate: >90%

2. **Device Metrics**
   - Managed device percentage: >98%
   - Compliance rate: >95%
   - Unpatched devices: <2%
   - Device trust score average: >85

3. **Network Metrics**
   - Microsegmentation coverage: 100%
   - Lateral movement blocks: >99%
   - Encrypted traffic: 100%
   - Policy violations: <1%

4. **Access Metrics**
   - Zero standing privileges: 100%
   - JIT access requests: >90%
   - Average privilege duration: <4h
   - Privilege abuse incidents: 0

Remember: **Never trust, always verify - and do it all in parallel!**