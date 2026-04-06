import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const formattedDate = user?.planExpiry 
    ? new Date(user.planExpiry).toLocaleDateString() 
    : 'N/A';

  return (
    <div className="flex flex-col items-center p-6 md:p-12 min-h-[calc(100vh-80px)]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Your Profile</h1>

        <div className="glass-card mb-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500">{user?.isAdmin ? 'Administrator' : 'Standard User'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-5 h-5 text-slate-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Shield className="w-5 h-5 text-slate-400" />
              <span>Role: {user?.isAdmin ? 'Admin' : 'User'}</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Plan Status</p>
              <p className={`font-bold ${user?.isPaid ? 'text-emerald-600' : 'text-slate-700'}`}>
                {user?.isPaid ? 'Active Premium' : 'Free Plan'}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Expiry Date</p>
              <p className="font-bold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {user?.isPaid ? formattedDate : 'Never'}
              </p>
            </div>
          </div>

          {!user?.isPaid && (
            <div className="mt-6">
              <Link to="/dashboard" className="w-full sm:w-auto inline-flex justify-center bg-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-primary/90 transition-all">
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
