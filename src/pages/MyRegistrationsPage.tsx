import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { Registration } from '../types';

export const MyRegistrationsPage: React.FC = () => {
  const {
    registrations,
    currentUser,
    cancelRegistration,
    openTicketModal,
    navigate,
    addToast,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Confirmed' | 'Pending Approval' | 'Cancelled'>('All');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Filter registrations for active attendee (by studentId, pass/collegeId, or email)
  const studentRegistrations = registrations.filter(
    (r) =>
      currentUser &&
      (r.studentId === currentUser.id ||
        r.collegeId === currentUser.collegeId ||
        (currentUser.email && r.studentEmail?.toLowerCase() === currentUser.email.toLowerCase()))
  );

  const displayedRegistrations = studentRegistrations.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const handleCancelClick = (reg: Registration) => {
    if (window.confirm(`Are you sure you want to cancel your registration for "${reg.eventTitle}"? Your reserved seat will be released back to other students.`)) {
      cancelRegistration(reg.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-800 mb-1">
            Student Ticket Manager
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Registered Events
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View your event passes, check gate status, or cancel attendance to release seats.
          </p>
        </div>

        <button
          onClick={() => navigate('events')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors self-start sm:self-auto shadow-xs"
        >
          <span>Discover More Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs">
        <div className="flex items-center gap-1.5">
          {(['All', 'Confirmed', 'Pending Approval', 'Cancelled'] as const).map((status) => {
            const count =
              status === 'All'
                ? studentRegistrations.length
                : studentRegistrations.filter((r) => r.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{status}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {currentUser?.name ? (
            <>
              Logged in as: <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.collegeId})
            </>
          ) : (
            <span>Ready to register for Nov 21 & 22 events</span>
          )}
        </span>
      </div>

      {/* Registrations List */}
      {displayedRegistrations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {filterStatus === 'All'
              ? 'No event registrations yet'
              : `No registrations with status "${filterStatus}"`}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Discover hackathons, cultural festivals, workshops and competitions scheduled across campus and claim your ticket!
          </p>
          <button
            onClick={() => navigate('events')}
            className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-700 transition-colors inline-block"
          >
            Browse Campus Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRegistrations.map((reg) => {
            const isConfirmed = reg.status === 'Confirmed';
            const isCancelled = reg.status === 'Cancelled';
            const isPending = reg.status === 'Pending Approval';

            return (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side: Thumbnail + Event Logistics */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  {reg.eventPosterUrl && (
                    <div className="w-full sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={reg.eventPosterUrl}
                        alt={reg.eventTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Unboxed Metadata with typographic separator */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-mono text-teal-800 font-bold">{reg.id}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{reg.eventCategory}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Registered on {reg.registeredAt.split(' ')[0]}</span>
                    </div>

                    <h3
                      onClick={() => navigate('event-detail', reg.eventId)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-teal-800 cursor-pointer transition-colors"
                    >
                      {reg.eventTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{reg.eventDate}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{reg.eventTime}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{reg.eventVenue}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Status Badge + Action Buttons */}
                <div className="flex sm:flex-col md:flex-row items-center justify-between md:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  {/* Status Indicator */}
                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                      {isPending && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{reg.status}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isCancelled && (
                      <button
                        onClick={() => openTicketModal(reg)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Digital Pass</span>
                      </button>
                    )}

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelClick(reg)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Cancel Registration"
                        aria-label="Cancel registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
