import React, { useState } from 'react';
import {
  Smartphone,
  Building,
  CreditCard,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { VerificationResult } from './LivePaymentVerificationEngine';
import { PaymentScanner } from './PaymentScanner';
import { RazorpayCheckoutModal } from './RazorpayCheckoutModal';

interface PaymentSelectorProps {
  studentName: string;
  collegeId: string;
  eventName: string;
  email?: string;
  phone?: string;
  amount?: number;
  onPaymentComplete: (result: VerificationResult) => void;
  onBack: () => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  studentName,
  collegeId,
  eventName,
  email = '',
  phone = '',
  amount = 1,
  onPaymentComplete,
  onBack,
}) => {
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [showUtrForm, setShowUtrForm] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');

  const handleOpenUtrForm = () => {
    setUtrError('');
    setShowUtrForm(true);
  };

  const handleSubmitUtr = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanUtr = utrNumber.trim().replace(/\\s+/g, '');
    if (!/^[A-Za-z0-9-]{6,30}$/.test(cleanUtr)) {
      setUtrError('Enter a valid UTR / UPI transaction ID (at least 6 characters).');
      return;
    }

    // This records the UTR supplied by the attendee. It does not independently
    // confirm settlement with the bank; production verification needs a payment gateway API.
    onPaymentComplete({
      utrNumber: cleanUtr,
      verificationId: `UTR-SUB-${Date.now()}`,
      paymentMethod: 'UPI QR — UTR submitted for confirmation',
      paymentApp: 'UPI QR',
      amount,
      timestamp: new Date().toISOString(),
    });
  };

  const handleOpenCheckout = () => {
    setIsRazorpayModalOpen(true);
  };

  const handleDirectUpiIntent = (app: string) => {
    const upiId = '9500677895@ptyes';
    const payee = 'MOHAMMATH YASIR A';
    const note = `Event-${eventName.substring(0, 16).trim()}`;
    const uri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payee
    )}&am=1&cu=INR&tn=${encodeURIComponent(note)}`;

    // Attempt to open native UPI app on mobile devices
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = uri;
    }

    // Open verification checkout
    setTimeout(() => {
      setIsRazorpayModalOpen(true);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
            Step 2 of 2: Payment
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Pay Registration Fee
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {eventName} · <strong className="text-slate-800">{studentName}</strong> ({collegeId})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount to Pay</span>
            <div className="text-xl font-black text-slate-900 font-mono">₹{amount}.00</div>
          </div>
        </div>
      </div>

      {/* Main Payment Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* QR Code Scanner Card */}
        <div className="md:col-span-6 bg-slate-50/70 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center">
          <PaymentScanner
            amount={amount}
            eventName={eventName}
            onAutoVerify={handleOpenUtrForm}
          />
        </div>

        {/* UPI & Instant Payment Options */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Or Pay Directly with UPI Apps
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any option below to pay ₹1.00 directly:
              </p>
            </div>

            {/* Quick UPI Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Pay */}
              <button
                type="button"
                onClick={() => handleDirectUpiIntent('Google Pay')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Google Pay</span>
                  <span className="text-[10px] text-slate-500">Pay ₹1.00</span>
                </div>
              </button>

              {/* PhonePe */}
              <button
                type="button"
                onClick={() => handleDirectUpiIntent('PhonePe')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5f259f] text-white font-black text-sm flex items-center justify-center shrink-0">
                  पे
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">PhonePe</span>
                  <span className="text-[10px] text-slate-500">Pay ₹1.00</span>
                </div>
              </button>

              {/* Paytm */}
              <button
                type="button"
                onClick={() => handleDirectUpiIntent('Paytm')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#002970] text-[#00b9f5] font-black text-xs flex items-center justify-center shrink-0">
                  paytm
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Paytm</span>
                  <span className="text-[10px] text-slate-500">Pay ₹1.00</span>
                </div>
              </button>

              {/* Cards / Net Banking */}
              <button
                type="button"
                onClick={handleOpenCheckout}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-300 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Cards / Net Banking</span>
                  <span className="text-[10px] text-slate-500">All Banks</span>
                </div>
              </button>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenUtrForm}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Verify Payment & Get Entry Pass</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={onBack}
                className="hover:text-slate-900 underline"
              >
                &larr; Back to Details
              </button>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Secure 256-bit Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {showUtrForm && (
        <div className="bg-white border border-teal-200 rounded-2xl shadow-lg p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Enter UPI Transaction ID / UTR</h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete the payment in your UPI app, then copy the UTR from the successful transaction receipt.
            </p>
          </div>
          <form onSubmit={handleSubmitUtr} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="payment-utr">
              UTR / Transaction ID
            </label>
            <input
              id="payment-utr"
              type="text"
              value={utrNumber}
              onChange={(event) => {
                setUtrNumber(event.target.value);
                setUtrError('');
              }}
              placeholder="Enter your UTR number"
              autoComplete="off"
              maxLength={30}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              required
            />
            {utrError && <p className="text-xs text-rose-600">{utrError}</p>}
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
              Note: Submitting a UTR records the transaction reference. It does not verify payment with the bank automatically.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex-1 min-w-[180px] py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold"
              >
                Submit UTR & Continue
              </button>
              <button
                type="button"
                onClick={() => setShowUtrForm(false)}
                className="px-4 py-3 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clean Razorpay Checkout Modal */}
      {isRazorpayModalOpen && (
        <RazorpayCheckoutModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          studentName={studentName}
          collegeId={collegeId}
          eventName={eventName}
          email={email}
          phone={phone}
          amount={amount}
          onPaymentSuccess={(result) => {
            setIsRazorpayModalOpen(false);
            onPaymentComplete(result);
          }}
        />
      )}
    </div>
  );
};
