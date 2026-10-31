import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigate } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Administrator email address is required.');
      return;
    }

    if (!password) {
      setErrorMessage('Administrator password is required.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = loginAdmin(email.trim(), password);
      setIsSubmitting(false);

      if (!success) {
        setErrorMessage(
          'Access Denied: Invalid administrator credentials. Student access is prohibited.'
        );
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Portal</span>
        </button>

        {/* Security Shield Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 space-y-6 relative overflow-hidden">
          {/* Top Security Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-md border border-amber-400/20 relative">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                !
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-2">
                Restricted Access · Authorized Personnel Only
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Admin Control Portal
              </h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                Access is restricted to authorized campus staff. Students are prohibited from entering this section.
              </p>
            </div>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Access Restricted</span>
                <p className="text-[11px] leading-relaxed text-rose-600/90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="admin@campus.edu"
                  className="w-full text-xs font-medium pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Administrator Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Case-sensitive</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter administrator password"
                  className="w-full text-xs font-mono pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 group border border-amber-400/20"
            >
              {isSubmitting ? (
                <span>Verifying Administrator Credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Authenticate & Enter Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice Footer */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Protected by 256-bit TLS encryption · Authorized campus coordinators only
        </p>
      </div>
    </div>
  );
};
