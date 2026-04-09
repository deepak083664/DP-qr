import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { Loader2 } from 'lucide-react';

// Lazy-loaded Components (Code Splitting for Performance)
const Landing = React.lazy(() => import('./pages/Landing'));
const About = React.lazy(() => import('./pages/About'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Contact = React.lazy(() => import('./pages/Contact'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Admin = React.lazy(() => import('./pages/Admin'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Upgrade = React.lazy(() => import('./pages/Upgrade'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const MyQRs = React.lazy(() => import('./pages/MyQRs'));

const LoadingFallback = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
    <Loader2 className="w-12 h-12 text-primary animate-spin" />
    <p className="text-slate-500 font-medium animate-pulse">Loading securely...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
          {/* Global Background Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
          
          <Navbar />
          <main className="flex-grow z-10 flex flex-col relative">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/my-qrs" element={
                  <ProtectedRoute>
                    <MyQRs />
                  </ProtectedRoute>
                } />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster theme="light" position="bottom-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
