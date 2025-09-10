import Link from 'next/link';
import { Shield, CheckCircle, AlertTriangle, Users, Globe, ArrowRight, Star, TrendingUp, Lock, Zap, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative py-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                Powered by Nokia Network-as-Code APIs
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              Fraud<span className="text-yellow-400">Shield</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-2xl md:text-3xl text-white/90 mb-6 font-light">
              India's First Real-Time Fraud Prevention Platform
            </p>
            
            {/* Description */}
            <p className="text-lg text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Protect your fintech platform with AI-powered fraud detection using Nokia's Network-as-Code APIs. 
              Verify users instantly, prevent fraudulent onboarding, and secure your business with enterprise-grade protection.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 font-semibold shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kyc/verify">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4 backdrop-blur-sm"
                >
                  Live Demo
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm">5.0 Customer Rating</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">99.9% Fraud Detection Rate</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">
              Nokia Network APIs
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Fraud Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge Nokia Network APIs to secure your user onboarding process with 
              real-time verification and fraud detection capabilities.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="mb-6 p-4 bg-green-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Number Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Instantly verify phone number ownership without SMS codes using network-level verification
                </p>
                <div className="mt-4 text-sm text-green-600 font-semibold">
                  &lt; 2 seconds verification
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="mb-6 p-4 bg-orange-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <AlertTriangle className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">SIM Swap Detection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Detect recent SIM card changes to prevent account takeover attacks and fraud attempts
                </p>
                <div className="mt-4 text-sm text-orange-600 font-semibold">
                  Real-time monitoring
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="mb-6 p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">KYC Match</h3>
                <p className="text-gray-600 leading-relaxed">
                  Verify customer identity against official records with advanced matching algorithms
                </p>
                <div className="mt-4 text-sm text-blue-600 font-semibold">
                  99.5% accuracy rate
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="mb-6 p-4 bg-red-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Globe className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Scam Signal</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time detection of phones involved in fraudulent activities and scam networks
                </p>
                <div className="mt-4 text-sm text-red-600 font-semibold">
                  Live threat intelligence
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Leading Financial Institutions
            </h2>
            <p className="text-xl text-white/90">
              Protecting millions of customers across India
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
              <div className="text-5xl md:text-6xl font-bold mb-3 text-yellow-400">99.9%</div>
              <div className="text-lg text-white/90 mb-2">Fraud Detection Rate</div>
              <div className="text-sm text-white/70">Industry leading accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
              <div className="text-5xl md:text-6xl font-bold mb-3 text-yellow-400">&lt;2s</div>
              <div className="text-lg text-white/90 mb-2">Verification Speed</div>
              <div className="text-sm text-white/70">Lightning fast processing</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
              <div className="text-5xl md:text-6xl font-bold mb-3 text-yellow-400">50M+</div>
              <div className="text-lg text-white/90 mb-2">Protected Users</div>
              <div className="text-sm text-white/70">Secure verifications daily</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
              <div className="text-5xl md:text-6xl font-bold mb-3 text-yellow-400">₹1000Cr+</div>
              <div className="text-lg text-white/90 mb-2">Fraud Prevented</div>
              <div className="text-sm text-white/70">Losses avoided annually</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
                Why FraudShield?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Built for India's <span className="text-purple-600">Growing Economy</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Specifically designed for Tier-2 and Tier-3 banking markets, FraudShield addresses 
                the unique challenges of rapid digital adoption and increasing fraud threats.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Verification</h3>
                    <p className="text-gray-600">No more waiting for OTP codes. Verify users in real-time using network intelligence.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-grade security with end-to-end encryption and compliance with Indian regulations.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                    <p className="text-gray-600">Comprehensive dashboard with actionable insights and fraud pattern analysis.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Content - Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
                <div className="text-sm text-gray-600">Faster than traditional KYC</div>
              </Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Reduction in fraud losses</div>
              </Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Real-time monitoring</div>
              </Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <div className="text-3xl font-bold text-orange-600 mb-2">API</div>
                <div className="text-sm text-gray-600">Easy integration</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Secure Your Platform?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join leading fintechs and banks who trust FraudShield to protect their customers. 
            Get started with our free trial and see the difference in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-4 font-semibold">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/kyc/verify">
              <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-4">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}