import Link from 'next/link';
import { Shield, Twitter, Linkedin, Github, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Stay Updated with FraudShield</h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates on fraud prevention, security insights, and product announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Shield className="h-10 w-10 text-blue-400" />
                <div className="absolute inset-0 bg-blue-400/20 blur-xl"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FraudShield
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              India's first real-time fraud prevention platform powered by Nokia Network-as-Code APIs. 
              Protecting millions of users across Tier-2 and Tier-3 banking markets.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>contact@fraudshield.in</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/kyc/verify" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span>KYC Verification</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span>Analytics Dashboard</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span>Risk Assessment</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">API Documentation</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">SDK & Libraries</span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">About Us</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Careers</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Press Kit</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Partner Program</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Contact Sales</span>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal & Support</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Security</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Compliance</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Help Center</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Status Page</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2025 FraudShield Technologies Pvt. Ltd. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                All systems operational
              </span>
              <span>|</span>
              <span>Built for Nokia Network APIs Hackathon 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}