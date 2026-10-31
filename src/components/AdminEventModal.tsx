import React, { useState, useEffect } from 'react';
import { CampusEvent, EventCategory } from '../types';
import { X, Image, Plus, Trash2, Calendar, Clock, MapPin, Users, Award, ShieldCheck } from 'lucide-react';

interface AdminEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CampusEvent, 'id' | 'availableSeats'>) => void;
  onUpdate?: (id: string, updated: Partial<CampusEvent>) => void;
  initialEvent?: CampusEvent | null;
}

const PRESET_POSTERS = [
  { label: 'Hackathon / Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cultural / Fest', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Meet', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Technical Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiz Competition', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Coding Contest', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminEventModal: React.FC<AdminEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  initialEvent,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [posterUrl, setPosterUrl] = useState(PRESET_POSTERS[0].url);
  const [date, setDate] = useState('2026-11-21');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [endTime, setEndTime] = useState('04:30 PM');
  const [venue, setVenue] = useState('Near Central Auditorium');
  const [organizerName, setOrganizerName] = useState('Event Desk Lead');
  const [organizerClub, setOrganizerClub] = useState('Event Desk (Near Auditorium)');
  const [organizerEmail, setOrganizerEmail] = useState('eventcell@klu.ac.in');
  const [organizerPhone, setOrganizerPhone] = useState('Ext. 2104');
  const [totalSeats, setTotalSeats] = useState(100);
  const [eligibility, setEligibility] = useState('Open to all enrolled students with valid ID');
  const [isFeatured, setIsFeatured] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [status, setStatus] = useState<'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'>('Upcoming');

  const [perksText, setPerksText] = useState('Certificate of Participation, Cash Prize for Winners, Refreshments');
  const [rulesText, setRulesText] = useState('College ID mandatory, Pre-registration required, Adhere to campus discipline');

  useEffect(() => {
    if (initialEvent) {
      setName(initialEvent.name);
      setTagline(initialEvent.tagline);
      setDescription(initialEvent.description);
      setCategory(initialEvent.category);
      setPosterUrl(initialEvent.posterUrl);
      setDate(initialEvent.date);
      setStartTime(initialEvent.startTime);
      setEndTime(initialEvent.endTime);
      setVenue(initialEvent.venue);
      setOrganizerName(initialEvent.organizer.name);
      setOrganizerClub(initialEvent.organizer.club);
      setOrganizerEmail(initialEvent.organizer.email);
      setOrganizerPhone(initialEvent.organizer.phone);
      setTotalSeats(initialEvent.totalSeats);
      setEligibility(initialEvent.eligibility);
      setIsFeatured(Boolean(initialEvent.isFeatured));
      setRequiresApproval(Boolean(initialEvent.requiresApproval));
      setStatus(initialEvent.status);
      setPerksText(initialEvent.perks.join(', '));
      setRulesText(initialEvent.rules.join(', '));
    } else {
      // Reset form
      setName('');
      setTagline('');
      setDescription('');
      setCategory('Technical');
      setPosterUrl(PRESET_POSTERS[0].url);
      setDate('2026-10-30');
      setStartTime('09:30 AM');
      setEndTime('04:30 PM');
      setVenue('Central Campus Auditorium');
      setTotalSeats(150);
      setIsFeatured(false);
      setRequiresApproval(false);
      setStatus('Upcoming');
    }
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const perks = perksText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const rules = rulesText
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const eventPayload: Omit<CampusEvent, 'id' | 'availableSeats'> = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      posterUrl,
      date,
      startTime,
      endTime,
      venue: venue.trim(),
      organizer: {
        name: organizerName.trim(),
        club: organizerClub.trim(),
        email: organizerEmail.trim(),
        phone: organizerPhone.trim(),
      },
      totalSeats: Number(totalSeats),
      eligibility: eligibility.trim(),
      perks,
      rules,
      price: 1, // Fixed ₹1 registration fee
      isFeatured,
      requiresApproval,
      status,
    };

    if (initialEvent && onUpdate) {
      onUpdate(initialEvent.id, eventPayload);
    } else {
      onSave(eventPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <h3 className="text-base font-bold">
              {initialEvent ? 'Edit Campus Event' : 'Create New Campus Event'}
            </h3>
            <p className="text-xs text-slate-300">
              Configure schedule, venue, seat quota, and eligibility details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Event Title & Tagline */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Name / Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. National Robotics Challenge 2026"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catchy Tagline *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Battle of autonomous rovers and computer vision drones"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Event Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide event details, schedule highlights, and prerequisites..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Quiz Competition">Quiz Competition</option>
                <option value="Coding Contest">Coding Contest</option>
                <option value="Competitions">Competitions</option>
                <option value="Academic">Academic</option>
                <option value="Social & Community">Social & Community</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seat Capacity *
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                required
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time *
              </label>
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 05:00 PM"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Venue Location *
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Main Auditorium, Block A, Room 201"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
            />
          </div>

          {/* Poster Image Presets & Custom URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Poster Cover Image *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_POSTERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPosterUrl(preset.url)}
                  className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all ${
                    posterUrl === preset.url
                      ? 'border-teal-700 scale-105 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-white py-0.5 text-center truncate px-0.5">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="url"
              required
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden mt-2 font-mono"
            />
          </div>

          {/* Organizer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty / Student Lead Coordinator
              </label>
              <input
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Host Club or Academic Department
              </label>
              <input
                type="text"
                value={organizerClub}
                onChange={(e) => setOrganizerClub(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>
          </div>

          {/* Eligibility, Perks & Rules */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Eligibility Requirements
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. All UG & PG Students, or B.Tech CS Only"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Perks & Benefits (comma separated)
              </label>
              <input
                type="text"
                value={perksText}
                onChange={(e) => setPerksText(e.target.value)}
                placeholder="e.g. Certificate, Cash Prize, Free Lunch, T-Shirt"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rules & Guidelines (comma separated)
              </label>
              <input
                type="text"
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                placeholder="e.g. Bring college ID, Laptop mandatory, Teams of 2"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>
          </div>

          {/* Toggles: Featured & Requires Approval */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-slate-800 border-slate-300"
              />
              <span>Mark as Flagship / Featured Event</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="w-4 h-4 rounded text-slate-800 border-slate-300"
              />
              <span>Require Coordinator Manual Approval for Registrations</span>
            </label>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              {initialEvent ? 'Save Changes' : 'Publish Campus Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
