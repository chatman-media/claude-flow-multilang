# Claude Code Configuration for Microservices Architecture

## 🚨 CRITICAL: PARALLEL MICROSERVICE ORCHESTRATION

**MANDATORY RULE**: All microservice operations MUST be parallel for distributed system efficiency:

1. **Service deployment** → Deploy all services simultaneously
2. **API gateway configuration** → Configure all routes in parallel
3. **Service mesh setup** → Initialize all mesh components together
4. **Database per service** → Provision all databases concurrently

## 🚀 CRITICAL: Microservices Parallel Execution Pattern

### 🔴 MANDATORY DISTRIBUTED SYSTEM BATCH OPERATIONS

**ABSOLUTE RULE**: ALL microservice operations MUST be concurrent in single messages:

```javascript
// ✅ CORRECT: Microservices deployment in ONE message
[Single Message]:
  // Service deployments
  - Bash("kubectl apply -f user-service/k8s/")
  - Bash("kubectl apply -f order-service/k8s/")
  - Bash("kubectl apply -f payment-service/k8s/")
  - Bash("kubectl apply -f notification-service/k8s/")
  - Bash("kubectl apply -f inventory-service/k8s/")
  
  // Database provisioning
  - Bash("helm install user-db bitnami/postgresql")
  - Bash("helm install order-db bitnami/postgresql")
  - Bash("helm install payment-db bitnami/postgresql")
  
  // Service mesh configuration
  - Bash("istioctl apply -f service-mesh/gateway.yaml")
  - Bash("istioctl apply -f service-mesh/virtual-services.yaml")
  - Bash("istioctl apply -f service-mesh/destination-rules.yaml")
  
  // File creation for all services
  - Write("user-service/src/app.js", userServiceCode)
  - Write("order-service/src/app.js", orderServiceCode)
  - Write("payment-service/src/app.js", paymentServiceCode)
  - Write("api-gateway/src/gateway.js", apiGatewayCode)
```

## 🏗️ Microservices Architecture Overview

### System Architecture Diagram

```
                         ┌─────────────────┐
                         │   API Gateway   │
                         │   (Kong/Istio)  │
                         └─────────┬───────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
             ┌──────▼──────┐ ┌────▼────┐ ┌───────▼────────┐
             │ User Service│ │Order Svc│ │Payment Service │
             │   Node.js   │ │ Node.js │ │    Node.js     │
             └──────┬──────┘ └────┬────┘ └───────┬────────┘
                    │             │              │
             ┌──────▼──────┐ ┌────▼────┐ ┌───────▼────────┐
             │  Users DB   │ │Orders DB│ │  Payments DB   │
             │ PostgreSQL  │ │MongoDB  │ │   PostgreSQL   │
             └─────────────┘ └─────────┘ └────────────────┘
                    │             │              │
                    └─────────────┼──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │      Message Bus           │
                    │   (Apache Kafka/NATS)     │
                    └────────────────────────────┘
```

## 🔧 Service Templates

### User Service (Node.js)

```javascript
// user-service/src/app.js
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Kafka } = require('kafkajs');
const OpenTelemetry = require('@opentelemetry/api');
const prometheus = require('prom-client');

const app = express();
const port = process.env.PORT || 3001;

// Metrics
const register = new prometheus.Registry();
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestDuration);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Kafka setup for event publishing
const kafka = new Kafka({
  clientId: 'user-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionTimeout: 30000
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'user-service' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// User registration
app.post('/users/register', async (req, res) => {
  const span = OpenTelemetry.trace.getActiveSpan();
  span?.setAttributes({ 'user.action': 'register' });
  
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, first_name, last_name, created_at',
      [email, hashedPassword, firstName, lastName]
    );
    
    const user = result.rows[0];
    
    // Publish user created event
    await producer.send({
      topic: 'user-events',
      messages: [{
        key: user.id.toString(),
        value: JSON.stringify({
          eventType: 'USER_CREATED',
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        })
      }]
    });
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at
      }
    });
    
  } catch (error) {
    span?.recordException(error);
    if (error.code === '23505') {
      res.status(409).json({ error: 'User already exists' });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// User authentication
app.post('/users/login', async (req, res) => {
  const span = OpenTelemetry.trace.getActiveSpan();
  span?.setAttributes({ 'user.action': 'login' });
  
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    // Publish login event
    await producer.send({
      topic: 'user-events',
      messages: [{
        key: user.id.toString(),
        value: JSON.stringify({
          eventType: 'USER_LOGIN',
          userId: user.id,
          timestamp: new Date().toISOString()
        })
      }]
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
    
  } catch (error) {
    span?.recordException(error);
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, created_at, last_login FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      lastLogin: user.last_login
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Circuit breaker for external service calls
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Initialize Kafka producer
async function initKafka() {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Failed to connect Kafka producer:', error);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await producer.disconnect();
  await pool.end();
  process.exit(0);
});

// Start server
initKafka();
app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});

module.exports = app;
```

### Order Service (Node.js with MongoDB)

```javascript
// order-service/src/app.js
const express = require('express');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const axios = require('axios');
const prometheus = require('prom-client');

const app = express();
const port = process.env.PORT || 3002;

// Metrics
const register = new prometheus.Registry();
const orderCounter = new prometheus.Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status']
});
register.registerMetric(orderCounter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Order schema
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Kafka setup
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'order-service-group' });

app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'healthy', service: 'order-service' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

// Create order
app.post('/orders', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, items, shippingAddress } = req.body;
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress
    });
    
    await order.save({ session });
    
    // Publish order created event
    await producer.send({
      topic: 'order-events',
      messages: [{
        key: order._id.toString(),
        value: JSON.stringify({
          eventType: 'ORDER_CREATED',
          orderId: order._id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          timestamp: new Date().toISOString()
        })
      }]
    });
    
    // Reserve inventory (call inventory service)
    try {
      await axios.post(`${process.env.INVENTORY_SERVICE_URL}/inventory/reserve`, {
        orderId: order._id,
        items: items
      });
    } catch (error) {
      throw new Error('Failed to reserve inventory');
    }
    
    await session.commitTransaction();
    orderCounter.labels('created').inc();
    
    res.status(201).json(order);
    
  } catch (error) {
    await session.abortTransaction();
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    session.endSession();
  }
});

// Get order
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Update order status
app.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Publish order status updated event
    await producer.send({
      topic: 'order-events',
      messages: [{
        key: order._id.toString(),
        value: JSON.stringify({
          eventType: 'ORDER_STATUS_UPDATED',
          orderId: order._id,
          userId: order.userId,
          status: order.status,
          timestamp: new Date().toISOString()
        })
      }]
    });
    
    orderCounter.labels(status).inc();
    res.json(order);
    
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Event handlers
async function handlePaymentEvents() {
  await consumer.subscribe({ topic: 'payment-events' });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      
      switch (event.eventType) {
        case 'PAYMENT_CONFIRMED':
          await Order.findByIdAndUpdate(event.orderId, {
            status: 'confirmed',
            updatedAt: new Date()
          });
          console.log(`Order ${event.orderId} confirmed after payment`);
          break;
          
        case 'PAYMENT_FAILED':
          await Order.findByIdAndUpdate(event.orderId, {
            status: 'cancelled',
            updatedAt: new Date()
          });
          console.log(`Order ${event.orderId} cancelled due to payment failure`);
          break;
      }
    },
  });
}

// Initialize Kafka
async function initKafka() {
  await producer.connect();
  await consumer.connect();
  await handlePaymentEvents();
  console.log('Kafka connected and consuming events');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await producer.disconnect();
  await consumer.disconnect();
  await mongoose.connection.close();
  process.exit(0);
});

initKafka();
app.listen(port, () => {
  console.log(`Order service listening on port ${port}`);
});

module.exports = app;
```

### Payment Service (Node.js)

```javascript
// payment-service/src/app.js
const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prometheus = require('prom-client');

const app = express();
const port = process.env.PORT || 3003;

// Metrics
const register = new prometheus.Registry();
const paymentCounter = new prometheus.Counter({
  name: 'payments_total',
  help: 'Total number of payments',
  labelNames: ['status', 'provider']
});
register.registerMetric(paymentCounter);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Kafka setup
const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'payment-service-group' });

app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'payment-service' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Process payment
app.post('/payments', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { orderId, amount, currency, paymentMethodId, customerId } = req.body;
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      payment_method: paymentMethodId,
      customer: customerId,
      confirm: true,
      return_url: process.env.PAYMENT_RETURN_URL
    });
    
    // Store payment record
    const result = await client.query(
      `INSERT INTO payments (order_id, stripe_payment_intent_id, amount, currency, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, status`,
      [orderId, paymentIntent.id, amount, currency, paymentIntent.status]
    );
    
    const payment = result.rows[0];
    
    if (paymentIntent.status === 'succeeded') {
      // Publish payment confirmed event
      await producer.send({
        topic: 'payment-events',
        messages: [{
          key: orderId.toString(),
          value: JSON.stringify({
            eventType: 'PAYMENT_CONFIRMED',
            orderId: orderId,
            paymentId: payment.id,
            amount: amount,
            timestamp: new Date().toISOString()
          })
        }]
      });
      
      paymentCounter.labels('succeeded', 'stripe').inc();
    } else if (paymentIntent.status === 'requires_action') {
      // Handle 3D Secure or other authentication
      res.json({
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
        requiresAction: true
      });
      await client.query('COMMIT');
      return;
    }
    
    await client.query('COMMIT');
    
    res.json({
      paymentId: payment.id,
      status: payment.status,
      amount: amount
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    
    // Publish payment failed event
    await producer.send({
      topic: 'payment-events',
      messages: [{
        key: req.body.orderId?.toString() || 'unknown',
        value: JSON.stringify({
          eventType: 'PAYMENT_FAILED',
          orderId: req.body.orderId,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }]
    });
    
    paymentCounter.labels('failed', 'stripe').inc();
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  } finally {
    client.release();
  }
});

// Webhook handler for Stripe events
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSucceeded(paymentIntent);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailed(failedPayment);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({received: true});
});

async function handlePaymentSucceeded(paymentIntent) {
  try {
    // Update payment status in database
    await pool.query(
      'UPDATE payments SET status = $1 WHERE stripe_payment_intent_id = $2',
      ['succeeded', paymentIntent.id]
    );
    
    // Get order ID from payment
    const result = await pool.query(
      'SELECT order_id FROM payments WHERE stripe_payment_intent_id = $1',
      [paymentIntent.id]
    );
    
    if (result.rows.length > 0) {
      const orderId = result.rows[0].order_id;
      
      // Publish payment confirmed event
      await producer.send({
        topic: 'payment-events',
        messages: [{
          key: orderId.toString(),
          value: JSON.stringify({
            eventType: 'PAYMENT_CONFIRMED',
            orderId: orderId,
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            timestamp: new Date().toISOString()
          })
        }]
      });
    }
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    // Update payment status in database
    await pool.query(
      'UPDATE payments SET status = $1 WHERE stripe_payment_intent_id = $2',
      ['failed', paymentIntent.id]
    );
    
    // Get order ID from payment
    const result = await pool.query(
      'SELECT order_id FROM payments WHERE stripe_payment_intent_id = $1',
      [paymentIntent.id]
    );
    
    if (result.rows.length > 0) {
      const orderId = result.rows[0].order_id;
      
      // Publish payment failed event
      await producer.send({
        topic: 'payment-events',
        messages: [{
          key: orderId.toString(),
          value: JSON.stringify({
            eventType: 'PAYMENT_FAILED',
            orderId: orderId,
            stripePaymentIntentId: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message || 'Payment failed',
            timestamp: new Date().toISOString()
          })
        }]
      });
    }
    
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Initialize Kafka
async function initKafka() {
  await producer.connect();
  await consumer.connect();
  console.log('Payment service Kafka connected');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await producer.disconnect();
  await consumer.disconnect();
  await pool.end();
  process.exit(0);
});

initKafka();
app.listen(port, () => {
  console.log(`Payment service listening on port ${port}`);
});

module.exports = app;
```

## 🌐 API Gateway Configuration

### Kong Gateway Setup

```yaml
# api-gateway/kong.yml
_format_version: "3.0"
_transform: true

services:
  - name: user-service
    url: http://user-service:3001
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
      - name: prometheus
        config:
          per_consumer: true
      - name: jwt
        config:
          secret_is_base64: false
          key_claim_name: iss
    routes:
      - name: user-routes
        paths:
          - /api/v1/users
        methods:
          - GET
          - POST
          - PUT
          - DELETE
        strip_path: true
        preserve_host: false

  - name: order-service
    url: http://order-service:3002
    plugins:
      - name: rate-limiting
        config:
          minute: 200
          hour: 2000
      - name: prometheus
        config:
          per_consumer: true
      - name: jwt
        config:
          secret_is_base64: false
    routes:
      - name: order-routes
        paths:
          - /api/v1/orders
        methods:
          - GET
          - POST
          - PUT
          - PATCH
        strip_path: true

  - name: payment-service
    url: http://payment-service:3003
    plugins:
      - name: rate-limiting
        config:
          minute: 50
          hour: 500
      - name: prometheus
        config:
          per_consumer: true
      - name: jwt
        config:
          secret_is_base64: false
    routes:
      - name: payment-routes
        paths:
          - /api/v1/payments
        methods:
          - POST
        strip_path: true

consumers:
  - username: web-app
    jwt_secrets:
      - key: web-app-key
        secret: your-jwt-secret-key
  - username: mobile-app
    jwt_secrets:
      - key: mobile-app-key
        secret: your-mobile-jwt-secret

plugins:
  - name: cors
    config:
      origins:
        - http://localhost:3000
        - https://myapp.com
      methods:
        - GET
        - POST
        - PUT
        - PATCH
        - DELETE
        - OPTIONS
      headers:
        - Accept
        - Accept-Version
        - Content-Length
        - Content-MD5
        - Content-Type
        - Date
        - Authorization
      exposed_headers:
        - X-Auth-Token
      credentials: true
      max_age: 3600

  - name: response-transformer
    config:
      add:
        headers:
          - "X-API-Version: v1"
          - "X-Service-Name: api-gateway"
```

## 🕸️ Service Mesh (Istio)

### Gateway Configuration

```yaml
# service-mesh/gateway.yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: microservices-gateway
  namespace: production
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - api.myapp.com
    tls:
      httpsRedirect: true
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: api-tls-secret
    hosts:
    - api.myapp.com

---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: microservices-routes
  namespace: production
spec:
  hosts:
  - api.myapp.com
  gateways:
  - microservices-gateway
  http:
  # User service routes
  - match:
    - uri:
        prefix: /api/v1/users
    route:
    - destination:
        host: user-service
        port:
          number: 3001
    fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
    retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: gateway-error,connect-failure,refused-stream
      
  # Order service routes
  - match:
    - uri:
        prefix: /api/v1/orders
    route:
    - destination:
        host: order-service
        port:
          number: 3002
    timeout: 30s
    retries:
      attempts: 2
      perTryTimeout: 10s
      
  # Payment service routes
  - match:
    - uri:
        prefix: /api/v1/payments
    route:
    - destination:
        host: payment-service
        port:
          number: 3003
    timeout: 60s
    retries:
      attempts: 1
      perTryTimeout: 30s

---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: microservices-destinations
  namespace: production
spec:
  host: "*.production.svc.cluster.local"
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 10
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 2
    loadBalancer:
      simple: LEAST_CONN
    outlierDetection:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 50

---
# Separate destination rules for each service
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: user-service-destination
  namespace: production
spec:
  host: user-service
  trafficPolicy:
    circuitBreaker:
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
    loadBalancer:
      simple: ROUND_ROBIN

---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: order-service-destination
  namespace: production
spec:
  host: order-service
  trafficPolicy:
    circuitBreaker:
      consecutiveErrors: 3
      interval: 60s
      baseEjectionTime: 60s
      maxEjectionPercent: 30
    loadBalancer:
      simple: LEAST_CONN

---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: payment-service-destination
  namespace: production
spec:
  host: payment-service
  trafficPolicy:
    circuitBreaker:
      consecutiveErrors: 2
      interval: 30s
      baseEjectionTime: 120s
      maxEjectionPercent: 10
    loadBalancer:
      simple: RANDOM
```

### Security Policies

```yaml
# service-mesh/security.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: microservices-authz
  namespace: production
spec:
  rules:
  # Allow user service to be called by gateway
  - from:
    - source:
        principals: ["cluster.local/ns/istio-system/sa/istio-ingressgateway-service-account"]
    to:
    - operation:
        methods: ["GET", "POST"]
    when:
    - key: destination.service.name
      values: ["user-service"]
      
  # Allow order service to call user service
  - from:
    - source:
        principals: ["cluster.local/ns/production/sa/order-service"]
    to:
    - operation:
        methods: ["GET"]
    when:
    - key: destination.service.name
      values: ["user-service"]
      
  # Allow payment service to call order service
  - from:
    - source:
        principals: ["cluster.local/ns/production/sa/payment-service"]
    to:
    - operation:
        methods: ["PATCH"]
    when:
    - key: destination.service.name
      values: ["order-service"]

---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT

---
apiVersion: security.istio.io/v1beta1
kind: RequestAuthentication
metadata:
  name: jwt-auth
  namespace: production
spec:
  selector:
    matchLabels:
      app: user-service
  jwtRules:
  - issuer: "https://myapp.auth0.com/"
    jwksUri: https://myapp.auth0.com/.well-known/jwks.json
    audiences:
    - "https://api.myapp.com"
```

## 📊 Event-Driven Architecture

### Apache Kafka Configuration

```yaml
# kafka/kafka-cluster.yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: microservices-kafka
  namespace: kafka
spec:
  kafka:
    version: 3.5.0
    replicas: 3
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
      - name: tls
        port: 9093
        type: internal
        tls: true
        authentication:
          type: tls
      - name: external
        port: 9094
        type: route
        tls: true
    config:
      offsets.topic.replication.factor: 3
      transaction.state.log.replication.factor: 3
      transaction.state.log.min.isr: 2
      default.replication.factor: 3
      min.insync.replicas: 2
      inter.broker.protocol.version: "3.5"
      auto.create.topics.enable: false
      log.message.format.version: "3.5"
    storage:
      type: jbod
      volumes:
      - id: 0
        type: persistent-claim
        size: 100Gi
        deleteClaim: false
        class: fast-ssd
    resources:
      requests:
        memory: 2Gi
        cpu: 1000m
      limits:
        memory: 4Gi
        cpu: 2000m
    jvmOptions:
      -Xms: 1024m
      -Xmx: 2048m
    template:
      pod:
        affinity:
          podAntiAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                  - key: strimzi.io/name
                    operator: In
                    values:
                    - microservices-kafka-kafka
                topologyKey: kubernetes.io/hostname
  zookeeper:
    replicas: 3
    storage:
      type: persistent-claim
      size: 10Gi
      deleteClaim: false
      class: fast-ssd
    resources:
      requests:
        memory: 512Mi
        cpu: 500m
      limits:
        memory: 1Gi
        cpu: 1000m
  entityOperator:
    topicOperator: {}
    userOperator: {}

---
# Topic definitions
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: user-events
  namespace: kafka
  labels:
    strimzi.io/cluster: microservices-kafka
spec:
  partitions: 3
  replicas: 3
  config:
    retention.ms: 604800000  # 7 days
    segment.ms: 86400000     # 1 day
    cleanup.policy: delete

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: order-events
  namespace: kafka
  labels:
    strimzi.io/cluster: microservices-kafka
spec:
  partitions: 6
  replicas: 3
  config:
    retention.ms: 2592000000  # 30 days
    segment.ms: 86400000      # 1 day
    cleanup.policy: delete

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: payment-events
  namespace: kafka
  labels:
    strimzi.io/cluster: microservices-kafka
spec:
  partitions: 3
  replicas: 3
  config:
    retention.ms: 7776000000  # 90 days
    segment.ms: 86400000      # 1 day
    cleanup.policy: delete
```

## 🗄️ Database per Service

### User Service Database Schema

```sql
-- user-service/migrations/001_initial.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(20) DEFAULT 'active',
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_status CHECK (account_status IN ('active', 'suspended', 'deleted'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login);

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  avatar_url VARCHAR(500),
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  device_info JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Payment Service Database Schema

```sql
-- payment-service/migrations/001_initial.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  user_id UUID NOT NULL,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  provider_fee DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'))
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

CREATE TABLE payment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  error_code VARCHAR(100),
  error_message TEXT,
  provider_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_attempts_payment_id ON payment_attempts(payment_id);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  stripe_refund_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(100),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_refund_amount CHECK (amount > 0),
  CONSTRAINT valid_refund_status CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled'))
);

CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);

-- Trigger to update updated_at
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔍 Distributed Tracing

### OpenTelemetry Configuration

```javascript
// shared/tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const serviceName = process.env.SERVICE_NAME || 'unknown-service';
const serviceVersion = process.env.SERVICE_VERSION || '1.0.0';
const jaegerEndpoint = process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: new JaegerExporter({
    endpoint: jaegerEndpoint,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        requestHook: (span, request) => {
          span.setAttributes({
            'http.request.body.size': request.headers['content-length'],
            'user.id': request.headers['x-user-id'],
          });
        },
        responseHook: (span, response) => {
          span.setAttributes({
            'http.response.body.size': response.headers['content-length'],
          });
        },
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-pg': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-mongodb': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-kafkajs': {
        enabled: true,
      },
    }),
  ],
});

sdk.start();

module.exports = sdk;
```

## 🚀 Microservices Best Practices

### 1. **Service Design Principles**
- Single Responsibility: Each service owns one business capability
- Database per Service: Avoid shared databases
- API-First Design: Define APIs before implementation
- Stateless Services: Store state in databases, not in service memory

### 2. **Communication Patterns**
- Synchronous: HTTP/REST for real-time requests
- Asynchronous: Event-driven with message queues
- Circuit Breakers: Prevent cascade failures
- Retry Policies: Handle transient failures

### 3. **Data Management**
- CQRS: Separate read and write models
- Event Sourcing: Store events instead of current state
- Saga Pattern: Manage distributed transactions
- Data Consistency: Eventually consistent where possible

### 4. **Monitoring and Observability**
- Distributed Tracing: Track requests across services
- Centralized Logging: Aggregate logs from all services
- Health Checks: Monitor service availability
- Business Metrics: Track domain-specific metrics

### 5. **Security**
- Service-to-Service Authentication: Use mutual TLS
- API Gateway: Centralize authentication and authorization
- Secrets Management: Use external secret stores
- Network Policies: Restrict inter-service communication

## 📈 Performance Optimization

### Load Testing with Artillery

```yaml
# load-testing/artillery-config.yml
config:
  target: https://api.myapp.com
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 120
      arrivalRate: 100
      name: "Peak load"
  payload:
    path: "./users.csv"
    fields:
      - "email"
      - "password"
  variables:
    domain: "myapp.com"

scenarios:
  - name: "User Registration and Order Flow"
    weight: 70
    flow:
      - post:
          url: "/api/v1/users/register"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
            firstName: "Test"
            lastName: "User"
          capture:
            - json: "$.user.id"
              as: "userId"
            - json: "$.token"
              as: "authToken"
      - post:
          url: "/api/v1/orders"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            userId: "{{ userId }}"
            items:
              - productId: "prod-123"
                quantity: 2
                price: 29.99
            shippingAddress:
              street: "123 Test St"
              city: "Test City"
              state: "TS"
              zipCode: "12345"
              country: "US"
          capture:
            - json: "$.id"
              as: "orderId"
      - post:
          url: "/api/v1/payments"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            orderId: "{{ orderId }}"
            amount: 59.98
            currency: "USD"
            paymentMethodId: "pm_card_visa"

  - name: "Read-heavy operations"
    weight: 30
    flow:
      - get:
          url: "/api/v1/users/{{ $randomInt(1, 1000) }}"
      - get:
          url: "/api/v1/orders/{{ $randomInt(1, 500) }}"
```

This comprehensive microservices template provides enterprise-grade distributed system architecture with parallel execution patterns, event-driven communication, and production-ready observability optimized for Claude Code workflows.