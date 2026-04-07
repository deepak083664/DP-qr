import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      login(res.data.user, res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            <div className="flex justify-between items-center mb-1.5 mx-1">
              <label className="block text-xs sm:text-sm font-medium text-slate-500">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline hover:text-primary/80 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 sm:py-3.5 focus:outline-none focus:border-primary transition-all text-slate-900 placeholder:text-slate-300"
                value={password} onChange={e => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 sm:py-4 rounded-xl mt-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Create account</Link>
        </p>
      </motion.div>
    </div>


  );
};

export default Login;
