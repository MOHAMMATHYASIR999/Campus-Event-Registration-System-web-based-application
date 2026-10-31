import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Globe,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    loginStudent,
    navigate,
  } = useApp();

  // Active sign in tab: College Student or Outsider
  const [activeTab, setActiveTab] = useState<'student' | 'outsider'>('student');

  // Common and role-specific form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Outsider specific fields
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const err: Record<string, string> = {};
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      err.email = 'Email address is required.';
    } else if (activeTab === 'student') {
      // College student login: any random number including @klu.ac.in mail id only
      const studentRollRegex = /^\d+@klu\.ac\.in$/i;
      if (!studentRollRegex.test(cleanEmail)) {
        err.email =
          'College student login must be your roll number followed by @klu.ac.in (e.g. 2400031982@klu.ac.in).';
      }
    } else {
      // Outsider login: personal/external email (strictly non-klu, e.g. @gmail.com)
      if (cleanEmail.endsWith('@klu.ac.in')) {
        err.email =
          'Outsiders cannot use @klu.ac.in. Please use your personal email address (e.g. yourname@gmail.com).';
      } else if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        err.email = 'Valid personal email is required (e.g. yourname@gmail.com).';
      }
    }

    if (!password.trim() || password.length < 4) {
      err.password = 'Password must be at least 4 characters.';
    }

    if (activeTab === 'outsider') {
      if (!name.trim()) err.name = 'Full name is required.';
      if (!organization.trim()) {
        err.organization = 'College name, organization, or city is required.';
      }
      if (!phone.trim()) err.phone = 'Contact phone number is required.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (activeTab === 'student') {
      loginStudent(email.trim(), password.trim());
      navigate('events');
    } else {
      // Sign in as outsider with participant details
      loginStudent(
        email.trim(),
        password.trim(),
        name.trim(),
        organization.trim(),
        phone.trim()
      );
      navigate('events');
    }
  };

  // Demo auto-fill helpers
  const fillStudentDemo = () => {
    setActiveTab('student');
    setEmail('2400031982@klu.ac.in');
    setPassword('student123');
    setErrors({});
  };

  const fillOutsiderDemo = () => {
    setActiveTab('outsider');
    setName('Kavya Sharma');
    setEmail('kavya.outer@gmail.com');
    setPassword('kavya2026');
    setOrganization('SRM University / Tech Enthusiast');
    setPhone('+91 98480 23456');
    setErrors({});
  };

  const goToAdminLogin = () => {
    navigate('admin-login');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Event Registration System
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Sign in to view campus events, reserve entry tickets, and download your passes.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        {/* Sign In Options Switcher */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Select Sign In Type:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setEmail('');
                setErrors({});
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                activeTab === 'student'
                  ? 'border-teal-700 bg-teal-50/70 text-slate-900 ring-2 ring-teal-600/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <GraduationCap className="w-4 h-4 text-teal-700" />
                <span>College Student</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                [roll_no]@klu.ac.in
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('outsider');
                setEmail('');
                setErrors({});
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                activeTab === 'outsider'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Sign In as Outsider</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Other Colleges & Guests
              </span>
            </button>
          </div>
        </div>

        {/* Informative Subhead for chosen tab */}
        {activeTab === 'student' ? (
          <div className="p-3 bg-teal-50/60 border border-teal-100/70 rounded-xl text-xs text-slate-800">
            <span className="font-semibold block text-slate-900">Campus Student Sign In</span>
            <span className="text-[11px] text-teal-800/90 block mt-0.5">
              Enter your student roll number email (e.g. <strong className="font-mono">2400031982@klu.ac.in</strong>).
            </span>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl text-xs text-emerald-900">
            <span className="font-semibold block text-emerald-950">Outsider / Guest Sign In</span>
            <span className="text-[11px] text-emerald-700/90 block mt-0.5">
              Enter your details to sign in and generate your visitor entry pass.
            </span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'outsider' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kavya Sharma"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {activeTab === 'student'
                ? 'College Student Email (@klu.ac.in only) *'
                : 'Personal Email *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                placeholder={
                  activeTab === 'student'
                    ? '2400031982@klu.ac.in'
                    : 'youremail@gmail.com'
                }
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-mono"
              />
            </div>
            {errors.email ? (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
            ) : activeTab === 'student' ? (
              <p className="text-[10px] text-slate-400 mt-1">
                Format: <span className="font-mono font-semibold text-slate-600">any_number@klu.ac.in</span> (e.g. 2400031982@klu.ac.in)
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>
            )}
          </div>

          {activeTab === 'outsider' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / Organization / City <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. SRM University or Hyderabad"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
                  />
                </div>
                {errors.organization && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.organization}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>An official Pass ID (e.g. EXT-2026-9281) will be issued.</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>
              {activeTab === 'student'
                ? 'Sign In as College Student'
                : 'Sign In as Outsider'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast-Action Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] text-slate-400 block text-center font-medium">
            Quick 1-Click Evaluation Helpers:
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-slate-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
              <span>Fill Student (2400031982@klu.ac.in)</span>
            </button>
            <button
              type="button"
              onClick={fillOutsiderDemo}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fill Outsider (kavya.outer@gmail.com)</span>
            </button>
          </div>
        </div>

        {/* Admin Gateway link */}
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={goToAdminLogin}
            className="text-[11px] font-semibold text-slate-500 hover:text-amber-700 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Authorized Administrator Portal &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
