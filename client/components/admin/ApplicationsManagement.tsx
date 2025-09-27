'use client';

import { useEffect, useState } from 'react';
import { adminAPI, LoanApplication, ApplicationFilters } from '@/lib/api/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationDetailsProps {
  application: LoanApplication;
  onStatusUpdate: (applicationId: string, status: 'approved' | 'rejected', data: any) => Promise<void>;
}

function ApplicationDetails({ application, onStatusUpdate }: ApplicationDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusData, setStatusData] = useState({
    decision: 'approved' as 'approved' | 'rejected',
    reason: '',
    approvedAmount: application.loanAmount,
    comments: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(application._id, statusData.decision, statusData);
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details - {application.applicationId}</DialogTitle>
          <DialogDescription>
            Complete application information and review actions
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          {/* Status and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {application.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                  {application.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {application.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                  <Badge className={
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {application.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Applied: {formatDate(application.createdAt)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Loan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">{formatCurrency(application.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-semibold capitalize">{application.loanType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purpose:</span>
                    <span className="font-semibold">{application.purpose}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="mt-1">{application.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <p className="mt-1">{formatDate(application.dateOfBirth)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="mt-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {application.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="mt-1 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {application.phoneNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Monthly Income</Label>
                  <p className="mt-1">{formatCurrency(application.monthlyIncome)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {application.address.street}, {application.address.city}, 
                {application.address.state} - {application.address.pincode}, 
                {application.address.country}
              </p>
            </CardContent>
          </Card>

          {/* Review Section - Only show if pending */}
          {application.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="decision">Decision</Label>
                    <Select value={statusData.decision} onValueChange={(value: 'approved' | 'rejected') => 
                      setStatusData(prev => ({ ...prev, decision: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {statusData.decision === 'approved' && (
                    <div>
                      <Label htmlFor="approvedAmount">Approved Amount</Label>
                      <Input
                        id="approvedAmount"
                        type="number"
                        value={statusData.approvedAmount}
                        onChange={(e) => setStatusData(prev => ({ 
                          ...prev, 
                          approvedAmount: parseFloat(e.target.value) || 0 
                        }))}
                        max={application.loanAmount}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={statusData.reason}
                    onChange={(e) => setStatusData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter reason for decision"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    value={statusData.comments}
                    onChange={(e) => setStatusData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Any additional comments or notes"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleStatusUpdate} 
                  disabled={isUpdating || !statusData.reason}
                  className="w-full"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `${statusData.decision === 'approved' ? 'Approve' : 'Reject'} Application`
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Review History - Show if already reviewed */}
          {application.status !== 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Reviewed At:</span>
                    <span>{application.reviewedAt ? formatDate(application.reviewedAt) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reviewed By:</span>
                    <span>{application.reviewedBy || 'System'}</span>
                  </div>
                  {application.reason && (
                    <div>
                      <span className="font-medium">Reason:</span>
                      <p className="mt-1 text-gray-600">{application.reason}</p>
                    </div>
                  )}
                  {application.comments && (
                    <div>
                      <span className="font-medium">Comments:</span>
                      <p className="mt-1 text-gray-600">{application.comments}</p>
                    </div>
                  )}
                  {application.approvedAmount && application.status === 'approved' && (
                    <div className="flex justify-between">
                      <span>Approved Amount:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(application.approvedAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    limit: 10,
    status: 'all',
    search: ''
  });
  
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const queryFilters = { ...filters };
      if (queryFilters.status === 'all') {
        delete queryFilters.status;
      }
      
      const response = await adminAPI.applications.getAllApplications(queryFilters);
      
      if (response.success && response.data) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast({
        title: "Error Loading Applications",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const handleStatusUpdate = async (
    applicationId: string, 
    decision: 'approved' | 'rejected', 
    data: any
  ) => {
    try {
      const response = await adminAPI.applications.updateApplicationStatus(applicationId, data);
      
      if (response.success) {
        toast({
          title: "Application Updated",
          description: `Application ${decision} successfully`,
        });
        
        // Refresh applications list
        fetchApplications();
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw to handle in component
    }
  };

  const handleFilterChange = (key: keyof ApplicationFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) // Reset to first page when filtering
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications Management</h1>
        <p className="text-muted-foreground">
          Review and manage loan applications
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or application ID..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.limit?.toString() || '10'} 
              onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({pagination.total})</CardTitle>
          <CardDescription>
            Page {pagination.current} of {pagination.pages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.fullName}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">{application.applicationId}</code>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(application.loanAmount)}
                      </TableCell>
                      <TableCell className="capitalize">{application.loanType}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(application.status)}
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(application.createdAt)}</TableCell>
                      <TableCell>
                        <ApplicationDetails 
                          application={application}
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', Math.max(1, pagination.current - 1))}
            disabled={pagination.current <= 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = Math.max(1, Math.min(pagination.pages - 4, pagination.current - 2)) + i;
            return (
              <Button
                key={page}
                variant={page === pagination.current ? "default" : "outline"}
                onClick={() => handleFilterChange('page', page)}
              >
                {page}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', Math.min(pagination.pages, pagination.current + 1))}
            disabled={pagination.current >= pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}