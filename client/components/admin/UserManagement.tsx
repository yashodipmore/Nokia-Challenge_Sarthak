'use client';

import { useEffect, useState } from 'react';
import { adminAPI, User, PaginationParams } from '@/lib/api/admin';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Users,
  Eye,
  UserPlus,
  Mail,
  Calendar,
  FileText,
  Loader2,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    search: ''
  });
  
  const { hasRole } = useAdminAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.users.getAllUsers(filters);
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast({
        title: "Error Loading Users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (key: keyof PaginationParams, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }));
  };

  const handleViewUserApplications = async (user: User) => {
    try {
      setIsLoadingUserDetails(true);
      setIsUserModalOpen(true);
      
      const response = await adminAPI.users.getUserDetails(user._id);
      if (response.success && response.data) {
        setSelectedUser(response.data.user);
      }
    } catch (error: any) {
      toast({
        title: "Error Loading User Details",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and view their applications</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({pagination.total})</CardTitle>
          <CardDescription>Page {pagination.current} of {pagination.pages}</CardDescription>
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
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-semibold">{user.stats?.totalApplications || 0}</div>
                        <div className="text-xs text-gray-500">total</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUserApplications(user)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Applications
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', Math.max(1, pagination.current - 1))}
            disabled={pagination.current <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', Math.min(pagination.pages, pagination.current + 1))}
            disabled={pagination.current >= pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* User Applications Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Applications
            </DialogTitle>
            <DialogDescription>
              {selectedUser ? `Applications for ${selectedUser.name}` : 'Loading user details...'}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingUserDetails ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              {/* User Info Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {selectedUser.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined {formatDate(selectedUser.createdAt)}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={selectedUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {selectedUser.isVerified ? 'Verified' : 'Pending Verification'}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Total Applications: {selectedUser.applications?.length || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              {selectedUser.applications && selectedUser.applications.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Applications ({selectedUser.applications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedUser.applications.map((application) => (
                        <div key={application._id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">#{application.applicationId}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {application.loanType} loan • {application.purpose}
                              </p>
                            </div>
                            <Badge className={
                              application.status === 'approved' ? 'bg-green-100 text-green-800' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {application.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Loan Amount</span>
                              <div className="flex items-center">
                                <IndianRupee className="h-3 w-3" />
                                {application.loanAmount.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Monthly Income</span>
                              <div className="flex items-center">
                                <IndianRupee className="h-3 w-3" />
                                {application.monthlyIncome.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Applied On</span>
                              <div>{formatDate(application.createdAt)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Contact</span>
                              <div>{application.phoneNumber}</div>
                            </div>
                          </div>
                          
                          {application.status !== 'pending' && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {application.reviewedAt && (
                                  <div>
                                    <span className="text-gray-500">Reviewed On</span>
                                    <div>{formatDate(application.reviewedAt)}</div>
                                  </div>
                                )}
                                {application.approvedAmount && (
                                  <div>
                                    <span className="text-gray-500">Approved Amount</span>
                                    <div className="flex items-center font-medium text-green-600">
                                      <IndianRupee className="h-3 w-3" />
                                      {application.approvedAmount.toLocaleString()}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {(application.reason || application.comments) && (
                                <div className="mt-2">
                                  <span className="text-gray-500">Notes</span>
                                  <p className="text-sm mt-1">
                                    {application.reason && <span className="font-medium">{application.reason}. </span>}
                                    {application.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No applications found</p>
                      <p className="text-sm">This user hasn't submitted any loan applications yet.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Failed to load user details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}