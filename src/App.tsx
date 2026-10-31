import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { TicketPassModal } from './components/TicketPassModal';

import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AuthPage } from './pages/AuthPage';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-[calc(100vh-140px)]">
      {currentView === 'home' && <HomePage />}
      {currentView === 'events' && <EventsPage />}
      {currentView === 'event-detail' && <EventDetailPage />}
      {currentView === 'registration' && <RegistrationPage />}
      {currentView === 'my-registrations' && <MyRegistrationsPage />}
      {currentView === 'student-dashboard' && <StudentDashboard />}
      {currentView === 'admin-dashboard' && <AdminDashboard />}
      {currentView === 'admin-login' && <AdminLoginPage />}
      {(currentView === 'login' || currentView === 'signup') && <AuthPage />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-slate-800">
        <Navbar />
        <MainContent />
        <Footer />
        <TicketPassModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
