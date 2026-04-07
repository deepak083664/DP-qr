import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import Pricing from './pages/Pricing';
import Upgrade from './pages/Upgrade';
import PaymentSuccess from './pages/PaymentSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
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
          </main>
          <Footer />
          <Toaster theme="light" position="bottom-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
