import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, { name, email, password });
      login(res.data.user, res.data.token);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Create Account</h2>
          <p className="text-slate-500 text-sm">Join DP QR-generator and start creating today</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4 sm:gap-5">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="John Doe"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary transition-all text-slate-900 placeholder:text-slate-300"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
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
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary transition-all text-slate-900 placeholder:text-slate-300"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 sm:py-4 rounded-xl mt-3 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Log in</Link>
        </p>
      </motion.div>
    </div>


  );
};

export default Signup;
