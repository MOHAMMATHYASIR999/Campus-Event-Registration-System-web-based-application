import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  Info,
  AlertTriangle,
  XCircle,
  X,
  ExternalLink,
} from 'lucide-react';

interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    navigate,
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  // Filter notifications for this student or broadcast
  const userNotifications = notifications.filter(
    (n) => n.recipientId === 'all' || (currentUser && n.recipientId === currentUser.id)
  );

  return (
    <div
      ref={containerRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-800" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Campus Notifications
          </h3>
          <span className="text-[10px] font-semibold bg-teal-100 text-slate-700 px-1.5 py-0.5 rounded-full">
            {userNotifications.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {userNotifications.some((n) => !n.read) && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-teal-800 hover:text-slate-800 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200/60"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Read All</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {userNotifications.length === 0 ? (
          <div className="py-12 px-6 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium text-slate-600">No new campus notifications</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Registration confirmations and event alerts will appear here.
            </p>
          </div>
        ) : (
          userNotifications.map((notif) => {
            let icon = <Info className="w-4 h-4 text-sky-600 shrink-0" />;
            if (notif.type === 'confirmation') {
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            } else if (notif.type === 'reminder') {
              icon = <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
            } else if (notif.type === 'cancellation') {
              icon = <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
            } else if (notif.type === 'update') {
              icon = <AlertTriangle className="w-4 h-4 text-teal-700 shrink-0" />;
            }

            return (
              <div
                key={notif.id}
                className={`p-3.5 transition-colors relative group ${
                  notif.read ? 'bg-white hover:bg-slate-50/70' : 'bg-teal-50/30 hover:bg-teal-50/60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-semibold ${
                          notif.read ? 'text-slate-800' : 'text-slate-900 font-bold'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {notif.eventId && (
                        <button
                          onClick={() => {
                            navigate('event-detail', notif.eventId);
                            markNotificationRead(notif.id);
                            onClose();
                          }}
                          className="text-[10px] font-semibold text-teal-800 hover:text-slate-800 flex items-center gap-1"
                        >
                          View Event <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}

                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-700"
                        >
                          Mark read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-[10px] text-slate-400 hover:text-rose-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <button
          onClick={() => {
            navigate('my-registrations');
            onClose();
          }}
          className="text-xs font-semibold text-teal-800 hover:text-slate-800"
        >
          Check My Active Passes & Tickets &rarr;
        </button>
      </div>
    </div>
  );
};
