import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Settings, Save, Loader2, IndianRupee, Users, Activity, Crown, Mail } from 'lucide-react';

const Admin = () => {
  const [settings, setSettings] = useState({ oneMonthPrice: 499, threeMonthsPrice: 1299, oneYearPrice: 3999 });
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('premium');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchStats();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users');
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

  const filteredUsers = users.filter(u => activeTab === 'premium' ? u.isPaid : true);


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

        {/* User Management Section */}
        <div className="mt-8 glass-card p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-900 w-full sm:w-auto">User Management</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('premium')}
                className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'premium' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Premium Users
              </button>
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All Users
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 whitespace-nowrap">User</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 whitespace-nowrap">Plan</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 whitespace-nowrap">Joined</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 whitespace-nowrap">Expiry</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right whitespace-nowrap">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No users found in this category.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.isPaid ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
                          {u.planType.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {u.isPaid && u.planExpiry ? new Date(u.planExpiry).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a 
                          href={`mailto:${u.email}`} 
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500 transition-colors"
                          title="Mail User"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
