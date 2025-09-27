import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
title: 'Nokia Loan Management System',
description: 'Complete loan management system with fraud detection and Nokia Network-as-Code APIs integration.',
keywords: 'loan management, fraud detection, fintech security, KYC verification, Nokia Network APIs',
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body className={inter.className}>
<AdminAuthProvider>
{children}
<Toaster />
</AdminAuthProvider>
</body>
</html>
);
}