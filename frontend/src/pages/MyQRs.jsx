import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, ExternalLink, Calendar, QrCode, Edit3, X, Upload, Loader2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyQRs = () => {
    const { token, user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit State
    const [editingQr, setEditingQr] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/qr/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setHistory(data);
            } else {
                toast.error(data.error || 'Failed to fetch history');
            }
        } catch (err) {
            console.error(err);
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (dataUrl, name) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qr-${name || 'code'}.png`;
        link.click();
    };

    const openEditModal = (qr) => {
        setEditingQr(qr);
        setEditContent(qr.type === 'url' || qr.type === 'text' ? qr.originalUrl : '');
        setEditFile(null);
    };

    const handleSaveEdit = async () => {
        if (!editingQr) return;
        
        // Validation
        if ((editingQr.type === 'pdf' || editingQr.type === 'image') && !editFile) {
            toast.error(`Please select a new ${editingQr.type} file`);
            return;
        }
        if ((editingQr.type === 'url' || editingQr.type === 'text') && !editContent) {
            toast.error('Content cannot be empty');
            return;
        }

        setIsSaving(true);
        let finalContent = editContent;

        try {
            // Upload new file if needed
            if ((editingQr.type === 'pdf' || editingQr.type === 'image') && editFile) {
                const formData = new FormData();
                formData.append('file', editFile);
                const uploadRes = await axios.post(`${BASE_URL}/api/upload/file`, formData, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                finalContent = uploadRes.data.url;
            }

            // Save via PUT
            await axios.put(`${BASE_URL}/api/qr/edit/${editingQr.shortId}`, {
                content: finalContent
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('QR Content updated successfully!');
            setEditingQr(null);
            fetchHistory(); // Refresh
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to update content');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 relative">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
            >
                <h1 className="text-4xl font-bold mb-4">My Generated <span className="gradient-text">QR Codes</span></h1>
                <p className="text-slate-500">Manage and track your all time generated QR codes here.</p>
            </motion.div>

            {history.length === 0 ? (
                <div className="glass p-12 text-center rounded-3xl">
                    <QrCode className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600">No QR codes found</h3>
                    <p className="text-slate-400 mt-2">Start generating QR codes to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass p-5 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group relative overflow-hidden"
                        >
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm flex-shrink-0">
                                    <img src={item.qrCodeUrl} alt="QR" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                item.type === 'url' ? 'bg-blue-100 text-blue-600' : 
                                                item.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                                item.type === 'image' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold truncate mb-1" title={item.originalUrl || 'QR Code'}>
                                            {item.originalUrl || 'QR Code'}
                                        </h3>
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" />
                                            Scans: <span className="font-bold text-primary">{item.scans}</span>
                                        </p>
                                    </div>
                                    
                                    <div className="mt-3 flex gap-2">
                                        <button 
                                            onClick={() => handleDownload(item.qrCodeUrl, item.shortId)}
                                            className="flex-[2] bg-slate-50 hover:bg-primary hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-200"
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </button>
                                        
                                        {(user?.planType !== 'free' || user?.isAdmin) ? (
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="flex-1 bg-slate-50 hover:bg-purple-500 hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-200 text-slate-600"
                                                title="Edit Destination"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                            </button>
                                        ) : (
                                            <Link 
                                                to="/pricing"
                                                className="flex-1 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-amber-200 text-amber-600"
                                                title="Upgrade to Edit"
                                            >
                                                <Crown className="w-3 h-3" />
                                            </Link>
                                        )}

                                        <a 
                                            href={item.originalUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center bg-slate-50 hover:bg-slate-200 transition-colors rounded-lg text-slate-600 border border-slate-200"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editingQr && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => !isSaving && setEditingQr(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Edit QR Destination</h3>
                                    <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Dynamic Content Update</p>
                                </div>
                                <button 
                                    onClick={() => !isSaving && setEditingQr(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl border border-blue-100/50">
                                    <p className="font-semibold">Your QR image stays exactly the same!</p>
                                    <p className="mt-1 opacity-90 text-xs">Anyone scanning this existing QR code will instantly be redirected to the new content you set below.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        {editingQr.type === 'url' ? 'New Target URL' : 
                                         editingQr.type === 'text' ? 'New Display Text' : 
                                         `Upload New ${editingQr.type.toUpperCase()} File`}
                                    </label>
                                    
                                    {(editingQr.type === 'url' || editingQr.type === 'text') ? (
                                        <input 
                                            type="text" 
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            placeholder={`Enter new ${editingQr.type}...`}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all placeholder:text-slate-400"
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors bg-slate-50 cursor-pointer relative">
                                            <input 
                                                type="file" 
                                                accept={editingQr.type === 'image' ? 'image/*' : 'application/pdf'}
                                                onChange={(e) => setEditFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center pointer-events-none">
                                                <Upload className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="text-center pointer-events-none">
                                                <span className="text-slate-600 font-medium">Click to select new file</span>
                                                <p className="text-xs text-slate-400 mt-1">Replacing current {editingQr.type}</p>
                                            </div>
                                            {editFile && <span className="text-sm font-bold text-green-600 mt-2 bg-green-50 px-3 py-1 rounded-md max-w-[200px] truncate">{editFile.name}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                                <button 
                                    onClick={() => setEditingQr(null)}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveEdit}
                                    disabled={isSaving || ((editingQr.type === 'pdf' || editingQr.type === 'image') && !editFile) || ((editingQr.type === 'text' || editingQr.type === 'url') && !editContent)}
                                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyQRs;
