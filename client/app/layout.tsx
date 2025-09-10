import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FraudShield - Secure Onboarding Platform',
  description: 'Prevent fraud during user onboarding with Nokia Network-as-Code APIs. Number verification, SIM swap detection, KYC matching, and scam signal detection.',
  keywords: 'fraud detection, fintech security, KYC verification, Nokia Network APIs, user onboarding',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}