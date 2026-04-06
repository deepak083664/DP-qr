import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const Upgrade = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card max-w-lg w-full text-center p-8 sm:p-12"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-extrabold mb-4 text-slate-900">QR Code Expired</h2>
        <p className="text-lg text-slate-600 mb-8 font-medium">
          The creator of this QR code is on the Free Plan, which restricts QR codes to a 24-hour lifetime.
        </p>

        <div className="bg-primary/5 rounded-2xl p-6 mb-8 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Crown className="w-24 h-24 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Is this your QR Code?</h3>
          <p className="text-slate-600 mb-6 relative z-10 text-sm">
            Upgrade to a Premium Plan to instantly reactivate this QR code, get unlimited scans, and remove all limits forever.
          </p>
          <Link 
            to="/pricing" 
            className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-primary/30 relative z-10"
          >
            <Crown className="w-5 h-5" /> View Premium Plans
          </Link>
        </div>

        <Link to="/" className="text-slate-500 hover:text-primary font-medium transition-colors">
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default Upgrade;
