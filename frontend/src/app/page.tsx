"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Bug, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Code, 
  History, 
  CheckCircle2,
  Share2,
  Play
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Bug size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Bug Decoder</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-purple-400 transition-colors">Log in</Link>
            <Link 
              href="/dashboard" 
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-purple-50 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center mb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
              AI-Powered Debugging for everyone
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Fix your code <br />
              <span className="gradient-text">at light speed.</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Detect errors, understand logic bugs, and fix syntax in seconds. 
              The intelligent coding mentor that supports 10+ languages.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all group active:scale-95"
              >
                Start Debugging Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
        </div>

        {/* Features Section */}
        <section id="features" className="py-24 border-t border-white/5 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to debug</h2>
            <p className="text-gray-400">Professional tools designed for students and developers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap size={24} className="text-yellow-400" />}
              title="Instant OCR"
              description="Upload a screenshot of your error and let our AI extract and analyze the code automatically."
            />
            <FeatureCard 
              icon={<Cpu size={24} className="text-blue-400" />}
              title="Deep Logic Check"
              description="Beyond syntax. We find logical flaws and provide step-by-step explanations for beginners."
            />
            <FeatureCard 
              icon={<ShieldCheck size={24} className="text-green-400" />}
              title="Multi-Language Support"
              description="From Python and C++ to Java and SQL. One platform for all your debugging needs."
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 border-t border-white/5 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400">Debugging made simple in three steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              num="01"
              icon={<Code size={24} />}
              title="Input Code"
              description="Paste your code or upload a screenshot of your terminal/IDE."
            />
            <StepCard 
              num="02"
              icon={<Search size={24} />}
              title="Analyze"
              description="Our AI and Judge0 execution engine identify the exact cause of the issue."
            />
            <StepCard 
              num="03"
              icon={<History size={24} />}
              title="Fix & Save"
              description="Get a corrected version and save it to your history for future reference."
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 border-t border-white/5 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass p-10 border border-white/10">
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-bold mb-6">$0 <span className="text-sm font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-10 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> 5 AI Scans per day</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Basic OCR Support</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> 3 Languages support</li>
              </ul>
              <Link href="/dashboard" className="block text-center py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all font-bold">Start Free</Link>
            </div>
            <div className="glass p-10 border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold mb-6">$9 <span className="text-sm font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-10 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Unlimited AI Scans</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Advanced Logic Analysis</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> All 10+ Languages</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Download PDF Reports</li>
              </ul>
              <Link href="/dashboard" className="block text-center py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all font-bold">Go Pro</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d0d0f] border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Bug size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Bug Decoder</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              Making debugging easy for the next generation of developers. 
              Powered by Gemini and Judge0.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Code size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Share2 size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Play size={20} /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Status</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
          © 2026 Bug Decoder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 hover:border-white/20 transition-all group"
    >
      <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

function StepCard({ num, icon, title, description }: { num: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="text-5xl font-black text-white/5 absolute -top-8 -left-4 z-0">{num}</div>
      <div className="relative z-10">
        <div className="text-purple-500 mb-6">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
