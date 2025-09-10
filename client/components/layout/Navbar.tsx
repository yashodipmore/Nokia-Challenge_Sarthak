'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="absolute inset-0 bg-blue-600/20 blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FraudShield
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Solutions
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/kyc/verify" className="flex flex-col items-start">
                    <span className="font-medium">KYC Verification</span>
                    <span className="text-sm text-gray-500">Instant identity verification</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex flex-col items-start">
                    <span className="font-medium">Analytics Dashboard</span>
                    <span className="text-sm text-gray-500">Real-time fraud monitoring</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/results" className="flex flex-col items-start">
                    <span className="font-medium">Risk Assessment</span>
                    <span className="text-sm text-gray-500">AI-powered fraud detection</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Navigation Links */}
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </Link>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="relative"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                  isOpen ? 'rotate-45 top-3' : 'top-1'
                }`} />
                <span className={`absolute h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'top-3'
                }`} />
                <span className={`absolute h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                  isOpen ? '-rotate-45 top-3' : 'top-5'
                }`} />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-4 pt-2 pb-6 space-y-3 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          {/* Mobile Solutions */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3">
              Solutions
            </div>
            <Link
              href="/kyc/verify"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              KYC Verification
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Analytics Dashboard
            </Link>
            <Link
              href="/results"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Risk Assessment
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="pt-4 space-y-3 border-t border-gray-200">
            <Link href="/auth/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-center font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}