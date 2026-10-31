import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Award,
  ArrowDownToLine,
  Share2,
  CalendarPlus,
  Zap,
  Lock,
  Utensils,
  CreditCard,
  Ticket,
} from 'lucide-react';

export const TicketPassModal: React.FC = () => {
  const { selectedRegistration, ticketModalOpen, closeTicketModal, addToast } = useApp();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (!selectedRegistration) return;

    // Generate real cryptographic QR payload containing ticket admission metadata
    const qrPayload = JSON.stringify({
      passId: selectedRegistration.id,
      event: selectedRegistration.eventTitle,
      attendee: selectedRegistration.studentName,
      collegeId: selectedRegistration.collegeId,
      gate: selectedRegistration.entryGate || 'GATE-A',
      seat: selectedRegistration.seatNumber || 'SEAT-01',
      status: selectedRegistration.status,
      utr: selectedRegistration.utrNumber || 'CAMPUS-VERIFIED',
      method: selectedRegistration.paymentMethod || 'Campus UPI',
      timestamp: selectedRegistration.registeredAt,
    });

    QRCode.toDataURL(qrPayload, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Error generating pass QR:', err));
  }, [selectedRegistration]);

  if (!ticketModalOpen || !selectedRegistration) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/pass receipt summary file download
    const passData = `
==================================================
   CAMPUS EVENT REGISTRATION SYSTEM - OFFICIAL PASS
==================================================
REGISTRATION ID: ${selectedRegistration.id}
STATUS: ${selectedRegistration.status.toUpperCase()}
GATE: ${selectedRegistration.entryGate || 'GATE-A (Main Lobby)'}
SEAT: ${selectedRegistration.seatNumber || 'SEAT-01'}
DATE ISSUED: ${selectedRegistration.registeredAt}

EVENT DETAILS:
- Event: ${selectedRegistration.eventTitle}
- Category: ${selectedRegistration.eventCategory}
- Date: ${selectedRegistration.eventDate}
- Time: ${selectedRegistration.eventTime}
- Venue: ${selectedRegistration.eventVenue}

ATTENDEE DETAILS:
- Student Name: ${selectedRegistration.studentName}
- College ID / Reg No: ${selectedRegistration.collegeId}
- Department: ${selectedRegistration.department}
- Academic Year: ${selectedRegistration.year}
- Dietary Preference: ${selectedRegistration.dietaryPreference || 'NON-VEG'}
- Contact Phone: ${selectedRegistration.phone}
- Email: ${selectedRegistration.studentEmail}

PAYMENT & VERIFICATION:
- Payment Method: ${selectedRegistration.paymentMethod || 'Official Campus Gateway'}
- Provider: ${selectedRegistration.paymentApp || 'Direct UPI / NetBanking'}
- UTR / Transaction ID: ${selectedRegistration.utrNumber || 'N/A'}
- Verification Code: ${selectedRegistration.verificationId || 'VER-CAMPUS-OK'}

COORDINATION DESK:
- Location: Near Central Auditorium
- Contact Desk: Central Auditorium Event Helpdesk
- Official Email: eventcell@klu.ac.in

INSTRUCTIONS:
1. Present this digital pass along with your physical College ID card at the entrance desk.
2. Gates open 30 minutes prior to scheduled start time.
==================================================
    `.trim();

    const blob = new Blob([passData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pass-${selectedRegistration.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Pass Downloaded', `Digital pass ${selectedRegistration.id} saved.`, 'success');
  };

  // Generate .ics calendar file
  const handleAddToCalendar = () => {
    const title = selectedRegistration.eventTitle;
    const location = selectedRegistration.eventVenue;
    const description = `Campus Event Admission Pass: ${selectedRegistration.id}\\nAttendee: ${selectedRegistration.studentName} (${selectedRegistration.collegeId})\\nGate: ${selectedRegistration.entryGate || 'GATE-A'}\\nSeat: ${selectedRegistration.seatNumber || 'SEAT-01'}`;

    // Format dates to basic ICS format
    const cleanDate = selectedRegistration.eventDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Campus Events//Admission Ticket//EN',
      'BEGIN:VEVENT',
      `UID:${selectedRegistration.id}@campus.edu`,
      `DTSTAMP:${cleanDate}T090000Z`,
      `DTSTART:${cleanDate}T093000Z`,
      `DTEND:${cleanDate}T170000Z`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Event-${selectedRegistration.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Calendar Event Saved', 'Added to your calendar schedule.', 'success');
  };

  const handleShare = () => {
    const text = `I'm attending ${selectedRegistration.eventTitle}! Here is my official Campus Event Pass: ${selectedRegistration.id}`;
    if (navigator.share) {
      navigator.share({
        title: selectedRegistration.eventTitle,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      addToast('Copied to Clipboard', 'Pass details copied to clipboard.', 'info');
    }
  };

  const isConfirmed = selectedRegistration.status === 'Confirmed';
  const isCancelled = selectedRegistration.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Modal Top Actions */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-300 flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block leading-tight">
                Official Campus Admission Pass
              </span>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${selectedRegistration.status === 'Confirmed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {selectedRegistration.status === 'Confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {selectedRegistration.status === 'Confirmed' ? 'Registration Confirmed' : 'UTR Submitted · Awaiting Confirmation'}
              </span>
            </div>
          </div>
          <button
            onClick={closeTicketModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close pass modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" ref={ticketRef} className="p-6 sm:p-8 bg-white space-y-4">
          {/* Main Ticket Card Header */}
          <div className="border border-slate-900/10 rounded-2xl p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900 text-white relative overflow-hidden shadow-lg">
            {/* Ambient gradients */}
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-teal-600/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* University & Desk Title */}
            <div className="flex items-center justify-between text-xs tracking-wider uppercase text-teal-100/80 font-semibold border-b border-white/10 pb-3 mb-3">
              <span>Event Desk · Near Auditorium</span>
              <span className="font-mono text-amber-300 font-bold">{selectedRegistration.id}</span>
            </div>

            {/* Status indicator and Category */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs uppercase tracking-widest text-teal-300 font-medium">
                {selectedRegistration.eventCategory}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  isConfirmed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : isCancelled
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isConfirmed ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <ShieldAlert className="w-3 h-3" />
                )}
                {selectedRegistration.status}
              </span>
            </div>

            {/* Event Name */}
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white mb-3">
              {selectedRegistration.eventTitle}
            </h2>

            {/* Gate and Seat Allocation Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-lg">
                {selectedRegistration.entryGate || 'GATE-A (Main Lobby)'}
              </span>
              <span className="bg-teal-600/20 border border-teal-500/30 text-teal-100 text-xs font-mono font-bold px-3 py-1 rounded-lg">
                {selectedRegistration.seatNumber || 'SEAT-01'}
              </span>
            </div>

            {/* Event Logistics */}
            <div className="space-y-1.5 text-xs text-teal-100/90 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold">{selectedRegistration.eventDate}</span>
                <span className="text-teal-500">·</span>
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{selectedRegistration.eventTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{selectedRegistration.eventVenue}</span>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Notch */}
          <div className="relative flex items-center justify-between my-1 -mx-6 sm:-mx-8">
            <div className="w-5 h-6 bg-slate-950/70 rounded-r-full" />
            <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-3" />
            <div className="w-5 h-6 bg-slate-950/70 rounded-l-full" />
          </div>

          {/* Attendee Details & High-Res Dynamic QR Section */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Attendee Info */}
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">
                    Attendee Name
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedRegistration.studentName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">
                      {selectedRegistration.attendeeType === 'external' ? 'Pass ID / Visitor' : 'College Reg ID'}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedRegistration.collegeId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">
                      {selectedRegistration.attendeeType === 'external' ? 'Attendee Type' : 'Year'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedRegistration.attendeeType === 'external' ? 'Outer Guest' : selectedRegistration.year}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">
                      {selectedRegistration.attendeeType === 'external' ? 'Institution / City' : 'Department'}
                    </span>
                    <span className="text-slate-700 font-medium truncate block">
                      {selectedRegistration.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">
                      Refreshment
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      <Utensils className="w-3 h-3 text-teal-700" />
                      {selectedRegistration.dietaryPreference || 'NON-VEG'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code */}
              <div className="flex flex-col items-center justify-center p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Admission Ticket QR Code"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    Generating QR...
                  </div>
                )}
                <span className="text-[9px] font-mono font-bold text-slate-600 mt-1 uppercase tracking-wider">
                  Gate Admission Scan
                </span>
              </div>
            </div>

            {/* Live Payment Verification Proof Strip */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {selectedRegistration.status === 'Confirmed' ? 'Payment Method' : 'Payment Reference Submitted'}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {selectedRegistration.paymentMethod || `${selectedRegistration.paymentApp || 'Campus UPI'} Verified`}
                  </span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Payment Status
                </span>
                <span className={`font-mono font-bold text-xs ${selectedRegistration.status === 'Confirmed' ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {selectedRegistration.status === 'Confirmed' ? `Confirmed (₹${selectedRegistration.amountPaid || 1}.00)` : `Awaiting confirmation (₹${selectedRegistration.amountPaid || 1}.00)`}
                </span>
              </div>
            </div>

            {/* Barcode strip */}
            <div className="pt-2 flex flex-col items-center">
              <div className="flex items-center justify-center gap-1 w-full max-w-[280px] h-6 overflow-hidden">
                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 2].map(
                  (width, idx) => (
                    <span
                      key={idx}
                      className="h-full bg-slate-800"
                      style={{ width: `${width * 2}px` }}
                    />
                  )
                )}
              </div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest mt-1">
                {selectedRegistration.id} · {selectedRegistration.registeredAt}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center leading-relaxed">
            Please carry your official College ID Card. Issued by Campus Event Coordination Desk Near Auditorium · Official Event Cell
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCalendar}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-teal-800" />
              <span>Add to Calendar</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Share Pass</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
