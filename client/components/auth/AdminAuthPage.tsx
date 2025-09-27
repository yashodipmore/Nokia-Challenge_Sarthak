'use client';

import { useState } from 'react';
import AdminLogin from '@/components/auth/AdminLogin';
import SuperAdminSetup from '@/components/auth/SuperAdminSetup';

export default function AdminAuthPage() {
  const [showSuperAdminSetup, setShowSuperAdminSetup] = useState(false);

  if (showSuperAdminSetup) {
    return (
      <SuperAdminSetup 
        onBackToLogin={() => setShowSuperAdminSetup(false)} 
      />
    );
  }

  return (
    <AdminLogin 
      onSuperAdminSetup={() => setShowSuperAdminSetup(true)} 
    />
  );
}