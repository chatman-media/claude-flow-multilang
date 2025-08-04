# Claude Code Configuration for Serverless Architecture

## 🚨 CRITICAL: PARALLEL SERVERLESS DEPLOYMENT

**MANDATORY RULE**: All serverless operations MUST be parallel for Function-as-a-Service efficiency:

1. **Function deployment** → Deploy all functions simultaneously
2. **Infrastructure provisioning** → Create all resources concurrently
3. **Event source mapping** → Configure all triggers in parallel
4. **API Gateway setup** → Define all routes together

## 🚀 CRITICAL: Serverless Parallel Execution Pattern

### 🔴 MANDATORY SERVERLESS BATCH OPERATIONS

**ABSOLUTE RULE**: ALL serverless operations MUST be concurrent in single messages:

```javascript
// ✅ CORRECT: Serverless deployment in ONE message
[Single Message]:
  // AWS SAM deployment
  - Bash("sam build --parallel")
  - Bash("sam deploy --no-confirm-changeset --no-fail-on-empty-changeset")
  
  // Terraform serverless infrastructure
  - Bash("terraform init")
  - Bash("terraform apply -auto-approve")
  
  // Function deployments
  - Bash("serverless deploy --stage production")
  - Bash("sls deploy function --function userHandler")
  - Bash("sls deploy function --function orderHandler")
  - Bash("sls deploy function --function paymentHandler")
  
  // File creation for all functions
  - Write("functions/user/handler.js", userFunctionCode)
  - Write("functions/order/handler.js", orderFunctionCode)
  - Write("functions/payment/handler.js", paymentFunctionCode)
  - Write("serverless.yml", serverlessConfig)
  - Write("template.yaml", samTemplate)
```

## ☁️ AWS Lambda Functions

### User Management Function

```javascript
// functions/user/handler.js
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  maxRetries: 3,
  retryDelayOptions: {
    customBackoff: function(retryCount) {
      return Math.pow(2, retryCount) * 100;
    }
  }
});

const sns = new AWS.SNS({ region: process.env.AWS_REGION });
const ses = new AWS.SES({ region: process.env.AWS_REGION });

// Structured logging
const logger = {
  info: (message, meta = {}) => console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() })),
  error: (message, error = {}, meta = {}) => console.error(JSON.stringify({ level: 'error', message, error: error.message || error, stack: error.stack, ...meta, timestamp: new Date().toISOString() })),
  warn: (message, meta = {}) => console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }))
};

// Response helper
const response = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...headers
  },
  body: JSON.stringify(body)
});

// User registration
exports.register = async (event, context) => {
  // Set correlation ID for tracing
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const { email, password, firstName, lastName } = JSON.parse(event.body);
    
    logger.info('User registration started', { correlationId, email });
    
    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return response(400, { error: 'Missing required fields' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response(400, { error: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return response(400, { error: 'Password must be at least 8 characters' });
    }
    
    // Check if user already exists
    const existingUser = await dynamodb.get({
      TableName: process.env.USERS_TABLE,
      Key: { email }
    }).promise();
    
    if (existingUser.Item) {
      return response(409, { error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();
    
    const user = {
      id: userId,
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      createdAt: now,
      updatedAt: now,
      emailVerified: false,
      status: 'active'
    };
    
    // Save to DynamoDB with conditional check
    await dynamodb.put({
      TableName: process.env.USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)'
    }).promise();
    
    // Publish user created event to SNS
    await sns.publish({
      TopicArn: process.env.USER_EVENTS_TOPIC,
      Message: JSON.stringify({
        eventType: 'USER_CREATED',
        userId,
        email,
        timestamp: now,
        correlationId
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'USER_CREATED'
        },
        userId: {
          DataType: 'String',
          StringValue: userId
        }
      }
    }).promise();
    
    // Send welcome email (async)
    const emailParams = {
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Welcome to MyApp!' },
        Body: {
          Html: {
            Data: `
              <h1>Welcome ${firstName}!</h1>
              <p>Thank you for joining MyApp. Please verify your email address by clicking the link below:</p>
              <a href="${process.env.FRONTEND_URL}/verify-email?token=${jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '24h' })}">Verify Email</a>
            `
          }
        }
      }
    };
    
    // Send email without waiting (fire and forget)
    ses.sendEmail(emailParams).promise().catch(error => {
      logger.error('Failed to send welcome email', error, { correlationId, userId });
    });
    
    logger.info('User registration completed', { correlationId, userId });
    
    return response(201, {
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        createdAt: now
      }
    });
    
  } catch (error) {
    logger.error('User registration failed', error, { correlationId });
    
    if (error.code === 'ConditionalCheckFailedException') {
      return response(409, { error: 'User already exists' });
    }
    
    return response(500, { error: 'Registration failed' });
  }
};

// User authentication
exports.login = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const { email, password } = JSON.parse(event.body);
    
    logger.info('User login started', { correlationId, email });
    
    // Get user from DynamoDB
    const result = await dynamodb.get({
      TableName: process.env.USERS_TABLE,
      Key: { email }
    }).promise();
    
    if (!result.Item) {
      return response(401, { error: 'Invalid credentials' });
    }
    
    const user = result.Item;
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return response(401, { error: 'Invalid credentials' });
    }
    
    // Check user status
    if (user.status !== 'active') {
      return response(403, { error: 'Account is not active' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    await dynamodb.update({
      TableName: process.env.USERS_TABLE,
      Key: { email },
      UpdateExpression: 'SET lastLogin = :now',
      ExpressionAttributeValues: {
        ':now': new Date().toISOString()
      }
    }).promise();
    
    // Publish login event
    await sns.publish({
      TopicArn: process.env.USER_EVENTS_TOPIC,
      Message: JSON.stringify({
        eventType: 'USER_LOGIN',
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        correlationId
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'USER_LOGIN'
        },
        userId: {
          DataType: 'String',
          StringValue: user.id
        }
      }
    }).promise();
    
    logger.info('User login completed', { correlationId, userId: user.id });
    
    return response(200, {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    });
    
  } catch (error) {
    logger.error('User login failed', error, { correlationId });
    return response(500, { error: 'Login failed' });
  }
};

// Get user profile
exports.getProfile = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const userId = event.pathParameters.id;
    
    // Get user from DynamoDB using GSI
    const result = await dynamodb.query({
      TableName: process.env.USERS_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'id = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();
    
    if (result.Items.length === 0) {
      return response(404, { error: 'User not found' });
    }
    
    const user = result.Items[0];
    
    logger.info('User profile retrieved', { correlationId, userId });
    
    return response(200, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      emailVerified: user.emailVerified
    });
    
  } catch (error) {
    logger.error('Failed to get user profile', error, { correlationId });
    return response(500, { error: 'Failed to get user profile' });
  }
};

// JWT Authorization middleware
exports.authorize = async (event, context) => {
  try {
    const token = event.authorizationToken.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const policy = {
      principalId: decoded.userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      },
      context: {
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      }
    };
    
    return policy;
    
  } catch (error) {
    logger.error('Authorization failed', error);
    throw new Error('Unauthorized');
  }
};

// Email verification
exports.verifyEmail = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const { token } = JSON.parse(event.body);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Update user email verification status
    await dynamodb.update({
      TableName: process.env.USERS_TABLE,
      Key: { email: decoded.email },
      UpdateExpression: 'SET emailVerified = :verified, updatedAt = :now',
      ExpressionAttributeValues: {
        ':verified': true,
        ':now': new Date().toISOString()
      }
    }).promise();
    
    logger.info('Email verified', { correlationId, userId: decoded.userId });
    
    return response(200, { message: 'Email verified successfully' });
    
  } catch (error) {
    logger.error('Email verification failed', error, { correlationId });
    return response(400, { error: 'Invalid or expired token' });
  }
};
```

### Order Processing Function

```javascript
// functions/order/handler.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  maxRetries: 3
});

const stepfunctions = new AWS.StepFunctions({ region: process.env.AWS_REGION });
const sns = new AWS.SNS({ region: process.env.AWS_REGION });

// Structured logging
const logger = {
  info: (message, meta = {}) => console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() })),
  error: (message, error = {}, meta = {}) => console.error(JSON.stringify({ level: 'error', message, error: error.message || error, stack: error.stack, ...meta, timestamp: new Date().toISOString() }))
};

// Response helper
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(body)
});

// Create order
exports.createOrder = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  const userId = event.requestContext.authorizer.userId;
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const { items, shippingAddress } = JSON.parse(event.body);
    
    logger.info('Order creation started', { correlationId, userId });
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return response(400, { error: 'Invalid items' });
    }
    
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return response(400, { error: 'Invalid shipping address' });
    }
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      if (!item.productId || !item.quantity || !item.price) {
        throw new Error('Invalid item format');
      }
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Create order
    const orderId = uuidv4();
    const now = new Date().toISOString();
    
    const order = {
      id: orderId,
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
    };
    
    // Save order to DynamoDB
    await dynamodb.put({
      TableName: process.env.ORDERS_TABLE,
      Item: order
    }).promise();
    
    // Start order processing state machine
    const stateMachineInput = {
      orderId,
      userId,
      totalAmount,
      items,
      correlationId
    };
    
    await stepfunctions.startExecution({
      stateMachineArn: process.env.ORDER_PROCESSING_STATE_MACHINE,
      name: `order-${orderId}-${Date.now()}`,
      input: JSON.stringify(stateMachineInput)
    }).promise();
    
    // Publish order created event
    await sns.publish({
      TopicArn: process.env.ORDER_EVENTS_TOPIC,
      Message: JSON.stringify({
        eventType: 'ORDER_CREATED',
        orderId,
        userId,
        totalAmount,
        timestamp: now,
        correlationId
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'ORDER_CREATED'
        },
        orderId: {
          DataType: 'String',
          StringValue: orderId
        }
      }
    }).promise();
    
    logger.info('Order created successfully', { correlationId, orderId });
    
    return response(201, order);
    
  } catch (error) {
    logger.error('Order creation failed', error, { correlationId });
    return response(500, { error: 'Failed to create order' });
  }
};

// Get order
exports.getOrder = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  const userId = event.requestContext.authorizer.userId;
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const orderId = event.pathParameters.id;
    
    const result = await dynamodb.get({
      TableName: process.env.ORDERS_TABLE,
      Key: { id: orderId }
    }).promise();
    
    if (!result.Item) {
      return response(404, { error: 'Order not found' });
    }
    
    const order = result.Item;
    
    // Check if user owns this order
    if (order.userId !== userId) {
      return response(403, { error: 'Access denied' });
    }
    
    logger.info('Order retrieved', { correlationId, orderId });
    
    return response(200, order);
    
  } catch (error) {
    logger.error('Failed to get order', error, { correlationId });
    return response(500, { error: 'Failed to get order' });
  }
};

// Update order status
exports.updateOrderStatus = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const orderId = event.pathParameters.id;
    const { status } = JSON.parse(event.body);
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return response(400, { error: 'Invalid status' });
    }
    
    // Update order status
    const result = await dynamodb.update({
      TableName: process.env.ORDERS_TABLE,
      Key: { id: orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }).promise();
    
    if (!result.Attributes) {
      return response(404, { error: 'Order not found' });
    }
    
    // Publish order status updated event
    await sns.publish({
      TopicArn: process.env.ORDER_EVENTS_TOPIC,
      Message: JSON.stringify({
        eventType: 'ORDER_STATUS_UPDATED',
        orderId,
        userId: result.Attributes.userId,
        status,
        timestamp: new Date().toISOString(),
        correlationId
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'ORDER_STATUS_UPDATED'
        },
        orderId: {
          DataType: 'String',
          StringValue: orderId
        }
      }
    }).promise();
    
    logger.info('Order status updated', { correlationId, orderId, status });
    
    return response(200, result.Attributes);
    
  } catch (error) {
    logger.error('Failed to update order status', error, { correlationId });
    return response(500, { error: 'Failed to update order status' });
  }
};

// List user orders
exports.listOrders = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  const userId = event.requestContext.authorizer.userId;
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const limit = parseInt(event.queryStringParameters?.limit) || 20;
    const lastKey = event.queryStringParameters?.lastKey;
    
    const params = {
      TableName: process.env.ORDERS_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: Math.min(limit, 100), // Cap at 100
      ScanIndexForward: false // Latest first
    };
    
    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(lastKey, 'base64').toString());
    }
    
    const result = await dynamodb.query(params).promise();
    
    const response_body = {
      orders: result.Items,
      count: result.Items.length
    };
    
    if (result.LastEvaluatedKey) {
      response_body.lastKey = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
    }
    
    logger.info('Orders listed', { correlationId, userId, count: result.Items.length });
    
    return response(200, response_body);
    
  } catch (error) {
    logger.error('Failed to list orders', error, { correlationId });
    return response(500, { error: 'Failed to list orders' });
  }
};

// Process order events (from SQS)
exports.processOrderEvents = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const processedRecords = [];
  const failedRecords = [];
  
  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      const correlationId = message.correlationId || uuidv4();
      
      logger.info('Processing order event', { correlationId, eventType: message.eventType });
      
      switch (message.eventType) {
        case 'PAYMENT_CONFIRMED':
          await updateOrderStatus(message.orderId, 'confirmed', correlationId);
          break;
          
        case 'PAYMENT_FAILED':
          await updateOrderStatus(message.orderId, 'cancelled', correlationId);
          break;
          
        case 'INVENTORY_RESERVED':
          await updateOrderStatus(message.orderId, 'processing', correlationId);
          break;
          
        case 'INVENTORY_INSUFFICIENT':
          await updateOrderStatus(message.orderId, 'cancelled', correlationId);
          break;
          
        default:
          logger.info('Unhandled event type', { correlationId, eventType: message.eventType });
      }
      
      processedRecords.push(record.messageId);
      
    } catch (error) {
      logger.error('Failed to process order event', error, { messageId: record.messageId });
      failedRecords.push(record.messageId);
    }
  }
  
  // Return partial batch failure response
  if (failedRecords.length > 0) {
    return {
      batchItemFailures: failedRecords.map(messageId => ({ itemIdentifier: messageId }))
    };
  }
  
  return { batchItemFailures: [] };
};

async function updateOrderStatus(orderId, status, correlationId) {
  await dynamodb.update({
    TableName: process.env.ORDERS_TABLE,
    Key: { id: orderId },
    UpdateExpression: 'SET #status = :status, updatedAt = :now',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':now': new Date().toISOString()
    }
  }).promise();
  
  logger.info('Order status updated via event', { correlationId, orderId, status });
}
```

### Payment Processing Function

```javascript
// functions/payment/handler.js
const AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const sns = new AWS.SNS({ region: process.env.AWS_REGION });
const secrets = new AWS.SecretsManager({ region: process.env.AWS_REGION });

// Structured logging
const logger = {
  info: (message, meta = {}) => console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() })),
  error: (message, error = {}, meta = {}) => console.error(JSON.stringify({ level: 'error', message, error: error.message || error, stack: error.stack, ...meta, timestamp: new Date().toISOString() }))
};

// Response helper
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(body)
});

// Process payment
exports.processPayment = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  const userId = event.requestContext.authorizer.userId;
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const { orderId, amount, currency = 'usd', paymentMethodId } = JSON.parse(event.body);
    
    logger.info('Payment processing started', { correlationId, orderId, amount });
    
    // Validate input
    if (!orderId || !amount || !paymentMethodId) {
      return response(400, { error: 'Missing required fields' });
    }
    
    if (amount <= 0 || amount > 999999) {
      return response(400, { error: 'Invalid amount' });
    }
    
    // Verify order exists and belongs to user
    const orderResult = await dynamodb.get({
      TableName: process.env.ORDERS_TABLE,
      Key: { id: orderId }
    }).promise();
    
    if (!orderResult.Item) {
      return response(404, { error: 'Order not found' });
    }
    
    if (orderResult.Item.userId !== userId) {
      return response(403, { error: 'Access denied' });
    }
    
    if (orderResult.Item.status !== 'pending') {
      return response(400, { error: 'Order cannot be paid' });
    }
    
    // Create payment record
    const paymentId = uuidv4();
    const now = new Date().toISOString();
    
    const payment = {
      id: paymentId,
      orderId,
      userId,
      amount,
      currency,
      status: 'processing',
      createdAt: now,
      updatedAt: now,
      ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
    };
    
    // Save payment record
    await dynamodb.put({
      TableName: process.env.PAYMENTS_TABLE,
      Item: payment
    }).promise();
    
    try {
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: process.env.PAYMENT_RETURN_URL,
        metadata: {
          orderId,
          paymentId,
          userId
        }
      });
      
      // Update payment with Stripe data
      await dynamodb.update({
        TableName: process.env.PAYMENTS_TABLE,
        Key: { id: paymentId },
        UpdateExpression: 'SET stripePaymentIntentId = :intentId, #status = :status, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':intentId': paymentIntent.id,
          ':status': paymentIntent.status,
          ':now': new Date().toISOString()
        }
      }).promise();
      
      if (paymentIntent.status === 'succeeded') {
        // Publish payment confirmed event
        await sns.publish({
          TopicArn: process.env.PAYMENT_EVENTS_TOPIC,
          Message: JSON.stringify({
            eventType: 'PAYMENT_CONFIRMED',
            paymentId,
            orderId,
            userId,
            amount,
            timestamp: new Date().toISOString(),
            correlationId
          }),
          MessageAttributes: {
            eventType: {
              DataType: 'String',
              StringValue: 'PAYMENT_CONFIRMED'
            },
            orderId: {
              DataType: 'String',
              StringValue: orderId
            }
          }
        }).promise();
        
        logger.info('Payment confirmed', { correlationId, paymentId, orderId });
        
        return response(200, {
          paymentId,
          status: 'succeeded',
          amount
        });
        
      } else if (paymentIntent.status === 'requires_action') {
        return response(200, {
          paymentId,
          clientSecret: paymentIntent.client_secret,
          requiresAction: true
        });
      }
      
      return response(200, {
        paymentId,
        status: paymentIntent.status
      });
      
    } catch (stripeError) {
      // Update payment status to failed
      await dynamodb.update({
        TableName: process.env.PAYMENTS_TABLE,
        Key: { id: paymentId },
        UpdateExpression: 'SET #status = :status, errorMessage = :error, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'failed',
          ':error': stripeError.message,
          ':now': new Date().toISOString()
        }
      }).promise();
      
      // Publish payment failed event
      await sns.publish({
        TopicArn: process.env.PAYMENT_EVENTS_TOPIC,
        Message: JSON.stringify({
          eventType: 'PAYMENT_FAILED',
          paymentId,
          orderId,
          userId,
          error: stripeError.message,
          timestamp: new Date().toISOString(),
          correlationId
        }),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: 'PAYMENT_FAILED'
          },
          orderId: {
            DataType: 'String',
            StringValue: orderId
          }
        }
      }).promise();
      
      logger.error('Payment processing failed', stripeError, { correlationId, paymentId });
      
      return response(402, { error: 'Payment failed', details: stripeError.message });
    }
    
  } catch (error) {
    logger.error('Payment processing error', error, { correlationId });
    return response(500, { error: 'Payment processing failed' });
  }
};

// Stripe webhook handler
exports.stripeWebhook = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } catch (error) {
      logger.error('Webhook signature verification failed', error);
      return response(400, { error: 'Invalid signature' });
    }
    
    const correlationId = uuidv4();
    logger.info('Stripe webhook received', { correlationId, eventType: stripeEvent.type });
    
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object, correlationId);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object, correlationId);
        break;
        
      case 'payment_intent.requires_action':
        await handlePaymentRequiresAction(stripeEvent.data.object, correlationId);
        break;
        
      default:
        logger.info('Unhandled webhook event', { correlationId, eventType: stripeEvent.type });
    }
    
    return response(200, { received: true });
    
  } catch (error) {
    logger.error('Webhook processing failed', error);
    return response(500, { error: 'Webhook processing failed' });
  }
};

async function handlePaymentSucceeded(paymentIntent, correlationId) {
  try {
    const { orderId, paymentId, userId } = paymentIntent.metadata;
    
    // Update payment status
    await dynamodb.update({
      TableName: process.env.PAYMENTS_TABLE,
      Key: { id: paymentId },
      UpdateExpression: 'SET #status = :status, processedAt = :now, updatedAt = :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'succeeded',
        ':now': new Date().toISOString()
      }
    }).promise();
    
    // Publish payment confirmed event
    await sns.publish({
      TopicArn: process.env.PAYMENT_EVENTS_TOPIC,
      Message: JSON.stringify({
        eventType: 'PAYMENT_CONFIRMED',
        paymentId,
        orderId,
        userId,
        amount: paymentIntent.amount / 100,
        stripePaymentIntentId: paymentIntent.id,
        timestamp: new Date().toISOString(),
        correlationId
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'PAYMENT_CONFIRMED'
        },
        orderId: {
          DataType: 'String',
          StringValue: orderId
        }
      }
    }).promise();
    
    logger.info('Payment succeeded webhook processed', { correlationId, paymentId, orderId });
    
  } catch (error) {
    logger.error('Failed to handle payment succeeded', error, { correlationId });
  }
}

async function handlePaymentFailed(paymentIntent, correlationId) {
  try {
    const { orderId, paymentId, userId } = paymentIntent.metadata;
    
    // Update payment status
    await dynamodb.update({
      TableName: process.env.PAYMENTS_TABLE,
      Key: { id: paymentId },
      UpdateExpression: 'SET #status = :status, errorMessage = :error, updatedAt = :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'failed',
        ':error': paymentIntent.last_payment_error?.message || 'Payment failed',
        ':now': new Date().toISOString()
      }
    }).promise();
    
    // Publish payment failed event
    await sns.publish({
      TopicArn: process.env.PAYMENT_EVENTS_TOPIC,
      Message: JSON.stringify({
        eventType: 'PAYMENT_FAILED',
        paymentId,
        orderId,
        userId,
        error: paymentIntent.last_payment_error?.message || 'Payment failed',
        stripePaymentIntentId: paymentIntent.id,
        timestamp: new Date().toISOString(),
        correlationId
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'PAYMENT_FAILED'
        },
        orderId: {
          DataType: 'String',
          StringValue: orderId
        }
      }
    }).promise();
    
    logger.info('Payment failed webhook processed', { correlationId, paymentId, orderId });
    
  } catch (error) {
    logger.error('Failed to handle payment failed', error, { correlationId });
  }
}

async function handlePaymentRequiresAction(paymentIntent, correlationId) {
  try {
    const { paymentId } = paymentIntent.metadata;
    
    // Update payment status
    await dynamodb.update({
      TableName: process.env.PAYMENTS_TABLE,
      Key: { id: paymentId },
      UpdateExpression: 'SET #status = :status, updatedAt = :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'requires_action',
        ':now': new Date().toISOString()
      }
    }).promise();
    
    logger.info('Payment requires action webhook processed', { correlationId, paymentId });
    
  } catch (error) {
    logger.error('Failed to handle payment requires action', error, { correlationId });
  }
}

// Get payment status
exports.getPayment = async (event, context) => {
  const correlationId = event.headers['x-correlation-id'] || uuidv4();
  const userId = event.requestContext.authorizer.userId;
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const paymentId = event.pathParameters.id;
    
    const result = await dynamodb.get({
      TableName: process.env.PAYMENTS_TABLE,
      Key: { id: paymentId }
    }).promise();
    
    if (!result.Item) {
      return response(404, { error: 'Payment not found' });
    }
    
    const payment = result.Item;
    
    // Check if user owns this payment
    if (payment.userId !== userId) {
      return response(403, { error: 'Access denied' });
    }
    
    logger.info('Payment retrieved', { correlationId, paymentId });
    
    return response(200, {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
      processedAt: payment.processedAt
    });
    
  } catch (error) {
    logger.error('Failed to get payment', error, { correlationId });
    return response(500, { error: 'Failed to get payment' });
  }
};
```

## 🔧 Infrastructure as Code (AWS SAM)

### SAM Template

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Serverless Microservices Application

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs18.x
    Architectures:
      - x86_64
    Environment:
      Variables:
        NODE_ENV: !Ref Environment
        POWERTOOLS_SERVICE_NAME: serverless-app
        POWERTOOLS_METRICS_NAMESPACE: ServerlessApp
        LOG_LEVEL: !Ref LogLevel
    Layers:
      - !Ref SharedLibrariesLayer
    DeadLetterQueue:
      Type: SQS
      TargetArn: !GetAtt DeadLetterQueue.Arn
    ReservedConcurrencyLimit: 100
    Tracing: Active
  Api:
    TracingConfig:
      TracingEnabled: true
    Cors:
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Correlation-Id'"
      AllowOrigin: "'*'"

Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]
    Description: Environment name
  
  LogLevel:
    Type: String
    Default: INFO
    AllowedValues: [DEBUG, INFO, WARN, ERROR]
    Description: Log level
  
  StripeSecretKey:
    Type: String
    NoEcho: true
    Description: Stripe secret key
  
  JWTSecret:
    Type: String
    NoEcho: true
    Description: JWT secret key

Resources:
  # Shared Layer
  SharedLibrariesLayer:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: !Sub "${AWS::StackName}-shared-libraries"
      Description: Shared libraries for all functions
      ContentUri: layers/shared/
      CompatibleRuntimes:
        - nodejs18.x
      RetentionPolicy: Retain
    Metadata:
      BuildMethod: nodejs18.x

  # API Gateway
  ServerlessApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: !Ref Environment
      Name: !Sub "${AWS::StackName}-api"
      Description: Serverless microservices API
      TracingConfig:
        TracingEnabled: true
      AccessLogSetting:
        DestinationArn: !GetAtt ApiLogGroup.Arn
        Format: '$requestId $ip $requestTime "$request" $status $responseLength $responseTime'
      MethodSettings:
        - ResourcePath: "/*"
          HttpMethod: "*"
          LoggingLevel: INFO
          DataTraceEnabled: true
          MetricsEnabled: true
      Auth:
        DefaultAuthorizer: JWTAuthorizer
        Authorizers:
          JWTAuthorizer:
            FunctionArn: !GetAtt AuthorizerFunction.Arn
            Identity:
              Header: Authorization
              ValidationExpression: "Bearer .*"
      GatewayResponses:
        DEFAULT_4XX:
          ResponseTemplates:
            "application/json": '{"error": "Client Error", "requestId": "$context.requestId"}'
        DEFAULT_5XX:
          ResponseTemplates:
            "application/json": '{"error": "Server Error", "requestId": "$context.requestId"}'

  # User Service Functions
  UserRegisterFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-user-register"
      CodeUri: functions/user/
      Handler: handler.register
      Description: User registration function
      Environment:
        Variables:
          USERS_TABLE: !Ref UsersTable
          USER_EVENTS_TOPIC: !Ref UserEventsTopic
          FROM_EMAIL: !Ref FromEmail
          FRONTEND_URL: !Ref FrontendUrl
          JWT_SECRET: !Ref JWTSecret
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
        - SESCrudPolicy:
            IdentityName: "*"
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt UserEventsTopic.TopicName
      ReservedConcurrencyLimit: 50
      Events:
        RegisterApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /users/register
            Method: POST
            Auth:
              Authorizer: NONE

  UserLoginFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-user-login"
      CodeUri: functions/user/
      Handler: handler.login
      Description: User login function
      Environment:
        Variables:
          USERS_TABLE: !Ref UsersTable
          USER_EVENTS_TOPIC: !Ref UserEventsTopic
          JWT_SECRET: !Ref JWTSecret
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref UsersTable
        - DynamoDBWritePolicy:
            TableName: !Ref UsersTable
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt UserEventsTopic.TopicName
      Events:
        LoginApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /users/login
            Method: POST
            Auth:
              Authorizer: NONE

  UserProfileFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-user-profile"
      CodeUri: functions/user/
      Handler: handler.getProfile
      Description: Get user profile function
      Environment:
        Variables:
          USERS_TABLE: !Ref UsersTable
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref UsersTable
      Events:
        GetProfileApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /users/{id}
            Method: GET

  AuthorizerFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-authorizer"
      CodeUri: functions/user/
      Handler: handler.authorize
      Description: JWT authorizer function
      Environment:
        Variables:
          JWT_SECRET: !Ref JWTSecret
      ReservedConcurrencyLimit: 200

  # Order Service Functions
  OrderCreateFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-order-create"
      CodeUri: functions/order/
      Handler: handler.createOrder
      Description: Order creation function
      Timeout: 60
      Environment:
        Variables:
          ORDERS_TABLE: !Ref OrdersTable
          ORDER_EVENTS_TOPIC: !Ref OrderEventsTopic
          ORDER_PROCESSING_STATE_MACHINE: !Ref OrderProcessingStateMachine
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref OrdersTable
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt OrderEventsTopic.TopicName
        - StepFunctionsExecutionPolicy:
            StateMachineName: !GetAtt OrderProcessingStateMachine.Name
      Events:
        CreateOrderApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /orders
            Method: POST

  OrderGetFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-order-get"
      CodeUri: functions/order/
      Handler: handler.getOrder
      Description: Get order function
      Environment:
        Variables:
          ORDERS_TABLE: !Ref OrdersTable
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref OrdersTable
      Events:
        GetOrderApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /orders/{id}
            Method: GET

  OrderListFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-order-list"
      CodeUri: functions/order/
      Handler: handler.listOrders
      Description: List orders function
      Environment:
        Variables:
          ORDERS_TABLE: !Ref OrdersTable
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref OrdersTable
      Events:
        ListOrdersApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /orders
            Method: GET

  OrderEventProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-order-event-processor"
      CodeUri: functions/order/
      Handler: handler.processOrderEvents
      Description: Process order events from SQS
      Timeout: 300
      ReservedConcurrencyLimit: 10
      Environment:
        Variables:
          ORDERS_TABLE: !Ref OrdersTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref OrdersTable
      Events:
        OrderEventsQueue:
          Type: SQS
          Properties:
            Queue: !GetAtt OrderEventsQueue.Arn
            BatchSize: 10
            MaximumBatchingWindowInSeconds: 5

  # Payment Service Functions
  PaymentProcessFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-payment-process"
      CodeUri: functions/payment/
      Handler: handler.processPayment
      Description: Process payment function
      Timeout: 60
      Environment:
        Variables:
          PAYMENTS_TABLE: !Ref PaymentsTable
          ORDERS_TABLE: !Ref OrdersTable
          PAYMENT_EVENTS_TOPIC: !Ref PaymentEventsTopic
          STRIPE_SECRET_KEY: !Ref StripeSecretKey
          PAYMENT_RETURN_URL: !Sub "https://${FrontendUrl}/payment/return"
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref PaymentsTable
        - DynamoDBReadPolicy:
            TableName: !Ref OrdersTable
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt PaymentEventsTopic.TopicName
      Events:
        ProcessPaymentApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /payments
            Method: POST

  PaymentWebhookFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-payment-webhook"
      CodeUri: functions/payment/
      Handler: handler.stripeWebhook
      Description: Stripe webhook handler
      Timeout: 30
      Environment:
        Variables:
          PAYMENTS_TABLE: !Ref PaymentsTable
          PAYMENT_EVENTS_TOPIC: !Ref PaymentEventsTopic
          STRIPE_SECRET_KEY: !Ref StripeSecretKey
          STRIPE_WEBHOOK_SECRET: !Ref StripeWebhookSecret
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref PaymentsTable
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt PaymentEventsTopic.TopicName
      Events:
        StripeWebhookApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /webhooks/stripe
            Method: POST
            Auth:
              Authorizer: NONE

  PaymentGetFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-payment-get"
      CodeUri: functions/payment/
      Handler: handler.getPayment
      Description: Get payment function
      Environment:
        Variables:
          PAYMENTS_TABLE: !Ref PaymentsTable
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref PaymentsTable
      Events:
        GetPaymentApi:
          Type: Api
          Properties:
            RestApiId: !Ref ServerlessApi
            Path: /payments/{id}
            Method: GET

  # DynamoDB Tables
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub "${AWS::StackName}-users"
      AttributeDefinitions:
        - AttributeName: email
          AttributeType: S
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: email
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: UserIdIndex
          KeySchema:
            - AttributeName: id
              KeyType: HASH
          Projection:
            ProjectionType: ALL
          BillingMode: PAY_PER_REQUEST
      BillingMode: PAY_PER_REQUEST
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
      SSESpecification:
        SSEEnabled: true
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: false
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Service
          Value: UserService

  OrdersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub "${AWS::StackName}-orders"
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: userId
          AttributeType: S
        - AttributeName: createdAt
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: UserIdIndex
          KeySchema:
            - AttributeName: userId
              KeyType: HASH
            - AttributeName: createdAt
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
          BillingMode: PAY_PER_REQUEST
      BillingMode: PAY_PER_REQUEST
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
      SSESpecification:
        SSEEnabled: true
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Service
          Value: OrderService

  PaymentsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub "${AWS::StackName}-payments"
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: orderId
          AttributeType: S
        - AttributeName: userId
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: OrderIdIndex
          KeySchema:
            - AttributeName: orderId
              KeyType: HASH
          Projection:
            ProjectionType: ALL
          BillingMode: PAY_PER_REQUEST
        - IndexName: UserIdIndex
          KeySchema:
            - AttributeName: userId
              KeyType: HASH
          Projection:
            ProjectionType: ALL
          BillingMode: PAY_PER_REQUEST
      BillingMode: PAY_PER_REQUEST
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
      SSESpecification:
        SSEEnabled: true
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Service
          Value: PaymentService

  # SNS Topics
  UserEventsTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: !Sub "${AWS::StackName}-user-events"
      DisplayName: User Events Topic
      KmsMasterKeyId: alias/aws/sns

  OrderEventsTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: !Sub "${AWS::StackName}-order-events"
      DisplayName: Order Events Topic
      KmsMasterKeyId: alias/aws/sns

  PaymentEventsTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: !Sub "${AWS::StackName}-payment-events"
      DisplayName: Payment Events Topic
      KmsMasterKeyId: alias/aws/sns

  # SQS Queues
  OrderEventsQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub "${AWS::StackName}-order-events"
      VisibilityTimeoutSeconds: 300
      MessageRetentionPeriod: 1209600 # 14 days
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt OrderEventsDLQ.Arn
        maxReceiveCount: 3
      KmsMasterKeyId: alias/aws/sqs

  OrderEventsDLQ:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub "${AWS::StackName}-order-events-dlq"
      MessageRetentionPeriod: 1209600 # 14 days
      KmsMasterKeyId: alias/aws/sqs

  DeadLetterQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub "${AWS::StackName}-dlq"
      MessageRetentionPeriod: 1209600 # 14 days
      KmsMasterKeyId: alias/aws/sqs

  # SNS Subscriptions
  OrderEventsSubscription:
    Type: AWS::SNS::Subscription
    Properties:
      Protocol: sqs
      TopicArn: !Ref PaymentEventsTopic
      Endpoint: !GetAtt OrderEventsQueue.Arn
      FilterPolicy:
        eventType:
          - PAYMENT_CONFIRMED
          - PAYMENT_FAILED

  # SQS Queue Policy
  OrderEventsQueuePolicy:
    Type: AWS::SQS::QueuePolicy
    Properties:
      Queues:
        - !Ref OrderEventsQueue
      PolicyDocument:
        Statement:
          - Effect: Allow
            Principal:
              Service: sns.amazonaws.com
            Action: sqs:SendMessage
            Resource: !GetAtt OrderEventsQueue.Arn
            Condition:
              ArnEquals:
                aws:SourceArn: !Ref PaymentEventsTopic

  # Step Functions State Machine
  OrderProcessingStateMachine:
    Type: AWS::Serverless::StateMachine
    Properties:
      Name: !Sub "${AWS::StackName}-order-processing"
      DefinitionUri: statemachine/order-processing.asl.json
      DefinitionSubstitutions:
        ReserveInventoryFunction: !GetAtt ReserveInventoryFunction.Arn
        ProcessPaymentFunction: !GetAtt PaymentProcessFunction.Arn
        SendNotificationFunction: !GetAtt SendNotificationFunction.Arn
      Policies:
        - LambdaInvokePolicy:
            FunctionName: !Ref ReserveInventoryFunction
        - LambdaInvokePolicy:
            FunctionName: !Ref PaymentProcessFunction
        - LambdaInvokePolicy:
            FunctionName: !Ref SendNotificationFunction
      Tracing:
        Enabled: true

  # Additional Lambda Functions for State Machine
  ReserveInventoryFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-reserve-inventory"
      CodeUri: functions/inventory/
      Handler: handler.reserveInventory
      Description: Reserve inventory function
      Environment:
        Variables:
          INVENTORY_TABLE: !Ref InventoryTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref InventoryTable

  SendNotificationFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "${AWS::StackName}-send-notification"
      CodeUri: functions/notification/
      Handler: handler.sendNotification
      Description: Send notification function
      Environment:
        Variables:
          FROM_EMAIL: !Ref FromEmail
      Policies:
        - SESCrudPolicy:
            IdentityName: "*"

  InventoryTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub "${AWS::StackName}-inventory"
      AttributeDefinitions:
        - AttributeName: productId
          AttributeType: S
      KeySchema:
        - AttributeName: productId
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true

  # CloudWatch Log Groups
  ApiLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub "/aws/apigateway/${AWS::StackName}-api"
      RetentionInDays: 30

  # CloudWatch Alarms
  ApiGateway4xxAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub "${AWS::StackName}-api-4xx-errors"
      AlarmDescription: High number of 4xx errors
      MetricName: 4XXError
      Namespace: AWS/ApiGateway
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 2
      Threshold: 10
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: ApiName
          Value: !Sub "${AWS::StackName}-api"

  ApiGateway5xxAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub "${AWS::StackName}-api-5xx-errors"
      AlarmDescription: High number of 5xx errors
      MetricName: 5XXError
      Namespace: AWS/ApiGateway
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 5
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: ApiName
          Value: !Sub "${AWS::StackName}-api"

  LambdaErrorAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub "${AWS::StackName}-lambda-errors"
      AlarmDescription: High number of Lambda errors
      MetricName: Errors
      Namespace: AWS/Lambda
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 2
      Threshold: 5
      ComparisonOperator: GreaterThanThreshold

Outputs:
  ApiGatewayUrl:
    Description: API Gateway URL
    Value: !Sub "https://${ServerlessApi}.execute-api.${AWS::Region}.amazonaws.com/${Environment}/"
    Export:
      Name: !Sub "${AWS::StackName}-api-url"

  UsersTableName:
    Description: Users table name
    Value: !Ref UsersTable
    Export:
      Name: !Sub "${AWS::StackName}-users-table"

  OrdersTableName:
    Description: Orders table name
    Value: !Ref OrdersTable
    Export:
      Name: !Sub "${AWS::StackName}-orders-table"

  PaymentsTableName:
    Description: Payments table name
    Value: !Ref PaymentsTable
    Export:
      Name: !Sub "${AWS::StackName}-payments-table"

  UserEventsTopicArn:
    Description: User events SNS topic ARN
    Value: !Ref UserEventsTopic
    Export:
      Name: !Sub "${AWS::StackName}-user-events-topic"

  OrderEventsTopicArn:
    Description: Order events SNS topic ARN
    Value: !Ref OrderEventsTopic
    Export:
      Name: !Sub "${AWS::StackName}-order-events-topic"

  PaymentEventsTopicArn:
    Description: Payment events SNS topic ARN
    Value: !Ref PaymentEventsTopic
    Export:
      Name: !Sub "${AWS::StackName}-payment-events-topic"
```

## 🔧 Serverless Framework Configuration

### Serverless.yml

```yaml
# serverless.yml
service: serverless-microservices
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  architecture: x86_64
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  memorySize: 512
  timeout: 30
  logRetentionInDays: 30
  versionFunctions: false
  
  environment:
    STAGE: ${self:provider.stage}
    REGION: ${self:provider.region}
    SERVICE_NAME: ${self:service}
    
  tracing:
    lambda: true
    apiGateway: true
    
  logs:
    restApi: true
    level: INFO
    
  apiGateway:
    shouldStartNameWithService: true
    metrics: true
    
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Query
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          Resource:
            - "arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-${self:provider.stage}-*"
            - "arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-${self:provider.stage}-*/index/*"
        - Effect: Allow
          Action:
            - sns:Publish
          Resource:
            - "arn:aws:sns:${self:provider.region}:*:${self:service}-${self:provider.stage}-*"
        - Effect: Allow
          Action:
            - sqs:SendMessage
            - sqs:ReceiveMessage
            - sqs:DeleteMessage
            - sqs:GetQueueAttributes
          Resource:
            - "arn:aws:sqs:${self:provider.region}:*:${self:service}-${self:provider.stage}-*"
        - Effect: Allow
          Action:
            - states:StartExecution
          Resource:
            - "arn:aws:states:${self:provider.region}:*:stateMachine:${self:service}-${self:provider.stage}-*"
        - Effect: Allow
          Action:
            - ses:SendEmail
            - ses:SendRawEmail
          Resource: "*"
        - Effect: Allow
          Action:
            - xray:PutTraceSegments
            - xray:PutTelemetryRecords
          Resource: "*"

plugins:
  - serverless-webpack
  - serverless-offline
  - serverless-domain-manager
  - serverless-plugin-warmup
  - serverless-plugin-canary-deployments
  - serverless-plugin-aws-alerts

custom:
  webpack:
    webpackConfig: 'webpack.config.js'
    includeModules: true
    packager: 'npm'
    excludeFiles: src/**/*.test.js
    
  warmup:
    default:
      enabled: true
      events:
        - schedule: 'cron(0/5 8-17 ? * MON-FRI *)'
      concurrency: 1
      
  customDomain:
    domainName: ${file(./config/${self:provider.stage}.json):domain}
    stage: ${self:provider.stage}
    createRoute53Record: true
    
  deploymentBucket:
    blockPublicAccess: true
    versioning: true
    
  alerts:
    stages:
      - prod
    topics:
      alarm:
        topic: ${self:service}-${self:provider.stage}-alerts
        notifications:
          - protocol: email
            endpoint: alerts@myapp.com
    alarms:
      - functionErrors
      - functionDuration
      - functionThrottles

functions:
  # User Service
  userRegister:
    handler: src/functions/user/handler.register
    description: User registration
    events:
      - http:
          path: /users/register
          method: POST
          cors: true
    environment:
      USERS_TABLE: ${self:service}-${self:provider.stage}-users
      USER_EVENTS_TOPIC: 
        Ref: UserEventsTopic
    reservedConcurrency: 50
    
  userLogin:
    handler: src/functions/user/handler.login
    description: User login
    events:
      - http:
          path: /users/login
          method: POST
          cors: true
    environment:
      USERS_TABLE: ${self:service}-${self:provider.stage}-users
      USER_EVENTS_TOPIC: 
        Ref: UserEventsTopic
        
  userProfile:
    handler: src/functions/user/handler.getProfile
    description: Get user profile
    events:
      - http:
          path: /users/{id}
          method: GET
          cors: true
          authorizer:
            name: jwtAuthorizer
            type: request
    environment:
      USERS_TABLE: ${self:service}-${self:provider.stage}-users
      
  jwtAuthorizer:
    handler: src/functions/user/handler.authorize
    description: JWT authorizer
    reservedConcurrency: 200
    
  # Order Service
  orderCreate:
    handler: src/functions/order/handler.createOrder
    description: Create order
    timeout: 60
    events:
      - http:
          path: /orders
          method: POST
          cors: true
          authorizer:
            name: jwtAuthorizer
            type: request
    environment:
      ORDERS_TABLE: ${self:service}-${self:provider.stage}-orders
      ORDER_EVENTS_TOPIC:
        Ref: OrderEventsTopic
      ORDER_PROCESSING_STATE_MACHINE:
        Ref: OrderProcessingStateMachine
        
  orderGet:
    handler: src/functions/order/handler.getOrder
    description: Get order
    events:
      - http:
          path: /orders/{id}
          method: GET
          cors: true
          authorizer:
            name: jwtAuthorizer
            type: request
    environment:
      ORDERS_TABLE: ${self:service}-${self:provider.stage}-orders
      
  orderList:
    handler: src/functions/order/handler.listOrders
    description: List orders
    events:
      - http:
          path: /orders
          method: GET
          cors: true
          authorizer:
            name: jwtAuthorizer
            type: request
    environment:
      ORDERS_TABLE: ${self:service}-${self:provider.stage}-orders
      
  orderEventProcessor:
    handler: src/functions/order/handler.processOrderEvents
    description: Process order events
    timeout: 300
    reservedConcurrency: 10
    events:
      - sqs:
          arn:
            Fn::GetAtt: [OrderEventsQueue, Arn]
          batchSize: 10
          maximumBatchingWindow: 5
    environment:
      ORDERS_TABLE: ${self:service}-${self:provider.stage}-orders
      
  # Payment Service
  paymentProcess:
    handler: src/functions/payment/handler.processPayment
    description: Process payment
    timeout: 60
    events:
      - http:
          path: /payments
          method: POST
          cors: true
          authorizer:
            name: jwtAuthorizer
            type: request
    environment:
      PAYMENTS_TABLE: ${self:service}-${self:provider.stage}-payments
      ORDERS_TABLE: ${self:service}-${self:provider.stage}-orders
      PAYMENT_EVENTS_TOPIC:
        Ref: PaymentEventsTopic
      STRIPE_SECRET_KEY: ${ssm:/serverless-app/${self:provider.stage}/stripe-secret-key~true}
      
  paymentWebhook:
    handler: src/functions/payment/handler.stripeWebhook
    description: Stripe webhook
    events:
      - http:
          path: /webhooks/stripe
          method: POST
          cors: true
    environment:
      PAYMENTS_TABLE: ${self:service}-${self:provider.stage}-payments
      PAYMENT_EVENTS_TOPIC:
        Ref: PaymentEventsTopic
      STRIPE_SECRET_KEY: ${ssm:/serverless-app/${self:provider.stage}/stripe-secret-key~true}
      STRIPE_WEBHOOK_SECRET: ${ssm:/serverless-app/${self:provider.stage}/stripe-webhook-secret~true}
      
  paymentGet:
    handler: src/functions/payment/handler.getPayment
    description: Get payment
    events:
      - http:
          path: /payments/{id}
          method: GET
          cors: true
          authorizer:
            name: jwtAuthorizer
            type: request
    environment:
      PAYMENTS_TABLE: ${self:service}-${self:provider.stage}-payments

resources:
  Resources:
    # DynamoDB Tables
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-users
        AttributeDefinitions:
          - AttributeName: email
            AttributeType: S
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: email
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: UserIdIndex
            KeySchema:
              - AttributeName: id
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            BillingMode: PAY_PER_REQUEST
        BillingMode: PAY_PER_REQUEST
        PointInTimeRecoverySpecification:
          PointInTimeRecoveryEnabled: true
        SSESpecification:
          SSEEnabled: true
        StreamSpecification:
          StreamViewType: NEW_AND_OLD_IMAGES
          
    OrdersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-orders
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: userId
            AttributeType: S
          - AttributeName: createdAt
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: UserIdIndex
            KeySchema:
              - AttributeName: userId
                KeyType: HASH
              - AttributeName: createdAt
                KeyType: RANGE
            Projection:
              ProjectionType: ALL
            BillingMode: PAY_PER_REQUEST
        BillingMode: PAY_PER_REQUEST
        PointInTimeRecoverySpecification:
          PointInTimeRecoveryEnabled: true
        SSESpecification:
          SSEEnabled: true
        TimeToLiveSpecification:
          AttributeName: ttl
          Enabled: true
          
    PaymentsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-payments
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: orderId
            AttributeType: S
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: OrderIdIndex
            KeySchema:
              - AttributeName: orderId
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            BillingMode: PAY_PER_REQUEST
          - IndexName: UserIdIndex
            KeySchema:
              - AttributeName: userId
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            BillingMode: PAY_PER_REQUEST
        BillingMode: PAY_PER_REQUEST
        PointInTimeRecoverySpecification:
          PointInTimeRecoveryEnabled: true
        SSESpecification:
          SSEEnabled: true
        TimeToLiveSpecification:
          AttributeName: ttl
          Enabled: true
          
    # SNS Topics
    UserEventsTopic:
      Type: AWS::SNS::Topic
      Properties:
        TopicName: ${self:service}-${self:provider.stage}-user-events
        KmsMasterKeyId: alias/aws/sns
        
    OrderEventsTopic:
      Type: AWS::SNS::Topic
      Properties:
        TopicName: ${self:service}-${self:provider.stage}-order-events
        KmsMasterKeyId: alias/aws/sns
        
    PaymentEventsTopic:
      Type: AWS::SNS::Topic
      Properties:
        TopicName: ${self:service}-${self:provider.stage}-payment-events
        KmsMasterKeyId: alias/aws/sns
        
    # SQS Queues
    OrderEventsQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-${self:provider.stage}-order-events
        VisibilityTimeoutSeconds: 300
        MessageRetentionPeriod: 1209600
        RedrivePolicy:
          deadLetterTargetArn:
            Fn::GetAtt: [OrderEventsDLQ, Arn]
          maxReceiveCount: 3
        KmsMasterKeyId: alias/aws/sqs
        
    OrderEventsDLQ:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-${self:provider.stage}-order-events-dlq
        MessageRetentionPeriod: 1209600
        KmsMasterKeyId: alias/aws/sqs
        
    # SNS Subscriptions
    OrderEventsSubscription:
      Type: AWS::SNS::Subscription
      Properties:
        Protocol: sqs
        TopicArn:
          Ref: PaymentEventsTopic
        Endpoint:
          Fn::GetAtt: [OrderEventsQueue, Arn]
        FilterPolicy:
          eventType:
            - PAYMENT_CONFIRMED
            - PAYMENT_FAILED
            
    # Queue Policy
    OrderEventsQueuePolicy:
      Type: AWS::SQS::QueuePolicy
      Properties:
        Queues:
          - Ref: OrderEventsQueue
        PolicyDocument:
          Statement:
            - Effect: Allow
              Principal:
                Service: sns.amazonaws.com
              Action: sqs:SendMessage
              Resource:
                Fn::GetAtt: [OrderEventsQueue, Arn]
              Condition:
                ArnEquals:
                  aws:SourceArn:
                    Ref: PaymentEventsTopic
                    
    # Step Functions State Machine
    OrderProcessingStateMachine:
      Type: AWS::StepFunctions::StateMachine
      Properties:
        StateMachineName: ${self:service}-${self:provider.stage}-order-processing
        DefinitionString: ${file(./statemachine/order-processing.json)}
        RoleArn:
          Fn::GetAtt: [StepFunctionsRole, Arn]
          
    StepFunctionsRole:
      Type: AWS::IAM::Role
      Properties:
        AssumeRolePolicyDocument:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Principal:
                Service: states.amazonaws.com
              Action: sts:AssumeRole
        Policies:
          - PolicyName: StepFunctionsPolicy
            PolicyDocument:
              Version: '2012-10-17'
              Statement:
                - Effect: Allow
                  Action:
                    - lambda:InvokeFunction
                  Resource:
                    - "arn:aws:lambda:${self:provider.region}:*:function:${self:service}-${self:provider.stage}-*"

  Outputs:
    ApiGatewayUrl:
      Description: API Gateway URL
      Value:
        Fn::Join:
          - ''
          - - 'https://'
            - Ref: ApiGatewayRestApi
            - '.execute-api.'
            - ${self:provider.region}
            - '.amazonaws.com/'
            - ${self:provider.stage}
      Export:
        Name: ${self:service}-${self:provider.stage}-api-url
```

## 🚀 Serverless Best Practices

### 1. **Function Design**
- Single Purpose: Each function handles one specific task
- Stateless: Store state externally (DynamoDB, S3)
- Idempotent: Functions can be safely retried
- Timeout Management: Set appropriate timeouts

### 2. **Performance Optimization**
- Warm-up Functions: Use scheduled events to keep functions warm
- Connection Pooling: Reuse database connections
- Lazy Loading: Load dependencies on-demand
- Layer Usage: Share common code and dependencies

### 3. **Security**
- Least Privilege: Minimal IAM permissions
- Secrets Management: Use Parameter Store or Secrets Manager
- VPC Configuration: Network isolation when needed
- Input Validation: Validate all inputs

### 4. **Monitoring and Observability**
- Structured Logging: JSON formatted logs
- Distributed Tracing: X-Ray integration
- Custom Metrics: CloudWatch custom metrics
- Error Handling: Proper error responses

### 5. **Cost Optimization**
- Right-sizing: Appropriate memory allocation
- Reserved Capacity: For predictable workloads
- Dead Letter Queues: Handle failed executions
- TTL Settings: Automatic data cleanup

This comprehensive serverless template provides enterprise-grade Function-as-a-Service architecture with parallel execution patterns, event-driven communication, and production-ready observability optimized for Claude Code workflows.