import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Ticket,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  BookOpen,
  Trophy,
  User,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    registrations,
    events,
    navigate,
    openTicketModal,
    isStudentRegistered,
  } = useApp();

  const studentRegs = registrations.filter(
    (r) =>
      currentUser &&
      (r.studentId === currentUser.id ||
        r.collegeId === currentUser.collegeId ||
        (currentUser.email && r.studentEmail?.toLowerCase() === currentUser.email.toLowerCase()))
  );

  const activeRegistrations = studentRegs.filter((r) => r.status !== 'Cancelled');
  const confirmedRegistrations = studentRegs.filter((r) => r.status === 'Confirmed');

  // Categorize registrations into upcoming and completed based on event date
  const todayStr = '2026-09-28';
  const upcomingRegs = activeRegistrations.filter((r) => r.eventDate >= todayStr);
  const completedRegs = studentRegs.filter((r) => r.eventDate < todayStr || r.status === 'Attended');

  // Discover other events student hasn't registered for
  const registeredEventIds = new Set(activeRegistrations.map((r) => r.eventId));
  const recommendedEvents = events.filter((e) => !registeredEventIds.has(e.id)).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Student Welcome & Profile Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-md">
              {currentUser?.name.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                <span>{currentUser?.attendeeType === 'external' ? 'Outer / External Guest' : 'Campus Student'}</span>
                {currentUser?.collegeId && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-amber-300">{currentUser.collegeId}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {currentUser?.name || 'Attendee Hub'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-teal-100 mt-1">
                <span>
                  {currentUser?.attendeeType === 'external' ? 'Affiliation: ' : 'Department: '}
                  <strong className="text-white">{currentUser?.department || currentUser?.organization || 'General Public'}</strong>
                </span>
                <span aria-hidden="true" className="text-teal-500">·</span>
                <span>Category: <strong className="text-white">{currentUser?.attendeeType === 'external' ? 'Outer Guest' : (currentUser?.year || '1st Year')}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('events')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-colors"
            >
              Browse Events
            </button>
            <button
              onClick={() => navigate('my-registrations')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-colors border border-white/10"
            >
              My Ticket Passes
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Registered
            </span>
            <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
              {studentRegs.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {confirmedRegistrations.length} confirmed passes
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Events
            </span>
            <div className="text-3xl font-extrabold text-slate-800 font-mono mt-1">
              {upcomingRegs.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Registered events
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed / Attended
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
              {completedRegs.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Certificates earned
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Select Event to Register Section in Student Portal */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Select an Event to Register
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click Register on any of the 8 campus events scheduled on Nov 21 & Nov 22.
            </p>
          </div>
          <button
            onClick={() => navigate('events')}
            className="text-xs font-bold text-teal-800 hover:text-slate-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => {
            const isReg = isStudentRegistered(evt.id);
            const count = registrations.filter(
              (r) => r.eventId === evt.id && r.status !== 'Cancelled'
            ).length;
            const isFull = count >= evt.totalSeats;

            return (
              <div
                key={evt.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50/50 transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="font-semibold text-teal-800">{evt.category}</span>
                    <span>·</span>
                    <span>{evt.date} ({evt.startTime})</span>
                  </div>
                  <h4
                    onClick={() => navigate('event-detail', evt.id)}
                    className="text-sm font-bold text-slate-900 truncate hover:text-teal-800 cursor-pointer"
                  >
                    {evt.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>
                      Registrations: <strong className="font-mono text-slate-800">{count}/{evt.totalSeats}</strong>
                    </span>
                    {isFull && <span className="text-rose-600 font-bold">(Event Full)</span>}
                  </div>
                </div>

                <div className="shrink-0">
                  {isReg ? (
                    <button
                      onClick={() => openTicketModal(isReg)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                    >
                      Full
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('registration', evt.id)}
                      className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors shadow-xs"
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Grid: Schedule Timeline + Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Schedule Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Events Schedule
            </h2>
            <button
              onClick={() => navigate('my-registrations')}
              className="text-xs font-semibold text-teal-800 hover:text-slate-800 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingRegs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No events registered yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't registered for any events yet. Select an event above to register.
              </p>
              <button
                onClick={() => navigate('events')}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingRegs.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-mono text-teal-800 font-bold">{reg.id}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{reg.eventCategory}</span>
                    </div>

                    <h4
                      onClick={() => navigate('event-detail', reg.eventId)}
                      className="text-base font-bold text-slate-900 hover:text-teal-800 cursor-pointer"
                    >
                      {reg.eventTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                        <span>{reg.eventDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                        <span>{reg.eventTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                        <span className="truncate max-w-[180px]">{reg.eventVenue}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openTicketModal(reg)}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors shrink-0"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Pass</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Discover Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Recommended for You
            </h2>
            <button
              onClick={() => navigate('events')}
              className="text-xs font-semibold text-teal-800 hover:text-slate-800"
            >
              See All &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {recommendedEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate('event-detail', evt.id)}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={evt.posterUrl}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider block">
                      {evt.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-800">
                      {evt.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{evt.date}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-800 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ / Guidelines Card */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-800" />
              <span>Event Desk (Near Auditorium)</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Entry passes are scanned digitally at auditorium gates. For queries or assistance, contact Campus Event Coordination Desk Near Central Auditorium or email <strong>eventcell@klu.ac.in</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
