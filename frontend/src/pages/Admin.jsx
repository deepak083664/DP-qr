import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Settings, Save, Loader2, IndianRupee, Users, Activity, Crown } from 'lucide-react';

const Admin = () => {
  const [settings, setSettings] = useState({ oneMonthPrice: 499, threeMonthsPrice: 1299, oneYearPrice: 3999 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/settings`);
      if (data.settings) {
        setSettings({
          oneMonthPrice: data.settings.oneMonthPrice || 499,
          threeMonthsPrice: data.settings.threeMonthsPrice || 1299,
          oneYearPrice: data.settings.oneYearPrice || 3999,
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Prices updated successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 md:p-12 min-h-[calc(100vh-80px)]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 flex flex-col">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Users className="w-5 h-5" /> Total Users
              </div>
              <span className="text-3xl font-bold text-slate-900">{stats.totalUsers}</span>
            </div>
            
            <div className="glass-card p-6 flex flex-col border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 text-primary mb-2 font-medium">
                <Crown className="w-5 h-5" /> Subscribed Users
              </div>
              <span className="text-3xl font-bold text-primary">{stats.paidUsers}</span>
            </div>

            <div className="glass-card p-6 flex flex-col">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Activity className="w-5 h-5" /> Est. Revenue (INR)
              </div>
              <span className="text-3xl font-bold text-slate-900">₹{stats.estRevenue}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="glass-card p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Manage Plan Prices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">1 Month Plan</label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  required
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all text-slate-900"
                  value={settings.oneMonthPrice}
                  onChange={e => setSettings({...settings, oneMonthPrice: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">3 Months Plan</label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  required
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all text-slate-900"
                  value={settings.threeMonthsPrice}
                  onChange={e => setSettings({...settings, threeMonthsPrice: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">1 Year Plan</label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  required
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all text-slate-900"
                  value={settings.oneYearPrice}
                  onChange={e => setSettings({...settings, oneYearPrice: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Prices
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;
