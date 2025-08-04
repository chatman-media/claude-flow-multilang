# Claude Code Configuration for DevOps Infrastructure

## 🚨 CRITICAL: PARALLEL INFRASTRUCTURE PROVISIONING

**MANDATORY RULE**: All infrastructure operations MUST be parallel for DevOps efficiency:

1. **Infrastructure as Code** → Deploy all components simultaneously
2. **Container orchestration** → Scale services in parallel
3. **CI/CD pipelines** → Execute stages concurrently
4. **Monitoring setup** → Initialize all observability tools together

## 🚀 CRITICAL: DevOps Parallel Execution Pattern

### 🔴 MANDATORY INFRASTRUCTURE BATCH OPERATIONS

**ABSOLUTE RULE**: ALL DevOps operations MUST be concurrent in single messages:

```javascript
// ✅ CORRECT: Infrastructure provisioning in ONE message
[Single Message]:
  // Terraform/IaC operations
  - Bash("terraform init")
  - Bash("terraform plan -out=tfplan")
  - Bash("terraform apply tfplan")
  - Bash("ansible-playbook -i inventory site.yml")
  
  // Container operations
  - Bash("docker build -t app:latest .")
  - Bash("docker build -t nginx:custom nginx/")
  - Bash("docker build -t worker:latest worker/")
  
  // Kubernetes deployment
  - Bash("kubectl apply -f k8s/namespace.yaml")
  - Bash("kubectl apply -f k8s/configmap.yaml")
  - Bash("kubectl apply -f k8s/deployment.yaml")
  - Bash("kubectl apply -f k8s/service.yaml")
  - Bash("kubectl apply -f k8s/ingress.yaml")
  
  // File creation for all infrastructure components
  - Write("terraform/main.tf", terraformConfig)
  - Write("docker-compose.yml", dockerComposeConfig)
  - Write("k8s/deployment.yaml", kubernetesDeployment)
  - Write("ansible/playbook.yml", ansiblePlaybook)
  - Write(".github/workflows/ci-cd.yml", githubActions)
```

## 🏗️ Infrastructure as Code Templates

### Terraform Configuration

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    bucket = var.terraform_state_bucket
    key    = "infrastructure/terraform.tfstate"
    region = var.aws_region
  }
}

# VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name               = "${var.project_name}-vpc"
  cidr               = var.vpc_cidr
  azs                = var.availability_zones
  private_subnets    = var.private_subnets
  public_subnets     = var.public_subnets
  enable_nat_gateway = true
  enable_vpn_gateway = true
  
  tags = local.common_tags
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name                   = "${var.project_name}-eks"
  cluster_version               = var.kubernetes_version
  cluster_endpoint_public_access = true
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  # Managed node groups
  eks_managed_node_groups = {
    main = {
      instance_types = var.node_instance_types
      min_size      = var.min_nodes
      max_size      = var.max_nodes
      desired_size  = var.desired_nodes
      
      # Use bottlerocket AMI for better container performance
      ami_type = "BOTTLEROCKET_x86_64"
      
      labels = {
        Environment = var.environment
        Project     = var.project_name
      }
      
      taints = [
        {
          key    = "dedicated"
          value  = "worker"
          effect = "NO_SCHEDULE"
        }
      ]
    }
    
    spot = {
      instance_types = var.spot_instance_types
      capacity_type  = "SPOT"
      min_size      = 0
      max_size      = var.max_spot_nodes
      desired_size  = var.desired_spot_nodes
      
      labels = {
        Environment = var.environment
        Project     = var.project_name
        "node-type" = "spot"
      }
    }
  }
  
  # Fargate profiles for serverless containers
  fargate_profiles = {
    default = {
      name = "default"
      selectors = [
        {
          namespace = "fargate"
          labels = {
            WorkloadType = "fargate"
          }
        }
      ]
    }
  }
  
  tags = local.common_tags
}

# RDS Database
module "rds" {
  source = "terraform-aws-modules/rds/aws"
  
  identifier = "${var.project_name}-db"
  
  engine               = "postgres"
  engine_version       = "15.4"
  family              = "postgres15"
  major_engine_version = "15"
  instance_class      = var.db_instance_class
  
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_encrypted    = true
  
  db_name  = var.db_name
  username = var.db_username
  port     = 5432
  
  multi_az               = var.environment == "production"
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  backup_retention_period = var.backup_retention_period
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"
  
  # Enhanced monitoring
  monitoring_interval    = 60
  monitoring_role_name   = "${var.project_name}-rds-monitoring"
  create_monitoring_role = true
  
  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  
  tags = local.common_tags
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.project_name}-redis"
  description               = "Redis cluster for ${var.project_name}"
  
  node_type                 = var.redis_node_type
  port                      = 6379
  parameter_group_name      = "default.redis7"
  
  num_cache_clusters        = var.redis_num_nodes
  automatic_failover_enabled = var.redis_num_nodes > 1
  multi_az_enabled          = var.redis_num_nodes > 1
  
  subnet_group_name = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  tags = local.common_tags
}

# Application Load Balancer
module "alb" {
  source = "terraform-aws-modules/alb/aws"
  
  name = "${var.project_name}-alb"
  
  load_balancer_type = "application"
  vpc_id             = module.vpc.vpc_id
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.alb.id]
  
  target_groups = [
    {
      name_prefix      = "app-"
      backend_protocol = "HTTP"
      backend_port     = 80
      target_type      = "ip"
      
      health_check = {
        enabled             = true
        healthy_threshold   = 2
        interval            = 30
        matcher             = "200"
        path               = "/health"
        port               = "traffic-port"
        protocol           = "HTTP"
        timeout            = 5
        unhealthy_threshold = 2
      }
    }
  ]
  
  # HTTPS listener
  https_listeners = [
    {
      port               = 443
      protocol           = "HTTPS"
      certificate_arn    = module.acm.acm_certificate_arn
      target_group_index = 0
    }
  ]
  
  # HTTP redirect to HTTPS
  http_tcp_listeners = [
    {
      port        = 80
      protocol    = "HTTP"
      action_type = "redirect"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  ]
  
  tags = local.common_tags
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EKS cluster CPU utilization"
  
  dimensions = {
    ClusterName = module.eks.cluster_name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
  
  tags = local.common_tags
}

# Auto Scaling
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "${var.project_name}-scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = module.eks.eks_managed_node_groups["main"].asg_name
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "${var.project_name}-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = module.eks.eks_managed_node_groups["main"].asg_name
}

# Local values for common tags
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    ManagedBy   = "terraform"
    CostCenter  = var.cost_center
  }
}
```

### Ansible Playbook

```yaml
# ansible/site.yml
---
- name: Configure Infrastructure
  hosts: all
  become: yes
  vars:
    docker_version: "24.0"
    kubernetes_version: "1.28"
    monitoring_stack: true
    
  tasks:
    - name: Update system packages
      package:
        name: "*"
        state: latest
      when: ansible_os_family == "RedHat"
      
    - name: Install Docker
      include_role:
        name: docker
      vars:
        docker_compose_version: "2.21.0"
        
    - name: Configure Docker daemon
      template:
        src: docker-daemon.json.j2
        dest: /etc/docker/daemon.json
        backup: yes
      notify: restart docker
      
    - name: Install Kubernetes tools
      include_role:
        name: kubernetes
      vars:
        install_kubectl: true
        install_kubelet: true
        install_kubeadm: true
        
    - name: Setup monitoring agents
      include_role:
        name: monitoring
      when: monitoring_stack
      vars:
        node_exporter_enabled: true
        cadvisor_enabled: true
        fluentd_enabled: true
        
    - name: Configure security hardening
      include_role:
        name: security
      vars:
        fail2ban_enabled: true
        ufw_enabled: true
        automatic_updates: true
        
    - name: Setup backup scripts
      template:
        src: backup-script.sh.j2
        dest: /opt/backup/backup.sh
        mode: '0755'
        
    - name: Configure log rotation
      template:
        src: logrotate.conf.j2
        dest: /etc/logrotate.d/application
        
  handlers:
    - name: restart docker
      systemd:
        name: docker
        state: restarted
        daemon_reload: yes
```

## 🐳 Container Orchestration

### Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Application Services
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
      target: development
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./src:/app/src:ro
      - ./logs:/app/logs
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped
    
  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - QUEUE_NAME=default
    volumes:
      - ./logs:/app/logs
    depends_on:
      - api
      - redis
    networks:
      - app-network
    restart: unless-stopped
    deploy:
      replicas: 2
      
  scheduler:
    build:
      context: .
      dockerfile: Dockerfile.scheduler
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    networks:
      - app-network
    restart: unless-stopped
    
  # Infrastructure Services
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --replica-read-only no
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    ports:
      - "6379:6379"
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    
  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - api
    networks:
      - app-network
    restart: unless-stopped
    
  # Monitoring Stack
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - monitoring
    restart: unless-stopped
    
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
    networks:
      - monitoring
    restart: unless-stopped
    
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring
    restart: unless-stopped
    
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    privileged: true
    networks:
      - monitoring
    restart: unless-stopped
    
  # Log Management
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - logging
    restart: unless-stopped
    
  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - logging
    restart: unless-stopped
    
  logstash:
    image: docker.elastic.co/logstash/logstash:8.10.0
    volumes:
      - ./logging/logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
      - ./logs:/logs:ro
    depends_on:
      - elasticsearch
    networks:
      - logging
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  monitoring:
    driver: bridge
  logging:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local
  elasticsearch_data:
    driver: local
```

## ☸️ Kubernetes Deployment

### Application Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  namespace: production
  labels:
    app: api
    version: v1
    component: backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: api-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
      - name: api
        image: myregistry/api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: config
        configMap:
          name: api-config
      - name: logs
        emptyDir: {}
      nodeSelector:
        kubernetes.io/os: linux
        node-type: worker
      tolerations:
      - key: "dedicated"
        operator: "Equal"
        value: "worker"
        effect: "NoSchedule"
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - api
              topologyKey: kubernetes.io/hostname

---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
  labels:
    app: api
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: api

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.myapp.com
    secretName: api-tls
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /(.*)
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  KUBE_CONFIG_DATA: ${{ secrets.KUBE_CONFIG_DATA }}

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: |
        npm ci
        npm run build --if-present
        
    - name: Run linting
      run: npm run lint
      
    - name: Run type checking
      run: npm run typecheck
      
    - name: Run unit tests
      run: npm run test:unit
      env:
        NODE_ENV: test
        
    - name: Run integration tests
      run: npm run test:integration
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:password@localhost:5432/test
        REDIS_URL: redis://localhost:6379
        
    - name: Run e2e tests
      run: npm run test:e2e
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:password@localhost:5432/test
        
    - name: Generate coverage report
      run: npm run coverage
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}

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
        
    - name: Run CodeQL analysis
      uses: github/codeql-action/analyze@v2
      with:
        languages: javascript

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    
    steps:
    - uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
          
    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64,linux/arm64

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://api-staging.myapp.com
    
    steps:
    - uses: actions/checkout@v4
      
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      
    - name: Set up Kustomize
      run: |
        curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
        sudo mv kustomize /usr/local/bin/
        
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG_DATA }}" | base64 --decode > ~/.kube/config
        
    - name: Deploy to staging
      run: |
        cd k8s/overlays/staging
        kustomize edit set image api-image=${{ needs.build.outputs.image-tag }}
        kustomize build . | kubectl apply -f -
        
    - name: Wait for deployment
      run: |
        kubectl rollout status deployment/api-deployment -n staging --timeout=300s
        
    - name: Run smoke tests
      run: |
        kubectl run smoke-test --image=curlimages/curl --rm -i --restart=Never -- \
          curl -f https://api-staging.myapp.com/health

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://api.myapp.com
    
    steps:
    - uses: actions/checkout@v4
      
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      
    - name: Set up Kustomize
      run: |
        curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
        sudo mv kustomize /usr/local/bin/
        
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG_DATA }}" | base64 --decode > ~/.kube/config
        
    - name: Blue-Green Deployment
      run: |
        cd k8s/overlays/production
        
        # Update image in kustomization
        kustomize edit set image api-image=${{ needs.build.outputs.image-tag }}
        
        # Deploy to green environment
        kustomize build . | sed 's/api-deployment/api-deployment-green/g' | kubectl apply -f -
        
        # Wait for green deployment
        kubectl rollout status deployment/api-deployment-green -n production --timeout=600s
        
        # Run health checks
        kubectl run health-check --image=curlimages/curl --rm -i --restart=Never -- \
          curl -f http://api-service-green.production.svc.cluster.local/health
          
        # Switch traffic to green
        kubectl patch service api-service -n production -p '{"spec":{"selector":{"deployment":"green"}}}'
        
        # Delete old blue deployment
        kubectl delete deployment api-deployment-blue -n production --ignore-not-found=true
        
        # Rename green to blue for next deployment
        kubectl patch deployment api-deployment-green -n production -p '{"spec":{"selector":{"matchLabels":{"deployment":"blue"}},"template":{"metadata":{"labels":{"deployment":"blue"}}}}}'
        kubectl patch deployment api-deployment-green -n production --type='merge' -p='{"metadata":{"name":"api-deployment"}}'

  notify:
    needs: [deploy-staging, deploy-production]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
    - name: Slack notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 Monitoring and Observability

### Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'
    replica: 'prometheus-1'

rule_files:
  - "alert-rules.yml"
  - "recording-rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Kubernetes API server
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
    - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
    - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
      action: keep
      regex: default;kubernetes;https

  # Kubernetes nodes
  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
    - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
    - action: labelmap
      regex: __meta_kubernetes_node_label_(.+)

  # Kubernetes pods
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__

  # Application metrics
  - job_name: 'api-application'
    static_configs:
    - targets: ['api-service:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  # Database metrics
  - job_name: 'postgres-exporter'
    static_configs:
    - targets: ['postgres-exporter:9187']

  # Redis metrics
  - job_name: 'redis-exporter'
    static_configs:
    - targets: ['redis-exporter:9121']

  # Infrastructure metrics
  - job_name: 'node-exporter'
    static_configs:
    - targets: ['node-exporter:9100']

  # Container metrics
  - job_name: 'cadvisor'
    static_configs:
    - targets: ['cadvisor:8080']
```

### Alert Rules

```yaml
# monitoring/alert-rules.yml
groups:
- name: application-alerts
  rules:
  - alert: HighErrorRate
    expr: (rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.instance }}"

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High latency detected"
      description: "95th percentile latency is {{ $value }}s for {{ $labels.instance }}"

  - alert: DatabaseDown
    expr: up{job="postgres-exporter"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database is down"
      description: "PostgreSQL database has been down for more than 1 minute"

- name: infrastructure-alerts
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage"
      description: "CPU usage is {{ $value }}% on {{ $labels.instance }}"

  - alert: HighMemoryUsage
    expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High memory usage"
      description: "Memory usage is {{ $value }}% on {{ $labels.instance }}"

  - alert: DiskSpaceLow
    expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 85
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Low disk space"
      description: "Disk usage is {{ $value }}% on {{ $labels.instance }}"

- name: kubernetes-alerts
  rules:
  - alert: PodCrashLooping
    expr: rate(kube_pod_container_status_restarts_total[10m]) > 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Pod is crash looping"
      description: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash looping"

  - alert: DeploymentReplicasMismatch
    expr: kube_deployment_spec_replicas != kube_deployment_status_available_replicas
    for: 15m
    labels:
      severity: warning
    annotations:
      summary: "Deployment replicas mismatch"
      description: "Deployment {{ $labels.namespace }}/{{ $labels.deployment }} has {{ $value }} available replicas, expected {{ $labels.spec_replicas }}"
```

## 🔒 Security and Compliance

### Security Policies

```yaml
# security/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    - podSelector:
        matchLabels:
          app: nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 443

---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
```

### Backup and Disaster Recovery

```bash
#!/bin/bash
# scripts/backup.sh

set -euo pipefail

# Configuration
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="myapp-backups"
ENCRYPTION_KEY="/opt/keys/backup.key"

# Create backup directory
mkdir -p "$BACKUP_DIR/$TIMESTAMP"

# Database backup
echo "Starting database backup..."
kubectl exec -n production $(kubectl get pods -n production -l app=postgres -o jsonpath='{.items[0].metadata.name}') -- \
  pg_dump -U postgres myapp | gzip > "$BACKUP_DIR/$TIMESTAMP/database.sql.gz"

# Application data backup
echo "Starting application data backup..."
kubectl cp production/$(kubectl get pods -n production -l app=api -o jsonpath='{.items[0].metadata.name}'):/app/data \
  "$BACKUP_DIR/$TIMESTAMP/app-data"

# Kubernetes resources backup
echo "Starting Kubernetes resources backup..."
kubectl get all -n production -o yaml > "$BACKUP_DIR/$TIMESTAMP/k8s-resources.yaml"
kubectl get secrets -n production -o yaml > "$BACKUP_DIR/$TIMESTAMP/k8s-secrets.yaml"
kubectl get configmaps -n production -o yaml > "$BACKUP_DIR/$TIMESTAMP/k8s-configmaps.yaml"

# Encrypt backup
echo "Encrypting backup..."
tar -czf - -C "$BACKUP_DIR" "$TIMESTAMP" | \
  openssl enc -aes-256-cbc -salt -in - -out "$BACKUP_DIR/${TIMESTAMP}.tar.gz.enc" -pass file:"$ENCRYPTION_KEY"

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "$BACKUP_DIR/${TIMESTAMP}.tar.gz.enc" "s3://$S3_BUCKET/backups/${TIMESTAMP}.tar.gz.enc"

# Cleanup local backup
rm -rf "$BACKUP_DIR/$TIMESTAMP"
rm -f "$BACKUP_DIR/${TIMESTAMP}.tar.gz.enc"

# Cleanup old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.tar.gz.enc" -mtime +$RETENTION_DAYS -delete
aws s3 ls "s3://$S3_BUCKET/backups/" | \
  awk '$1 < "'$(date -d "$RETENTION_DAYS days ago" '+%Y-%m-%d')'" {print $4}' | \
  xargs -r -I {} aws s3 rm "s3://$S3_BUCKET/backups/{}"

echo "Backup completed successfully!"
```

## 🚀 DevOps Best Practices

### 1. **Infrastructure as Code**
- Use Terraform for infrastructure provisioning
- Version control all infrastructure code
- Implement automated testing for infrastructure changes
- Use modules for reusable components

### 2. **Container Security**
- Use minimal base images (Alpine, Distroless)
- Scan images for vulnerabilities
- Run containers as non-root users
- Implement resource limits and requests

### 3. **Monitoring and Alerting**
- Implement comprehensive monitoring stack
- Set up meaningful alerts with proper thresholds
- Use distributed tracing for microservices
- Monitor business metrics alongside technical metrics

### 4. **Backup and Recovery**
- Automate regular backups
- Test recovery procedures regularly
- Implement point-in-time recovery for databases
- Store backups in multiple locations

### 5. **Security Hardening**
- Implement network policies
- Use secrets management systems
- Enable audit logging
- Regular security scans and updates

## 📈 Performance Optimization

### Auto-scaling Configuration

```yaml
# k8s/cluster-autoscaler.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.27.0
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/myapp-cluster
        - --balance-similar-node-groups
        - --skip-nodes-with-system-pods=false
        - --scale-down-enabled=true
        - --scale-down-delay-after-add=10m
        - --scale-down-unneeded-time=10m
        - --scale-down-utilization-threshold=0.5
        - --max-node-provision-time=15m
        env:
        - name: AWS_REGION
          value: us-east-1
```

This comprehensive DevOps template provides enterprise-grade infrastructure automation, monitoring, security, and deployment strategies with parallel execution patterns optimized for Claude Code workflows.