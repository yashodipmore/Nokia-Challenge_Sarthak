'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, History, Settings, Bell, Shield, AlertTriangle, 
  CheckCircle, Moon, Sun, Menu, X, BarChart3, Users, Activity,
  Download, Search, Plus, RefreshCw, Eye, MoreHorizontal,
  Clock, Phone, Mail, MapPin, Building, CreditCard,
  UserCheck, UserX, AlertCircle, Calendar, Filter,
  LogOut, User, HelpCircle, FileText, Ban, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

// TypeScript interfaces
interface UserApplication {
  applicationId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  aadhaarNumber: string;
  panNumber: string;
  applicationType: string;
  applicationAmount: string;
  monthlyIncome: string;
  employmentType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  verificationStatus: {
    identity: boolean;
    address: boolean;
    income: boolean;
    documents: boolean;
  };
  city: string;
  state: string;
  companyName: string;
  creditScore: string;
  currentAddress: string;
  bankName: string;
  purpose: string;
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

  // Generate fraud analysis for applications
  const generateFraudAnalysis = (app: any): UserApplication => {
    const fraudScore = Math.floor(Math.random() * 100);
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (fraudScore >= 80) riskLevel = 'critical';
    else if (fraudScore >= 60) riskLevel = 'high';
    else if (fraudScore >= 30) riskLevel = 'medium';
    
    return {
      ...app,
      fraudScore,
      riskLevel,
      verificationStatus: {
        identity: Math.random() > 0.2,
        address: Math.random() > 0.3,
        income: Math.random() > 0.4,
        documents: Math.random() > 0.1
      }
    };
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
        'Aadhaar': app.aadhaarNumber,
        'PAN': app.panNumber,
        'Application Type': app.applicationType,
        'Amount': app.applicationAmount,
        'Monthly Income': app.monthlyIncome,
        'Employment': app.employmentType,
        'City': app.city,
        'State': app.state,
        'Company': app.companyName,
        'Credit Score': app.creditScore,
        'Status': app.status,
        'Fraud Score': app.fraudScore,
        'Risk Level': app.riskLevel,
        'Identity Verified': app.verificationStatus.identity ? 'Yes' : 'No',
        'Address Verified': app.verificationStatus.address ? 'Yes' : 'No',
        'Income Verified': app.verificationStatus.income ? 'Yes' : 'No',
        'Documents Verified': app.verificationStatus.documents ? 'Yes' : 'No',
        'Purpose': app.purpose,
        'Bank Name': app.bankName,
        'Address': app.currentAddress,
        'Submitted Date': new Date(app.submittedAt).toLocaleDateString()
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

  const handleRefresh = () => {
    const storedApplications = JSON.parse(localStorage.getItem('fraudDetectionApplications') || '[]');
    const analyzedApplications = storedApplications.map(generateFraudAnalysis);
    setApplications(analyzedApplications);
    toast({
      title: "Data Refreshed",
      description: "Latest application data loaded.",
    });
  };

  const handleApproveApplication = (appId: string) => {
    setApplications(prev => prev.map(app => 
      app.applicationId === appId ? { ...app, status: 'approved' as const } : app
    ));
    toast({
      title: "Application Approved",
      description: "User has been verified and approved.",
    });
  };

  const handleRejectApplication = (appId: string) => {
    setApplications(prev => prev.map(app => 
      app.applicationId === appId ? { ...app, status: 'rejected' as const } : app
    ));
    toast({
      title: "Application Rejected",
      description: "User has been flagged and rejected.",
    });
  };

  const handleBlockUser = (appId: string) => {
    setApplications(prev => prev.map(app => 
      app.applicationId === appId ? { ...app, status: 'rejected' as const } : app
    ));
    toast({
      title: "User Blocked",
      description: "User account has been blocked for fraudulent activity.",
      variant: "destructive"
    });
  };

  // Filter applications
  useEffect(() => {
    let filtered = applications;
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phoneNumber.includes(searchTerm) ||
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // Generate mock applications for testing
    const mockApplications = [
      {
        applicationId: `APP${Date.now() - 86400000}`,
        fullName: 'Rajesh Kumar Sharma',
        email: 'rajesh.sharma@gmail.com',
        phoneNumber: '+91 9876543210',
        alternatePhone: '+91 8765432109',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        aadhaarNumber: '1234 5678 9012',
        panNumber: 'ABCDE1234F',
        currentAddress: '123, MG Road, Sector 14, Gurgaon, Haryana',
        permanentAddress: '456, Village Khandsa, Gurgaon, Haryana',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001',
        applicationType: 'personal_loan',
        applicationAmount: '500000',
        purpose: 'Home renovation and furniture purchase',
        employmentType: 'salaried',
        companyName: 'Infosys Technologies Ltd',
        designation: 'Senior Software Engineer',
        monthlyIncome: '85000',
        workExperience: '8',
        bankAccountNumber: '1234567890123456',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        existingLoans: 'Car loan EMI: Rs 15,000/month',
        creditScore: '750',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending'
      },
      {
        applicationId: `APP${Date.now() - 172800000}`,
        fullName: 'Priya Patel',
        email: 'priya.patel@yahoo.com',
        phoneNumber: '+91 9123456789',
        alternatePhone: '',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        aadhaarNumber: '2345 6789 0123',
        panNumber: 'FGHIJ5678K',
        currentAddress: '789, Satellite Road, Ahmedabad, Gujarat',
        permanentAddress: '789, Satellite Road, Ahmedabad, Gujarat',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        applicationType: 'business_loan',
        applicationAmount: '1200000',
        purpose: 'Expanding textile business and purchasing new machinery',
        employmentType: 'business_owner',
        companyName: 'Patel Textiles Pvt Ltd',
        designation: 'Managing Director',
        monthlyIncome: '150000',
        workExperience: '5',
        bankAccountNumber: '2345678901234567',
        ifscCode: 'ICIC0002345',
        bankName: 'ICICI Bank',
        existingLoans: 'Business loan: Rs 25,000/month, Credit card outstanding: Rs 50,000',
        creditScore: '680',
        submittedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'pending'
      },
      {
        applicationId: `APP${Date.now() - 259200000}`,
        fullName: 'Mohammad Ali Khan',
        email: 'ali.khan@hotmail.com',
        phoneNumber: '+91 8987654321',
        alternatePhone: '+91 7876543210',
        dateOfBirth: '1982-11-08',
        gender: 'male',
        aadhaarNumber: '3456 7890 1234',
        panNumber: 'KLMNO9012P',
        currentAddress: '456, Old City, Hyderabad, Telangana',
        permanentAddress: '789, Charminar Area, Hyderabad, Telangana',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500002',
        applicationType: 'home_loan',
        applicationAmount: '2500000',
        purpose: 'Purchase of 2BHK apartment in Gachibowli area',
        employmentType: 'self_employed',
        companyName: 'Khan Motors',
        designation: 'Proprietor',
        monthlyIncome: '120000',
        workExperience: '12',
        bankAccountNumber: '3456789012345678',
        ifscCode: 'SBIN0003456',
        bankName: 'State Bank of India',
        existingLoans: 'No existing loans',
        creditScore: '720',
        submittedAt: new Date(Date.now() - 259200000).toISOString(),
        status: 'approved'
      },
      {
        applicationId: `APP${Date.now() - 345600000}`,
        fullName: 'Sneha Reddy',
        email: 'sneha.reddy@gmail.com',
        phoneNumber: '+91 7654321098',
        alternatePhone: '',
        dateOfBirth: '1995-01-30',
        gender: 'female',
        aadhaarNumber: '4567 8901 2345',
        panNumber: 'PQRST3456U',
        currentAddress: '321, Brigade Road, Bangalore, Karnataka',
        permanentAddress: '654, Koramangala, Bangalore, Karnataka',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        applicationType: 'credit_card',
        applicationAmount: '200000',
        purpose: 'Premium credit card for international travel and shopping',
        employmentType: 'salaried',
        companyName: 'Wipro Limited',
        designation: 'Technical Lead',
        monthlyIncome: '95000',
        workExperience: '6',
        bankAccountNumber: '4567890123456789',
        ifscCode: 'AXIS0004567',
        bankName: 'Axis Bank',
        existingLoans: 'Education loan: Rs 8,000/month',
        creditScore: '780',
        submittedAt: new Date(Date.now() - 345600000).toISOString(),
        status: 'rejected'
      }
    ];
    
    // Load applications from localStorage or use mock data
    const storedApplications = JSON.parse(localStorage.getItem('fraudDetectionApplications') || '[]');
    let applicationsToUse = storedApplications.length > 0 ? storedApplications : mockApplications;
    
    // Store mock data if none exists
    if (storedApplications.length === 0) {
      localStorage.setItem('fraudDetectionApplications', JSON.stringify(mockApplications));
    }
    
    const analyzedApplications = applicationsToUse.map(generateFraudAnalysis);
    setApplications(analyzedApplications);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

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
                      <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
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
                      <p className="text-2xl font-bold text-green-600">
                        {applications.filter(app => app.status === 'approved').length}
                      </p>
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
                      <p className="text-2xl font-bold text-red-600">
                        {applications.filter(app => app.riskLevel === 'high' || app.riskLevel === 'critical').length}
                      </p>
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
                      <p className="text-2xl font-bold text-yellow-600">
                        {applications.filter(app => app.status === 'pending').length}
                      </p>
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
                      <SelectItem value="under_review">Under Review</SelectItem>
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
                  {filteredApplications.length === 0 ? (
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
                                    <span className="text-gray-600">{app.city}, {app.state}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">{app.applicationType} - ₹{app.applicationAmount}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">Aadhaar: {app.aadhaarNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">{formatDate(app.submittedAt)}</span>
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
                                <div className="text-xs text-gray-500">Employment: {app.employmentType}</div>
                                <div className="text-xs text-gray-500">Income: ₹{app.monthlyIncome}/month</div>
                                <div className="text-xs text-gray-500">Company: {app.companyName || 'Not specified'}</div>
                                <div className="text-xs text-gray-500">Credit Score: {app.creditScore || 'Not available'}</div>
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
                { id: 'home', label: 'Applications', icon: Home, badge: applications.filter(app => app.status === 'pending').length || null },
                { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
                { id: 'history', label: 'History', icon: History, badge: null },
                { id: 'alerts', label: 'Alerts', icon: Bell, badge: applications.filter(app => app.riskLevel === 'critical').length || null },
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