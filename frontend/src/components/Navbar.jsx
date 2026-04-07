import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        navigate('/admin-login');
        return 0;
      }
      return newCount;
    });
  };

  // Reset click count if no click for 2 seconds
  React.useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center"
      >
      <div onClick={handleBrandClick} className="cursor-pointer">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 z-50">
          <QrCode className="text-primary w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">DP <span className="gradient-text">QR-generator</span></span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">Profile</Link>
            <Link to="/my-qrs" className="text-sm font-medium hover:text-primary transition-colors">My QRs</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors ml-4">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Link to="/signup" className="text-sm font-medium text-white bg-primary px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden z-50 p-2 text-slate-600 hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {user ? (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-slate-900 hover:text-primary transition-colors">Home</Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-slate-900 hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-slate-900 hover:text-primary transition-colors">Profile</Link>
                <Link to="/my-qrs" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-slate-900 hover:text-primary transition-colors">My QRs</Link>
                <Link to="/#pricing" onClick={() => setIsOpen(false)} className="text-2xl font-bold gradient-text">Upgrade Pro</Link>
                <button onClick={handleLogout} className="flex items-center gap-3 text-2xl text-red-600 font-semibold mt-4 pt-4 border-t border-slate-100/50">
                  <LogOut className="w-6 h-6" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-slate-900 hover:text-primary transition-colors">Home</Link>
                <Link to="/#pricing" onClick={() => setIsOpen(false)} className="text-2xl font-bold gradient-text">Upgrade Options</Link>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-slate-900 hover:text-primary transition-colors">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="text-2xl font-bold bg-primary text-white px-10 py-5 rounded-2xl shadow-2xl shadow-primary/40 mt-4">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

