import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  Calendar,
  Layers,
  Send,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { AdminEventModal } from '../components/AdminEventModal';
import { AdminLoginPage } from './AdminLoginPage';
import { CampusEvent, Registration } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    userRole,
    adminUser,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    events,
    registrations,
    createEvent,
    updateEvent,
    deleteEvent,
    updateRegistrationStatus,
    openTicketModal,
    addToast,
    navigate,
  } = useApp();

  // Tab state
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'broadcast'>('events');

  // Modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);

  // Registration filters
  const [searchRoster, setSearchRoster] = useState('');
  const [filterEventId, setFilterEventId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Strict Admin Guard: Students are blocked and cannot access this portal without credentials
  if (!isAdminAuthenticated || userRole !== 'admin') {
    return <AdminLoginPage />;
  }

  // Analytics
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const pendingApprovals = registrations.filter((r) => r.status === 'Pending Approval').length;
  const confirmedCount = registrations.filter((r) => r.status === 'Confirmed').length;

  const totalSeatsAcross = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const availableSeatsAcross = events.reduce((sum, e) => sum + e.availableSeats, 0);
  const capacityBookedPercent =
    totalSeatsAcross > 0
      ? Math.round(((totalSeatsAcross - availableSeatsAcross) / totalSeatsAcross) * 100)
      : 0;

  // Filter registrations
  const filteredRegistrations = registrations.filter((r) => {
    if (filterEventId !== 'all' && r.eventId !== filterEventId) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchRoster.trim()) {
      const q = searchRoster.toLowerCase();
      const matchName = r.studentName.toLowerCase().includes(q);
      const matchId = r.collegeId.toLowerCase().includes(q);
      const matchEvent = r.eventTitle.toLowerCase().includes(q);
      const matchRegId = r.id.toLowerCase().includes(q);
      const matchDept = r.department.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchEvent && !matchRegId && !matchDept) {
        return false;
      }
    }
    return true;
  });

  // Export roster to CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Event Name',
      'Event Date',
      'Student Name',
      'College ID',
      'Department',
      'Year',
      'Email',
      'Phone',
      'Status',
      'Registered At',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id}"`,
      `"${r.eventTitle}"`,
      `"${r.eventDate}"`,
      `"${r.studentName}"`,
      `"${r.collegeId}"`,
      `"${r.department}"`,
      `"${r.year}"`,
      `"${r.studentEmail}"`,
      `"${r.phone}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Campus-Registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('CSV Exported', `${filteredRegistrations.length} attendee records exported.`, 'success');
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = (evt: CampusEvent) => {
    setEditingEvent(evt);
    setIsEventModalOpen(true);
  };

  const handleDeleteEventClick = (evt: CampusEvent) => {
    if (window.confirm(`Are you sure you want to delete "${evt.name}"? All attendee registrations for this event will be cancelled.`)) {
      deleteEvent(evt.id);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    addToast('Broadcast Sent', `Campus announcement "${broadcastTitle}" broadcasted.`, 'success');
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-28">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Campus Event Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Coordinator Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active Administrator Session · {adminUser?.department || 'Central Event Cell'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors"
            title="Sign out of Administrator console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Published Events
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 mt-1">
            {totalEvents}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active campus catalog</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Attendees
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-800 mt-1">
            {totalRegistrations}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {confirmedCount} confirmed passes
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Capacity Booked
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-600 mt-1">
            {capacityBookedPercent}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across all campus venues</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Pending Approval
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-rose-600 mt-1">
            {pendingApprovals}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Requires coordinator review</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'events'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Manage Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'registrations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Roster ({registrations.length})</span>
          {pendingApprovals > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingApprovals}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'broadcast'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      {/* TAB 1: EVENT MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Event Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Venue</th>
                    <th className="py-3.5 px-4">Capacity Utilization</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((evt) => {
                    const booked = registrations.filter(
                      (r) => r.eventId === evt.id && r.status !== 'Cancelled'
                    ).length;
                    const percent = Math.min(100, Math.round((booked / evt.totalSeats) * 100));

                    return (
                      <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={evt.posterUrl}
                              alt=""
                              className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <div
                                onClick={() => navigate('event-detail', evt.id)}
                                className="font-bold text-slate-900 hover:text-teal-800 cursor-pointer"
                              >
                                {evt.name}
                              </div>
                              <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                                {evt.organizer.club}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-medium text-slate-700">{evt.category}</span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{evt.date}</div>
                          <div className="text-[11px] text-slate-500">{evt.startTime}</div>
                        </td>

                        <td className="py-4 px-4 max-w-[160px] truncate text-slate-600">
                          {evt.venue}
                        </td>

                        <td className="py-4 px-4 min-w-[150px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-mono font-semibold text-slate-800">
                              {booked} / {evt.totalSeats}
                            </span>
                            <span className="text-slate-500">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-teal-700 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              evt.status === 'Upcoming'
                                ? 'bg-teal-50 text-teal-800'
                                : evt.status === 'Ongoing'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {evt.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setFilterEventId(evt.id);
                                setActiveTab('registrations');
                              }}
                              className="p-1.5 text-slate-400 hover:text-teal-800 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View attendees"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(evt)}
                              className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit event"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEventClick(evt)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTRATION ROSTER */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, CSV Export */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchRoster}
                  onChange={(e) => setSearchRoster(e.target.value)}
                  placeholder="Search attendee name, College ID (e.g. 2400031982), or Reg ID..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-teal-500 text-slate-900"
                />
              </div>

              {/* Event Filter */}
              <select
                value={filterEventId}
                onChange={(e) => setFilterEventId(e.target.value)}
                className="w-full sm:w-auto text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-medium text-slate-800"
              >
                <option value="all">All Events ({registrations.length})</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-medium text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-xs shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredRegistrations.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium text-slate-600">No student registrations match filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Pass ID</th>
                      <th className="py-3 px-4">Student Info</th>
                      <th className="py-3 px-4">College ID / Dept</th>
                      <th className="py-3 px-4">Registered Event</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {reg.id}
                        </td>

                        <td className="py-3.5 px-4 min-w-[140px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 block">{reg.studentName}</span>
                            {reg.attendeeType === 'external' || reg.collegeId.startsWith('EXT-') ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Outer Guest
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-slate-700 border border-teal-100">
                                Student
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {reg.studentEmail}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-semibold text-slate-800 block">
                            {reg.collegeId}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                            {reg.department} · {reg.year}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 min-w-[160px]">
                          <span className="font-semibold text-slate-800 block line-clamp-1">
                            {reg.eventTitle}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {reg.eventDate} ({reg.eventTime})
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          <div>{reg.phone}</div>
                          {reg.utrNumber && (
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              UTR: {reg.utrNumber}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                              reg.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : reg.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openTicketModal(reg)}
                              className="p-1.5 text-slate-400 hover:text-teal-800 hover:bg-slate-100 rounded-lg"
                              title="View official digital pass"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {reg.status === 'Pending Approval' && (
                              <>
                                <button
                                  onClick={() => updateRegistrationStatus(reg.id, 'Confirmed', 'Approved by Dean Office')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                                  title="Approve pass"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateRegistrationStatus(reg.id, 'Cancelled', 'Declined by coordinator')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold"
                                  title="Decline pass"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {reg.status === 'Confirmed' && (
                              <button
                                onClick={() => updateRegistrationStatus(reg.id, 'Cancelled', 'Cancelled by coordinator')}
                                className="text-[11px] text-rose-600 hover:text-rose-800 px-2 py-1 hover:bg-rose-50 rounded"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST NOTICE */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Broadcast Campus Notice to Students
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sends an instant notification alert to all registered student accounts.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice Title *
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Schedule Update: Hackathon Venue Relocation"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice Message *
              </label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Provide instructions, reporting timings, or important updates..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>
      )}

      {/* Admin Event Modal */}
      <AdminEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={createEvent}
        onUpdate={updateEvent}
        initialEvent={editingEvent}
      />
    </div>
  );
};
