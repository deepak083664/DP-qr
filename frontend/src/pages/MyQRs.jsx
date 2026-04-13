import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, Calendar, QrCode, Edit3, X, Upload, Loader2, Crown, Link as LinkIcon, Type, Image as ImageIcon, FileText, ExternalLink, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExpiryDisplay = ({ expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState('');
    
    useEffect(() => {
        if (!expiresAt) return;
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = new Date(expiresAt).getTime() - now;
            
            if (distance <= 0) {
                setTimeLeft('Expired');
            } else if (distance < 24 * 60 * 60 * 1000) {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(null);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    if (!expiresAt) return <span className="text-emerald-600 font-semibold">Never Expires</span>;
    if (timeLeft === 'Expired') return <span className="text-red-500 font-bold">Expired</span>;
    if (timeLeft) return <span className="text-amber-500 font-mono font-bold animate-pulse">Expires in {timeLeft}</span>;
    return <span>Exp: {new Date(expiresAt).toLocaleDateString()}</span>;
};

const MyQRs = () => {
    const { token, user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit State
    const [editingQr, setEditingQr] = useState(null);
    const [editType, setEditType] = useState('url');
    const [editContent, setEditContent] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);

    // Body scroll lock effect
    useEffect(() => {
        if (editingQr) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [editingQr]);

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

    const handleDelete = async (shortId) => {
        if (!window.confirm("Are you sure you want to delete this QR Code entirely?")) return;
        
        setIsDeleting(true);
        try {
            await axios.delete(`${BASE_URL}/api/qr/delete/${shortId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success("QR Code deleted successfully");
            fetchHistory();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to delete QR code");
        } finally {
            setIsDeleting(false);
        }
    };

    const openEditModal = (qr) => {
        setEditingQr(qr);
        setEditType(qr.type || 'url');
        setEditContent(qr.type === 'url' || qr.type === 'text' ? qr.originalUrl : '');
        setEditFile(null);
    };

    const handleSaveEdit = async () => {
        if (!editingQr) return;
        
        // Validation
        if ((editType === 'pdf' || editType === 'image') && !editFile && editType !== editingQr.type) {
            toast.error(`Please select a ${editType} file`);
            return;
        }
        if ((editType === 'url' || editType === 'text') && !editContent) {
            toast.error('Content cannot be empty');
            return;
        }

        setIsSaving(true);
        let finalContent = editContent;

        try {
            // Upload new file if needed (if user provided a new file, OR if they changed type to a file and provided a file)
            if ((editType === 'pdf' || editType === 'image') && editFile) {
                const formData = new FormData();
                formData.append('file', editFile);
                const uploadRes = await axios.post(`${BASE_URL}/api/upload/file`, formData, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                finalContent = uploadRes.data.url;
            } else if ((editType === 'pdf' || editType === 'image') && !editFile && editType === editingQr.type) {
                // Kept old file untouched
                finalContent = editingQr.originalUrl;
            }

            // Save via PUT
            await axios.put(`${BASE_URL}/api/qr/edit/${editingQr.shortId}`, {
                type: editType,
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
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 relative min-h-[85vh]">
            {/* Consolidated One-Layer Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24 z-30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <QrCode className="w-6 h-6 text-primary" />
                            My <span className="gradient-text">QRs</span>
                        </h1>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2 group">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status:</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <div className={`w-2 h-2 rounded-full ${user?.isAdmin || user?.planType !== 'free' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`}></div>
                            <span className="text-xs font-bold text-slate-700">{user?.isAdmin ? 'ADMIN' : (user?.planType ? user.planType.replace('_', ' ').toUpperCase() : 'FREE')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {(user?.planType === 'free' || !user?.planType) && !user?.isAdmin && (
                        <Link to="/pricing" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-md active:scale-95">
                            <Crown className="w-3.5 h-3.5" /> Upgrade
                        </Link>
                    )}
                    <div className="text-[11px] text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hidden sm:flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> {history.length} Codes Created
                    </div>
                </div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
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
                            className="glass p-5 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col"
                        >
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm flex-shrink-0 cursor-pointer" onClick={() => window.open(item.originalUrl, '_blank')}>
                                    <img src={item.qrCodeUrl} alt="QR" className="w-full h-full object-contain hover:scale-105 transition-transform" />
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
                                            Scans: <span className="font-bold text-primary">{item.scans}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            <ExpiryDisplay expiresAt={item.expiresAt} />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                                <button 
                                    onClick={() => handleDownload(item.qrCodeUrl, item.shortId)}
                                    className="flex-[2] bg-slate-50 hover:bg-primary hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-200"
                                >
                                    <Download className="w-3 h-3" /> Download
                                </button>
                                
                                {(user?.planType !== 'free' || user?.isAdmin) ? (
                                    <>
                                        <button 
                                            onClick={() => openEditModal(item)}
                                            className="flex-1 bg-slate-50 hover:bg-purple-500 hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-200 text-slate-600"
                                            title="Edit QR Options"
                                        >
                                            <Edit3 className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-2 flex-1">
                                        <Link 
                                            to="/pricing"
                                            className="flex-1 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-amber-200 text-amber-600"
                                            title="Upgrade to Edit/Delete"
                                        >
                                            <Crown className="w-3 h-3" /> Get Pro
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Modal Structural Overhaul */}
            <AnimatePresence>
                {editingQr && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50">
                        {/* Layer 1: Global Backdrop (Dense/Solid for focus) */}
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-50 z-[101]"
                        />

                        {/* Layer 2: Dedicated Independent Scroll Surface */}
                        <div className="fixed inset-0 overflow-y-auto z-[102] flex flex-col items-center">
                            {/* Mobile-Adaptive Container */}
                            <div className="min-h-full w-full flex items-start justify-center py-6 sm:py-12 px-0 sm:px-4">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 1, y: 30 }} 
                                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                                    exit={{ opacity: 0, scale: 1, y: 30 }}
                                    className="bg-white sm:rounded-[2rem] shadow-2xl w-full max-w-lg pointer-events-auto flex flex-col relative min-h-screen sm:min-h-0"
                                >
                                    {/* Header Section (Natural Flow) */}
                                    <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[2rem]">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Edit QR</h3>
                                            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Dynamic Destination Update</p>
                                        </div>
                                        <button 
                                            onClick={() => !isSaving && setEditingQr(null)}
                                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Body Section (Natural Flow) */}
                                    <div className="p-6 md:p-8 space-y-8">
                                        <div className="bg-blue-50 text-blue-800 text-sm p-5 rounded-2xl border border-blue-100/50 shadow-sm shadow-blue-500/5">
                                            <p className="font-bold flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                Immutable QR Image
                                            </p>
                                            <p className="mt-2 opacity-90 leading-relaxed text-[11px] sm:text-xs">
                                                The physical QR pattern will not change. Scanners will instantly be redirected to your new destination once saved.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-5">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Select Content Type</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                                                    {[
                                                        { id: 'url', icon: LinkIcon, label: 'URL' },
                                                        { id: 'text', icon: Type, label: 'Text' },
                                                        { id: 'image', icon: ImageIcon, label: 'Image' },
                                                        { id: 'pdf', icon: FileText, label: 'PDF' }
                                                    ].map(tab => (
                                                        <button
                                                            key={tab.id}
                                                            onClick={() => { setEditType(tab.id); setEditContent(''); setEditFile(null); }}
                                                            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl font-bold transition-all ${editType === tab.id ? 'bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                                                        >
                                                            <tab.icon className="w-4 h-4 shrink-0" />
                                                            <span className="text-[10px]">{tab.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                                                    {editType === 'url' ? 'New Destination URL' : 
                                                     editType === 'text' ? 'New Display Text' : 
                                                     `Upload ${editType.toUpperCase()} File`}
                                                </label>
                                                
                                                {(editType === 'url' || editType === 'text') ? (
                                                    <input 
                                                        type="text" 
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        placeholder={`e.g. ${editType === 'url' ? 'https://google.com' : 'Your text here...'}`}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-slate-900 transition-all placeholder:text-slate-300 font-medium"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all bg-slate-50 cursor-pointer relative group">
                                                        <input 
                                                            type="file" 
                                                            accept={editType === 'image' ? 'image/*' : 'application/pdf'}
                                                            onChange={(e) => setEditFile(e.target.files[0])}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-[1]"
                                                        />
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <Upload className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-slate-700 font-bold block">Choose a new file</span>
                                                            <p className="text-[11px] text-slate-400 mt-2 font-medium uppercase tracking-tight">Format: {editType.toUpperCase()}</p>
                                                        </div>
                                                        {editFile && (
                                                            <div className="mt-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2 max-w-full">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                                <span className="truncate">{editFile.name}</span>
                                                            </div>
                                                        )}
                                                        {(!editFile && editType === editingQr.type) && (
                                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 mt-2">
                                                                Replacing current {editType}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Section (Natural Flow) */}
                                    <div className="p-6 md:p-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/50 rounded-b-[2rem]">
                                        <button 
                                            onClick={() => setEditingQr(null)}
                                            disabled={isSaving}
                                            className="order-2 sm:order-1 flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-slate-500 font-bold hover:bg-slate-200 transition-all hover:text-slate-700 disabled:opacity-50"
                                        >
                                            Discard
                                        </button>
                                        <button 
                                            onClick={handleSaveEdit}
                                            disabled={isSaving || ((editType === 'pdf' || editType === 'image') && !editFile && editType !== editingQr.type) || ((editType === 'text' || editType === 'url') && !editContent)}
                                            className="order-1 sm:order-2 flex-[2] sm:flex-none px-10 py-3.5 rounded-2xl bg-primary hover:bg-slate-900 text-white font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale active:scale-95"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Apply Changes</>}
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyQRs;
