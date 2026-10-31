import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { Search, Filter, Calendar, X, Sparkles, Layers } from 'lucide-react';
import { EventCategory } from '../types';

export const EventsPage: React.FC = () => {
  const { events, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | 'nov21' | 'nov22'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'fillingFast'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'seats' | 'name'>('date');

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Workshop',
    'Quiz Competition',
    'Coding Contest',
    'Competitions',
    'Academic',
    'Social & Community',
  ];

  // Filtering & Sorting
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = evt.name.toLowerCase().includes(q);
          const matchDesc = evt.description.toLowerCase().includes(q);
          const matchVenue = evt.venue.toLowerCase().includes(q);
          const matchClub = evt.organizer.club.toLowerCase().includes(q);
          const matchCategory = evt.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchVenue && !matchClub && !matchCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
          return false;
        }

        // Date filter
        if (dateFilter === 'nov21' && evt.date !== '2026-11-21') {
          return false;
        }
        if (dateFilter === 'nov22' && evt.date !== '2026-11-22') {
          return false;
        }

        // Availability filter
        if (availabilityFilter === 'available' && evt.availableSeats <= 0) {
          return false;
        }
        if (
          availabilityFilter === 'fillingFast' &&
          (evt.availableSeats <= 0 || evt.availableSeats > evt.totalSeats * 0.25)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'seats') {
          return b.availableSeats - a.availableSeats;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [events, searchQuery, selectedCategory, dateFilter, availabilityFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    dateFilter !== 'all' ||
    availabilityFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setDateFilter('all');
    setAvailabilityFilter('all');
    setSortBy('date');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          {/* Unboxed breadcrumb kicker */}
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-800 mb-1">
            Campus Catalog · Fall 2026
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Events
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Explore hackathons, workshops, inter-college cultural battles, athletic matches, and quiz championships. Filter by track and secure your digital seat.
          </p>
        </div>

        {/* Total matches counter */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Layers className="w-3.5 h-3.5 text-teal-800" />
          <span className="font-semibold text-slate-900">{filteredEvents.length}</span>
          <span>{filteredEvents.length === 1 ? 'Event found' : 'Events found'}</span>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top row: Search input + Sorting */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, venue, club, or keyword..."
              className="w-full text-xs pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-hidden text-slate-900 placeholder-slate-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 outline-hidden focus:border-teal-500 font-medium"
            >
              <option value="date">Date (Earliest First)</option>
              <option value="seats">Available Seats (High to Low)</option>
              <option value="name">Event Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons (Functional Buttons, not static pills) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Month & Seat Availability */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Month Filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">Date Schedule:</span>
              <div className="inline-flex rounded-md bg-slate-100 p-0.5">
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    dateFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All Dates (8)
                </button>
                <button
                  onClick={() => setDateFilter('nov21')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    dateFilter === 'nov21' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Nov 21 (4 Events)
                </button>
                <button
                  onClick={() => setDateFilter('nov22')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    dateFilter === 'nov22' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Nov 22 (4 Events)
                </button>
              </div>
            </div>

            {/* Seat Filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-medium">Availability:</span>
              <div className="inline-flex rounded-md bg-slate-100 p-0.5">
                <button
                  onClick={() => setAvailabilityFilter('all')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    availabilityFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setAvailabilityFilter('available')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    availabilityFilter === 'available'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Open Seats
                </button>
                <button
                  onClick={() => setAvailabilityFilter('fillingFast')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    availabilityFilter === 'fillingFast'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Filling Fast
                </button>
              </div>
            </div>
          </div>

          {/* Reset Filters action */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No events match your criteria</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search terms, changing the category, or clearing filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors inline-block"
          >
            Clear All Active Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
};
