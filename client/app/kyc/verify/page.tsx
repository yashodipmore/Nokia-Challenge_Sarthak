'use client';

import { useState } from 'react';
import { Upload, Loader2, Shield, FileText, Phone, User, Mail, CreditCard, Building, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function KYCVerify() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File | null}>({
    aadhaar: null,
    pan: null,
    address: null,
    income: null
  });
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phoneNumber: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: '',
    
    // Identity Documents
    aadhaarNumber: '',
    panNumber: '',
    
    // Address Information
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    
    // Application Details
    applicationType: 'loan',
    applicationAmount: '',
    purpose: '',
    
    // Employment Details
    employmentType: '',
    companyName: '',
    designation: '',
    monthlyIncome: '',
    workExperience: '',
    
    // Financial Information
    bankAccountNumber: '',
    ifscCode: '',
    bankName: '',
    existingLoans: '',
    creditScore: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create comprehensive application data
      const applicationData = {
        ...formData,
        documents: Object.keys(selectedFiles).filter(key => selectedFiles[key] !== null),
        applicationId: `APP${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Store in localStorage for demo
      const existingApplications = JSON.parse(localStorage.getItem('fraudDetectionApplications') || '[]');
      existingApplications.push(applicationData);
      localStorage.setItem('fraudDetectionApplications', JSON.stringify(existingApplications));

      toast({
        title: "Application Submitted Successfully!",
        description: `Your application ID is ${applicationData.applicationId}. Admin will review and verify your details.`,
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        alternatePhone: '',
        dateOfBirth: '',
        gender: '',
        aadhaarNumber: '',
        panNumber: '',
        currentAddress: '',
        permanentAddress: '',
        city: '',
        state: '',
        pincode: '',
        applicationType: 'loan',
        applicationAmount: '',
        purpose: '',
        employmentType: '',
        companyName: '',
        designation: '',
        monthlyIncome: '',
        workExperience: '',
        bankAccountNumber: '',
        ifscCode: '',
        bankName: '',
        existingLoans: '',
        creditScore: ''
      });
      setSelectedFiles({ aadhaar: null, pan: null, address: null, income: null });

    } catch (error) {
      console.error('Application submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadSection = ({ type, label, icon: Icon }: { type: string, label: string, icon: any }) => (
    <div>
      <Label htmlFor={type} className="flex items-center mb-2">
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <label
            htmlFor={type}
            className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
          >
            Choose file
            <input
              id={type}
              type="file"
              className="sr-only"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(type, e)}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 5MB</p>
          {selectedFiles[type] && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {selectedFiles[type]?.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fraud Detection Verification</h1>
          <p className="text-lg text-gray-600">
            Complete your application with accurate information for comprehensive fraud analysis
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-2xl">
              <FileText className="h-6 w-6 mr-3" />
              Application Form
            </CardTitle>
            <CardDescription className="text-base">
              Fill in all required information for comprehensive verification
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmitApplication} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Mobile Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      name="alternatePhone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Identity Documents */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Identity Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentAddress">Current Address *</Label>
                    <Textarea
                      id="currentAddress"
                      name="currentAddress"
                      placeholder="Enter your current address"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea
                      id="permanentAddress"
                      name="permanentAddress"
                      placeholder="Enter your permanent address"
                      value={formData.permanentAddress}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="123456"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Application Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicationType">Application Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange('applicationType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal_loan">Personal Loan</SelectItem>
                        <SelectItem value="home_loan">Home Loan</SelectItem>
                        <SelectItem value="business_loan">Business Loan</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="banking_account">Banking Account</SelectItem>
                        <SelectItem value="investment_account">Investment Account</SelectItem>
                        <SelectItem value="insurance_policy">Insurance Policy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="applicationAmount">Application Amount *</Label>
                    <Input
                      id="applicationAmount"
                      name="applicationAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.applicationAmount}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="purpose">Purpose/Description *</Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      placeholder="Describe the purpose of your application"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Employment Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">Employment Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange('employmentType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self_employed">Self Employed</SelectItem>
                        <SelectItem value="business_owner">Business Owner</SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company/Business Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation/Role</Label>
                    <Input
                      id="designation"
                      name="designation"
                      placeholder="Your designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                    <Input
                      id="monthlyIncome"
                      name="monthlyIncome"
                      type="number"
                      placeholder="Monthly income"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workExperience">Work Experience (Years)</Label>
                    <Input
                      id="workExperience"
                      name="workExperience"
                      type="number"
                      placeholder="Years of experience"
                      value={formData.workExperience}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Financial Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                    <Input
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      placeholder="Account number"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      name="ifscCode"
                      placeholder="IFSC Code"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      placeholder="Bank name"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditScore">Credit Score (if known)</Label>
                    <Input
                      id="creditScore"
                      name="creditScore"
                      type="number"
                      placeholder="Credit score"
                      value={formData.creditScore}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="existingLoans">Existing Loans/EMIs</Label>
                    <Textarea
                      id="existingLoans"
                      name="existingLoans"
                      placeholder="Details of existing loans, EMIs, credit cards"
                      value={formData.existingLoans}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Document Upload</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUploadSection type="aadhaar" label="Aadhaar Card *" icon={CreditCard} />
                  <FileUploadSection type="pan" label="PAN Card *" icon={CreditCard} />
                  <FileUploadSection type="address" label="Address Proof" icon={MapPin} />
                  <FileUploadSection type="income" label="Income Proof" icon={Building} />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application for Verification'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}