# 🖥️ Backend (Server) Documentation

## Status: 🟡 **45% Complete**

## 📁 Backend Structure (Planned)

```
server/
├── src/                          # Source code (🔴 Not Created)
│   ├── controllers/             # Route handlers (🔴 0%)
│   │   ├── auth.controller.ts   # Authentication endpoints
│   │   ├── risk.controller.ts   # Risk assessment endpoints
│   │   ├── user.controller.ts   # User management endpoints
│   │   └── webhook.controller.ts # Nokia webhook handlers
│   ├── services/                # Business logic (🔴 20%)
│   │   ├── nokia.service.ts     # Nokia API integration
│   │   ├── risk.service.ts      # Risk scoring engine
│   │   ├── auth.service.ts      # Authentication service
│   │   └── notification.service.ts # Email/SMS notifications
│   ├── models/                  # Database models (🟡 70%)
│   │   ├── user.model.ts        # User entity
│   │   ├── riskCheck.model.ts   # Risk assessment entity
│   │   ├── auditLog.model.ts    # Audit trail entity
│   │   └── apiClient.model.ts   # API client management
│   ├── middleware/              # Express middleware (🔴 30%)
│   │   ├── auth.middleware.ts   # JWT authentication
│   │   ├── rateLimit.middleware.ts # Rate limiting
│   │   ├── validation.middleware.ts # Request validation
│   │   └── error.middleware.ts  # Error handling
│   ├── routes/                  # API routes (🟡 40%)
│   │   ├── auth.routes.ts       # /api/auth/*
│   │   ├── risk.routes.ts       # /api/risk/*
│   │   ├── user.routes.ts       # /api/users/*
│   │   └── webhook.routes.ts    # /api/webhooks/*
│   ├── utils/                   # Utility functions (🟡 60%)
│   │   ├── logger.ts           # Structured logging
│   │   ├── crypto.ts           # Encryption utilities
│   │   ├── validation.ts       # Input validation schemas
│   │   └── constants.ts        # Application constants
│   ├── config/                  # Configuration (🟡 50%)
│   │   ├── database.ts         # Database connection
│   │   ├── redis.ts           # Redis connection
│   │   ├── nokia.ts           # Nokia API configuration
│   │   └── environment.ts     # Environment variables
│   └── app.ts                   # Express app setup (🔴 30%)
├── tests/                       # Test files (🔴 0%)
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── database/                    # Database related (🟡 60%)
│   ├── migrations/             # Database migrations
│   ├── seeds/                  # Test data seeds
│   └── schema.sql             # Database schema
├── docker/                      # Docker configuration (🔴 20%)
│   ├── Dockerfile             # Container definition
│   ├── docker-compose.yml     # Local development
│   └── .dockerignore          # Docker ignore file
└── Configuration Files          # Setup files (🟡 70%)
    ├── package.json           # Dependencies
    ├── tsconfig.json          # TypeScript config
    ├── .env.example           # Environment template
    └── README.md              # Setup instructions
```

## 🛠️ Technology Stack

### Core Technologies (🟡 50%)
| Technology | Status | Version | Purpose |
|------------|--------|---------|---------|
| **Node.js** | 🟡 | 18.x LTS | Runtime environment |
| **TypeScript** | 🟡 | 5.2+ | Type safety |
| **Express.js** | 🔴 | 4.18+ | Web framework |
| **Prisma** | 🔴 | 5.0+ | Database ORM |
| **PostgreSQL** | 🔴 | 15+ | Primary database |
| **Redis** | 🔴 | 7.0+ | Caching & sessions |
| **Jest** | 🔴 | 29+ | Testing framework |

### Supporting Libraries (🔴 20%)
| Library | Status | Purpose |
|---------|--------|---------|
| **joi/zod** | 🔴 | Request validation |
| **bcrypt** | 🔴 | Password hashing |
| **jsonwebtoken** | 🔴 | JWT token management |
| **bull** | 🔴 | Background job queue |
| **winston** | 🔴 | Structured logging |
| **helmet** | 🔴 | Security headers |
| **cors** | 🔴 | Cross-origin requests |
| **compression** | 🔴 | Response compression |

## 🔌 API Endpoints Design

### Authentication Endpoints (🔴 0%)
```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

// POST /api/auth/login  
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/refresh
interface RefreshRequest {
  refreshToken: string;
}
```

### Risk Assessment Endpoints (🔴 10%)
```typescript
// POST /api/risk/check - Main fraud detection endpoint
interface RiskCheckRequest {
  msisdn: string;
  declared_location?: {lat: number, lon: number};
  kyc: {
    name: string;
    id_type: string;
    id_number: string;
  };
  consent: {
    given: boolean;
    timestamp: string;
  };
  metadata?: {
    channel: string;
    agent_id?: string;
  };
}

interface RiskCheckResponse {
  request_id: string;
  score: number;
  verdict: 'PASS' | 'REVIEW' | 'BLOCK';
  reasons: Array<{code: string, detail: string}>;
  signals: {
    number: any;
    sim_swap: any;
    reachability: any;
    location?: any;
  };
  latency_ms: number;
}

// GET /api/risk/:request_id - Get stored result
// GET /api/risk/history?msisdn=... - Get history for MSISDN
```

### User Management Endpoints (🔴 0%)
```typescript
// GET /api/users/profile
// PUT /api/users/profile
// GET /api/users/verification-history
// DELETE /api/users/account
```

### Webhook Endpoints (🔴 0%)
```typescript
// POST /api/webhooks/nokia - Nokia async notifications
interface NoKiaWebhookPayload {
  event_type: string;
  msisdn: string;
  data: any;
  timestamp: string;
  signature: string;
}
```

## 🏗️ Service Architecture

### Nokia Integration Service (🟡 40%)
```typescript
// services/nokia.service.ts
class NokiaService {
  // ✅ Basic structure planned
  async verifyNumber(msisdn: string): Promise<NumberVerificationResult>
  async checkSimSwap(msisdn: string, lookbackHours: number): Promise<SimSwapResult>
  async checkReachability(msisdn: string): Promise<ReachabilityResult>
  async getLocation(msisdn: string): Promise<LocationResult>
  
  // 🔴 Implementation needed
  private authenticateWithNokia(): Promise<string>
  private handleRateLimit(): void
  private validateResponse(response: any): boolean
}
```

### Risk Scoring Service (🟡 30%)
```typescript
// services/risk.service.ts
class RiskService {
  // ✅ Basic logic planned
  calculateRiskScore(signals: AllSignals): number
  generateVerdict(score: number): 'PASS' | 'REVIEW' | 'BLOCK'
  generateReasons(signals: AllSignals): Array<Reason>
  
  // 🔴 Implementation needed
  private applyBusinessRules(signals: AllSignals): RuleResult[]
  private weightSignals(signals: AllSignals): WeightedSignals
  private mlModelPredict(features: FeatureVector): number
}
```

### Authentication Service (🔴 20%)
```typescript
// services/auth.service.ts
class AuthService {
  // 🔴 Full implementation needed
  async register(userData: RegisterData): Promise<User>
  async login(credentials: LoginCredentials): Promise<AuthResult>
  async refreshToken(token: string): Promise<string>
  async validateToken(token: string): Promise<User | null>
  async logout(token: string): Promise<void>
}
```

## 💾 Database Schema Implementation

### Current Status (🟡 70%)

#### Users Table (✅ 90%)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

#### Risk Checks Table (✅ 95%)
```sql
CREATE TABLE risk_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  request_id VARCHAR(100) UNIQUE NOT NULL,
  msisdn VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  verdict VARCHAR(10) NOT NULL CHECK (verdict IN ('PASS', 'REVIEW', 'BLOCK')),
  raw_signals JSONB NOT NULL,
  latency_ms INTEGER,
  channel VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Audit Logs Table (✅ 90%)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### API Clients Table (🟡 60%)
```sql
CREATE TABLE api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  client_id VARCHAR(100) UNIQUE NOT NULL,
  client_secret_hash VARCHAR(255) NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  rate_limit_per_hour INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Missing Tables (🔴 0%)
- **sessions** - User session management
- **verification_reasons** - Reason codes and descriptions  
- **nokia_webhooks** - Webhook event log
- **rate_limits** - Rate limiting tracking
- **notifications** - Email/SMS notification queue

## 🔒 Security Implementation

### Authentication & Authorization (🔴 30%)
```typescript
// middleware/auth.middleware.ts
interface AuthStrategy {
  // 🔴 JWT implementation needed
  validateJWT(token: string): Promise<User | null>
  
  // 🔴 API key validation needed  
  validateApiKey(key: string): Promise<ApiClient | null>
  
  // 🔴 Rate limiting needed
  checkRateLimit(clientId: string): Promise<boolean>
}
```

### Data Protection (🔴 20%)
```typescript
// utils/crypto.ts
interface CryptoUtils {
  // 🔴 PII encryption needed
  encryptPII(data: string): string
  decryptPII(encrypted: string): string
  
  // 🔴 MSISDN hashing needed
  hashMSISDN(msisdn: string): string
  
  // 🔴 Password security needed
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hash: string): Promise<boolean>
}
```

### Input Validation (🔴 10%)
```typescript
// middleware/validation.middleware.ts
const riskCheckSchema = {
  msisdn: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required(),
  kyc: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    id_type: Joi.string().valid('aadhaar', 'passport', 'driving_license').required(),
    id_number: Joi.string().min(10).max(20).required()
  }).required(),
  consent: Joi.object({
    given: Joi.boolean().valid(true).required(),
    timestamp: Joi.date().iso().required()
  }).required()
};
```

## 📊 Performance & Monitoring

### Performance Targets (🔴 20%)
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **API Response Time** | < 2000ms | N/A | 🔴 Not measured |
| **Database Query Time** | < 500ms | N/A | 🔴 Not measured |
| **Nokia API Latency** | < 1500ms | N/A | 🔴 Not measured |
| **Throughput** | 100 RPS | N/A | 🔴 Not tested |
| **Memory Usage** | < 512MB | N/A | 🔴 Not monitored |

### Monitoring Implementation (🔴 15%)
```typescript
// utils/logger.ts
interface LoggerService {
  // 🔴 Structured logging needed
  logRequest(req: Request, res: Response, duration: number): void
  logError(error: Error, context: any): void
  logSecurityEvent(event: SecurityEvent): void
  
  // 🔴 Metrics collection needed
  incrementCounter(metric: string, tags?: Record<string, string>): void
  recordHistogram(metric: string, value: number): void
  recordGauge(metric: string, value: number): void
}
```

## 📋 Development Priorities

### Critical (Next 48 Hours)
1. **Basic Express Server Setup** - Bootstrap the application
2. **Database Connection** - PostgreSQL + Prisma setup
3. **Nokia Service Stub** - Mock Nokia API integration
4. **Risk Check Endpoint** - Core `/api/risk/check` implementation
5. **Basic Authentication** - JWT token validation

### High Priority (Next Week)
6. **Real Nokia Integration** - Replace mocks with real API calls
7. **Error Handling Middleware** - Comprehensive error responses
8. **Input Validation** - Request/response validation
9. **Rate Limiting** - API abuse prevention
10. **Basic Testing** - Unit tests for core functions

### Medium Priority (Next 2 Weeks)
11. **Advanced Risk Rules** - Business logic refinement
12. **Webhook Handling** - Nokia async notifications
13. **Audit Logging** - Comprehensive activity tracking
14. **Performance Optimization** - Database indexing, caching
15. **Security Hardening** - OWASP compliance

### Low Priority (Later)
16. **ML Model Integration** - Advanced risk scoring
17. **Background Jobs** - Async processing
18. **API Documentation** - OpenAPI/Swagger docs
19. **Load Testing** - Performance benchmarking
20. **Production Monitoring** - APM integration

## 🧪 Testing Strategy

### Test Coverage Goals (🔴 0%)
- **Unit Tests**: 80% coverage target
- **Integration Tests**: Core API endpoints
- **E2E Tests**: Critical user flows
- **Load Tests**: Performance validation

### Test Implementation Plan
```typescript
// tests/unit/services/risk.service.test.ts
describe('RiskService', () => {
  describe('calculateRiskScore', () => {
    it('should return low score for clean signals', () => {});
    it('should return high score for fraud signals', () => {});
    it('should handle missing signals gracefully', () => {});
  });
});

// tests/integration/risk.routes.test.ts
describe('POST /api/risk/check', () => {
  it('should return risk assessment for valid request', () => {});
  it('should reject invalid MSISDN format', () => {});
  it('should handle Nokia API failures', () => {});
});
```

## 🚀 Deployment Preparation

### Environment Configuration (🟡 50%)
```bash
# .env.example
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fraudshield
REDIS_URL=redis://localhost:6379

# Nokia APIs
NOKIA_CLIENT_ID=your_client_id
NOKIA_CLIENT_SECRET=your_client_secret
NOKIA_BASE_URL=https://sandbox.network.nokia.com

# Security
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
ENCRYPTION_KEY=your_encryption_key

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
```

### Docker Configuration (🔴 20%)
```dockerfile
# Dockerfile - TO BE CREATED
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### CI/CD Pipeline (🔴 10%)
```yaml
# .github/workflows/backend.yml - TO BE CREATED
name: Backend CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    # ... test steps
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    # ... deployment steps
```
