import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { Trash2, Download, ExternalLink, Calendar, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const MyQRs = () => {
    const { token } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
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

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
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
                            className="glass p-5 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group"
                        >
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm flex-shrink-0">
                                    <img src={item.qrCodeUrl} alt="QR" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
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
                                    <h3 className="text-sm font-semibold truncate mb-1">
                                        {item.originalUrl || 'QR Code'}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        Scans: <span className="font-bold text-primary">{item.scans}</span>
                                    </p>
                                    
                                    <div className="mt-3 flex gap-2">
                                        <button 
                                            onClick={() => handleDownload(item.qrCodeUrl, item.shortId)}
                                            className="flex-1 bg-slate-50 hover:bg-primary hover:text-white transition-colors py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </button>
                                        <a 
                                            href={item.originalUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 bg-slate-50 hover:bg-slate-200 transition-colors rounded-lg text-slate-600"
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
        </div>
    );
};

export default MyQRs;
