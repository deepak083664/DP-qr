import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hardcoded admin email as requested
      const email = 'ganu9955171746@gmail.com';
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      
      if (res.data.user.isAdmin) {
        login(res.data.user, res.data.token);
        toast.success('Admin access granted');
        navigate('/admin');
      } else {
        toast.error('Access denied: User is not an administrator');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid Admin Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-80px)] bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 sm:p-12 shadow-2xl border-t-4 border-emerald-500"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-slate-500 text-sm font-medium">Authentication required for restricted access</p>
        </div>
        
        <form onSubmit={handleAdminLogin} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 ml-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-900 placeholder:text-slate-300"
                value={password} 
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] mt-2 text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : <Lock className="w-5 h-5" />}
            Unlock Dashboard
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-slate-100/50 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Secure Environment</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
