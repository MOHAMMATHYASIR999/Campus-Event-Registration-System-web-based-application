import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Calendar,
  Ticket,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  RefreshCw,
  Search,
  Lock,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigate,
    userRole,
    currentUser,
    adminUser,
    isAdminAuthenticated,
    logoutAdmin,
    switchRole,
    logout,
    notifications,
    registrations,
    events,
    resetToSampleData,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.recipientId === 'all' || (currentUser && n.recipientId === currentUser.id))
  ).length;

  const myActiveRegistrations = registrations.filter(
    (r) => currentUser && r.studentId === currentUser.id && r.status !== 'Cancelled'
  ).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('events');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top utility stripe with campus identity */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              Campus Event Helpdesk (Near Central Auditorium) · <span className="text-teal-300">eventcell@klu.ac.in</span>
            </span>
          </div>

          {/* Quick Role Switcher for seamless evaluation */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden sm:inline">Active View:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => switchRole('student')}
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                  userRole === 'student'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student View
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                  userRole === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-teal-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                CampusConnect
              </span>
              <span className="text-[11px] font-semibold text-teal-800 tracking-wider uppercase block">
                Events & Tickets
              </span>
            </div>
          </div>

          {/* Center Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xs mx-4"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hackathons, sports, fests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-teal-500 rounded-lg outline-hidden text-slate-800 placeholder-slate-400 transition-all"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-slate-800 bg-teal-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigate('events')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'events'
                  ? 'text-slate-800 bg-teal-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Events</span>
              <span className="text-[11px] font-mono font-medium text-slate-500 ml-0.5">
                ({events.length})
              </span>
            </button>

            <button
              onClick={() => navigate('my-registrations')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'my-registrations'
                  ? 'text-slate-800 bg-teal-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Ticket className="w-4 h-4 text-slate-400" />
              <span>My Registrations</span>
              {myActiveRegistrations > 0 && (
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">
                  {myActiveRegistrations}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('student-dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'student-dashboard'
                  ? 'text-slate-800 bg-teal-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>{currentUser?.attendeeType === 'external' ? 'My Hub' : 'Attendee Hub'}</span>
            </button>

            <button
              onClick={() => navigate(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'admin-dashboard' || currentView === 'admin-login'
                  ? 'text-amber-800 bg-amber-50 font-bold ring-1 ring-amber-200'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/50'
              }`}
            >
              {isAdminAuthenticated ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Hub</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Login</span>
                </>
              )}
            </button>
          </nav>

          {/* Right actions: Notifications + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <NotificationDrawer onClose={() => setNotificationsOpen(false)} />
              )}
            </div>

            {/* Profile Dropdown / User indicator */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {userRole === 'admin' ? (
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    AD
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {currentUser?.name.charAt(0) || 'S'}
                  </div>
                )}
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-semibold text-slate-800 block truncate max-w-[110px]">
                    {userRole === 'admin'
                      ? 'Administrator'
                      : currentUser?.name || 'Guest'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {userRole === 'admin' ? 'Staff Portal' : currentUser?.collegeId}
                  </span>
                </div>
              </button>

              {/* Profile dropdown menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-slate-100 bg-slate-50/60 rounded-lg mb-2">
                    <p className="text-xs font-semibold text-slate-900">
                      {userRole === 'admin' ? 'Administrator' : currentUser?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {userRole === 'admin' ? 'Authenticated Staff Console' : currentUser?.email}
                    </p>
                    {userRole === 'student' && currentUser && (
                      <p className="text-[10px] font-mono text-teal-800 mt-1 font-semibold">
                        {currentUser.attendeeType === 'external' ? 'Pass ID: ' : 'ID: '}
                        {currentUser.collegeId} · {currentUser.department}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-xs font-medium">
                    <button
                      onClick={() => navigate('student-dashboard')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>{currentUser?.attendeeType === 'external' ? 'My Attendee Hub' : 'Student Dashboard'}</span>
                    </button>
                    <button
                      onClick={() => navigate('my-registrations')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-left"
                    >
                      <Ticket className="w-4 h-4 text-slate-400" />
                      My Registrations & Tickets
                    </button>
                    {isAdminAuthenticated ? (
                      <>
                        <button
                          onClick={() => navigate('admin-dashboard')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-amber-800 hover:bg-amber-50 rounded-lg text-left font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Control Center
                        </button>
                        <button
                          onClick={logoutAdmin}
                          className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out of Admin
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate('admin-login')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-left"
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                        Admin Portal (Staff Only)
                      </button>
                    )}
                    <button
                      onClick={resetToSampleData}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-left"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                      Reset Demo Data
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        navigate('login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-100 rounded-lg text-slate-800 placeholder-slate-400"
              />
            </form>

            <div className="space-y-1">
              <button
                onClick={() => {
                  navigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === 'home' ? 'bg-teal-50 text-slate-800' : 'text-slate-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('events');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  currentView === 'events' ? 'bg-teal-50 text-slate-800' : 'text-slate-700'
                }`}
              >
                <span>Browse All Events</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {events.length}
                </span>
              </button>
              <button
                onClick={() => {
                  navigate('my-registrations');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  currentView === 'my-registrations'
                    ? 'bg-teal-50 text-slate-800'
                    : 'text-slate-700'
                }`}
              >
                <span>My Registered Events</span>
                <span className="text-xs bg-teal-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  {myActiveRegistrations}
                </span>
              </button>
              <button
                onClick={() => {
                  navigate('student-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === 'student-dashboard'
                    ? 'bg-teal-50 text-slate-800'
                    : 'text-slate-700'
                }`}
              >
                Student Dashboard
              </button>
              <button
                onClick={() => {
                  navigate(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  currentView === 'admin-dashboard' || currentView === 'admin-login'
                    ? 'bg-amber-50 font-bold text-amber-900'
                    : 'text-slate-700'
                }`}
              >
                {isAdminAuthenticated ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Control Portal</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Admin Login (Staff Only)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
