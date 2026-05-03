"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bug, ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="absolute top-0 left-0 w-full h-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-10 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="bg-purple-600 p-3 rounded-2xl mb-6">
            <Bug size={32} />
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Enter your credentials to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:bg-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] text-purple-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:bg-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-purple-900/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-400 font-bold hover:underline">Sign up for free</Link>
        </div>
      </motion.div>
    </div>
  );
}
