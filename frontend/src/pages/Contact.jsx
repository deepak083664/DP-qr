import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare, Clock } from 'lucide-react';

const Contact = () => {
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
            Get in touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Have questions, feedback, or need support? We'd love to hear from you. Reach out to our team using the details below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Box */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Email Support</h3>
            <p className="text-slate-500 text-sm mb-2">
              Our friendly team is here to help you 24/7. Drop us an email anytime.
            </p>
            <a href="mailto:Support.dpqrgenerator@gmail.com" className="text-primary font-semibold text-base sm:text-lg break-all hover:underline transition-all px-2">
              Support.dpqrgenerator@gmail.com
            </a>
          </motion.div>

          {/* Social Box */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Chat with Us</h3>
            <p className="text-slate-500 text-sm mb-2">
              Join our community or send us a direct message on our social platforms.
            </p>
            <a href="mailto:Support.dpqrgenerator@gmail.com" className="text-emerald-600 font-semibold text-lg hover:underline transition-all">
              @DPQRGenerator
            </a>
          </motion.div>



          {/* Hours Box */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-2">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Working Hours</h3>
            <p className="text-slate-500 text-sm">
              When we're online and ready to help.
            </p>
            <p className="text-slate-800 font-medium">
              Monday - Friday<br/>9:00 AM - 6:00 PM (PST)
            </p>
          </motion.div>
        </div>
        
        {/* Contact Form CTA */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Need a quick answer?</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 relative z-10">
            For direct inquiries regarding custom API setup, enterprise solutions, or billing issues, email us directly. We guarantee a response within 24 hours.
          </p>
          <a 
            href="mailto:Support.dpqrgenerator@gmail.com"
            className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-xl relative z-10 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1"
          >
            Email Support Team
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
