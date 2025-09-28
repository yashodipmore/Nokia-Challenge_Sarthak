'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { adminAPI } from '@/lib/api/admin';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Shield, Home, BarChart3, History, Bell, Settings, Users,
  FileText, CheckCircle2, AlertTriangle, Clock, Search,
  RefreshCw, Download, UserCheck, UserX, Ban,
  Mail, Phone, MapPin, Building, CreditCard, Calendar,
  CheckCircle, AlertCircle, Menu, X, Sun, Moon,
  LogOut, HelpCircle
} from 'lucide-react';
interface UserApplication {
_id: string;
applicationId: string;
userId: {
name: string;
email: string;
};
loanAmount: number;
loanType: string;
purpose: string;
fullName: string;
phoneNumber: string;
email: string;
dateOfBirth: string;
monthlyIncome: number;
address: {
street: string;
city: string;
state: string;
pincode: string;
country: string;
};
status: 'pending' | 'approved' | 'rejected';
reviewedBy?: string;
reviewedAt?: string;
reason?: string;
approvedAmount?: number;
comments?: string;
createdAt: string;
// Fraud analysis fields (calculated client-side)
fraudScore: number;
riskLevel: 'low' | 'medium' | 'high' | 'critical';
verificationStatus: {
identity: boolean;
address: boolean;
income: boolean;
documents: boolean;
};
}

export default function Dashboard() {
const router = useRouter();
const [activeTab, setActiveTab] = useState('home');
const [mounted, setMounted] = useState(false);
const [isDarkMode, setIsDarkMode] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(true);
const [applications, setApplications] = useState<UserApplication[]>([]);
const [filteredApplications, setFilteredApplications] = useState<UserApplication[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [riskFilter, setRiskFilter] = useState('all');
const [currentTime, setCurrentTime] = useState(new Date());
const [isLoading, setIsLoading] = useState(true);
const [stats, setStats] = useState({
total: 0,
approved: 0,
pending: 0,
rejected: 0,
highRisk: 0
});
const { toast } = useToast();

  // Generate fraud analysis for applications
  const generateFraudAnalysis = (app: any): UserApplication => {
  // Calculate fraud score based on application data
  let fraudScore = 0;
    
  // Income to loan ratio
  const incomeToLoanRatio = app.loanAmount / (app.monthlyIncome * 12);
  if (incomeToLoanRatio > 5) fraudScore += 30;
  else if (incomeToLoanRatio > 3) fraudScore += 20;
  else if (incomeToLoanRatio > 2) fraudScore += 10;
    
  // Loan amount risk
  if (app.loanAmount > 2000000) fraudScore += 20;
  else if (app.loanAmount > 1000000) fraudScore += 15;
  else if (app.loanAmount > 500000) fraudScore += 10;
    
  // Random factors for simulation
  fraudScore += Math.floor(Math.random() * 40);
    
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (fraudScore >= 80) riskLevel = 'critical';
  else if (fraudScore >= 60) riskLevel = 'high';
  else if (fraudScore >= 30) riskLevel = 'medium';
    
  return {
  ...app,
  fraudScore: Math.min(fraudScore, 100),
  riskLevel,
  verificationStatus: {
  identity: Math.random() > 0.2,
  address: Math.random() > 0.3,
  income: Math.random() > 0.4,
  documents: Math.random() > 0.1
  }
  };
  };

  // Fetch applications from backend
  const fetchApplications = async () => {
  try {
  setIsLoading(true);
  const response = await adminAPI.applications.getAllApplications({
  page: 1,
  limit: 50 // Get more applications for the dashboard
  });

  if (response.success && response.data) {
  const analyzedApplications = response.data.applications.map(generateFraudAnalysis);
  setApplications(analyzedApplications);
        
  // Update stats
  const newStats = {
  total: analyzedApplications.length,
  approved: analyzedApplications.filter(app => app.status === 'approved').length,
  pending: analyzedApplications.filter(app => app.status === 'pending').length,
  rejected: analyzedApplications.filter(app => app.status === 'rejected').length,
  highRisk: analyzedApplications.filter(app => app.riskLevel === 'high' || app.riskLevel === 'critical').length
  };
  setStats(newStats);
  }
  } catch (error: any) {
  console.error('Error fetching applications:', error);
  toast({
  title: "Error Loading Applications",
  description: error.message || "Failed to load applications",
  variant: "destructive",
  });
  } finally {
  setIsLoading(false);
  }
  };

  // Function handlers
  const handleSignOut = () => {
    localStorage.removeItem('theme');
    localStorage.removeItem('userSession');
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account.",
    });
    router.push('/auth/login');
  };

  const handleExportToExcel = () => {
  try {
  const exportData = filteredApplications.map(app => ({
  'Application ID': app.applicationId,
  'Full Name': app.fullName,
  'Email': app.email,
  'Phone': app.phoneNumber,
  'Date of Birth': app.dateOfBirth,
  'Loan Type': app.loanType,
  'Loan Amount': app.loanAmount,
  'Monthly Income': app.monthlyIncome,
  'Purpose': app.purpose,
  'City': app.address?.city || '',
  'State': app.address?.state || '',
  'Pincode': app.address?.pincode || '',
  'Status': app.status,
  'Fraud Score': app.fraudScore,
  'Risk Level': app.riskLevel,
  'Identity Verified': app.verificationStatus.identity ? 'Yes' : 'No',
  'Address Verified': app.verificationStatus.address ? 'Yes' : 'No',
  'Income Verified': app.verificationStatus.income ? 'Yes' : 'No',
  'Documents Verified': app.verificationStatus.documents ? 'Yes' : 'No',
  'Reviewed By': app.reviewedBy || '',
  'Approved Amount': app.approvedAmount || '',
  'Reason': app.reason || '',
  'Comments': app.comments || '',
  'Submitted Date': new Date(app.createdAt).toLocaleDateString(),
  'Reviewed Date': app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : ''
  }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
      
      const fileName = `fraud_detection_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast({
        title: "Export Successful!",
        description: `Data exported to ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Error occurred while exporting data.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
  await fetchApplications();
  toast({
  title: "Data Refreshed",
  description: "Latest application data loaded from server.",
  });
  };

  const handleApproveApplication = async (appId: string) => {
  try {
  const application = applications.find(app => app.applicationId === appId);
  if (!application) return;

  await adminAPI.applications.updateApplicationStatus(application._id, {
  decision: 'approved',
  reason: 'Application approved through fraud detection dashboard',
  approvedAmount: application.loanAmount,
  comments: 'Verified and approved by fraud detection system'
  });

  // Update local state
  setApplications(prev => prev.map(app =>
  app.applicationId === appId ? { ...app, status: 'approved' as const } : app
  ));

  toast({
  title: "Application Approved",
  description: "User has been verified and approved successfully.",
  });
  } catch (error: any) {
  toast({
  title: "Error Approving Application",
  description: error.message || "Failed to approve application",
  variant: "destructive",
  });
  }
  };

  const handleRejectApplication = async (appId: string) => {
  try {
  const application = applications.find(app => app.applicationId === appId);
  if (!application) return;

  await adminAPI.applications.updateApplicationStatus(application._id, {
  decision: 'rejected',
  reason: 'Application rejected due to fraud detection analysis',
  comments: `High fraud risk score: ${application.fraudScore}/100`
  });

  // Update local state
  setApplications(prev => prev.map(app =>
  app.applicationId === appId ? { ...app, status: 'rejected' as const } : app
  ));

  toast({
  title: "Application Rejected",
  description: "User application has been rejected.",
  });
  } catch (error: any) {
  toast({
  title: "Error Rejecting Application",
  description: error.message || "Failed to reject application",
  variant: "destructive",
  });
  }
  };

  const handleBlockUser = async (appId: string) => {
  try {
  const application = applications.find(app => app.applicationId === appId);
  if (!application) return;

  await adminAPI.applications.updateApplicationStatus(application._id, {
  decision: 'rejected',
  reason: 'User blocked due to high fraud risk',
  comments: `Critical fraud risk detected: ${application.fraudScore}/100. User account flagged.`
  });

  // Update local state
  setApplications(prev => prev.map(app =>
  app.applicationId === appId ? { ...app, status: 'rejected' as const } : app
  ));

  toast({
  title: "User Blocked",
  description: "User account has been blocked for fraudulent activity.",
  variant: "destructive"
  });
  } catch (error: any) {
  toast({
  title: "Error Blocking User",
  description: error.message || "Failed to block user",
  variant: "destructive",
  });
  }
  };

  // Filter applications
  useEffect(() => {
  let filtered = applications;
    
  if (searchTerm) {
  filtered = filtered.filter(app =>
  app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  app.phoneNumber.includes(searchTerm) ||
  app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  app.loanType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  }
    
  if (statusFilter !== 'all') {
  filtered = filtered.filter(app => app.status === statusFilter);
  }
    
  if (riskFilter !== 'all') {
  filtered = filtered.filter(app => app.riskLevel === riskFilter);
  }
    
  setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, riskFilter]);

  useEffect(() => {
  setMounted(true);
    
  // Check if admin is authenticated
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
  toast({
  title: "Authentication Required",
  description: "Please log in to access the dashboard.",
  variant: "destructive",
  });
  router.push('/admin/login');
  return;
  }
    
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
  setIsDarkMode(true);
  document.documentElement.classList.add('dark');
  }

  // Fetch real applications from backend
  fetchApplications();

  // Real-time clock
  const clockInterval = setInterval(() => {
  setCurrentTime(new Date());
  }, 1000);

  return () => {
  clearInterval(clockInterval);
  };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return 'Loading...';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
      under_review: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Under Review' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const getRiskBadge = (riskLevel: string) => {
    const riskConfig = {
      low: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Low Risk' },
      medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Medium Risk' },
      high: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'High Risk' },
      critical: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Critical Risk' }
    };
    
    const config = riskConfig[riskLevel as keyof typeof riskConfig] || riskConfig.low;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
            </div>
            </CardContent>
            </Card>
              
            <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            </CardContent>
            </Card>
              
            <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">High Risk</p>
            <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            </CardContent>
            </Card>
              
            <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            </CardContent>
            </Card>
            </div>

            {/* Main Applications Management */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">User Applications Management</CardTitle>
                    <CardDescription className="text-gray-600">
                      Review and manage user applications with fraud detection analysis
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button onClick={handleExportToExcel} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email, phone, or application ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="critical">Critical Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                {isLoading ? (
                <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                </div>
                <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                </div>
                </div>
                </CardContent>
                </Card>
                ))}
                </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                      <p className="text-gray-500">No user applications match your current filters.</p>
                    </div>
                  ) : (
                    filteredApplications.map((app) => (
                      <Card key={app.applicationId} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* User Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                      {app.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{app.fullName}</h3>
                                    <p className="text-sm text-gray-500">ID: {app.applicationId}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {getStatusBadge(app.status)}
                                  {getRiskBadge(app.riskLevel)}
                                </div>
                              </div>

                              {/* Contact & Application Details */}
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{app.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{app.phoneNumber}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{app.address?.city}, {app.address?.state}</span>
                              </div>
                              </div>
                              <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{app.loanType} - ₹{app.loanAmount?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Monthly Income: ₹{app.monthlyIncome?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{formatDate(app.createdAt)}</span>
                              </div>
                              </div>
                              </div>

                              {/* Verification Status */}
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {Object.entries(app.verificationStatus).map(([key, verified]) => (
                                    <div key={key} className="flex items-center gap-1">
                                      {verified ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                      )}
                                      <span className="text-xs capitalize text-gray-600">{key}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Fraud Analysis */}
                            <div className="lg:w-80 border-l border-gray-200 pl-6">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Fraud Analysis</h4>
                              
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-gray-600">Fraud Score</span>
                                  <span className="font-medium text-gray-900">{app.fraudScore}/100</span>
                                </div>
                                <Progress 
                                  value={app.fraudScore} 
                                  className={`h-2 ${
                                    app.fraudScore >= 80 ? 'bg-red-100' :
                                    app.fraudScore >= 60 ? 'bg-orange-100' :
                                    app.fraudScore >= 30 ? 'bg-yellow-100' : 'bg-green-100'
                                  }`}
                                />
                              </div>

                              <div className="space-y-2 mb-4">
                              <div className="text-xs text-gray-500">Loan Type: {app.loanType}</div>
                              <div className="text-xs text-gray-500">Income: ₹{app.monthlyIncome?.toLocaleString()}/month</div>
                              <div className="text-xs text-gray-500">Purpose: {app.purpose}</div>
                              <div className="text-xs text-gray-500">DOB: {new Date(app.dateOfBirth).toLocaleDateString()}</div>
                              </div>

                              {/* Action Buttons */}
                              <div className="space-y-2">
                                {app.status === 'pending' && (
                                  <>
                                    <Button 
                                      onClick={() => handleApproveApplication(app.applicationId)}
                                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                                      size="sm"
                                    >
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Approve & Verify
                                    </Button>
                                    <Button 
                                      onClick={() => handleRejectApplication(app.applicationId)}
                                      variant="outline"
                                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                      size="sm"
                                    >
                                      <UserX className="h-4 w-4 mr-2" />
                                      Reject Application
                                    </Button>
                                    {(app.riskLevel === 'high' || app.riskLevel === 'critical') && (
                                      <Button 
                                        onClick={() => handleBlockUser(app.applicationId)}
                                        variant="outline"
                                        className="w-full border-red-300 text-red-700 hover:bg-red-100"
                                        size="sm"
                                      >
                                        <Ban className="h-4 w-4 mr-2" />
                                        Block User
                                      </Button>
                                    )}
                                  </>
                                )}
                                {app.status !== 'pending' && (
                                  <div className="text-center py-2">
                                    <span className="text-sm text-gray-500">
                                      Status: {app.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
      case 'history':
      case 'alerts':
      case 'settings':
        return (
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  {activeTab === 'analytics' ? 'Analytics Dashboard' :
                   activeTab === 'history' ? 'Application History' :
                   activeTab === 'alerts' ? 'Security Alerts' : 'System Settings'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {activeTab === 'analytics' ? 'Comprehensive fraud detection analytics' :
                   activeTab === 'history' ? 'Complete history of all processed applications' :
                   activeTab === 'alerts' ? 'Real-time fraud detection alerts and notifications' :
                   'Configure fraud detection parameters and system preferences'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  {activeTab === 'analytics' && <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                  {activeTab === 'history' && <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                  {activeTab === 'alerts' && <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                  {activeTab === 'settings' && <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'analytics' ? 'Analytics Coming Soon' :
                     activeTab === 'history' ? 'History View' :
                     activeTab === 'alerts' ? 'No Active Alerts' : 'Settings Panel'}
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'analytics' ? 'Advanced analytics and reporting features will be available here.' :
                     activeTab === 'history' ? 'Detailed application history and audit trails will be shown here.' :
                     activeTab === 'alerts' ? 'All systems are running normally. Alerts will appear here when detected.' :
                     'System configuration options will be available here.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FraudShield...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          transition-all duration-300 ease-in-out
          ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
          border-r h-screen sticky top-0 z-50 flex flex-col
        `}>
          <div className="flex-1 flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 min-h-[60px]">
              <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center w-full'} transition-all duration-300`}>
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg flex-shrink-0">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                {sidebarOpen && (
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-bold text-gray-900 truncate">FraudShield</h1>
                    <p className="text-xs text-blue-600 font-semibold">Enterprise Pro</p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-gray-100 flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Toggle button when collapsed */}
            {!sidebarOpen && (
              <div className="absolute top-4 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-gray-100 p-1.5"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
            {[
            { id: 'home', label: 'Applications', icon: Home, badge: stats.pending || null },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
            { id: 'history', label: 'History', icon: History, badge: null },
            { id: 'alerts', label: 'Alerts', icon: Bell, badge: stats.highRisk || null },
            { id: 'settings', label: 'Settings', icon: Settings, badge: null }
            ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className={`
                    w-full transition-all duration-200 min-h-[48px]
                    ${sidebarOpen ? 'justify-start px-3' : 'justify-center px-2'}
                    ${activeTab === item.id 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 bg-red-500 text-white text-xs flex-shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Button>
              ))}
            </nav>

            {/* User Section */}
            <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Theme Toggle */}
              <div className="flex items-center justify-between mb-4">
                {sidebarOpen && (
                  <span className="text-sm font-medium text-gray-600">Theme</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`hover:bg-gray-100 ${!sidebarOpen ? 'w-full' : ''}`}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>

              {/* User Profile */}
              {sidebarOpen && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">System Admin</p>
                      <p className="text-xs text-gray-500 truncate">admin@fraudshield.com</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-3 w-3 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
              
              {/* Collapsed user avatar */}
              {!sidebarOpen && (
                <div className="flex justify-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="p-6 w-full min-h-screen">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {activeTab === 'home' ? 'Fraud Detection Dashboard' : 
                     activeTab === 'history' ? 'Application History' : 
                     activeTab === 'analytics' ? 'Analytics Dashboard' :
                     activeTab === 'alerts' ? 'Security Alerts' : 'System Settings'}
                  </h1>
                  <p className="text-base text-gray-600">
                    {activeTab === 'home' ? 'Monitor and manage user applications with comprehensive fraud analysis' :
                     activeTab === 'history' ? 'View complete history of all processed applications' : 
                     activeTab === 'analytics' ? 'Advanced analytics and fraud detection insights' :
                     activeTab === 'alerts' ? 'Real-time security alerts and threat notifications' :
                     'Configure system settings and fraud detection parameters'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 bg-green-100 text-green-800 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    System Operational
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentTime.toLocaleTimeString()}
                  </span>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}