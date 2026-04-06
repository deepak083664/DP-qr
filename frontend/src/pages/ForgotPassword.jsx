import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { measureToast } from '../utils/toastHelpers'; // fall-back to normal sonner toast if not exist
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      setSuccess(true);
      toast.success('If the email exists, a reset link has been sent to it.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-80px)] bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-sm sm:max-w-md p-6 sm:p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Reset Password</h2>
          <p className="text-slate-500 text-sm">Enter your email and we'll send you a link to reset your password</p>
        </div>
        
        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="name@company.com"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary transition-all text-slate-900 placeholder:text-slate-300"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 sm:py-4 rounded-xl mt-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center">
            <svg className="w-12 h-12 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-bold text-emerald-800 mb-2">Check your email</h3>
            <p className="text-emerald-600 text-sm">We've sent a password reset link to <span className="font-medium">{email}</span></p>
          </div>
        )}
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Remember your password? <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
