import React from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { InviteShareSection } from '../components/InviteShareSection';
import {
  Sparkles,
  Search,
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    events,
    navigate,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    registrations,
  } = useApp();

  const categories = [
    { name: 'Technical', count: events.filter((e) => e.category === 'Technical').length, icon: Zap },
    { name: 'Cultural', count: events.filter((e) => e.category === 'Cultural').length, icon: Sparkles },
    { name: 'Sports', count: events.filter((e) => e.category === 'Sports').length, icon: Trophy },
    { name: 'Workshop', count: events.filter((e) => e.category === 'Workshop').length, icon: BookOpen },
    { name: 'Competitions', count: events.filter((e) => e.category === 'Competitions').length, icon: Compass },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('events');
  };

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    navigate('events');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900 text-white pt-16 pb-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Quiet unboxed kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-300">
            <span>Campus Mega Events</span>
            <span aria-hidden="true" className="text-teal-600">·</span>
            <span>Nov 21 & Nov 22, 2026</span>
            <span aria-hidden="true" className="text-teal-600">·</span>
            <span className="text-amber-400">Near Auditorium</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover. Register. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Participate.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal">
            Your official registration gateway for 8 campus events scheduled on November 21st & 22nd. 100 seats per event with 800 total student capacity. Reserve your seat and generate your digital pass.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3 w-full px-3 py-2 text-white">
              <Search className="w-5 h-5 text-teal-300 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Hackathon, Cultural Fest, Sports Meet, Quiz..."
                className="w-full bg-transparent text-sm text-white placeholder-teal-100/60 outline-hidden font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-colors shrink-0"
            >
              Search Events
            </button>
          </form>

          {/* Quick Filter suggestions */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-teal-100/80 pt-2">
            <span className="font-semibold text-white">Event Dates:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                navigate('events');
              }}
              className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-amber-300 transition-colors font-medium"
            >
              Nov 21 (4 Events)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                navigate('events');
              }}
              className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-amber-300 transition-colors font-medium"
            >
              Nov 22 (4 Events)
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                8
              </div>
              <div className="text-xs text-teal-100 mt-1">Total Campus Events</div>
              <div className="text-[10px] text-amber-300">4 on Nov 21 · 4 on Nov 22</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                800
              </div>
              <div className="text-xs text-teal-100 mt-1">Total Student Capacity</div>
              <div className="text-[10px] text-emerald-400">Open for all students</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                100
              </div>
              <div className="text-xs text-teal-100 mt-1">Seats / Each Event</div>
              <div className="text-[10px] text-teal-300">Fair equal allocation</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                Near Aud
              </div>
              <div className="text-xs text-teal-100 mt-1">Campus Event Helpdesk</div>
              <div className="text-[10px] text-amber-300 truncate">eventcell@klu.ac.in</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Categories Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Explore by Category
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Filter activities aligned with your passions and academic profile
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                navigate('events');
              }}
              className="text-xs font-bold text-teal-800 hover:text-slate-800 flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover:bg-slate-800 text-teal-800 group-hover:text-amber-400 flex items-center justify-center transition-colors mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {cat.count} {cat.count === 1 ? 'Event' : 'Events'}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Events Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Events
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Browse all 8 campus competitions, workshops, and gatherings scheduled on Nov 21 & Nov 22
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                navigate('events');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors self-start sm:self-auto"
            >
              <span>View Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Seamless 3-Step Campus Event Participation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              No paper forms or physical line-ups required. Everything is managed through your college profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-slate-700 font-extrabold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Discover & Select</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by technical tracks, cultural nights, athletic meets, or career workshops with verified seats and dates.
              </p>
            </div>

            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-extrabold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">1-Click Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-fill your student ID, roll number, and department. Instant validation reserves your seat in real time.
              </p>
            </div>

            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Show QR & Participate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access your digital pass under "My Registrations" anytime, scan at the auditorium gate, and earn certificates.
              </p>
            </div>
          </div>
        </section>

        {/* Invite Fellow Students & Mobile QR Code Share Section */}
        <InviteShareSection />
      </div>
    </div>
  );
};
