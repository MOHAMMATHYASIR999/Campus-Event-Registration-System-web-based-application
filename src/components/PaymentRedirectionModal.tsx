import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  ArrowRight,
  Building,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Zap,
} from 'lucide-react';
import { PaymentProvider } from '../types';
import { LivePaymentVerificationEngine, VerificationResult } from './LivePaymentVerificationEngine';

interface PaymentRedirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: PaymentProvider;
  bankName?: string;
  studentName: string;
  collegeId: string;
  eventName: string;
  amount?: number;
  onPaymentSuccess: (result: VerificationResult) => void;
}

export const PaymentRedirectionModal: React.FC<PaymentRedirectionModalProps> = ({
  isOpen,
  onClose,
  provider,
  bankName = 'State Bank of India',
  studentName,
  collegeId,
  eventName,
  amount = 1,
  onPaymentSuccess,
}) => {
  const [phase, setPhase] = useState<'redirect' | 'verification'>('redirect');
  const [sessionTimer, setSessionTimer] = useState(599); // 10 minutes countdown
  const [netbankingOtp, setNetbankingOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState('');
  const [otpError, setOtpError] = useState('');
  const [upiPin, setUpiPin] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Official Campus Desk Institutional UPI ID (Personal Admin details hidden)
  const upiId = 'klu.events@icici';
  const payeeName = 'Campus Event Registration Desk';
  const note = `Event-${eventName.substring(0, 16).trim()}-${collegeId}`;
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(
    2
  )}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Provider specific deep links
  const getProviderDeepLink = () => {
    switch (provider) {
      case 'PhonePe':
        return `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(
          2
        )}&cu=INR&tn=${encodeURIComponent(note)}`;
      case 'Google Pay':
        return `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(
          2
        )}&cu=INR&tn=${encodeURIComponent(note)}`;
      case 'Paytm':
        return `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(
          2
        )}&cu=INR&tn=${encodeURIComponent(note)}`;
      default:
        return upiDeepLink;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPhase('redirect');
      setNetbankingOtp('');
      setUpiPin('');
      return;
    }

    // Generate random 6-digit OTP for Net Banking simulation
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpGenerated(randomOtp);

    // Countdown interval
    const interval = setInterval(() => {
      setSessionTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(sessionTimer / 60);
  const seconds = sessionTimer % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleLaunchDeepLink = () => {
    const link = getProviderDeepLink();
    try {
      window.location.href = link;
    } catch {
      // In web fallback
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(getProviderDeepLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProceedToVerification = () => {
    if (provider === 'Net Banking') {
      if (!netbankingOtp || netbankingOtp.length < 4) {
        setOtpError('Please enter the 6-digit Bank OTP (or click Auto-fill).');
        return;
      }
    }
    setOtpError('');
    setPhase('verification');
  };

  const handleAutofillOtp = () => {
    setNetbankingOtp(otpGenerated);
    setOtpError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Top Security & Redirection Banner */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-700/40 text-amber-300 flex items-center justify-center border border-teal-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Secure Payment Redirection
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded">
                  256-BIT SSL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Campus Gateway · Session expires in {formattedTime}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {phase === 'verification' ? (
          <div className="p-6 sm:p-8 bg-slate-50/50">
            <LivePaymentVerificationEngine
              provider={provider}
              bankName={provider === 'Net Banking' ? bankName : undefined}
              studentName={studentName}
              collegeId={collegeId}
              eventName={eventName}
              amount={amount}
              onVerificationComplete={(result) => {
                onPaymentSuccess(result);
              }}
              onCancel={() => setPhase('redirect')}
            />
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Provider Branded Header Card */}
            {provider === 'PhonePe' && (
              <div className="p-4 rounded-2xl bg-[#5f259f] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#5f259f] font-black text-2xl flex items-center justify-center shadow-xs">
                    पे
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight leading-none">
                      PhonePe Payment Gateway
                    </h3>
                    <span className="text-[11px] text-teal-100/90 font-medium">
                      NPCI Registered UPI 2.0 Provider
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-teal-100 block font-semibold">Amount</span>
                  <span className="text-lg font-mono font-bold text-white">₹{amount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {provider === 'Google Pay' && (
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-2xs">
                    <svg viewBox="0 0 48 48" className="w-8 h-8">
                      <path
                        d="M43.6 20.3c-.6-1.5-1.7-2.7-3.1-3.4L27.2 9c-3.1-1.8-7-1.1-9.4 1.7l-7.7 8.9c-2.4 2.8-2.6 6.9-.6 10l5.8 8.8c1.6 2.4 4.3 3.8 7.3 3.8 1.4 0 2.8-.4 4-1.1l13.3-7.9c2.8-1.7 4.5-4.7 4.5-8 0-1.8-.5-3.5-1.4-4.9z"
                        fill="none"
                      />
                      <path
                        d="M24.8 15.5l-9.1 14.8c-.8 1.3-.5 3 .8 3.8.4.3.9.4 1.4.4.9 0 1.9-.5 2.4-1.3l9.1-14.8c.8-1.3.5-3-.8-3.8-1.3-.8-3-.5-3.8.7z"
                        fill="#4285F4"
                      />
                      <path
                        d="M32.8 19.5l-9.1 14.8c-.8 1.3-.5 3 .8 3.8.4.3.9.4 1.4.4.9 0 1.9-.5 2.4-1.3l9.1-14.8c.8-1.3.5-3-.8-3.8-1.3-.8-3-.5-3.8.7z"
                        fill="#EA4335"
                      />
                      <path
                        d="M16.8 11.5l-9.1 14.8c-.8 1.3-.5 3 .8 3.8.4.3.9.4 1.4.4.9 0 1.9-.5 2.4-1.3l9.1-14.8c.8-1.3.5-3-.8-3.8-1.3-.8-3-.5-3.8.7z"
                        fill="#34A853"
                      />
                      <path
                        d="M24.8 15.5c-1.3-.8-3-.5-3.8.8l-4.2 6.8 4.2 2.6 3.8-6.4c.8-1.3.5-3-.8-3.8z"
                        fill="#FBBC05"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight leading-none text-slate-900">
                      Google Pay Gateway
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Pay with GPay UPI Auto-Prompt
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 block font-semibold">Amount</span>
                  <span className="text-lg font-mono font-bold text-slate-900">₹{amount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {provider === 'Paytm' && (
              <div className="p-4 rounded-2xl bg-[#002970] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#00b9f5] font-black text-xl flex items-center justify-center shadow-xs">
                    paytm
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight leading-none">
                      Paytm Payment Console
                    </h3>
                    <span className="text-[11px] text-sky-200 font-medium">
                      Fast Forward UPI & Wallet Clearance
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-sky-200 block font-semibold">Amount</span>
                  <span className="text-lg font-mono font-bold text-white">₹{amount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {provider === 'Net Banking' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-800 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                    <Building className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight leading-none">
                      {bankName} Net Banking
                    </h3>
                    <span className="text-[11px] text-teal-100 font-medium">
                      Direct Core Banking Gateway (Retail & Corporate)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-teal-100 block font-semibold">Amount</span>
                  <span className="text-lg font-mono font-bold text-amber-300">₹{amount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Transaction Order Overview */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Beneficiary Merchant:</span>
                <span className="font-bold text-slate-900">Campus Event Desk (Near Auditorium)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Student Attendee:</span>
                <span className="font-semibold text-slate-800">
                  {studentName} ({collegeId})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Event Title:</span>
                <span className="font-bold text-slate-800 truncate max-w-[220px]">{eventName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Pass Type:</span>
                <span className="font-semibold text-emerald-700">Official Campus Event Admission</span>
              </div>
            </div>

            {/* Provider Interaction Form */}
            {provider === 'Net Banking' ? (
              /* Net Banking Authorization Form */
              <div className="space-y-4 border border-blue-100 bg-blue-50/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 border-b border-blue-100 pb-2">
                  <Building className="w-4 h-4 text-blue-700" />
                  <span>{bankName} Secure 2FA Authentication</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Customer / Student Login ID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={collegeId}
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-600">
                        High-Security Transaction OTP <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutofillOtp}
                        className="text-[11px] font-bold text-teal-800 hover:text-slate-800 underline flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Autofill OTP ({otpGenerated})</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={netbankingOtp}
                      onChange={(e) => setNetbankingOtp(e.target.value)}
                      placeholder={`Enter 6-digit Bank OTP (e.g. ${otpGenerated})`}
                      className="w-full text-xs font-mono tracking-widest px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-teal-600 outline-hidden"
                    />

                    {otpError ? (
                      <p className="text-[11px] text-rose-500 mt-1">{otpError}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Simulated secure OTP sent to registered student mobile number.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* UPI Apps (PhonePe, GPay, Paytm) Redirection Flow */
              <div className="space-y-4">
                <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-2xl text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Smartphone className="w-4 h-4 text-teal-800" />
                    <span>How Payment Redirection Works:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-900/80 text-[11px] leading-relaxed">
                    <li>
                      Click <strong>"Open {provider} App"</strong> to launch your installed app on mobile.
                    </li>
                    <li>
                      Or click <strong>"Authorize & Start Live Verification"</strong> below to simulate instant payment approval.
                    </li>
                    <li>
                      The Live Verification Engine immediately captures the UTR and generates your admission pass!
                    </li>
                  </ol>
                </div>

                {/* Mobile Intent Trigger Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleLaunchDeepLink}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Open {provider} App</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied Deep Link' : 'Copy Intent'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleProceedToVerification}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Run Live Verification</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
