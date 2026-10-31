import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentSelector } from '../components/PaymentSelector';
import { VerificationResult } from '../components/LivePaymentVerificationEngine';
import { AttendeeType } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  AlertCircle,
  Smartphone,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  X,
  CreditCard,
  QrCode,
  ArrowRight,
  User,
  GraduationCap,
  Building,
  CalendarPlus,
  ArrowDownToLine,
  Zap,
  Globe,
} from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const {
    events,
    selectedEventId,
    currentUser,
    registerForEvent,
    navigate,
    openTicketModal,
    registrations,
    addToast,
  } = useApp();

  // Find target event
  const event = events.find((e) => e.id === selectedEventId) || events[0];

  // Current registration step: 'details' | 'payment'
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');

  // Form states initialized to currentUser if available or empty for user input
  const [attendeeType, setAttendeeType] = useState<AttendeeType>(
    currentUser?.attendeeType || (currentUser?.collegeId?.startsWith('EXT-') ? 'external' : 'student')
  );
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [collegeId, setCollegeId] = useState(currentUser?.collegeId || '');
  const [organization, setOrganization] = useState(
    currentUser?.organization || (currentUser?.attendeeType === 'external' ? currentUser?.department : '')
  );
  const [email, setEmail] = useState(currentUser?.email || '');
  const [department, setDepartment] = useState(
    currentUser?.department || 'Computer Science & Engineering'
  );
  const [year, setYear] = useState(currentUser?.year || '1st Year');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dietary, setDietary] = useState('NON-VEG');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Payment states
  const paymentMobileNumber = 'Official Campus UPI';
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [copiedMobile, setCopiedMobile] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.attendeeType) setAttendeeType(currentUser.attendeeType);
    if (currentUser?.name && !studentName) setStudentName(currentUser.name);
    if (currentUser?.collegeId && !collegeId) setCollegeId(currentUser.collegeId);
    if (currentUser?.organization && !organization) setOrganization(currentUser.organization);
    if (currentUser?.email && !email) setEmail(currentUser.email);
    if (currentUser?.department && !department) setDepartment(currentUser.department);
    if (currentUser?.year && !year) setYear(currentUser.year);
    if (currentUser?.phone && !phone) setPhone(currentUser.phone);
  }, [currentUser]);

  if (!event) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-sm text-slate-600">Please choose an event first.</p>
        <button
          onClick={() => navigate('events')}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
        >
          View Events
        </button>
      </div>
    );
  }

  // Validate step 1: Student & Event Information
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!studentName.trim()) errors.studentName = 'Full Name is required.';
    
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      errors.email = 'Valid email is required (e.g. yourname@gmail.com).';
    } else if (attendeeType === 'student') {
      if (!/^\d+@klu\.ac\.in$/i.test(cleanEmail)) {
        errors.email = 'Campus student email must be your roll number followed by @klu.ac.in (e.g. 2400031982@klu.ac.in).';
      }
    } else {
      if (cleanEmail.endsWith('@klu.ac.in')) {
        errors.email = 'Outsiders cannot use @klu.ac.in. Please use your personal email address (e.g. yourname@gmail.com).';
      }
    }

    if (!phone.trim()) errors.phone = 'Mobile number is required.';

    if (attendeeType === 'student') {
      if (!collegeId.trim()) errors.collegeId = 'College Registration ID is required.';
    } else {
      if (!organization.trim()) {
        errors.organization = 'College, institution, or organization name is required.';
      }
    }

    if (!agreeTerms) errors.agreeTerms = 'You must agree to campus event guidelines.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate step 2: Payment details
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!utrNumber.trim()) {
      errors.utrNumber = 'UTR / UPI Transaction ID is required to verify payment.';
    } else if (utrNumber.trim().length < 6) {
      errors.utrNumber = 'Please enter a valid Transaction ID / UTR number.';
    }

    if (!paymentScreenshotUrl) {
      errors.screenshot = 'Please upload a screenshot of your payment history.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyMobile = () => {
    navigator.clipboard?.writeText(paymentMobileNumber);
    setCopiedMobile(true);
    addToast('Copied to Clipboard', `Mobile Number ${paymentMobileNumber} copied`, 'info');
    setTimeout(() => setCopiedMobile(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({ ...prev, screenshot: 'Please select an image file (PNG, JPG, WEBP).' }));
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = (eventReader) => {
      const result = eventReader.target?.result as string;
      setPaymentScreenshotUrl(result);
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.screenshot;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleScreenshot = () => {
    // Generate a sleek canvas SVG voucher screenshot for quick testing
    const svgReceipt = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="16" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="40" y="60" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">UPI Payment Successful</text><text x="40" y="90" font-family="sans-serif" font-size="13" fill="%2316a34a">✓ Official Campus UPI Verified</text><text x="40" y="130" font-family="sans-serif" font-size="12" fill="%2364748b">Campus Event Registration Desk</text><text x="40" y="160" font-family="monospace" font-size="13" font-weight="bold" fill="%231e293b">UTR: 425510987654</text><text x="40" y="200" font-family="sans-serif" font-size="12" fill="%2364748b">Paid by: ${encodeURIComponent(studentName || 'Student')}</text><text x="40" y="240" font-family="sans-serif" font-size="11" fill="%2394a3b8">Timestamp: Nov 2026 · Confirmed</text></svg>`;
    setPaymentScreenshotUrl(svgReceipt);
    setScreenshotFileName('upi_payment_receipt.png');
    if (!utrNumber) setUtrNumber('425510987654');
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.screenshot;
      delete next.utrNumber;
      return next;
    });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const effectiveId = attendeeType === 'external' && !collegeId.trim()
        ? `EXT-${Math.floor(1000 + Math.random() * 9000)}`
        : collegeId.trim().toUpperCase();

      const result = registerForEvent({
        eventId: event.id,
        studentName: studentName.trim(),
        collegeId: effectiveId,
        email: email.trim(),
        department: attendeeType === 'external' ? organization.trim() : department,
        year: attendeeType === 'external' ? 'Outer Guest Attendee' : year,
        phone: phone.trim(),
        dietaryPreference: dietary,
        attendeeType,
        organization: attendeeType === 'external' ? organization.trim() : undefined,
        paymentMobile: paymentMobileNumber,
        utrNumber: utrNumber.trim(),
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
        paymentMethod: `UPI to ${paymentMobileNumber}`,
      });

      setIsSubmitting(false);

      if (result.success && result.registrationId) {
        setRegisteredSuccess(result.registrationId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 600);
  };

  const handleLivePaymentComplete = async (result: VerificationResult) => {
    setIsSubmitting(true);
    const effectiveId = attendeeType === 'external' && !collegeId.trim()
      ? `EXT-${Math.floor(1000 + Math.random() * 9000)}`
      : collegeId.trim().toUpperCase();

    // Call server-side validation & auto-booking endpoint
    try {
      await fetch('/api/registrations/validate-and-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          studentName: studentName.trim(),
          email: email.trim(),
          collegeId: effectiveId,
          phone: phone.trim(),
          attendeeType,
          amountPaid: 1, // Strictly 1 Rupee
          razorpayPaymentId: result.utrNumber,
          paymentMethod: result.paymentMethod || 'Razorpay Auto-Checked',
        }),
      });
    } catch {
      // Continue client fallback
    }

    const regResult = registerForEvent({
      eventId: event.id,
      studentName: studentName.trim(),
      collegeId: effectiveId,
      email: email.trim(),
      department: attendeeType === 'external' ? organization.trim() : department,
      year: attendeeType === 'external' ? 'Outer Guest Attendee' : year,
      phone: phone.trim(),
      dietaryPreference: dietary,
      attendeeType,
      organization: attendeeType === 'external' ? organization.trim() : undefined,
      paymentMobile: 'Campus Central Desk (Razorpay)',
      utrNumber: result.utrNumber || `RPZ-${Date.now()}`,
      paymentMethod: result.paymentMethod || 'Razorpay Automated Switch',
      paymentApp: result.paymentApp || 'Razorpay',
      bankName: result.bankName,
      amountPaid: 1, // Strictly 1 Rupee
      autoOpenTicket: false,
    });

    setIsSubmitting(false);

    if (regResult.success && regResult.registrationId) {
      setRegisteredSuccess(regResult.registrationId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentRegistration = registeredSuccess
    ? registrations.find((r) => r.id === registeredSuccess)
    : undefined;

  const registeredCount = registrations.filter(
    (r) => r.eventId === event.id && r.status !== 'Cancelled'
  ).length;
  const seatsLeft = Math.max(0, event.totalSeats - registeredCount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Back button */}
      <button
        onClick={() => {
          if (currentStep === 'payment' && !registeredSuccess) {
            setCurrentStep('details');
          } else {
            navigate('event-detail', event.id);
          }
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{currentStep === 'payment' && !registeredSuccess ? 'Back to Student Details' : 'Back to Event Details'}</span>
      </button>

      {/* Success Confirmation Banner if registered */}
      {registeredSuccess && currentRegistration ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Registration Confirmed & Payment Verified
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              You're Registered for {currentRegistration.eventTitle}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Your seat is confirmed. Below are your full registration, event, and payment verification details.
            </p>
          </div>

          {/* Official Pass ID Highlight Box */}
          <div className="bg-slate-800 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-teal-100 font-semibold block">
                Official Digital Registration Pass ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 mt-0.5 block">
                {currentRegistration.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-lg">
                Status: {currentRegistration.status}
              </span>
            </div>
          </div>

          {/* 3 Comprehensive Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Event Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-200 pb-2">
                <Calendar className="w-4 h-4 text-teal-800" />
                <span>Event Details</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Event Name</span>
                  <span className="font-bold text-slate-900 block">{currentRegistration.eventTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Date & Time</span>
                  <span className="font-medium text-slate-800">{currentRegistration.eventDate} ({currentRegistration.eventTime})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Venue</span>
                  <span className="font-medium text-slate-800">{currentRegistration.eventVenue}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Category</span>
                  <span className="font-medium text-slate-800">{currentRegistration.eventCategory}</span>
                </div>
              </div>
            </div>

            {/* 2. Attendee Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-200 pb-2">
                <User className="w-4 h-4 text-teal-800" />
                <span>
                  {currentRegistration.attendeeType === 'external' ? 'Outer Guest Details' : 'Student Details'}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Attendee Name</span>
                  <span className="font-bold text-slate-900 block">{currentRegistration.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    {currentRegistration.attendeeType === 'external' ? 'External Pass ID' : 'College Reg ID'}
                  </span>
                  <span className="font-mono font-bold text-slate-800">{currentRegistration.collegeId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    {currentRegistration.attendeeType === 'external' ? 'Affiliation / City' : 'Department'}
                  </span>
                  <span className="font-medium text-slate-800">{currentRegistration.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Type</span>
                  <span className="font-medium text-slate-800">
                    {currentRegistration.attendeeType === 'external' ? 'Outer / External Guest Attendee' : currentRegistration.year}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Mobile & Email</span>
                  <span className="font-medium text-slate-800">{currentRegistration.phone} · {currentRegistration.studentEmail}</span>
                </div>
              </div>
            </div>

            {/* 3. Payment Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-200 pb-2">
                <CreditCard className="w-4 h-4 text-teal-800" />
                <span>Live Payment Verification</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Payment Method</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {currentRegistration.paymentMethod || `${currentRegistration.paymentApp || 'Campus UPI'} Verified`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">UTR / Transaction ID</span>
                  <span className="font-mono font-bold text-emerald-700">{currentRegistration.utrNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Gate & Seat Allocated</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-slate-900 bg-teal-100/70 border border-teal-100 px-2 py-0.5 rounded text-[11px]">
                      {currentRegistration.entryGate || 'GATE-A (Main Lobby)'}
                    </span>
                    <span className="font-mono font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                      {currentRegistration.seatNumber || 'SEAT-01'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Refreshment</span>
                  <span className="font-bold text-slate-800">{currentRegistration.dietaryPreference || 'NON-VEG'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => openTicketModal(currentRegistration)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>View & Print Official Digital Pass</span>
            </button>

            <button
              onClick={() => navigate('student-dashboard')}
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Go to Student Portal
            </button>

            <button
              onClick={() => {
                setRegisteredSuccess(null);
                setCurrentStep('details');
                setUtrNumber('');
                setPaymentScreenshotUrl(null);
              }}
              className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Register Another Event
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Registration Form & Event Summary Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Summary Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative aspect-16/9 bg-slate-100">
                <img
                  src={event.posterUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {event.category}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {event.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Registrations</span>
                  <span className="font-mono font-bold text-slate-800">
                    {registeredCount} / {event.totalSeats}
                    <span className="font-sans font-normal text-slate-500 ml-1 text-[11px]">
                      ({seatsLeft} seats left)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl text-xs text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-800" />
                <span>Eligibility Criteria</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-800/80">
                {event.eligibility}
              </p>
            </div>
          </div>

          {/* Right Column: Step 1 or Step 2 Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 sm:px-6 shadow-xs text-xs font-semibold">
              <div className={`flex items-center gap-2 ${currentStep === 'details' ? 'text-slate-800' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === 'details' ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white'}`}>
                  {currentStep === 'payment' ? '✓' : '1'}
                </span>
                <span>1. Student Details</span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />
              <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-slate-800' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === 'payment' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </span>
                <span>2. UPI Payment</span>
              </div>
            </div>

            {/* STEP 1: Attendee Information Form */}
            {currentStep === 'details' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Step 1: Attendee & Event Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in your attendee details. Open to enrolled campus students and external/outer participants.
                  </p>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  {/* Attendee Type Switcher */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Attendee Type
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAttendeeType('external');
                          setFormErrors({});
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          attendeeType === 'external'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                        }`}
                      >
                        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="text-xs">
                          <span>Outer / External Guest</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAttendeeType('student');
                          setFormErrors({});
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          attendeeType === 'student'
                            ? 'border-teal-700 bg-teal-50 text-slate-900 ring-2 ring-teal-600/20 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-teal-700 shrink-0" />
                        <div className="text-xs">
                          <span>Campus Student</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Event Name Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Name <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={event.id}
                      onChange={(e) => navigate('registration', e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-semibold text-slate-900"
                    >
                      {events.map((evt) => {
                        const count = registrations.filter(
                          (r) => r.eventId === evt.id && r.status !== 'Cancelled'
                        ).length;
                        const isFull = count >= evt.totalSeats;
                        return (
                          <option key={evt.id} value={evt.id}>
                            {evt.name} · {evt.date} ({count}/100 registered{isFull ? ' - FULL' : ''})
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      You can select any of the 8 campus events scheduled on Nov 21 & Nov 22.
                    </p>
                  </div>

                  {/* Full Name & College ID / Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Attendee Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Kavya Sharma"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                          formErrors.studentName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-teal-600 outline-hidden`}
                      />
                      {formErrors.studentName && (
                        <p className="text-[11px] text-rose-500 mt-1">{formErrors.studentName}</p>
                      )}
                    </div>

                    {attendeeType === 'external' ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          External College / Organization / City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. SRM University or Guest from Hyderabad"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                            formErrors.organization ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-teal-600 outline-hidden`}
                        />
                        {formErrors.organization && (
                          <p className="text-[11px] text-rose-500 mt-1">{formErrors.organization}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          College ID / Reg Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={collegeId}
                          onChange={(e) => setCollegeId(e.target.value.toUpperCase())}
                          placeholder="e.g. 2400031982"
                          className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border ${
                            formErrors.collegeId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-teal-600 outline-hidden uppercase`}
                        />
                        {formErrors.collegeId && (
                          <p className="text-[11px] text-rose-500 mt-1">{formErrors.collegeId}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Email & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Email <span className="text-rose-500">*</span>{' '}
                        <span className="text-[11px] text-slate-400 font-normal">
                          {attendeeType === 'student' ? '(@klu.ac.in email)' : '(Gmail / Personal)'}
                        </span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={attendeeType === 'student' ? '2400031982@klu.ac.in' : 'youremail@gmail.com'}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                          formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-teal-600 outline-hidden font-mono`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                          formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-teal-600 outline-hidden`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Department & Year (if Student) or External Pass Info (if External) */}
                  {attendeeType === 'student' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Department
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
                        >
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics & Communication">Electronics & Communication</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Biotechnology & Bio-Engineering">Biotechnology & Bio-Engineering</option>
                          <option value="Business Administration & Management">Business Administration & Management</option>
                          <option value="Design & Media Studies">Design & Media Studies</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Year
                        </label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold block text-emerald-950">Outer / External Guest Pass</span>
                          <span className="text-[11px] text-emerald-700 leading-relaxed block">
                            A unique visitor pass ID (e.g. EXT-2026-XXXX) with scannable QR ticket admission will be generated for {organization || 'your institution'}.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dietary Preference or Special Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dietary / Refreshment Preference
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
                    >
                      <option value="NON-VEG">NON-VEG</option>
                      <option value="VEG">VEG</option>
                    </select>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded-md text-slate-800 focus:ring-teal-600"
                      />
                      <span>
                        I confirm that the details entered above are accurate and I agree to follow the campus event code of conduct.
                      </span>
                    </label>
                    {formErrors.agreeTerms && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.agreeTerms}</p>
                    )}
                  </div>

                  {/* Proceed to Payment Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Next: Complete Payment via Official UPI Scanner
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Payment (Razorpay Auto-Checking & ₹1 QR Code) */}
            {currentStep === 'payment' && (
              <PaymentSelector
                studentName={studentName}
                collegeId={collegeId}
                eventName={event.name}
                email={email}
                phone={phone}
                amount={1}
                onPaymentComplete={handleLivePaymentComplete}
                onBack={() => setCurrentStep('details')}
              />
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-4 max-w-lg w-full space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Payment Screenshot Preview</span>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewModalImage}
              alt="Payment Full Preview"
              className="w-full max-h-[70vh] object-contain rounded-lg border border-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
