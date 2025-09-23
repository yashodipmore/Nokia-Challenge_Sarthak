import axios from 'axios';

class NokiaNetworkService {
  constructor() {
    this.baseUrl = process.env.NOKIA_BASE_URL || 'https://api.networkascode.nokia.com';
    this.apiKey = process.env.NOKIA_API_KEY;
    this.apiSecret = process.env.NOKIA_API_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get OAuth 2.0 access token
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await axios.post(`${this.baseUrl}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer

      return this.accessToken;
    } catch (error) {
      console.error('Nokia OAuth error:', error.response?.data || error.message);
      throw new Error('Failed to get Nokia API access token');
    }
  }

  // 1. Number Verification API
  async verifyPhoneNumber(phoneNumber) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/camara/number-verification/v0/verify`,
        {
          phoneNumber: phoneNumber,
          hashedPhoneNumber: this.hashPhoneNumber(phoneNumber) // Privacy protection
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        verified: response.data.devicePhoneNumberVerified,
        result: response.data.verificationResult,
        confidence: response.data.confidence || 0.95,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Nokia Number Verification error:', error.response?.data || error.message);
      return {
        success: false,
        verified: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 2. SIM Swap Detection API
  async checkSimSwap(phoneNumber, maxAgeHours = 240) { // 10 days default
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/camara/sim-swap/v0/check`,
        {
          phoneNumber: phoneNumber,
          maxAge: maxAgeHours
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        swapDetected: response.data.swapped,
        lastSwapDate: response.data.swapDate,
        riskLevel: response.data.swapped ? 'HIGH' : 'LOW',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Nokia SIM Swap error:', error.response?.data || error.message);
      return {
        success: false,
        swapDetected: null,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 3. Location Verification API
  async verifyLocation(phoneNumber, latitude, longitude, radius = 10000) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/camara/location-verification/v0/verify`,
        {
          device: {
            phoneNumber: phoneNumber
          },
          area: {
            areaType: 'Circle',
            center: {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude)
            },
            radius: radius
          },
          maxAge: 3600 // 1 hour
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        locationMatch: response.data.verificationResult === 'TRUE',
        distance: response.data.distance,
        accuracy: response.data.accuracy,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Nokia Location Verification error:', error.response?.data || error.message);
      return {
        success: false,
        locationMatch: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 4. Device Status API
  async checkDeviceStatus(phoneNumber) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/camara/device-status/v0/status`,
        {
          device: {
            phoneNumber: phoneNumber
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        isActive: response.data.connectivityStatus === 'CONNECTED_SMS',
        connectivityStatus: response.data.connectivityStatus,
        roaming: response.data.roaming,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Nokia Device Status error:', error.response?.data || error.message);
      return {
        success: false,
        isActive: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 5. Comprehensive Fraud Check (All APIs)
  async comprehensiveFraudCheck(applicationData) {
    try {
      const { phoneNumber, latitude, longitude } = applicationData;
      
      console.log(`🔍 Starting comprehensive fraud check for ${phoneNumber}`);
      
      // Run all Nokia APIs in parallel for faster processing
      const [numberCheck, simSwapCheck, locationCheck, deviceCheck] = await Promise.allSettled([
        this.verifyPhoneNumber(phoneNumber),
        this.checkSimSwap(phoneNumber, 168), // 7 days
        this.verifyLocation(phoneNumber, latitude, longitude),
        this.checkDeviceStatus(phoneNumber)
      ]);

      // Process results
      const results = {
        numberVerification: numberCheck.status === 'fulfilled' ? numberCheck.value : { success: false, error: 'API call failed' },
        simSwapDetection: simSwapCheck.status === 'fulfilled' ? simSwapCheck.value : { success: false, error: 'API call failed' },
        locationVerification: locationCheck.status === 'fulfilled' ? locationCheck.value : { success: false, error: 'API call failed' },
        deviceStatus: deviceCheck.status === 'fulfilled' ? deviceCheck.value : { success: false, error: 'API call failed' }
      };

      // Calculate overall fraud risk score
      const riskScore = this.calculateFraudScore(results, applicationData);
      
      return {
        success: true,
        riskScore: riskScore.score,
        riskLevel: riskScore.level,
        riskFactors: riskScore.factors,
        nokiaResults: results,
        confidence: riskScore.confidence,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Comprehensive fraud check error:', error);
      return {
        success: false,
        riskScore: 100,
        riskLevel: 'CRITICAL',
        riskFactors: ['Nokia API verification failed'],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Risk Score Calculation Algorithm
  calculateFraudScore(nokiaResults, applicationData) {
    let score = 0;
    const factors = [];
    let confidence = 1.0;

    // Number Verification (30 points max)
    if (!nokiaResults.numberVerification.success) {
      score += 30;
      factors.push('Phone number verification failed');
      confidence *= 0.7;
    } else if (!nokiaResults.numberVerification.verified) {
      score += 25;
      factors.push('Phone number not verified by carrier');
    }

    // SIM Swap Detection (40 points max) - Highest risk
    if (!nokiaResults.simSwapDetection.success) {
      score += 20;
      factors.push('SIM swap check failed');
      confidence *= 0.8;
    } else if (nokiaResults.simSwapDetection.swapDetected) {
      score += 40;
      factors.push('Recent SIM swap detected - HIGH FRAUD RISK');
    }

    // Location Verification (20 points max)
    if (!nokiaResults.locationVerification.success) {
      score += 10;
      factors.push('Location verification failed');
      confidence *= 0.9;
    } else if (!nokiaResults.locationVerification.locationMatch) {
      score += 15;
      factors.push('Location mismatch detected');
    }

    // Device Status (10 points max)
    if (!nokiaResults.deviceStatus.success) {
      score += 5;
      factors.push('Device status check failed');
      confidence *= 0.95;
    } else if (!nokiaResults.deviceStatus.isActive) {
      score += 8;
      factors.push('Device appears inactive');
    } else if (nokiaResults.deviceStatus.roaming) {
      score += 3;
      factors.push('Device is roaming (minor risk)');
    }

    // Determine risk level
    let riskLevel;
    if (score >= 80) riskLevel = 'CRITICAL';
    else if (score >= 60) riskLevel = 'HIGH';
    else if (score >= 30) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    return {
      score: Math.min(score, 100),
      level: riskLevel,
      factors: factors,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  // Utility function for phone number hashing (privacy)
  hashPhoneNumber(phoneNumber) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(phoneNumber).digest('hex');
  }

  // Mock/Fallback functions for testing (when Nokia APIs are not available)
  async mockVerifyPhoneNumber(phoneNumber) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      verified: !phoneNumber.includes('000'), // Numbers with '000' fail
      result: 'TRUE',
      confidence: 0.9,
      timestamp: new Date().toISOString()
    };
  }

  async mockCheckSimSwap(phoneNumber) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const swapDetected = phoneNumber.endsWith('666'); // Test pattern
    
    return {
      success: true,
      swapDetected: swapDetected,
      lastSwapDate: swapDetected ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : null,
      riskLevel: swapDetected ? 'HIGH' : 'LOW',
      timestamp: new Date().toISOString()
    };
  }
}

export default NokiaNetworkService;
