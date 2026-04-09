import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { Download, Upload, Type, Link as LinkIcon, FileText, Image as ImageIcon, QrCode, Loader2, BarChart2, Calendar, Crown } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('url');
  
  // Customization state
  const [content, setContent] = useState('https://www.dpqr.online');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState('');
  
  // File uploads
  const [file, setFile] = useState(null);
  
  // Results
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  

  const handleGenerate = async () => {
    if (!content && !file) return;
    setIsGenerating(true);
    let finalContent = content;
    
    // Upload logic for image/pdf
    if ((activeTab === 'image' || activeTab === 'pdf') && file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const uploadRes = await axios.post(`${BASE_URL}/api/upload/file`, formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        finalContent = uploadRes.data.url;
        setContent(finalContent);
        toast.success(`${activeTab.toUpperCase()} uploaded successfully`);
      } catch (err) {
        toast.error('File upload failed');
        setIsGenerating(false);
        return;
      }
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/qr/generate`, {
        type: activeTab,
        content: finalContent,
        fgColor,
        bgColor,
        logoUrl
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQrCodeUrl(res.data.qrCodeUrl);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response.data.error || 'Limit reached');
      } else {
        toast.error('Failed to generate QR Code');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const planName = user?.isAdmin ? 'ADMIN (PREMIUM)' : (user?.planType ? user.planType.replace('_', ' ').toUpperCase() : 'FREE');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full bg-slate-50 min-h-screen">
      
      {/* Plan Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Current Plan: <span className="font-bold text-primary">{planName}</span>
          </p>
        </div>
        {(user?.planType === 'free' || !user?.planType) && !user?.isAdmin && (
          <Link to="/pricing" className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md">
            <Crown className="w-4 h-4" /> Upgrade to Premium
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-12">
        {/* Configuration Panel */}
        <div className="glass flex-1 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 border border-slate-200 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-900">Create QR Code</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-slate-100 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl">
            {[
              { id: 'url', icon: LinkIcon, label: 'URL' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'image', icon: ImageIcon, label: 'Image' },
              { id: 'pdf', icon: FileText, label: 'PDF' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setContent(''); setFile(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
              >
                <tab.icon className="w-4 h-4 shrink-0" /> <span className="text-sm sm:text-base whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-8">
            {(activeTab === 'url' || activeTab === 'text') ? (
              <div>
                <label className="block text-sm text-slate-500 mb-2 font-medium">Content</label>
                <input 
                  type="text" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Enter ${activeTab} here...`}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 focus:outline-none focus:border-primary text-slate-900 transition-all placeholder:text-slate-300"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm text-slate-500 mb-2 font-medium">Upload {activeTab.toUpperCase()}</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 sm:p-8 text-center hover:border-primary/50 transition-colors bg-white/50">
                  <input 
                    type="file" 
                    accept={activeTab === 'image' ? 'image/*' : 'application/pdf'}
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
                        toast.error('File size exceeds 5MB limit. Please choose a smaller file.');
                        e.target.value = null; // reset input
                        setFile(null);
                        return;
                      }
                      setFile(selectedFile);
                    }}
                    className="hidden" id="file-upload" 
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-slate-600 font-medium text-sm sm:text-base">Browse files to upload {activeTab}</span>
                    {file && <span className="text-sm text-green-600 mt-2 font-mono truncate max-w-xs">{file.name}</span>}
                  </label>
                </div>
              </div>
            )}
          </div>

          {(user?.planType !== 'free' || user?.isAdmin) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div>
                <label className="block text-sm text-slate-500 mb-2 font-medium">Foreground Color</label>
                <input 
                  type="color" 
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-12 rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2 font-medium">Background Color</label>
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-12 rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                />
              </div>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={(!content && !file) || isGenerating}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><QrCode className="w-5 h-5" /> Generate QR Code</>}
          </button>
        </div>

        {/* Preview Panel */}
        <div className="glass lg:w-[400px] xl:w-[450px] rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          
          <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8 z-10 text-slate-900">Live Preview</h3>
          
          <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-2xl mb-8 sm:mb-10 z-10 relative group transition-transform hover:scale-[1.02] border border-slate-100">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-48 sm:w-64 h-48 sm:h-64 rounded-xl" crossOrigin="anonymous" />
            ) : (
               <div className="w-48 sm:w-64 h-48 sm:h-64 bg-slate-50 animate-pulse rounded-xl flex items-center justify-center border border-slate-100">
                  <QrCode className="w-12 h-12 text-slate-200" />
               </div>
            )}
          </div>

          <button
            onClick={() => {
              if (qrCodeUrl) {
                const a = document.createElement('a');
                a.href = qrCodeUrl;
                a.download = 'DP_QR-generator_Code.png';
                a.click();
              }
            }}
            disabled={!qrCodeUrl}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 z-10 disabled:opacity-50 shadow-xl"
          >
            <Download className="w-5 h-5" /> Download PNG
          </button>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
