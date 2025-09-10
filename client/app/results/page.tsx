'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VerificationResult {
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

export default function Results() {
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultData = params.get('result');
    
    if (resultData) {
      try {
        setResult(JSON.parse(resultData));
      } catch (error) {
        console.error('Failed to parse result data:', error);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading verification results...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600 bg-green-100';
    if (score <= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 70) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Results</h1>
          <p className="text-lg text-gray-600">
            Your identity verification has been processed
          </p>
        </div>

        {/* Status Alert */}
        {result.status === 'FAIL' || result.riskScore > 70 ? (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Verification Failed:</strong> High fraud risk detected. Please contact support for assistance.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Verification Successful:</strong> Your identity has been verified successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Verification Summary</CardTitle>
                <CardDescription>
                  Completed on {new Date(result.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Full Name</span>
                    <span>{result.user.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Phone Number</span>
                    <span>{result.user.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">ID Number</span>
                    <span>{result.user.idNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Overall Status</span>
                    <Badge variant={result.status === 'PASS' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Checks */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Checks</CardTitle>
                <CardDescription>
                  Detailed results from Nokia Network APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                      Number Verification
                    </span>
                    {result.checks.numberVerification ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-gray-400" />
                      SIM Swap Check
                    </span>
                    {result.checks.simSwapCheck ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-400" />
                      KYC Match
                    </span>
                    {result.checks.kycMatch ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-gray-400" />
                      Scam Signal
                    </span>
                    {result.checks.scamSignal ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Score */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getRiskColor(result.riskScore).split(' ')[0]}`}>
                    {result.riskScore}
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskColor(result.riskScore)}`}>
                    {getRiskLabel(result.riskScore)}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 rounded-full ${
                        result.riskScore <= 30 ? 'bg-green-500' : 
                        result.riskScore <= 70 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Risk score out of 100. Lower scores indicate safer users.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-3">
              <Link href="/dashboard">
                <Button className="w-full">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/kyc/verify">
                <Button variant="outline" className="w-full">
                  Verify Another User
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}