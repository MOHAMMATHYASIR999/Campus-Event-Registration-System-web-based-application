import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Mail, Phone, MapPin, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, resetToSampleData, isAdminAuthenticated } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight">CampusConnect</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Horizon Institute of Technology · Official Campus Event Discovery & Registration System.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Academic Year 2026–2027
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Student Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('events')}
                  className="hover:text-white transition-colors"
                >
                  All Campus Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('my-registrations')}
                  className="hover:text-white transition-colors"
                >
                  My Registered Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('student-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Student Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Coordinator Portal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Administration
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => navigate(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Admin Control Portal</span>
                  {!isAdminAuthenticated && <span className="text-[10px] text-amber-500">(Login)</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Publish New Event
                </button>
              </li>
              <li>
                <button
                  onClick={resetToSampleData}
                  className="hover:text-white transition-colors"
                >
                  Reset Demo Event Data
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Event Helpdesk (Near Auditorium)
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Near Central Auditorium, Ground Floor</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:eventcell@klu.ac.in" className="hover:text-white">
                  eventcell@klu.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400">
                  Campus Intercom: Ext. 2104
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Campus Event Registration System. All rights reserved.</span>
          <span>Designed with high legibility and real-time seat management.</span>
        </div>
      </div>
    </footer>
  );
};
