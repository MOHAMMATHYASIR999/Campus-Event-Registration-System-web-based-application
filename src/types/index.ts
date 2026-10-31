export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Academic'
  | 'Competitions'
  | 'Quiz Competition'
  | 'Coding Contest'
  | 'Social & Community';

export interface CampusEvent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  posterUrl: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:30 AM"
  endTime: string; // e.g. "05:00 PM"
  venue: string;
  organizer: {
    name: string;
    club: string;
    email: string;
    phone: string;
  };
  totalSeats: number;
  availableSeats: number;
  eligibility: string;
  perks: string[];
  rules: string[];
  price: number; // Event registration fee in INR (e.g. 1, 1.5, 2)
  isFeatured?: boolean;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  requiresApproval?: boolean;
}

export type AttendeeType = 'student' | 'external';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  collegeId: string; // Registration Number or External Pass ID (e.g. EXT-2026-8812)
  department: string;
  year: string;
  phone: string;
  avatarUrl?: string;
  attendeeType?: AttendeeType;
  organization?: string; // External College / University / Organization / City
  password?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export type PaymentProvider = 'PhonePe' | 'Google Pay' | 'Paytm' | 'Net Banking' | 'UPI QR' | 'Razorpay';

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCategory: string;
  eventPosterUrl?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  collegeId: string;
  department: string;
  year: string;
  phone: string;
  attendeeType?: AttendeeType;
  organization?: string;
  dietaryPreference?: string;
  registeredAt: string;
  status: 'Confirmed' | 'Pending Approval' | 'Cancelled' | 'Attended';
  qrData: string;
  adminNotes?: string;
  paymentMobile?: string;
  utrNumber?: string;
  paymentScreenshotUrl?: string;
  paymentMethod?: string;
  paymentApp?: PaymentProvider;
  bankName?: string;
  amountPaid?: number;
  entryGate?: string;
  seatNumber?: string;
  verificationId?: string;
  verifiedAt?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // Student ID or 'admin' or 'all'
  title: string;
  message: string;
  type: 'confirmation' | 'reminder' | 'update' | 'cancellation' | 'admin';
  timestamp: string;
  read: boolean;
  eventId?: string;
}

export type ViewPage =
  | 'home'
  | 'events'
  | 'event-detail'
  | 'registration'
  | 'my-registrations'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'admin-login'
  | 'login'
  | 'signup';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
