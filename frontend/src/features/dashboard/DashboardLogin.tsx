import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Square, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { loginAdmin } from '@/services/api';
import { COMPANY_INFO } from '@/constants/company';

interface DashboardLoginProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export const DashboardLogin: React.FC<DashboardLoginProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('admin@srisenthoorgranites.com');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin@srisenthoorgranites.com');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-gray-900 font-sans overflow-hidden selection:bg-black selection:text-white">
      {/* 1. Left Column - Luxury Stone Showcase Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-black text-white">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Sri Senthoor Granites Showroom"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Top Logo & Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Square className="w-6 h-6 fill-current text-white stroke-none" />
            <div className="flex flex-col">
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                Sri Senthoor Granites
              </span>
            </div>
          </div>
        </div>

        {/* Center Slogan & Quote */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <h2 className="font-sans text-4xl sm:text-5xl font-bold leading-tight text-white">
            "{COMPANY_INFO.slogan}"
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed font-sans font-light">
            Manage natural quarry granites, large-format vitrified slabs, authentic Cuddapah Kadappa stone, sanitaryware, and bath fitting pricing in real-time.
          </p>
        </div>
      </div>

      {/* 2. Right Column - Clean Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-8 relative z-10"
        >
          {/* Header Mobile Brand & Title */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2.5 mb-4">
              <Square className="w-6 h-6 fill-current text-black stroke-none" />
              <span className="font-sans text-xl font-bold tracking-tight text-black">Sri Senthoor Granites</span>
            </div>
            <h1 className="font-sans text-3xl font-bold text-gray-900 tracking-tight">Admin Sign In</h1>
            <p className="text-xs text-gray-600 font-sans">
              Enter your founder credentials to manage products, categories, users, and audit logs.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-black" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all text-sm font-sans"
                placeholder="admin@srisenthoorgranites.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-black" /> Password
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-gray-500 hover:text-black font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pr-11 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all text-sm font-sans"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Credentials Helper Badge */}
            <div
              onClick={handleFillCredentials}
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-black cursor-pointer transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span className="text-gray-700 font-medium">Auto-fill Default Admin Credentials</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-black group-hover:underline">Fill</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-4 border-t border-gray-200 text-center space-y-1">
            <p className="text-[11px] text-gray-500">
              Sri Senthoor Granites Management System
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
