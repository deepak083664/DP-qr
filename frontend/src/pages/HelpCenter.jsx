import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MessageCircle, HeartHandshake } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="flex flex-col items-center pb-20 pt-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Help Center</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Get immediate help from our official support channels and partners. We're always here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Partner Support Box */}
          <motion.a 
            href="https://jharkhandrasoi.online"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-4 relative overflow-hidden block"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-2 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">support.prince@Deepak</h3>
            <p className="text-slate-500 text-sm mb-2">
              Visit our official support partner's website for extensive guides and related resources.
            </p>
            <div className="mt-2 text-amber-600 font-bold bg-amber-50 px-6 py-3 rounded-xl flex items-center gap-2 group-hover:bg-amber-100 transition-colors">
              Jharkhandrasoi.online <ExternalLink className="w-4 h-4" />
            </div>
          </motion.a>

          {/* WhatsApp Box */}
          <motion.a 
            href="https://wa.me/919241302046"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-4 relative overflow-hidden block"
          >
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#25D366]/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366] mb-2 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Live WhatsApp Chat</h3>
            <p className="text-slate-500 text-sm mb-2">
              Connect with our support team instantly over WhatsApp. Fast, easy, and right on your phone.
            </p>
            <div className="mt-2 text-white font-bold bg-[#25D366] px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#25D366]/30 group-hover:bg-[#20BE5A] transition-colors">
              Chat on WhatsApp
            </div>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenter;
