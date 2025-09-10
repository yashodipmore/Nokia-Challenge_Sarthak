# 🧪 Testing & QA Documentation

## Status: 🔴 **25% Complete**

## 🎯 Testing Strategy Overview

### Testing Pyramid (🔴 25%)
```
                    ▲
                   /E2E\         🔴 5% Complete
                  /     \        
                 /  UI   \       🔴 10% Complete
                /_________\      
               /           \     
              / Integration \    🔴 20% Complete
             /               \   
            /_________________\  
           /                   \ 
          /    Unit Tests       \  🟡 40% Complete
         /_______________________\
```

### Test Coverage Goals
| Test Type | Target Coverage | Current Coverage | Status |
|-----------|----------------|------------------|--------|
| **Unit Tests** | 80% | 0% | 🔴 Not Started |
| **Integration Tests** | 70% | 0% | 🔴 Not Started |
| **E2E Tests** | 60% | 0% | 🔴 Not Started |
| **API Tests** | 90% | 0% | 🔴 Not Started |

## 🔧 Test Framework Setup

### Frontend Testing (🔴 10%)
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@playwright/test": "^1.40.0",
    "cypress": "^13.0.0"
  }
}
```

#### Jest Configuration (🔴 20%)
```javascript
// client/jest.config.js - TO BE CREATED
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Backend Testing (🔴 15%)
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "@types/jest": "^29.0.0",
    "@types/supertest": "^2.0.12",
    "testcontainers": "^10.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

#### Jest Configuration (🔴 25%)
```javascript
// server/jest.config.js - TO BE CREATED
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
};
```

## 🔬 Unit Testing

### Frontend Component Tests (🔴 10%)
```typescript
// client/components/__tests__/Button.test.tsx - TO BE CREATED
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Backend Service Tests (🔴 20%)
```typescript
// server/tests/unit/services/risk.service.test.ts - TO BE CREATED
import { RiskService } from '../../../src/services/risk.service';
import { NokiaService } from '../../../src/services/nokia.service';

jest.mock('../../../src/services/nokia.service');

describe('RiskService', () => {
  let riskService: RiskService;
  let mockNokiaService: jest.Mocked<NokiaService>;

  beforeEach(() => {
    mockNokiaService = new NokiaService() as jest.Mocked<NokiaService>;
    riskService = new RiskService(mockNokiaService);
  });

  describe('calculateRiskScore', () => {
    it('should return low score for clean signals', async () => {
      const signals = {
        numberVerification: { verified: true },
        simSwap: { swapped: false },
        reachability: { reachable: true },
        scamSignal: { isScam: false }
      };

      const score = await riskService.calculateRiskScore(signals);
      expect(score).toBeLessThan(30);
    });

    it('should return high score for fraud signals', async () => {
      const signals = {
        numberVerification: { verified: false },
        simSwap: { swapped: true },
        reachability: { reachable: false },
        scamSignal: { isScam: true }
      };

      const score = await riskService.calculateRiskScore(signals);
      expect(score).toBeGreaterThan(70);
    });

    it('should handle missing signals gracefully', async () => {
      const signals = {
        numberVerification: { verified: true }
        // Missing other signals
      };

      const score = await riskService.calculateRiskScore(signals);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('generateVerdict', () => {
    it('should return PASS for low risk scores', () => {
      expect(riskService.generateVerdict(20)).toBe('PASS');
    });

    it('should return REVIEW for medium risk scores', () => {
      expect(riskService.generateVerdict(50)).toBe('REVIEW');
    });

    it('should return BLOCK for high risk scores', () => {
      expect(riskService.generateVerdict(85)).toBe('BLOCK');
    });
  });
});
```

### Utility Function Tests (🔴 30%)
```typescript
// server/tests/unit/utils/crypto.test.ts - TO BE CREATED
import { CryptoService, MSISDNHasher } from '../../../src/utils/crypto';

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    cryptoService = new CryptoService();
  });

  describe('encryptPII and decryptPII', () => {
    it('should encrypt and decrypt data correctly', () => {
      const originalData = 'sensitive_user_data';
      
      const encrypted = cryptoService.encryptPII(originalData);
      expect(encrypted).not.toBe(originalData);
      expect(encrypted).toContain(':'); // Should contain separators
      
      const decrypted = cryptoService.decryptPII(encrypted);
      expect(decrypted).toBe(originalData);
    });

    it('should generate different encrypted values for same input', () => {
      const data = 'test_data';
      
      const encrypted1 = cryptoService.encryptPII(data);
      const encrypted2 = cryptoService.encryptPII(data);
      
      expect(encrypted1).not.toBe(encrypted2); // Different due to random IV
    });
  });
});

describe('MSISDNHasher', () => {
  describe('hash', () => {
    it('should generate consistent hashes for same MSISDN', () => {
      const msisdn = '+911234567890';
      
      const hash1 = MSISDNHasher.hash(msisdn);
      const hash2 = MSISDNHasher.hash(msisdn);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different MSISDNs', () => {
      const hash1 = MSISDNHasher.hash('+911234567890');
      const hash2 = MSISDNHasher.hash('+919876543210');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validateMSISDN', () => {
    it('should validate correct international format', () => {
      expect(MSISDNHasher.validateMSISDN('+911234567890')).toBe(true);
      expect(MSISDNHasher.validateMSISDN('+1234567890')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(MSISDNHasher.validateMSISDN('1234567890')).toBe(false); // No +
      expect(MSISDNHasher.validateMSISDN('+0123456789')).toBe(false); // Starts with 0
      expect(MSISDNHasher.validateMSISDN('++911234567890')).toBe(false); // Double +
    });
  });
});
```

## 🔗 Integration Testing

### API Integration Tests (🔴 20%)
```typescript
// server/tests/integration/risk.routes.test.ts - TO BE CREATED
import request from 'supertest';
import { app } from '../../src/app';
import { setupTestDatabase, teardownTestDatabase } from '../helpers/database';

describe('Risk Assessment API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/risk/check', () => {
    it('should return risk assessment for valid request', async () => {
      const requestData = {
        msisdn: '+911234567890',
        kyc: {
          name: 'John Doe',
          id_type: 'aadhaar',
          id_number: '1234567890123'
        },
        consent: {
          given: true,
          timestamp: new Date().toISOString()
        }
      };

      const response = await request(app)
        .post('/api/risk/check')
        .send(requestData)
        .expect(200);

      expect(response.body).toHaveProperty('request_id');
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('verdict');
      expect(response.body.score).toBeGreaterThanOrEqual(0);
      expect(response.body.score).toBeLessThanOrEqual(100);
    });

    it('should reject invalid MSISDN format', async () => {
      const requestData = {
        msisdn: '1234567890', // Invalid format
        kyc: {
          name: 'John Doe',
          id_type: 'aadhaar',
          id_number: '1234567890123'
        },
        consent: {
          given: true,
          timestamp: new Date().toISOString()
        }
      };

      const response = await request(app)
        .post('/api/risk/check')
        .send(requestData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('MSISDN');
    });

    it('should require consent', async () => {
      const requestData = {
        msisdn: '+911234567890',
        kyc: {
          name: 'John Doe',
          id_type: 'aadhaar',
          id_number: '1234567890123'
        }
        // Missing consent
      };

      await request(app)
        .post('/api/risk/check')
        .send(requestData)
        .expect(400);
    });

    it('should handle Nokia API failures gracefully', async () => {
      // Mock Nokia API failure
      const mockNokiaService = jest.fn().mockRejectedValue(new Error('Nokia API Error'));
      
      const requestData = {
        msisdn: '+910000000000', // Special number that triggers failure
        kyc: {
          name: 'John Doe',
          id_type: 'aadhaar',
          id_number: '1234567890123'
        },
        consent: {
          given: true,
          timestamp: new Date().toISOString()
        }
      };

      const response = await request(app)
        .post('/api/risk/check')
        .send(requestData)
        .expect(200); // Should still return a result

      expect(response.body.score).toBeGreaterThanOrEqual(0);
      // Should have fallback scoring when APIs fail
    });
  });

  describe('GET /api/risk/:request_id', () => {
    it('should return stored risk check result', async () => {
      // First create a risk check
      const createResponse = await request(app)
        .post('/api/risk/check')
        .send({
          msisdn: '+911234567890',
          kyc: {
            name: 'John Doe',
            id_type: 'aadhaar',
            id_number: '1234567890123'
          },
          consent: {
            given: true,
            timestamp: new Date().toISOString()
          }
        });

      const requestId = createResponse.body.request_id;

      // Then retrieve it
      const response = await request(app)
        .get(`/api/risk/${requestId}`)
        .expect(200);

      expect(response.body.request_id).toBe(requestId);
      expect(response.body).toHaveProperty('signals');
    });

    it('should return 404 for non-existent request', async () => {
      await request(app)
        .get('/api/risk/non-existent-id')
        .expect(404);
    });
  });
});
```

### Database Integration Tests (🔴 15%)
```typescript
// server/tests/integration/database.test.ts - TO BE CREATED
import { PrismaClient } from '@prisma/client';
import { setupTestDatabase, teardownTestDatabase } from '../helpers/database';

describe('Database Operations', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('User Operations', () => {
    it('should create user with encrypted PII', async () => {
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        fullName: 'Test User',
        phone: '+911234567890'
      };

      const user = await prisma.user.create({
        data: userData
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.phoneHash).toBeDefined();
    });
  });

  describe('Risk Check Operations', () => {
    it('should store and retrieve risk check with JSONB signals', async () => {
      const riskCheckData = {
        requestId: 'test-request-123',
        msisdnHash: 'hashed_msisdn',
        score: 45,
        verdict: 'REVIEW',
        rawSignals: {
          numberVerification: { verified: true },
          simSwap: { swapped: false },
          reachability: { reachable: true }
        }
      };

      const riskCheck = await prisma.riskCheck.create({
        data: riskCheckData
      });

      expect(riskCheck.id).toBeDefined();
      expect(riskCheck.rawSignals).toEqual(riskCheckData.rawSignals);

      // Test JSONB querying
      const foundCheck = await prisma.riskCheck.findFirst({
        where: {
          rawSignals: {
            path: ['numberVerification', 'verified'],
            equals: true
          }
        }
      });

      expect(foundCheck).toBeTruthy();
      expect(foundCheck?.id).toBe(riskCheck.id);
    });
  });
});
```

## 🌐 End-to-End Testing

### Playwright E2E Tests (🔴 5%)
```typescript
// client/tests/e2e/onboarding-flow.spec.ts - TO BE CREATED
import { test, expect } from '@playwright/test';

test.describe('User Onboarding Flow', () => {
  test('complete onboarding journey', async ({ page }) => {
    // Start at landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('FraudShield');

    // Navigate to signup
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/auth/signup');

    // Fill signup form
    await page.fill('[name="fullName"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+911234567890');
    await page.fill('[name="password"]', 'SecurePassword123!');
    await page.fill('[name="confirmPassword"]', 'SecurePassword123!');

    // Submit signup
    await page.click('button[type="submit"]');

    // Should redirect to KYC verification
    await expect(page).toHaveURL('/kyc/verify');
    await expect(page.locator('h1')).toContainText('KYC Verification');

    // Fill KYC form
    await page.fill('[name="fullName"]', 'John Doe');
    await page.fill('[name="phoneNumber"]', '+911234567890');
    await page.selectOption('[name="documentType"]', 'aadhaar');
    await page.fill('[name="idNumber"]', '123456789012');

    // Upload document (mock file upload)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'aadhaar.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });

    // Submit KYC
    await page.click('button[type="submit"]');

    // Wait for processing and results
    await expect(page).toHaveURL(/\/results/);
    await expect(page.locator('h1')).toContainText('Verification Results');

    // Verify results page shows status
    const statusBadge = page.locator('[data-testid="status-badge"]');
    await expect(statusBadge).toBeVisible();

    // Verify risk score is displayed
    const riskScore = page.locator('[data-testid="risk-score"]');
    await expect(riskScore).toBeVisible();
    await expect(riskScore).toContainText(/\d+/); // Should contain a number

    // Verify signal checks are shown
    await expect(page.locator('text=Number Verification')).toBeVisible();
    await expect(page.locator('text=SIM Swap Check')).toBeVisible();
    await expect(page.locator('text=KYC Match')).toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/kyc/verify');

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Full Name is required')).toBeVisible();
    await expect(page.locator('text=Phone Number is required')).toBeVisible();
  });

  test('should handle high risk scenarios', async ({ page }) => {
    await page.goto('/kyc/verify');

    // Fill form with high-risk data
    await page.fill('[name="fullName"]', 'High Risk User');
    await page.fill('[name="phoneNumber"]', '+919999999666'); // Triggers high risk
    await page.selectOption('[name="documentType"]', 'aadhaar');
    await page.fill('[name="idNumber"]', '000000000000');

    await page.click('button[type="submit"]');

    // Should show BLOCK or high risk result
    await expect(page).toHaveURL(/\/results/);
    const statusBadge = page.locator('[data-testid="status-badge"]');
    await expect(statusBadge).toContainText(/BLOCK|REVIEW/);
  });
});
```

### Cypress E2E Tests (🔴 5%)
```typescript
// client/cypress/e2e/dashboard.cy.ts - TO BE CREATED
describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Login as admin user
    cy.login('admin@fraudshield.com', 'admin_password');
    cy.visit('/dashboard');
  });

  it('displays dashboard statistics', () => {
    cy.get('[data-testid="total-verifications"]').should('be.visible');
    cy.get('[data-testid="success-rate"]').should('contain', '%');
    cy.get('[data-testid="fraud-prevented"]').should('be.visible');
  });

  it('shows recent verification history', () => {
    cy.get('[data-testid="verification-history"]').should('be.visible');
    cy.get('[data-testid="verification-item"]').should('have.length.greaterThan', 0);
  });

  it('allows filtering verification history', () => {
    // Filter by verdict
    cy.get('[data-testid="verdict-filter"]').select('BLOCK');
    cy.get('[data-testid="verification-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'BLOCK');
    });

    // Filter by date range
    cy.get('[data-testid="date-from"]').type('2025-09-01');
    cy.get('[data-testid="date-to"]').type('2025-09-06');
    cy.get('[data-testid="apply-filter"]').click();

    cy.get('[data-testid="verification-item"]').should('be.visible');
  });

  it('allows exporting verification data', () => {
    cy.get('[data-testid="export-button"]').click();
    
    // Check download initiated
    cy.readFile('cypress/downloads/verification-export.csv').should('exist');
  });
});
```

## 🚀 Performance Testing

### Load Testing with k6 (🔴 5%)
```javascript
// tests/performance/load-test.js - TO BE CREATED
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
    errors: ['rate<0.1'],
  },
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
};

const BASE_URL = 'http://localhost:3001';

export default function () {
  // Test risk check endpoint
  const riskCheckPayload = {
    msisdn: `+9112345${Math.floor(Math.random() * 90000) + 10000}`,
    kyc: {
      name: 'Load Test User',
      id_type: 'aadhaar',
      id_number: `${Math.floor(Math.random() * 900000000000) + 100000000000}`
    },
    consent: {
      given: true,
      timestamp: new Date().toISOString()
    }
  };

  const response = http.post(`${BASE_URL}/api/risk/check`, JSON.stringify(riskCheckPayload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test_token'
    },
  });

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'has request_id': (r) => JSON.parse(r.body).request_id !== undefined,
    'valid risk score': (r) => {
      const body = JSON.parse(r.body);
      return body.score >= 0 && body.score <= 100;
    },
  });

  errorRate.add(!success);

  sleep(Math.random() * 3 + 1); // Random sleep 1-4 seconds
}
```

### Database Performance Testing (🔴 10%)
```typescript
// tests/performance/database-performance.test.ts - TO BE CREATED
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

describe('Database Performance Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should handle concurrent risk check inserts', async () => {
    const concurrentOperations = 100;
    const operations = [];

    const startTime = performance.now();

    for (let i = 0; i < concurrentOperations; i++) {
      operations.push(
        prisma.riskCheck.create({
          data: {
            requestId: `perf-test-${i}`,
            msisdnHash: `hash_${i}`,
            score: Math.floor(Math.random() * 100),
            verdict: 'PASS',
            rawSignals: {
              test: true,
              iteration: i
            }
          }
        })
      );
    }

    await Promise.all(operations);

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Created ${concurrentOperations} records in ${duration}ms`);
    
    // Should complete within reasonable time
    expect(duration).toBeLessThan(5000); // 5 seconds
  });

  it('should efficiently query risk checks with JSONB filters', async () => {
    const startTime = performance.now();

    const results = await prisma.riskCheck.findMany({
      where: {
        rawSignals: {
          path: ['numberVerification', 'verified'],
          equals: true
        },
        score: {
          gte: 50
        }
      },
      take: 100
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`JSONB query completed in ${duration}ms`);
    
    // Should be fast even with complex queries
    expect(duration).toBeLessThan(500); // 500ms
    expect(results).toBeInstanceOf(Array);
  });
});
```

## 🔒 Security Testing

### Security Test Suite (🔴 15%)
```typescript
// tests/security/auth.security.test.ts - TO BE CREATED
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../src/app';

describe('Authentication Security Tests', () => {
  describe('JWT Token Security', () => {
    it('should reject invalid JWT tokens', async () => {
      const invalidToken = 'invalid.jwt.token';

      await request(app)
        .get('/api/risk/history')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });

    it('should reject expired JWT tokens', async () => {
      const expiredToken = jwt.sign(
        { sub: 'user123', exp: Math.floor(Date.now() / 1000) - 3600 },
        'secret'
      );

      await request(app)
        .get('/api/risk/history')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should prevent privilege escalation', async () => {
      const userToken = jwt.sign(
        { sub: 'user123', role: 'user' },
        process.env.JWT_SECRET!
      );

      // Try to access admin endpoint with user token
      await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection attempts', async () => {
      const maliciousInput = {
        msisdn: "+91'; DROP TABLE users; --",
        kyc: {
          name: 'Test User',
          id_type: 'aadhaar',
          id_number: '1234567890'
        },
        consent: {
          given: true,
          timestamp: new Date().toISOString()
        }
      };

      await request(app)
        .post('/api/risk/check')
        .send(maliciousInput)
        .expect(400); // Should reject invalid input
    });

    it('should sanitize XSS attempts', async () => {
      const xssInput = {
        msisdn: '+911234567890',
        kyc: {
          name: '<script>alert("xss")</script>',
          id_type: 'aadhaar',
          id_number: '1234567890'
        },
        consent: {
          given: true,
          timestamp: new Date().toISOString()
        }
      };

      const response = await request(app)
        .post('/api/risk/check')
        .send(xssInput)
        .expect(400);

      expect(response.body.error).not.toContain('<script>');
    });
  });

  describe('Rate Limiting Security', () => {
    it('should block excessive requests', async () => {
      const requests = [];
      
      // Send 20 rapid requests
      for (let i = 0; i < 20; i++) {
        requests.push(
          request(app)
            .post('/api/risk/check')
            .send({
              msisdn: '+911234567890',
              kyc: {
                name: 'Test User',
                id_type: 'aadhaar',
                id_number: '1234567890'
              },
              consent: {
                given: true,
                timestamp: new Date().toISOString()
              }
            })
        );
      }

      const responses = await Promise.all(requests);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
```

## 📊 Test Reporting & Metrics

### Test Coverage Reporting (🔴 20%)
```javascript
// scripts/test-coverage.js - TO BE CREATED
const { execSync } = require('child_process');
const fs = require('fs');

async function generateCoverageReport() {
  console.log('Generating test coverage report...');

  // Run frontend tests with coverage
  console.log('Running frontend tests...');
  execSync('cd client && npm run test:coverage', { stdio: 'inherit' });

  // Run backend tests with coverage
  console.log('Running backend tests...');
  execSync('cd server && npm run test:coverage', { stdio: 'inherit' });

  // Combine coverage reports
  console.log('Combining coverage reports...');
  execSync('nyc merge coverage-frontend coverage-backend coverage-combined');

  // Generate HTML report
  execSync('nyc report --reporter=html --temp-dir=coverage-combined');

  console.log('Coverage report generated at: coverage/index.html');
}

generateCoverageReport().catch(console.error);
```

### Automated Test Execution (🔴 25%)
```yaml
# .github/workflows/test.yml - TO BE CREATED
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../server && npm ci
      
      - name: Run unit tests
        run: |
          cd client && npm run test:coverage
          cd ../server && npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/lcov.info,./server/coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run integration tests
        run: |
          cd server && npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Playwright
        run: |
          cd client && npx playwright install
      
      - name: Run E2E tests
        run: |
          cd client && npm run test:e2e

  performance-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run k6 load tests
        uses: grafana/k6-action@v0.2.0
        with:
          filename: tests/performance/load-test.js
```

## 📋 Testing Priorities

### Critical Tasks (Next 48 Hours)
1. **Test Framework Setup** - Configure Jest, Testing Library, Playwright
2. **Unit Test Foundation** - Core utility and service tests
3. **API Integration Tests** - Basic endpoint testing
4. **CI/CD Integration** - Automated test execution
5. **Test Data Setup** - Mock data and test fixtures

### High Priority (Next Week)
6. **Component Testing** - Frontend component test coverage
7. **Database Testing** - Database operation and migration tests
8. **E2E Test Suite** - Critical user journey automation
9. **Security Testing** - Authentication and input validation tests
10. **Performance Baseline** - Basic load testing setup

### Medium Priority (Next 2 Weeks)
11. **Advanced E2E Scenarios** - Complex user flows and edge cases
12. **Load Testing** - Comprehensive performance testing
13. **Visual Regression Testing** - UI consistency testing
14. **Accessibility Testing** - WCAG compliance verification
15. **Cross-browser Testing** - Multi-browser compatibility

### Low Priority (Later)
16. **Mutation Testing** - Test quality assessment
17. **Contract Testing** - API contract verification
18. **Chaos Engineering** - Failure scenario testing
19. **Property-based Testing** - Automated test case generation
20. **Performance Monitoring** - Continuous performance tracking

## 🧪 Test Environment Management

### Test Database Setup (🔴 30%)
```typescript
// tests/helpers/database.ts - TO BE CREATED
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

let prisma: PrismaClient;

export async function setupTestDatabase(): Promise<PrismaClient> {
  const testDatabaseUrl = process.env.TEST_DATABASE_URL || 
    'postgresql://test:test@localhost:5432/fraudshield_test';

  // Create test database
  execSync('createdb fraudshield_test', { stdio: 'ignore' });

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });

  // Run migrations
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
  });

  // Seed test data
  await seedTestData();

  return prisma;
}

export async function teardownTestDatabase(): Promise<void> {
  await prisma.$disconnect();
  execSync('dropdb fraudshield_test', { stdio: 'ignore' });
}

export async function clearTestData(): Promise<void> {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    }
  }
}

async function seedTestData(): Promise<void> {
  // Create test users
  await prisma.user.createMany({
    data: [
      {
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        fullName: 'Test User',
        role: 'USER'
      },
      {
        email: 'admin@example.com',
        passwordHash: 'hashed_password',
        fullName: 'Admin User',
        role: 'ADMIN'
      }
    ]
  });

  // Create test risk checks
  await prisma.riskCheck.createMany({
    data: [
      {
        requestId: 'test-001',
        msisdnHash: 'hash_001',
        score: 25,
        verdict: 'PASS',
        rawSignals: {
          numberVerification: { verified: true },
          simSwap: { swapped: false }
        }
      },
      {
        requestId: 'test-002',
        msisdnHash: 'hash_002',
        score: 85,
        verdict: 'BLOCK',
        rawSignals: {
          numberVerification: { verified: false },
          simSwap: { swapped: true }
        }
      }
    ]
  });
}
```

## 📖 Testing Documentation

### Completed Documentation (🔴 25%)
- 🟡 Testing strategy overview
- 🔴 Test framework configuration
- 🔴 Test writing guidelines
- 🔴 CI/CD integration

### Pending Documentation (🔴 75%)
- 🔴 Test execution procedures
- 🔴 Performance testing guidelines
- 🔴 Security testing procedures
- 🔴 Test data management
- 🔴 Debugging test failures
- 🔴 Test maintenance procedures
