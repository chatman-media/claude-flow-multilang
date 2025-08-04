# Claude Code Configuration for Containerized Applications

## 🚨 CRITICAL: PARALLEL CONTAINER ORCHESTRATION

**MANDATORY RULE**: All containerized operations MUST be parallel for Docker efficiency:

1. **Multi-stage builds** → Build all containers simultaneously
2. **Container deployment** → Deploy all services in parallel
3. **Service scaling** → Scale all containers together
4. **Network configuration** → Setup all networks concurrently

## 🚀 CRITICAL: Containerized Parallel Execution Pattern

### 🔴 MANDATORY CONTAINER BATCH OPERATIONS

**ABSOLUTE RULE**: ALL container operations MUST be concurrent in single messages:

```javascript
// ✅ CORRECT: Container operations in ONE message
[Single Message]:
  // Docker builds
  - Bash("docker build -t app:latest .")
  - Bash("docker build -t worker:latest ./worker")
  - Bash("docker build -t scheduler:latest ./scheduler")
  - Bash("docker build -t nginx:custom ./nginx")
  
  // Docker Compose operations
  - Bash("docker-compose up -d --build")
  - Bash("docker-compose scale api=3 worker=2")
  
  // Kubernetes deployments
  - Bash("kubectl apply -f k8s/namespace.yaml")
  - Bash("kubectl apply -f k8s/configmap.yaml")
  - Bash("kubectl apply -f k8s/secret.yaml")
  - Bash("kubectl apply -f k8s/deployment.yaml")
  - Bash("kubectl apply -f k8s/service.yaml")
  
  // File creation for all containers
  - Write("Dockerfile", mainDockerfile)
  - Write("docker-compose.yml", composeConfig)
  - Write("k8s/deployment.yaml", k8sDeployment)
  - Write(".dockerignore", dockerIgnore)
```

## 🐳 Multi-Stage Dockerfiles

### Production-Ready Node.js Application

```dockerfile
# Dockerfile
# Multi-stage build for optimal image size and security
ARG NODE_VERSION=18.17.0
ARG ALPINE_VERSION=3.18

# ===============================================
# Dependencies stage - install all dependencies
# ===============================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS dependencies

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory with proper permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production --silent && \
    npm cache clean --force

# ===============================================
# Build stage - compile TypeScript and assets
# ===============================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS build

WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build && \
    npm run test:unit && \
    npm prune --production

# ===============================================
# Production stage - final optimized image
# ===============================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production

# Install security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy built application from build stage
COPY --from=build --chown=nodeuser:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nodeuser:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodeuser:nodejs /usr/src/app/package*.json ./

# Create necessary directories
RUN mkdir -p /usr/src/app/logs && \
    chown -R nodeuser:nodejs /usr/src/app

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]

# ===============================================
# Development stage - for local development
# ===============================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development

# Install additional development tools
RUN apk add --no-cache git

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Switch to non-root user
USER nodeuser

# Expose port and debug port
EXPOSE 3000 9229

# Start development server with debugging
CMD ["npm", "run", "dev"]

# ===============================================
# Testing stage - for running tests
# ===============================================
FROM build AS testing

# Install testing dependencies
RUN npm install --only=dev

# Copy test files
COPY __tests__ ./__tests__
COPY jest.config.js ./

# Run tests
RUN npm run test:coverage

# Default command for test containers
CMD ["npm", "test"]
```

### Nginx Reverse Proxy

```dockerfile
# nginx/Dockerfile
FROM nginx:1.25-alpine AS base

# Install security updates
RUN apk upgrade --no-cache

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Create custom user for nginx
RUN addgroup -g 101 -S nginx-custom && \
    adduser -S nginx-custom -u 101 -G nginx-custom

# ===============================================
# Configuration stage
# ===============================================
FROM base AS config

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Copy SSL certificates (if using HTTPS)
COPY ssl/ /etc/nginx/ssl/

# Set proper permissions
RUN chown -R nginx-custom:nginx-custom /etc/nginx/ssl/ && \
    chmod 600 /etc/nginx/ssl/*.key && \
    chmod 644 /etc/nginx/ssl/*.crt

# ===============================================
# Production stage
# ===============================================
FROM config AS production

# Create directories for logs and cache
RUN mkdir -p /var/log/nginx /var/cache/nginx && \
    chown -R nginx-custom:nginx-custom /var/log/nginx /var/cache/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Switch to non-root user
USER nginx-custom

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Background Worker

```dockerfile
# worker/Dockerfile
FROM node:18.17.0-alpine3.18 AS base

# Install security updates and necessary packages
RUN apk upgrade --no-cache && \
    apk add --no-cache dumb-init curl redis

# Create non-root user
RUN addgroup -g 1001 -S worker && \
    adduser -S workeruser -u 1001 -G worker

# ===============================================
# Dependencies stage
# ===============================================
FROM base AS dependencies

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent && \
    npm cache clean --force

# ===============================================
# Build stage
# ===============================================
FROM base AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build application
RUN npm run build && \
    npm run test:unit

# ===============================================
# Production stage
# ===============================================
FROM base AS production

WORKDIR /usr/src/app

# Copy built application
COPY --from=build --chown=workeruser:worker /usr/src/app/dist ./dist
COPY --from=dependencies --chown=workeruser:worker /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=workeruser:worker /usr/src/app/package*.json ./

# Create necessary directories
RUN mkdir -p /usr/src/app/logs && \
    chown -R workeruser:worker /usr/src/app

# Switch to non-root user
USER workeruser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node dist/health-check.js || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start worker
CMD ["node", "dist/worker.js"]
```

## 🎼 Docker Compose Configurations

### Development Environment

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ===============================================
  # Application Services
  # ===============================================
  api:
    build:
      context: .
      target: development
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 18.17.0
        ALPINE_VERSION: 3.18
    container_name: app-api-dev
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "9229:9229" # Debug port
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-key
      - LOG_LEVEL=debug
    volumes:
      - ./src:/usr/src/app/src:ro
      - ./package.json:/usr/src/app/package.json:ro
      - ./package-lock.json:/usr/src/app/package-lock.json:ro
      - ./tsconfig.json:/usr/src/app/tsconfig.json:ro
      - node_modules:/usr/src/app/node_modules
      - ./logs:/usr/src/app/logs
    networks:
      - app-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.localhost`)"
      - "traefik.http.services.api.loadbalancer.server.port=3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  worker:
    build:
      context: ./worker
      target: development
      dockerfile: Dockerfile
    container_name: app-worker-dev
    restart: unless-stopped
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp_dev
      - QUEUE_NAME=default
      - WORKER_CONCURRENCY=2
    volumes:
      - ./worker/src:/usr/src/app/src:ro
      - ./worker/logs:/usr/src/app/logs
    networks:
      - app-network
    depends_on:
      - redis
      - db
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  scheduler:
    build:
      context: ./scheduler
      target: development
      dockerfile: Dockerfile
    container_name: app-scheduler-dev
    restart: unless-stopped
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp_dev
    volumes:
      - ./scheduler/src:/usr/src/app/src:ro
      - ./scheduler/logs:/usr/src/app/logs
    networks:
      - app-network
    depends_on:
      - redis

  # ===============================================
  # Infrastructure Services
  # ===============================================
  db:
    image: postgres:15.4-alpine
    container_name: app-db-dev
    restart: unless-stopped
    environment:
      - POSTGRES_DB=myapp_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_INITDB_ARGS=--auth-host=scram-sha-256
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
      - ./scripts/seed-data.sql:/docker-entrypoint-initdb.d/02-seed.sql:ro
    ports:
      - "5432:5432"
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d myapp_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  redis:
    image: redis:7.2-alpine
    container_name: app-redis-dev
    restart: unless-stopped
    command: redis-server --appendonly yes --replica-read-only no --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    ports:
      - "6379:6379"
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'

  # ===============================================
  # Reverse Proxy & Load Balancer
  # ===============================================
  nginx:
    build:
      context: ./nginx
      target: production
      dockerfile: Dockerfile
    container_name: app-nginx-dev
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      - app-network
    depends_on:
      - api
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nginx.rule=Host(`localhost`)"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'

  # ===============================================
  # Monitoring & Observability
  # ===============================================
  prometheus:
    image: prom/prometheus:v2.47.0
    container_name: app-prometheus-dev
    restart: unless-stopped
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./monitoring/rules:/etc/prometheus/rules:ro
      - prometheus_data:/prometheus
    networks:
      - monitoring-network
      - app-network
    depends_on:
      - api
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  grafana:
    image: grafana/grafana:10.1.0
    container_name: app-grafana-dev
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SECURITY_ALLOW_EMBEDDING=true
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards:ro
    networks:
      - monitoring-network
    depends_on:
      - prometheus
    user: "472"
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  node-exporter:
    image: prom/node-exporter:v1.6.1
    container_name: app-node-exporter-dev
    restart: unless-stopped
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    networks:
      - monitoring-network
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    container_name: app-cadvisor-dev
    restart: unless-stopped
    privileged: true
    devices:
      - /dev/kmsg:/dev/kmsg
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
      - /cgroup:/cgroup:ro
    ports:
      - "8080:8080"
    networks:
      - monitoring-network
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'

  # ===============================================
  # Log Management
  # ===============================================
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.2
    container_name: app-elasticsearch-dev
    restart: unless-stopped
    environment:
      - node.name=elasticsearch
      - cluster.name=docker-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - logging-network
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.2
    container_name: app-kibana-dev
    restart: unless-stopped
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=kibana_system
      - XPACK_SECURITY_ENABLED=false
    ports:
      - "5601:5601"
    networks:
      - logging-network
    depends_on:
      - elasticsearch
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'

  logstash:
    image: docker.elastic.co/logstash/logstash:8.10.2
    container_name: app-logstash-dev
    restart: unless-stopped
    volumes:
      - ./logging/logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
      - ./logging/patterns:/usr/share/logstash/patterns:ro
      - ./logs:/logs:ro
    environment:
      - "LS_JAVA_OPTS=-Xmx512m -Xms512m"
    networks:
      - logging-network
    depends_on:
      - elasticsearch
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'

  # ===============================================
  # Message Queue
  # ===============================================
  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: app-rabbitmq-dev
    restart: unless-stopped
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=password
      - RABBITMQ_DEFAULT_VHOST=/
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
      - ./rabbitmq/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - app-network
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 30s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # ===============================================
  # Development Tools
  # ===============================================
  mailhog:
    image: mailhog/mailhog:v1.0.1
    container_name: app-mailhog-dev
    restart: unless-stopped
    ports:
      - "1025:1025" # SMTP port
      - "8025:8025" # Web UI port
    networks:
      - app-network
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'

  adminer:
    image: adminer:4.8.1
    container_name: app-adminer-dev
    restart: unless-stopped
    ports:
      - "8081:8080"
    networks:
      - app-network
    depends_on:
      - db
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'

  # ===============================================
  # Testing Services
  # ===============================================
  test-db:
    image: postgres:15.4-alpine
    container_name: app-test-db
    environment:
      - POSTGRES_DB=myapp_test
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - ./scripts/init-test-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - test-network
    profiles:
      - testing
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  test-redis:
    image: redis:7.2-alpine
    container_name: app-test-redis
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    networks:
      - test-network
    profiles:
      - testing
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'

networks:
  app-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  monitoring-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16
  logging-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.22.0.0/16
  test-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.23.0.0/16

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  node_modules:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local
  elasticsearch_data:
    driver: local
  rabbitmq_data:
    driver: local

# ===============================================
# Extension Fields for Reusability
# ===============================================
x-logging: &default-logging
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"

x-restart-policy: &default-restart-policy
  restart: unless-stopped

x-healthcheck-defaults: &default-healthcheck
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

### Production Environment

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: .
      target: production
      dockerfile: Dockerfile
    image: myregistry/myapp-api:${VERSION:-latest}
    container_name: app-api-prod
    restart: always
    ports:
      - "3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - LOG_LEVEL=info
      - NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
    volumes:
      - ./logs:/usr/src/app/logs
    networks:
      - app-network
      - monitoring-network
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: docker.api
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
        window: 120s
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        monitor: 60s
      rollback_config:
        parallelism: 1
        delay: 0s
        failure_action: pause
        monitor: 60s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  worker:
    build:
      context: ./worker
      target: production
      dockerfile: Dockerfile
    image: myregistry/myapp-worker:${VERSION:-latest}
    restart: always
    environment:
      - NODE_ENV=production
      - REDIS_URL=${REDIS_URL}
      - DATABASE_URL=${DATABASE_URL}
      - WORKER_CONCURRENCY=4
    networks:
      - app-network
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: docker.worker
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
        window: 120s
    healthcheck:
      test: ["CMD", "node", "dist/health-check.js"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    build:
      context: ./nginx
      target: production
      dockerfile: Dockerfile
    image: myregistry/myapp-nginx:${VERSION:-latest}
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      - app-network
    depends_on:
      - api
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: docker.nginx
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Database (using external managed service in production)
  # Uncomment if using containerized database
  # db:
  #   image: postgres:15.4-alpine
  #   restart: always
  #   environment:
  #     - POSTGRES_DB=${DB_NAME}
  #     - POSTGRES_USER=${DB_USER}
  #     - POSTGRES_PASSWORD=${DB_PASSWORD}
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   networks:
  #     - app-network
  #   deploy:
  #     resources:
  #       limits:
  #         memory: 2G
  #         cpus: '2.0'
  #       reservations:
  #         memory: 1G
  #         cpus: '1.0'

  # Monitoring
  prometheus:
    image: prom/prometheus:v2.47.0
    restart: always
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    networks:
      - monitoring-network
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'
        reservations:
          memory: 1G
          cpus: '1.0'

  grafana:
    image: grafana/grafana:10.1.0
    restart: always
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=https://monitoring.${DOMAIN}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
    networks:
      - monitoring-network
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

networks:
  app-network:
    driver: overlay
    external: true
  monitoring-network:
    driver: overlay
    external: true

volumes:
  postgres_data:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local

configs:
  nginx_config:
    file: ./nginx/nginx.conf
  prometheus_config:
    file: ./monitoring/prometheus.yml

secrets:
  jwt_secret:
    external: true
  db_password:
    external: true
```

## ☸️ Kubernetes Deployments

### Complete Application Stack

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myapp-production
  labels:
    name: myapp-production
    environment: production

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: myapp-production
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  DB_NAME: "myapp"
  WORKER_CONCURRENCY: "4"
  # Nginx configuration
  nginx.conf: |
    user nginx;
    worker_processes auto;
    error_log /var/log/nginx/error.log warn;
    pid /var/run/nginx.pid;
    
    events {
        worker_connections 1024;
        use epoll;
        multi_accept on;
    }
    
    http {
        include /etc/nginx/mime.types;
        default_type application/octet-stream;
        
        log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';
        
        access_log /var/log/nginx/access.log main;
        
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        
        gzip on;
        gzip_vary on;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/json
            application/javascript
            application/xml+rss
            application/atom+xml
            image/svg+xml;
        
        upstream api_backend {
            server api-service:3000 max_fails=3 fail_timeout=30s;
        }
        
        server {
            listen 80;
            server_name _;
            
            location /health {
                access_log off;
                return 200 "healthy\n";
                add_header Content-Type text/plain;
            }
            
            location / {
                proxy_pass http://api_backend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_connect_timeout 30s;
                proxy_send_timeout 30s;
                proxy_read_timeout 30s;
            }
        }
    }

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: myapp-production
type: Opaque
data:
  jwt-secret: <base64-encoded-jwt-secret>
  db-password: <base64-encoded-db-password>
  redis-password: <base64-encoded-redis-password>

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  namespace: myapp-production
  labels:
    app: api
    component: backend
    version: v1
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
        component: backend
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: api-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
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
      containers:
      - name: api
        image: myregistry/myapp-api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: LOG_LEVEL
        - name: DATABASE_URL
          value: "postgresql://postgres:$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_HOST
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_PORT
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_NAME
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
        - name: REDIS_URL
          value: "redis://$(REDIS_HOST):$(REDIS_PORT)"
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: REDIS_HOST
        - name: REDIS_PORT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: REDIS_PORT
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
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
        - name: logs
          mountPath: /usr/src/app/logs
        - name: tmp
          mountPath: /tmp
      volumes:
      - name: logs
        emptyDir:
          sizeLimit: 1Gi
      - name: tmp
        emptyDir:
          sizeLimit: 100Mi
      nodeSelector:
        kubernetes.io/os: linux
      tolerations:
      - key: "node-type"
        operator: "Equal"
        value: "app"
        effect: "NoSchedule"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker-deployment
  namespace: myapp-production
  labels:
    app: worker
    component: background
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: worker
  template:
    metadata:
      labels:
        app: worker
        component: background
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9464"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: worker-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: worker
        image: myregistry/myapp-worker:latest
        imagePullPolicy: Always
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: WORKER_CONCURRENCY
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: WORKER_CONCURRENCY
        - name: DATABASE_URL
          value: "postgresql://postgres:$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_HOST
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_PORT
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_NAME
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
        - name: REDIS_URL
          value: "redis://$(REDIS_HOST):$(REDIS_PORT)"
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: REDIS_HOST
        - name: REDIS_PORT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: REDIS_PORT
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          exec:
            command:
            - node
            - dist/health-check.js
          initialDelaySeconds: 30
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        readinessProbe:
          exec:
            command:
            - node
            - dist/health-check.js
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        volumeMounts:
        - name: logs
          mountPath: /usr/src/app/logs
      volumes:
      - name: logs
        emptyDir:
          sizeLimit: 1Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: myapp-production
  labels:
    app: nginx
    component: proxy
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
        component: proxy
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 101
        fsGroup: 101
      containers:
      - name: nginx
        image: myregistry/myapp-nginx:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
          name: http
          protocol: TCP
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
          readOnly: true
        - name: logs
          mountPath: /var/log/nginx
      volumes:
      - name: nginx-config
        configMap:
          name: app-config
      - name: logs
        emptyDir:
          sizeLimit: 500Mi

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: myapp-production
  labels:
    app: api
spec:
  type: ClusterIP
  sessionAffinity: None
  ports:
  - port: 3000
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: api

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: myapp-production
  labels:
    app: nginx
spec:
  type: LoadBalancer
  sessionAffinity: None
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: nginx

---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: myapp-production
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

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: worker-hpa
  namespace: myapp-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: worker-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 85

---
# k8s/service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-service-account
  namespace: myapp-production
  labels:
    app: api

---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: worker-service-account
  namespace: myapp-production
  labels:
    app: worker

---
# k8s/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: myapp-production
  name: api-role
rules:
- apiGroups: [""]
  resources: ["pods", "configmaps", "secrets"]
  verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-role-binding
  namespace: myapp-production
subjects:
- kind: ServiceAccount
  name: api-service-account
  namespace: myapp-production
roleRef:
  kind: Role
  name: api-role
  apiGroup: rbac.authorization.k8s.io

---
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: myapp-production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
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
# k8s/pod-disruption-budget.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
  namespace: myapp-production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: worker-pdb
  namespace: myapp-production
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: worker
```

## 🔧 Container Optimization

### .dockerignore

```dockerfile
# .dockerignore
# Ignore unnecessary files to reduce build context

# Version control
.git
.gitignore
.gitattributes

# IDE and editor files
.vscode
.idea
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage

# Logs
logs
*.log

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
test-results
junit.xml
coverage.xml

# Build outputs
dist
build
out

# Documentation
docs
*.md
!README.md

# Development files
docker-compose.yml
docker-compose.*.yml
Dockerfile.*
.dockerignore

# CI/CD
.github
.gitlab-ci.yml
.travis.yml
.circleci

# Monitoring and config
monitoring
k8s
scripts

# Temporary files
tmp
temp
.cache
```

### Health Check Scripts

```javascript
// src/health-check.js
const http = require('http');
const { Pool } = require('pg');
const redis = require('redis');

// Configuration
const config = {
  app: {
    port: process.env.PORT || 3000,
    timeout: 5000
  },
  database: {
    url: process.env.DATABASE_URL,
    timeout: 3000
  },
  redis: {
    url: process.env.REDIS_URL,
    timeout: 2000
  }
};

// Health check results
const healthChecks = {
  app: false,
  database: false,
  redis: false,
  timestamp: new Date().toISOString()
};

// Check application endpoint
async function checkApp() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: config.app.port,
      path: '/health',
      method: 'GET',
      timeout: config.app.timeout
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`App health check failed with status ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(new Error(`App health check failed: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('App health check timeout'));
    });

    req.end();
  });
}

// Check database connection
async function checkDatabase() {
  if (!config.database.url) {
    throw new Error('DATABASE_URL not configured');
  }

  const pool = new Pool({
    connectionString: config.database.url,
    connectionTimeoutMillis: config.database.timeout,
    max: 1
  });

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    throw new Error(`Database health check failed: ${error.message}`);
  } finally {
    await pool.end();
  }
}

// Check Redis connection
async function checkRedis() {
  if (!config.redis.url) {
    throw new Error('REDIS_URL not configured');
  }

  const client = redis.createClient({
    url: config.redis.url,
    connect_timeout: config.redis.timeout
  });

  try {
    await client.connect();
    await client.ping();
    return true;
  } catch (error) {
    throw new Error(`Redis health check failed: ${error.message}`);
  } finally {
    await client.quit();
  }
}

// Run all health checks
async function runHealthChecks() {
  const checks = [
    { name: 'app', fn: checkApp },
    { name: 'database', fn: checkDatabase },
    { name: 'redis', fn: checkRedis }
  ];

  for (const check of checks) {
    try {
      await check.fn();
      healthChecks[check.name] = true;
      console.log(`✓ ${check.name} health check passed`);
    } catch (error) {
      healthChecks[check.name] = false;
      console.error(`✗ ${check.name} health check failed: ${error.message}`);
    }
  }

  return healthChecks;
}

// Main execution
async function main() {
  try {
    const results = await runHealthChecks();
    const allHealthy = Object.values(results).every(status => status === true || typeof status === 'string');
    
    console.log('\nHealth Check Results:');
    console.log(JSON.stringify(results, null, 2));
    
    if (allHealthy) {
      console.log('\n✓ All health checks passed');
      process.exit(0);
    } else {
      console.log('\n✗ Some health checks failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('\nHealth check execution failed:', error.message);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main();
}

module.exports = {
  runHealthChecks,
  checkApp,
  checkDatabase,
  checkRedis
};
```

## 🚀 Container Best Practices

### 1. **Image Optimization**
- Multi-stage builds: Separate build and runtime stages
- Minimal base images: Use Alpine or distroless images
- Layer caching: Order instructions for optimal caching
- .dockerignore: Exclude unnecessary files

### 2. **Security**
- Non-root users: Run containers as non-privileged users
- Secret management: Use external secret stores
- Image scanning: Scan for vulnerabilities
- Resource limits: Set CPU and memory limits

### 3. **Performance**
- Resource requests: Define minimum resource requirements
- Health checks: Implement proper health and readiness probes
- Graceful shutdown: Handle SIGTERM signals properly
- Connection pooling: Reuse database connections

### 4. **Monitoring**
- Structured logging: Use JSON formatted logs
- Metrics collection: Expose Prometheus metrics
- Distributed tracing: Implement request tracing
- Log aggregation: Centralize log collection

### 5. **Development Workflow**
- Hot reloading: Use volumes for development
- Multi-environment: Support dev, staging, production
- CI/CD integration: Automated build and deployment
- Testing: Run tests in containers

This comprehensive containerized template provides enterprise-grade Docker and Kubernetes architecture with parallel execution patterns, multi-stage builds, and production-ready observability optimized for Claude Code workflows.