import React from 'react';
import { BASE_URL } from '../config';
import { motion } from 'framer-motion';

const Login = () => {
  const handleGoogleLogin = () => {
    // Explicitly use Vercel proxy to hide the Render URL backend
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-80px)] bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card w-full max-w-sm sm:max-w-md p-8 sm:p-12 shadow-2xl rounded-3xl"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6"
          >
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-slate-900 tracking-tight">Welcome</h2>
          <p className="text-slate-500 font-medium pb-2">Log in or create an account instantly.</p>
        </div>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 sm:py-5 rounded-2xl transition-all shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 group"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[15px] sm:text-[17px]">Continue with Google</span>
        </button>
        
        <p className="mt-8 text-center text-xs text-slate-400 max-w-[250px] mx-auto leading-relaxed">
          By continuing, you agree to our <a href="/terms" className="underline hover:text-slate-600">Terms of Service</a> and <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
