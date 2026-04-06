import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password. The link might be expired.');
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Create New Password</h2>
          <p className="text-slate-500 text-sm">Enter a strong new password for your account</p>
        </div>
        
        <form onSubmit={handleReset} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1.5 ml-1">New Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary transition-all text-slate-900 placeholder:text-slate-300"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1.5 ml-1">Confirm New Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary transition-all text-slate-900 placeholder:text-slate-300"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 sm:py-4 rounded-xl mt-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Remembered your password? <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
