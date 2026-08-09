import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, ArrowRight, Eye, EyeOff, Square, KeyRound } from 'lucide-react';
import { resetPasswordApi } from '@/services/api';
import { COMPANY_INFO } from '@/constants/company';

interface DashboardResetPasswordProps {
  onSuccessRedirect: () => void;
}

export const DashboardResetPassword: React.FC<DashboardResetPasswordProps> = ({ onSuccessRedirect }) => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Missing or invalid password reset token in URL.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing.');
      return;
    }

    if (password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
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
                Password Verification
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-gray-200 font-semibold">
            Est. {COMPANY_INFO.established} • Trichy
          </span>
        </div>

        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Set New Password</span>
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl font-bold leading-tight text-white">
            Create Your New Portal Password
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed font-sans font-light">
            Enter a strong new password to complete your account recovery. Your new password will be encrypted securely before saving.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-gray-400 border-t border-white/15 pt-6">
          <span>© {new Date().getFullYear()} {COMPANY_INFO.name}</span>
          <span className="text-[11px] uppercase tracking-widest text-gray-300">Management Security</span>
        </div>
      </div>

      {/* Right Column - Reset Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6 relative z-10"
        >
          <div className="space-y-2">
            <h1 className="font-sans text-3xl font-bold text-gray-900 tracking-tight">Set New Password</h1>
            <p className="text-xs text-gray-600 font-sans">
              Enter your new credentials below to complete resetting your account password.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {success ? (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sans text-2xl font-bold text-gray-900">Password Reset Complete!</h3>
              <p className="text-xs text-gray-600 font-sans max-w-sm leading-relaxed">
                Your password has been updated successfully. You can now sign in with your new credentials.
              </p>
              <button
                onClick={onSuccessRedirect}
                className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-4"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-black" /> New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all text-sm font-sans"
                    placeholder="Enter new password (min 6 chars)..."
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-black" /> Confirm New Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all text-sm font-sans"
                  placeholder="Re-enter new password..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{loading ? 'Saving New Password...' : 'Save & Reset Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
