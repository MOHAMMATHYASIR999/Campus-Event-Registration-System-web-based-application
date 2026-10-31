import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Share2,
  BookmarkCheck,
  Ticket,
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const {
    events,
    selectedEventId,
    navigate,
    isStudentRegistered,
    openTicketModal,
    addToast,
    registrations,
  } = useApp();

  const event = events.find((e) => e.id === selectedEventId) || events[0];

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <button
          onClick={() => navigate('events')}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
        >
          Return to Events Catalog
        </button>
      </div>
    );
  }

  const userReg = isStudentRegistered(event.id);
  const isRegistered = Boolean(userReg);

  // Real-time count of registered students for this event
  const registeredCount = registrations.filter(
    (r) => r.eventId === event.id && r.status !== 'Cancelled'
  ).length;

  const isSoldOut = registeredCount >= event.totalSeats;
  const seatsLeft = Math.max(0, event.totalSeats - registeredCount);
  const isFillingFast = !isSoldOut && registeredCount >= 75;

  const percentBooked = Math.min(100, Math.round((registeredCount / event.totalSeats) * 100));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied', 'Event link copied to clipboard.', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('events')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Share event link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Large Event Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-21/9 sm:aspect-16/7 bg-slate-900 shadow-xl border border-slate-200">
        <img
          src={event.posterUrl}
          alt={event.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          {/* Unboxed category & status */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-teal-100">
            <span className="bg-amber-500 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[11px]">
              {event.category}
            </span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>{event.organizer.club}</span>
            {event.requiresApproval && (
              <>
                <span aria-hidden="true" className="text-white/40">·</span>
                <span className="text-amber-300 font-medium">Approval Required</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {event.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-3xl line-clamp-2">
            {event.tagline}
          </p>
        </div>
      </div>

      {/* Main Grid: Details + Registration Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Description, Schedule, Rules, Perks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Logistic Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Event Date
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                  {event.date}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Timing
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Venue Location
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                  {event.venue}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Event
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Eligibility Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-800" />
              <h2 className="text-lg font-bold text-slate-900">
                Participant Eligibility
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed">
              {event.eligibility}
            </p>
          </div>

          {/* Perks & Benefits */}
          {event.perks && event.perks.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">
                  Perks & Awards
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                {event.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Rules & Participation Guidelines
              </h2>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed pl-1 py-0.5">
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Column: Registration Card & Organizer Info */}
        <div className="space-y-6">
          {/* Registration Sticky Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5 sticky top-24">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Registrations Progress
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {registeredCount} / {event.totalSeats}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {isSoldOut ? (
                    <span className="text-rose-600 font-bold">Event Full (100/100)</span>
                  ) : (
                    <span>{seatsLeft} seats left</span>
                  )}
                </span>
              </div>

              {/* Progress bar - Starts at 0% and increases as students register */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isSoldOut
                      ? 'bg-rose-500'
                      : isFillingFast
                      ? 'bg-amber-500'
                      : 'bg-teal-700'
                  }`}
                  style={{ width: `${percentBooked}%` }}
                />
              </div>

              {isFillingFast && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mt-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Only {seatsLeft} seats remaining! Filling fast.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">You are registered!</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Pass ID: <span className="font-mono font-semibold">{userReg?.id}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => userReg && openTicketModal(userReg)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View & Print Digital Pass</span>
                  </button>
                </div>
              ) : isSoldOut ? (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold cursor-not-allowed text-center"
                >
                  Registrations Full (100 / 100 Filled)
                </button>
              ) : (
                <button
                  onClick={() => navigate('registration', event.id)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                >
                  <span>Proceed to Register Now</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero registration fee for enrolled students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant QR pass confirmation sent to profile</span>
              </div>
            </div>
          </div>

          {/* Organizer Info Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Event Organizer
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Organizing Club</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{event.organizer.club}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Lead Coordinator</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{event.organizer.name}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <a
                  href={`mailto:${event.organizer.email}`}
                  className="flex items-center gap-2 text-teal-800 hover:text-slate-800"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{event.organizer.email}</span>
                </a>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{event.organizer.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
