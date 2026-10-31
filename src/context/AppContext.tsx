import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CampusEvent,
  StudentUser,
  AdminUser,
  Registration,
  NotificationItem,
  ViewPage,
  ToastMessage,
  EventCategory,
  PaymentProvider,
  AttendeeType,
} from '../types';
import {
  SAMPLE_EVENTS,
  INITIAL_STUDENT,
  INITIAL_ADMIN,
  INITIAL_REGISTRATIONS,
  INITIAL_NOTIFICATIONS,
  ADMIN_CREDENTIALS,
} from '../data/seedData';

interface AppContextType {
  events: CampusEvent[];
  registrations: Registration[];
  notifications: NotificationItem[];
  currentUser: StudentUser | null;
  adminUser: AdminUser | null;
  userRole: 'student' | 'admin' | 'guest';
  isAdminAuthenticated: boolean;
  currentView: ViewPage;
  selectedEventId: string | null;
  selectedRegistration: Registration | null;
  ticketModalOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  toasts: ToastMessage[];

  // Navigation
  navigate: (view: ViewPage, eventId?: string) => void;
  setSelectedEventId: (id: string | null) => void;
  openTicketModal: (registration: Registration) => void;
  closeTicketModal: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;

  // Actions
  registerForEvent: (data: {
    eventId: string;
    studentName: string;
    collegeId: string;
    email: string;
    department: string;
    year: string;
    phone: string;
    dietaryPreference?: string;
    attendeeType?: AttendeeType;
    organization?: string;
    paymentMobile?: string;
    utrNumber?: string;
    paymentScreenshotUrl?: string;
    paymentMethod?: string;
    paymentApp?: PaymentProvider;
    bankName?: string;
    amountPaid?: number;
    entryGate?: string;
    seatNumber?: string;
    autoOpenTicket?: boolean;
  }) => { success: boolean; registrationId?: string; message: string };

  cancelRegistration: (registrationId: string) => void;
  isStudentRegistered: (eventId: string, studentId?: string) => Registration | undefined;

  // Admin actions
  createEvent: (eventData: Omit<CampusEvent, 'id' | 'availableSeats'>) => void;
  updateEvent: (eventId: string, updated: Partial<CampusEvent>) => void;
  deleteEvent: (eventId: string) => void;
  updateRegistrationStatus: (
    registrationId: string,
    status: Registration['status'],
    adminNotes?: string
  ) => void;

  // Auth
  loginStudent: (
    email: string,
    passwordOrId?: string,
    name?: string,
    organization?: string,
    phone?: string
  ) => boolean;
  signupStudent: (data: {
    name: string;
    email: string;
    collegeId?: string;
    department?: string;
    year?: string;
    phone: string;
    attendeeType?: AttendeeType;
    organization?: string;
    password?: string;
  }) => boolean;
  loginAdmin: (email: string, pass?: string) => boolean;
  logoutAdmin: () => void;
  logout: () => void;
  switchRole: (role: 'student' | 'admin') => void;

  // Notifications & Toasts
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Utilities
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'campus_events_v4',
  REGISTRATIONS: 'campus_registrations_v4',
  NOTIFICATIONS: 'campus_notifications_v4',
  STUDENT: 'campus_student_user_v4',
  ADMIN: 'campus_admin_user_v4',
  ROLE: 'campus_active_role_v4',
  REGISTERED_USERS: 'campus_registered_users_v5',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage with safe fallback
  const [registeredUsers, setRegisteredUsers] = useState<StudentUser[]>(() => {
    try {
      const stored = localStorage.getItem('campus_registered_users_v5');
      return stored ? JSON.parse(stored) : [INITIAL_STUDENT];
    } catch {
      return [INITIAL_STUDENT];
    }
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return stored ? JSON.parse(stored) : SAMPLE_EVENTS;
    } catch {
      return SAMPLE_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return stored ? JSON.parse(stored) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENT);
      return stored ? JSON.parse(stored) : INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN);
      return stored ? JSON.parse(stored) : INITIAL_ADMIN;
    } catch {
      return INITIAL_ADMIN;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('campus_admin_auth_v5') === 'true';
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<'student' | 'admin' | 'guest'>(() => {
    try {
      return localStorage.getItem('campus_admin_auth_v5') === 'true' ? 'admin' : 'student';
    } catch {
      return 'student';
    }
  });
  const [currentView, setCurrentView] = useState<ViewPage>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Toast helper
  const addToast = (
    title: string,
    message?: string,
    type: ToastMessage['type'] = 'info'
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigate = (view: ViewPage, eventId?: string) => {
    if (eventId) {
      setSelectedEventId(eventId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTicketModal = (reg: Registration) => {
    setSelectedRegistration(reg);
    setTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setTicketModalOpen(false);
  };

  // Check if student registered
  const isStudentRegistered = (eventId: string, studentId?: string) => {
    const targetStudentId = studentId || currentUser?.id;
    if (!targetStudentId) return undefined;
    return registrations.find(
      (r) => r.eventId === eventId && r.studentId === targetStudentId && r.status !== 'Cancelled'
    );
  };

  // Registration flow
  const registerForEvent = (data: {
    eventId: string;
    studentName: string;
    collegeId: string;
    email: string;
    department: string;
    year: string;
    phone: string;
    dietaryPreference?: string;
    attendeeType?: AttendeeType;
    organization?: string;
    paymentMobile?: string;
    utrNumber?: string;
    paymentScreenshotUrl?: string;
    paymentMethod?: string;
    paymentApp?: PaymentProvider;
    bankName?: string;
    amountPaid?: number;
    entryGate?: string;
    seatNumber?: string;
    autoOpenTicket?: boolean;
  }) => {
    const event = events.find((e) => e.id === data.eventId);
    if (!event) {
      addToast('Event Not Found', 'The requested event does not exist.', 'error');
      return { success: false, message: 'Event not found' };
    }

    const currentEventRegs = registrations.filter(
      (r) => r.eventId === data.eventId && r.status !== 'Cancelled'
    ).length;

    if (currentEventRegs >= event.totalSeats || event.availableSeats <= 0) {
      addToast('Event Full', 'This event has reached its maximum limit of 100 registrations.', 'warning');
      return { success: false, message: 'Event is full' };
    }

    // Check duplicate
    const existing = registrations.find(
      (r) =>
        r.eventId === data.eventId &&
        r.collegeId.trim().toUpperCase() === data.collegeId.trim().toUpperCase() &&
        r.status !== 'Cancelled'
    );

    if (existing) {
      addToast('Already Registered', `You already have an active registration: ${existing.id}`, 'warning');
      return { success: false, registrationId: existing.id, message: 'Already registered for this event' };
    }

    // Generate unique ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const categoryPrefix = event.category.substring(0, 2).toUpperCase();
    const newRegId = `REG-2026-${categoryPrefix}${randomCode}`;

    const studentId = `std_${data.collegeId.trim().toUpperCase()}`;
    const isManualUtrSubmission = (data.paymentMethod || '').includes('UTR submitted for confirmation');
    const initialStatus = event.requiresApproval || isManualUtrSubmission ? 'Pending Approval' : 'Confirmed';

    // Gate & Seat allocation
    const gates = ['GATE-A (Main Lobby)', 'GATE-B (East Wing)', 'GATE-C (Auditorium Front)'];
    const assignedGate = data.entryGate || gates[currentEventRegs % gates.length];
    const assignedSeat = data.seatNumber || `SEAT-${String((currentEventRegs % 100) + 1).padStart(2, '0')}`;
    const verificationId = `VER-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const verifiedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const isExternal =
      data.attendeeType === 'external' ||
      data.collegeId.toUpperCase().startsWith('EXT-') ||
      currentUser?.attendeeType === 'external';
    const attendeeType: AttendeeType = isExternal ? 'external' : 'student';

    // Store/update active attendee profile with the exact details the user entered
    const studentUser: StudentUser = {
      id: studentId,
      name: data.studentName,
      email: data.email,
      collegeId: data.collegeId.toUpperCase(),
      department: data.department,
      year: data.year,
      phone: data.phone,
      attendeeType,
      organization: data.organization || (isExternal ? data.department : undefined),
    };
    setCurrentUser(studentUser);
    setUserRole('student');

    const newRegistration: Registration = {
      id: newRegId,
      eventId: event.id,
      eventTitle: event.name,
      eventDate: event.date,
      eventTime: event.startTime,
      eventVenue: event.venue,
      eventCategory: event.category,
      eventPosterUrl: event.posterUrl,
      studentId: studentId,
      studentName: data.studentName,
      studentEmail: data.email,
      collegeId: data.collegeId.toUpperCase(),
      department: data.department,
      year: data.year,
      phone: data.phone,
      attendeeType,
      organization: data.organization || (isExternal ? data.department : undefined),
      dietaryPreference: data.dietaryPreference || 'NON-VEG',
      registeredAt: verifiedAt,
      status: initialStatus,
      qrData: `CAMPUS-PASS-${newRegId}-${data.collegeId.toUpperCase()}-${event.id}`,
      paymentMobile: data.paymentMobile || 'Official Campus UPI',
      utrNumber: data.utrNumber,
      paymentScreenshotUrl: data.paymentScreenshotUrl,
      paymentMethod: data.paymentMethod || (data.paymentApp ? `${data.paymentApp} Verified` : 'Official Campus UPI'),
      paymentApp: data.paymentApp,
      bankName: data.bankName,
      amountPaid: data.amountPaid ?? 1,
      entryGate: assignedGate,
      seatNumber: assignedSeat,
      verificationId: verificationId,
      verifiedAt: verifiedAt,
    };

    // Decrement available seats
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, availableSeats: Math.max(0, e.availableSeats - 1) } : e
      )
    );

    setRegistrations((prev) => [newRegistration, ...prev]);

    // Send confirmation notification
    const newNotification: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientId: studentId,
      title: initialStatus === 'Confirmed' ? 'Admission Pass Issued!' : 'Registration Submitted',
      message: initialStatus === 'Confirmed'
        ? `Payment verified & ticket generated for "${event.name}". Assigned: ${assignedGate} (${assignedSeat}). Pass ID: ${newRegId}.`
        : `Your registration for "${event.name}" was submitted and is pending coordinator approval. Pass ID: ${newRegId}.`,
      type: 'confirmation',
      timestamp: 'Just now',
      read: false,
      eventId: event.id,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(
      initialStatus === 'Confirmed' ? 'Registration Confirmed' : 'UTR Submitted · Pass Generated',
      `Pass ID: ${newRegId} · ${assignedGate}`,
      initialStatus === 'Confirmed' ? 'success' : 'info'
    );

    // Automatic Ticket Generation: instantly select and open ticket
    setSelectedRegistration(newRegistration);
    if (data.autoOpenTicket !== false) {
      setTicketModalOpen(true);
    }

    return {
      success: true,
      registrationId: newRegId,
      message: 'Registration created and ticket generated successfully',
    };
  };

  // Cancel registration
  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;

    // Restore seat if it was confirmed or pending
    if (reg.status !== 'Cancelled') {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === reg.eventId ? { ...e, availableSeats: Math.min(e.totalSeats, e.availableSeats + 1) } : e
        )
      );
    }

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: 'Cancelled' as const } : r))
    );

    // Notification
    const cancellationNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientId: reg.studentId,
      title: 'Registration Cancelled',
      message: `Your registration for "${reg.eventTitle}" (${registrationId}) has been cancelled. The seat has been released.`,
      type: 'cancellation',
      timestamp: 'Just now',
      read: false,
      eventId: reg.eventId,
    };
    setNotifications((prev) => [cancellationNotif, ...prev]);

    addToast('Registration Cancelled', `Pass ${registrationId} is now marked cancelled.`, 'info');
  };

  // Admin event actions
  const createEvent = (eventData: Omit<CampusEvent, 'id' | 'availableSeats'>) => {
    const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEvent: CampusEvent = {
      ...eventData,
      id,
      availableSeats: eventData.totalSeats,
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Broadcast notification
    const broadcastNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientId: 'all',
      title: 'New Campus Event Announced!',
      message: `"${newEvent.name}" is now open for registration at ${newEvent.venue}.`,
      type: 'update',
      timestamp: 'Just now',
      read: false,
      eventId: id,
    };
    setNotifications((prev) => [broadcastNotif, ...prev]);

    addToast('Event Created', `"${newEvent.name}" has been published.`, 'success');
  };

  const updateEvent = (eventId: string, updated: Partial<CampusEvent>) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          // If totalSeats modified, clamp availableSeats
          let available = e.availableSeats;
          if (updated.totalSeats !== undefined && updated.totalSeats !== e.totalSeats) {
            const booked = e.totalSeats - e.availableSeats;
            available = Math.max(0, updated.totalSeats - booked);
          }
          return { ...e, ...updated, availableSeats: available };
        }
        return e;
      })
    );

    addToast('Event Updated', 'Changes were saved successfully.', 'success');
  };

  const deleteEvent = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    // Cancel all registrations for this event
    setRegistrations((prev) =>
      prev.map((r) => (r.eventId === eventId ? { ...r, status: 'Cancelled' as const } : r))
    );

    addToast('Event Deleted', evt ? `"${evt.name}" was removed.` : 'Event deleted.', 'warning');
  };

  const updateRegistrationStatus = (
    registrationId: string,
    status: Registration['status'],
    adminNotes?: string
  ) => {
    const targetReg = registrations.find((r) => r.id === registrationId);
    if (!targetReg) return;

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId ? { ...r, status, ...(adminNotes ? { adminNotes } : {}) } : r
      )
    );

    // Notify student
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientId: targetReg.studentId,
      title: `Registration Status: ${status}`,
      message: `Your registration for "${targetReg.eventTitle}" is now ${status}. ${
        adminNotes ? `Coordinator Note: ${adminNotes}` : ''
      }`,
      type: status === 'Confirmed' ? 'confirmation' : status === 'Cancelled' ? 'cancellation' : 'update',
      timestamp: 'Just now',
      read: false,
      eventId: targetReg.eventId,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('Status Updated', `Pass ${registrationId} updated to ${status}.`, 'info');
  };

  // Auth for Students & External (Outer) Attendees
  const loginStudent = (
    email: string,
    passwordOrId?: string,
    name?: string,
    organization?: string,
    phone?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if college student email: must end with @klu.ac.in
    const isKluStudent = cleanEmail.endsWith('@klu.ac.in');
    const rollNumberMatch = cleanEmail.split('@')[0];
    const isNumericRoll = /^\d+$/.test(rollNumberMatch);

    // Look for registered user in memory/storage
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (name && (!existing.name || existing.name === 'Outer Attendee')) existing.name = name;
      if (organization) {
        existing.organization = organization;
        existing.department = organization;
      }
      if (phone) existing.phone = phone;

      setCurrentUser(existing);
      setUserRole('student');
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(existing));
      addToast(
        'Welcome Back!',
        `Signed in as ${existing.name} (${existing.attendeeType === 'external' ? 'Outer Guest' : existing.collegeId})`,
        'success'
      );
      return true;
    }

    if (isKluStudent) {
      const rollNumber = rollNumberMatch.toUpperCase();
      const student: StudentUser = {
        id: `std_${rollNumber.toLowerCase()}`,
        name: name || (isNumericRoll ? `Student ${rollNumber}` : cleanEmail.split('@')[0]),
        email: cleanEmail,
        collegeId: rollNumber,
        department: 'Computer Science & Engineering',
        year: '1st Year',
        phone: phone || '+91 98480 12345',
        attendeeType: 'student',
        password: passwordOrId,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };

      setRegisteredUsers((prev) => {
        const updated = [student, ...prev.filter((u) => u.email !== cleanEmail)];
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updated));
        return updated;
      });

      setCurrentUser(student);
      setUserRole('student');
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
      addToast(
        'Student Sign In Successful!',
        `Welcome, Student ${rollNumber}! Campus pass active.`,
        'success'
      );
      return true;
    } else {
      // External / Outer participant
      const extPassId = `EXT-${Math.floor(1000 + Math.random() * 9000)}`;
      const outerUser: StudentUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Outer Attendee',
        email: cleanEmail,
        collegeId: extPassId,
        department: organization || 'External Participant',
        year: 'Outer Guest Attendee',
        phone: phone || '+91 98765 43210',
        attendeeType: 'external',
        organization: organization || 'Outside Institution',
        password: passwordOrId,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };

      setRegisteredUsers((prev) => {
        const updated = [outerUser, ...prev.filter((u) => u.email !== cleanEmail)];
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updated));
        return updated;
      });

      setCurrentUser(outerUser);
      setUserRole('student');
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(outerUser));
      addToast(
        'Signed In Successfully!',
        `Welcome, ${outerUser.name}! Outer / Guest access active.`,
        'success'
      );
      return true;
    }
  };

  const signupStudent = (data: {
    name: string;
    email: string;
    collegeId?: string;
    department?: string;
    year?: string;
    phone: string;
    attendeeType?: AttendeeType;
    organization?: string;
    password?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const isExternal =
      data.attendeeType === 'external' ||
      !data.collegeId ||
      data.collegeId.startsWith('EXT-') ||
      !cleanEmail.endsWith('.ac.in');

    const assignedId = data.collegeId?.trim()
      ? data.collegeId.trim().toUpperCase()
      : isExternal
      ? `EXT-${Math.floor(1000 + Math.random() * 9000)}`
      : `STD-${cleanEmail.split('@')[0].toUpperCase().slice(0, 10)}`;

    const newAttendee: StudentUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      collegeId: assignedId,
      department: isExternal
        ? (data.organization || data.department || 'External Participant')
        : (data.department || 'Computer Science & Engineering'),
      year: isExternal ? 'Guest / Outer Attendee' : (data.year || '1st Year'),
      phone: data.phone.trim(),
      attendeeType: isExternal ? 'external' : 'student',
      organization: data.organization || (isExternal ? (data.department || 'External') : undefined),
      password: data.password,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };

    setRegisteredUsers((prev) => {
      const updated = [newAttendee, ...prev.filter((u) => u.email !== cleanEmail)];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(newAttendee);
    setUserRole('student');
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(newAttendee));
    addToast(
      'Account Created!',
      `Welcome to Campus Events, ${newAttendee.name}! Registered as ${isExternal ? 'Outer / Guest Attendee' : 'Campus Student'}.`,
      'success'
    );
    return true;
  };

  const loginAdmin = (email: string, pass?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass?.trim() || '';

    if (
      cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
      cleanPass === ADMIN_CREDENTIALS.password
    ) {
      const admin: AdminUser = {
        id: 'adm_vishnu',
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role,
        department: ADMIN_CREDENTIALS.department,
      };
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
      setUserRole('admin');
      localStorage.setItem('campus_admin_auth_v5', 'true');
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
      addToast(
        'Admin Access Granted',
        'Welcome! Successfully authenticated as Administrator.',
        'success'
      );
      navigate('admin-dashboard');
      return true;
    } else {
      addToast(
        'Access Denied',
        'Invalid admin credentials. Students are not permitted access.',
        'error'
      );
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('campus_admin_auth_v5');
    setUserRole('student');
    navigate('home');
    addToast('Admin Signed Out', 'Administrator session ended securely.', 'info');
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('campus_admin_auth_v5');
    setUserRole('guest');
    addToast('Logged Out', 'You have been signed out.', 'info');
  };

  const switchRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      if (isAdminAuthenticated) {
        setUserRole('admin');
        navigate('admin-dashboard');
        addToast('Switched to Admin View', `Authenticated as ${adminUser?.name || 'Administrator'}`, 'info');
      } else {
        navigate('admin-login');
        addToast('Admin Authentication Required', 'Please enter administrator password to proceed.', 'warning');
      }
    } else {
      setUserRole('student');
      navigate('home');
      addToast('Switched to Student View', `Signed in as ${currentUser?.name || 'Student'}`, 'info');
    }
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All Read', 'Notifications marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const resetToSampleData = () => {
    setEvents(SAMPLE_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_STUDENT);
    setAdminUser(INITIAL_ADMIN);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('campus_admin_auth_v5');
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    addToast('Data Reset', 'Restored pristine sample events and registrations.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        events,
        registrations,
        notifications,
        currentUser,
        adminUser,
        userRole,
        isAdminAuthenticated,
        currentView,
        selectedEventId,
        selectedRegistration,
        ticketModalOpen,
        searchQuery,
        selectedCategory,
        toasts,
        navigate,
        setSelectedEventId,
        openTicketModal,
        closeTicketModal,
        setSearchQuery,
        setSelectedCategory,
        registerForEvent,
        cancelRegistration,
        isStudentRegistered,
        createEvent,
        updateEvent,
        deleteEvent,
        updateRegistrationStatus,
        loginStudent,
        signupStudent,
        loginAdmin,
        logoutAdmin,
        logout,
        switchRole,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addToast,
        removeToast,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
