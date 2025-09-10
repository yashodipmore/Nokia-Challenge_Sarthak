'use client';

import { useState, useEffect } from 'react';
import { Home, History, Settings, Bell, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Fix hydration error by using consistent date formatting
const formatDate = (dateString: string) => {
  if (typeof window === 'undefined') {
    // Server-side: return a consistent format
    return new Date(dateString).toISOString().slice(0, 16).replace('T', ' ');
  }
  // Client-side: use local formatting
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const mockData = {t';

import { useState, useEffect } from 'react';
import { Home, History, Settings, Bell, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const mockData = {
  recentVerifications: [
    {
      id: 1,
      name: 'John Smith',
      phone: '+1 555-0123',
      date: '2025-01-27T10:30:00Z',
      status: 'PASS',
      riskScore: 15
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      phone: '+1 555-0456',
      date: '2025-01-27T09:15:00Z',
      status: 'FAIL',
      riskScore: 85
    },
    {
      id: 3,
      name: 'Mike Wilson',
      phone: '+1 555-0789',
      date: '2025-01-26T16:45:00Z',
      status: 'PASS',
      riskScore: 25
    }
  ],
  fraudAlerts: [
    {
      id: 1,
      type: 'SIM Swap',
      description: 'Suspicious SIM swap activity detected',
      timestamp: '2025-01-27T11:00:00Z',
      severity: 'high'
    },
    {
      id: 2,
      type: 'Multiple Attempts',
      description: 'Multiple failed verification attempts from same IP',
      timestamp: '2025-01-27T08:30:00Z',
      severity: 'medium'
    }
  ],
  stats: {
    totalVerifications: 1247,
    successRate: 94.2,
    fraudPrevented: 73,
    riskScoreAvg: 32
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe date formatting function
  const formatDate = (dateString: string) => {
    if (!mounted) return 'Loading...';
    return new Date(dateString).toLocaleString();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                  <Shield className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.stats.totalVerifications.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.stats.successRate}%</div>
                  <p className="text-xs text-green-600">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.stats.fraudPrevented}</div>
                  <p className="text-xs text-red-600">-5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.stats.riskScoreAvg}</div>
                  <p className="text-xs text-orange-600">+1.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Onboarding Status */}
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Status</CardTitle>
                <CardDescription>Latest verification result</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your last verification was successful. Risk score: 15/100
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Fraud Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Fraud Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.fraudAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium">{alert.type}</h4>
                          <Badge 
                            variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                            className="ml-2"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'history':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
              <CardDescription>Past onboarding attempts and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.recentVerifications.map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{verification.name}</h4>
                      <p className="text-sm text-gray-600">{verification.phone}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(verification.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={verification.status === 'PASS' ? 'default' : 'destructive'}>
                        {verification.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Risk: {verification.riskScore}/100
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your FraudShield preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Fraud Detection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Risk Score Threshold</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="70" 
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable SIM Swap Detection</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable Scam Signal Alerts</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email Alerts</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">FraudShield</span>
            </div>

            <nav className="space-y-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('home')}
              >
                <Home className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('history')}
              >
                <History className="h-4 w-4 mr-3" />
                History
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'home' ? 'Dashboard' : 
                 activeTab === 'history' ? 'Verification History' : 'Settings'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'home' ? 'Monitor your fraud detection activity' :
                 activeTab === 'history' ? 'View past verification attempts' : 'Configure your preferences'}
              </p>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}