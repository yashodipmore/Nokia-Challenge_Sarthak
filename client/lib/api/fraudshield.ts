// Mock API functions for Nokia Network-as-Code APIs
// These functions simulate the behavior of actual fraud detection APIs

export interface KYCData {
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  documentType: string;
  document?: File | null;
}

export interface VerificationResult {
  status: 'PASS' | 'FAIL';
  riskScore: number;
  user: {
    fullName: string;
    phoneNumber: string;
    idNumber: string;
  };
  checks: {
    numberVerification: boolean;
    simSwapCheck: boolean;
    kycMatch: boolean;
    scamSignal: boolean;
  };
  timestamp: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock risk score based on phone number (for demo consistency)
const generateRiskScore = (phoneNumber: string): number => {
  const hash = phoneNumber.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash % 100);
};

export async function verifyNumber(phone: string): Promise<{ verified: boolean; carrier?: string }> {
  await delay(1000);
  
  // Mock verification logic
  const verified = !phone.includes('000'); // Numbers with '000' fail verification
  
  return {
    verified,
    carrier: verified ? ['Verizon', 'AT&T', 'T-Mobile'][Math.floor(Math.random() * 3)] : undefined
  };
}

export async function checkSimSwap(phone: string): Promise<{ swapped: boolean; lastSwapDate?: string }> {
  await delay(800);
  
  // Mock SIM swap detection
  const swapped = phone.endsWith('666'); // Numbers ending in '666' show recent swap
  
  return {
    swapped,
    lastSwapDate: swapped ? new Date(Date.now() - 86400000 * 2).toISOString() : undefined // 2 days ago
  };
}

export async function matchKYC(data: KYCData): Promise<{ matched: boolean; confidence: number }> {
  await delay(1500);
  
  // Mock KYC matching logic
  const matched = data.fullName.length > 5 && data.idNumber.length >= 10;
  const confidence = matched ? 0.85 + Math.random() * 0.14 : 0.2 + Math.random() * 0.3;
  
  return {
    matched,
    confidence: Math.round(confidence * 100) / 100
  };
}

export async function detectScamSignal(phone: string): Promise<{ isScam: boolean; riskLevel: 'low' | 'medium' | 'high' }> {
  await delay(600);
  
  // Mock scam detection
  const riskScore = generateRiskScore(phone);
  const isScam = riskScore > 75;
  const riskLevel = riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high';
  
  return {
    isScam,
    riskLevel
  };
}

export async function verifyKYC(data: KYCData): Promise<VerificationResult> {
  await delay(3000); // Simulate comprehensive verification process
  
  // Run all verification checks
  const [numberResult, simSwapResult, kycResult, scamResult] = await Promise.all([
    verifyNumber(data.phoneNumber),
    checkSimSwap(data.phoneNumber),
    matchKYC(data),
    detectScamSignal(data.phoneNumber)
  ]);
  
  // Calculate overall risk score
  let riskScore = generateRiskScore(data.phoneNumber);
  
  // Adjust risk score based on check results
  if (!numberResult.verified) riskScore += 20;
  if (simSwapResult.swapped) riskScore += 30;
  if (!kycResult.matched) riskScore += 25;
  if (scamResult.isScam) riskScore += 35;
  
  // Cap at 100
  riskScore = Math.min(riskScore, 100);
  
  // Determine overall status
  const status: 'PASS' | 'FAIL' = riskScore <= 70 ? 'PASS' : 'FAIL';
  
  const result: VerificationResult = {
    status,
    riskScore,
    user: {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      idNumber: data.idNumber
    },
    checks: {
      numberVerification: numberResult.verified,
      simSwapCheck: !simSwapResult.swapped,
      kycMatch: kycResult.matched,
      scamSignal: !scamResult.isScam
    },
    timestamp: new Date().toISOString()
  };
  
  return result;
}

// Additional utility functions for dashboard and analytics
export async function getVerificationHistory(userId?: string): Promise<VerificationResult[]> {
  await delay(500);
  
  // Return mock history data
  return [
    {
      status: 'PASS',
      riskScore: 15,
      user: {
        fullName: 'John Smith',
        phoneNumber: '+1 555-0123',
        idNumber: 'ID12345'
      },
      checks: {
        numberVerification: true,
        simSwapCheck: true,
        kycMatch: true,
        scamSignal: true
      },
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      status: 'FAIL',
      riskScore: 85,
      user: {
        fullName: 'Sarah Johnson',
        phoneNumber: '+1 555-0456',
        idNumber: 'ID67890'
      },
      checks: {
        numberVerification: false,
        simSwapCheck: false,
        kycMatch: true,
        scamSignal: false
      },
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ];
}

export async function getFraudStats(): Promise<{
  totalVerifications: number;
  successRate: number;
  fraudPrevented: number;
  averageRiskScore: number;
}> {
  await delay(300);
  
  return {
    totalVerifications: 1247,
    successRate: 94.2,
    fraudPrevented: 73,
    averageRiskScore: 32
  };
}