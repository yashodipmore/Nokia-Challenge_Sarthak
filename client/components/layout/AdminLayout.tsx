'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  Shield,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string;
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: 'view_reports'
  },
  {
    title: 'Applications',
    href: '/admin/applications',
    icon: FileText,
    permission: 'view_applications'
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: 'manage_users'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'system_settings'
  }
];

function Sidebar({ className }: { className?: string }) {
  const router = useRouter();
  const { admin, logout, hasPermission } = useAdminAuth();
  const [currentPath, setCurrentPath] = useState('/admin/dashboard');

  const handleNavigation = (href: string) => {
    setCurrentPath(href);
    router.push(href);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'senior_admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'loan_officer':
        return 'bg-green-100 text-green-800';
      case 'risk_analyst':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-white border-r', className)}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Nokia Admin</h2>
            <p className="text-xs text-gray-500">Loan Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const hasAccess = !item.permission || hasPermission(item.permission);
            
            if (!hasAccess) return null;

            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-10',
                    isActive && 'bg-blue-50 text-blue-700 border-blue-200'
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.title}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Profile */}
      {admin && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(admin.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <Badge className={getRoleBadgeColor(admin.role)}>
              {admin.role.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {admin.department}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}

function Header() {
  const { admin } = useAdminAuth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 lg:hidden">
      <div className="flex items-center space-x-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold">Nokia Admin</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        {admin && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {admin.fullName
                  .split(' ')
                  .map(part => part.charAt(0))
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
                }
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">{admin.fullName}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoading, isAuthenticated } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-shrink-0">
        <Sidebar className="w-full" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}