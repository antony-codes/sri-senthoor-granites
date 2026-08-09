import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck, Square } from 'lucide-react';
import { forgotPasswordApi } from '@/services/api';
import { COMPANY_INFO } from '@/constants/company';

interface DashboardForgotPasswordProps {
  onBackToLogin: () => void;
  onNavigateReset?: (url: string) => void;
}

export const DashboardForgotPassword: React.FC<DashboardForgotPasswordProps> = ({
  onBackToLogin,
  onNavigateReset,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [demoResetUrl, setDemoResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setDemoResetUrl('');
    setLoading(true);

    try {
      const res = await forgotPasswordApi(email);
      setSuccessMsg(res.message);
      if (res.resetUrl) {
        setDemoResetUrl(res.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-gray-900 font-sans overflow-hidden selection:bg-black selection:text-white">
      {/* Left Column - Showcase Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-black text-white">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Sri Senthoor Granites Showroom"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Square className="w-6 h-6 fill-current text-white stroke-none" />
            <div className="flex flex-col">
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                Sri Senthoor Granites
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-300 font-semibold">
                Account Recovery
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-gray-200 font-semibold">
            Est. {COMPANY_INFO.established} • Trichy
          </span>
        </div>

        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Password Recovery</span>
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl font-bold leading-tight text-white">
            Recover Access to Your Portal
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed font-sans font-light">
            Enter your registered admin or staff email address. We'll generate a time-limited password reset link to securely restore your dashboard account.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-gray-400 border-t border-white/15 pt-6">
          <span>© {new Date().getFullYear()} {COMPANY_INFO.name}</span>
          <span className="text-[11px] uppercase tracking-widest text-gray-300">Management Security</span>
        </div>
      </div>

      {/* Right Column - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6 relative z-10"
        >
          <div className="space-y-2">
            <button
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black font-semibold transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
            <h1 className="font-sans text-3xl font-bold text-gray-900 tracking-tight">Forgot Password?</h1>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              No worries. Enter your registered email address below to receive a secure reset link.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {successMsg ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-medium leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-green-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span>Reset Instructions Sent</span>
                </div>
                <p>{successMsg}</p>
              </div>

              {demoResetUrl && (
                <div className="p-4 rounded-2xl bg-gray-100 border border-gray-300 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                    Simulated Email Reset Link (Demo):
                  </span>
                  <a
                    href={demoResetUrl}
                    onClick={(e) => {
                      if (onNavigateReset) {
                        e.preventDefault();
                        onNavigateReset(demoResetUrl);
                      }
                    }}
                    className="text-xs font-sans font-bold text-black hover:underline block break-all"
                  >
                    {window.location.origin}{demoResetUrl}
                  </a>
                </div>
              )}

              <button
                onClick={onBackToLogin}
                className="w-full py-3.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all cursor-pointer shadow-md"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-black" /> Registered Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{loading ? 'Generating Link...' : 'Send Password Reset Link'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
