import React from 'react';
import { CampusEvent } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: CampusEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { navigate, isStudentRegistered, openTicketModal, registrations } = useApp();

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

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
        <img
          src={event.posterUrl}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Clean interactive status flag in corner */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
          <span>{event.category}</span>
        </div>

        {isRegistered && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registered</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium mb-2">
            <span className="flex items-center gap-1 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-teal-800 shrink-0" />
              <span>{event.date}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.startTime}</span>
            </span>
          </div>

          {/* Event Title */}
          <h3
            onClick={() => navigate('event-detail', event.id)}
            className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-teal-800 cursor-pointer transition-colors"
          >
            {event.name}
          </h3>

          {/* Tagline / Snippet */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {event.tagline || event.description}
          </p>

          {/* Venue & Organizer */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.organizer.club}</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar & Action Button */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Registrations</span>
            <span className="font-mono font-semibold text-slate-800">
              {registeredCount} / {event.totalSeats}
              {isSoldOut ? (
                <span className="text-rose-600 font-sans ml-1 text-[11px] font-bold">
                  (Event Full)
                </span>
              ) : (
                <span className="text-slate-500 font-sans ml-1 text-[11px] font-normal">
                  ({seatsLeft} seats left)
                </span>
              )}
            </span>
          </div>

          {/* Seat Progress Meter - Starts at 0% and fills up as registrations increase to 100% */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSoldOut
                  ? 'bg-rose-500'
                  : isFillingFast
                  ? 'bg-amber-500'
                  : 'bg-teal-700'
              }`}
              style={{ width: `${percentBooked}%` }}
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('event-detail', event.id)}
              className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
            >
              Details
            </button>

            {isRegistered ? (
              <button
                onClick={() => userReg && openTicketModal(userReg)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>View Pass</span>
              </button>
            ) : isSoldOut ? (
              <button
                disabled
                className="flex-1 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg cursor-not-allowed text-center"
              >
                Event Full
              </button>
            ) : (
              <button
                onClick={() => navigate('registration', event.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg shadow-xs transition-colors"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
