import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, Zap } from 'lucide-react';

interface PaymentScannerProps {
  amount?: number;
  eventName?: string;
  eventId?: string;
  onAutoVerify?: () => void;
}

export const PaymentScanner: React.FC<PaymentScannerProps> = ({
  amount = 1,
  eventName = 'Campus Event Pass',
  onAutoVerify,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  // Target UPI ID for the payment destination
  const upiId = '9500677895@ptyes';
  const payeeName = 'MOHAMMATH YASIR A';
  const formattedAmount = '1';
  const note = `Pass-${eventName.substring(0, 16).trim().replace(/\s+/g, '-')}`;

  // Pre-fixed ₹1 URI linking directly to the payment destination
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    QRCode.toDataURL(upiDeepLink, {
      width: 480,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [upiDeepLink]);

  return (
    <div className="flex flex-col items-center">
      {/* Clean White QR Card matching the uploaded Google Pay card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-200/80 w-full max-w-[340px] mx-auto text-center space-y-4">
        {/* Scannable QR Code */}
        <div className="relative flex items-center justify-center aspect-square max-w-[260px] mx-auto bg-white rounded-2xl overflow-hidden p-1">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Scan to pay ₹1.00"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400">
              Loading QR Code...
            </div>
          )}

          {/* Authentic Google Pay Center Icon Badge (from uploaded QR) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 bg-white rounded-full p-2 shadow-sm border border-slate-200 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-7 h-7">
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
          </div>
        </div>

        {/* Clean Caption matching standard QR card */}
        <div className="pt-1">
          <p className="text-slate-800 text-sm font-semibold">
            Scan to pay with any UPI app
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Google Pay · PhonePe · Paytm · BHIM
          </p>
        </div>
      </div>

      {/* Auto-verify button */}
      {onAutoVerify && (
        <div className="mt-4 w-full max-w-[340px]">
          <button
            type="button"
            onClick={onAutoVerify}
            className="w-full py-3 bg-[#0c2340] hover:bg-[#163863] text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Verify & Complete Registration</span>
          </button>
        </div>
      )}
    </div>
  );
};
